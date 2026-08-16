/**
 * Keeps the PWA chrome (browser toolbar, installed-app window title bar,
 * splash screen) in sync with the app's active theme.
 *
 * Two layers drive the color:
 *  1. <meta name="theme-color"> — mobile browser toolbar + some platforms.
 *  2. The web manifest's theme_color / background_color — what installed
 *     Chromium PWAs (Windows/Chrome/Edge) use for the window title bar.
 *     The generated manifest ships a static dark color, so we re-serialize
 *     it as a data: URL with the resolved theme's colors. Chromium re-reads
 *     the manifest link when its href changes and repaints the window chrome.
 *
 * The base manifest is fetched and cached so every toggle is synchronous and
 * CSP-safe (the strict `connect-src 'self' https:` policy blocks fetch() of
 * the data: URL we install, so we never re-fetch it). If the initial fetch
 * fails — e.g. the installed app launches offline before the manifest was
 * precached — we retry on the next sync call and when the connection
 * returns, so the window chrome can never stay stuck on Chromium's default
 * white.
 */

const THEME_COLORS = {
  dark: '#0a0f1d',
  light: '#ffffff'
} as const

let baseManifest: Record<string, unknown> | null = null
let lastSyncedColor: string | null = null
let currentResolved: 'dark' | 'light' = 'dark'
let onlineListenerAttached = false

function toManifestDataUrl(manifest: Record<string, unknown>): string {
  return `data:application/manifest+json,${encodeURIComponent(JSON.stringify(manifest))}`
}

async function fetchBaseManifest(href: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(href)
    if (!response.ok) return null
    return (await response.json()) as Record<string, unknown>
  } catch {
    // Offline / transient failure — retried on the next sync call or when
    // the app comes back online. Non-fatal.
    return null
  }
}

export function syncPwaTheme(resolvedTheme: 'dark' | 'light'): void {
  if (typeof document === 'undefined') return

  currentResolved = resolvedTheme
  const color = THEME_COLORS[resolvedTheme]

  // theme-color meta tag always updates synchronously
  const meta = document.querySelector<HTMLMetaElement>("meta[name='theme-color']")
  if (meta) meta.setAttribute('content', color)

  // Re-sync once the connection returns: the initial base-manifest fetch may
  // have failed while the installed app launched offline.
  if (!onlineListenerAttached && typeof window !== 'undefined') {
    onlineListenerAttached = true
    window.addEventListener('online', () => {
      if (!baseManifest) {
        lastSyncedColor = null
        syncPwaTheme(currentResolved)
      }
    })
  }

  if (color === lastSyncedColor) return

  // No manifest link in the Electron build — nothing else to do
  const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')
  if (!link?.href) return

  const syncFromCache = () => {
    if (!baseManifest) return
    link.href = toManifestDataUrl({
      ...baseManifest,
      theme_color: color,
      background_color: color
    })
    lastSyncedColor = color
  }

  // First sync: fetch the real manifest once and cache it. On failure,
  // baseManifest stays null so the next sync call retries.
  if (!baseManifest && !link.href.startsWith('data:')) {
    void fetchBaseManifest(link.href).then((manifest) => {
      if (!manifest) return
      baseManifest = manifest
      syncFromCache()
    })
    return
  }

  // Subsequent toggles: re-serialize the cached manifest synchronously
  syncFromCache()
}

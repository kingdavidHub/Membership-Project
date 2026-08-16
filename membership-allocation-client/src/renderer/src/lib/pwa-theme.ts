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
 * The base manifest is fetched exactly once and cached: re-serializing from
 * cache keeps every toggle synchronous and CSP-safe (the strict
 * `connect-src 'self' https:` policy blocks fetch() of the data: URL we
 * install, so we never re-fetch it).
 */

const THEME_COLORS = {
  dark: '#0a0f1d',
  light: '#ffffff'
} as const

let baseManifest: Record<string, unknown> | null = null
let lastSyncedColor: string | null = null

function toManifestDataUrl(manifest: Record<string, unknown>): string {
  return `data:application/manifest+json,${encodeURIComponent(JSON.stringify(manifest))}`
}

export function syncPwaTheme(resolvedTheme: 'dark' | 'light'): void {
  if (typeof document === 'undefined') return

  const color = THEME_COLORS[resolvedTheme]

  // theme-color meta tag always updates synchronously
  const meta = document.querySelector<HTMLMetaElement>("meta[name='theme-color']")
  if (meta) meta.setAttribute('content', color)

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

  // First sync: fetch the real manifest once and cache it
  if (!baseManifest && !link.href.startsWith('data:')) {
    fetch(link.href)
      .then((response) => (response.ok ? response.json() : null))
      .then((manifest) => {
        if (!manifest) return
        baseManifest = manifest as Record<string, unknown>
        syncFromCache()
      })
      .catch(() => {
        // Non-fatal: meta tag already updated; manifest stays static.
      })
    return
  }

  // Subsequent toggles: re-serialize the cached manifest synchronously
  syncFromCache()
}

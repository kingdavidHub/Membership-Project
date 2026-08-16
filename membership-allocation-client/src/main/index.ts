import { app, shell, BrowserWindow, ipcMain, nativeTheme, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const isDev = process.env.NODE_ENV === 'development'
const THEME_COOKIE_NAME = 'vite-ui-theme'

function isValidTheme(theme: unknown): theme is 'dark' | 'light' | 'system' {
  return theme === 'dark' || theme === 'light' || theme === 'system'
}

/**
 * Flip the native window chrome (title bar) to match the given theme.
 *
 * For 'system' we deliberately resolve the value first, then restore
 * 'system': on Windows, setting `themeSource` to the value it already has
 * (the default is 'system') is a no-op that never re-applies the
 * dark/light frame flag — the title bar can end up stuck on the default
 * light color even when the OS is in dark mode. Assigning the resolved
 * value ('dark'/'light') first triggers the frame repaint, and restoring
 * 'system' keeps following OS theme flips natively.
 */
function applyThemeToFrame(theme: 'dark' | 'light' | 'system'): void {
  if (theme === 'system') {
    nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
    nativeTheme.themeSource = 'system'
  } else {
    nativeTheme.themeSource = theme
  }
}

function createWindow(initialTheme?: 'dark' | 'light' | 'system'): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // Apply the stored theme AFTER the native window (HWND) exists: on
  // Windows the dark/light frame flag is applied when the window is
  // created, so setting nativeTheme before construction can race and
  // leave the title bar on the default light color.
  if (initialTheme) applyThemeToFrame(initialTheme)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Keep the native window chrome (title bar) in sync with the app theme.
  // The renderer sends the current theme whenever it changes; applying it to
  // nativeTheme.themeSource flips the OS-level dark/light window frame flag.
  ipcMain.on('theme:set', (_event, theme: unknown) => {
    if (isValidTheme(theme)) {
      applyThemeToFrame(theme)
    }
  })

  // Read the stored theme and pass it to createWindow, which applies it
  // once the native window exists, so the very first frame of the title
  // bar matches the app (no dark/light flash on startup).
  session.defaultSession.cookies
    .get({ name: THEME_COOKIE_NAME })
    .then((cookies) => {
      const stored = cookies[0]?.value
      createWindow(isValidTheme(stored) ? stored : undefined)
    })
    .catch(() => createWindow())

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (isDev) {
    const ses = session.defaultSession

    // 1. First, find the cookie to make sure you have the right details
    ses.cookies
      .get({ name: 'membership_access_token' })
      .then((cookies) => {
        cookies.forEach((cookie) => {
          // 2. Use the cookie's own domain/path to construct the removal URL
          const protocol = cookie.secure ? 'https' : 'http'
          const domain = cookie.domain
            ? cookie.domain.startsWith('.')
              ? cookie.domain.substring(1)
              : cookie.domain
            : 'localhost'
          const removalUrl = `${protocol}://${domain}${cookie.path}`

          ses.cookies
            .remove(removalUrl, cookie.name)
            .then(() => console.log(`Cleared: ${cookie.name}`))
            .catch((e) => console.error(e))
        })
      })
      .finally(() => {
        if (process.platform !== 'darwin') app.quit()
      })
  } else {
    // In production, just quit the app without worrying about cookies
    if (process.platform !== 'darwin') app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

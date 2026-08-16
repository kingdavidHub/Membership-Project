import { ElectronAPI } from '@electron-toolkit/preload'

type Theme = 'dark' | 'light' | 'system'

interface FreebuffApi {
  setNativeTheme: (theme: Theme) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: FreebuffApi
  }
}

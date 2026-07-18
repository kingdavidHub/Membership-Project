import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { DirectionProvider } from './context/direction-provider'
import { FontProvider } from './context/font-provider'
import { ThemeProvider } from './context/theme-provider'
import { queryClient, setQueryClientRouter } from './lib/query-client'
// Generated Routes
import { routeTree } from './routeTree.gen'
// Styles
import './styles/index.css'

// * Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0
})

setQueryClientRouter(router)

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// * Render the application
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      {/* //* TanstackQuery: server state management */}
      <QueryClientProvider client={queryClient}>
        {/* //* Theme: (dark/light mode) */}
        <ThemeProvider>
          {/* //* Font: (typography) */}
          <FontProvider>
            {/* //* Direction: (ltr/rtl) */}
            <DirectionProvider>
              {/* //* Router: (navigation) */}
              <RouterProvider router={router} />
            </DirectionProvider>
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}

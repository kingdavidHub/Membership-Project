import { createBrowserHistory, createRouter } from '@tanstack/react-router'
import { routeTree } from './routes'

export const router = createRouter({
  routeTree,
  history: createBrowserHistory()
})

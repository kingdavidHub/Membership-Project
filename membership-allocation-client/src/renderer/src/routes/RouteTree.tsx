import { createRootRoute, createRoute } from '@tanstack/react-router'
import App from './App'
import { Home } from './Home'

export const rootRoute = createRootRoute({
  component: App
})

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: Home
})

export const routeTree = rootRoute.addChildren([homeRoute])

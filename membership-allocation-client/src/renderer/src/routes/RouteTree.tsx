import { createRootRoute, createRoute } from '@tanstack/react-router'
import { App, Home, Login } from './'
export const rootRoute = createRootRoute({
  component: App
})

// Authentication Route
export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login
})

export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home
})

export const routeTree = rootRoute.addChildren([homeRoute, loginRoute])

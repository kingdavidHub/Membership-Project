/**
 * Environment Variables Configuration
 * Centralized access to environment variables for easier debugging and type safety
 */

/**
 * Environment configuration object
 * All environment variables are accessed through this object
 */
export const env = {
  API_URL: import.meta.env.VITE_API_URL
} as const

/**
 * Validate that all required environment variables are present
 * Call this function at app startup for early error detection
 */
export const validateEnv = (): void => {
  const requiredVars: (keyof ImportMetaEnv)[] = ['VITE_API_URL']

  const missing = requiredVars.filter((key) => !import.meta.env[key])

  if (missing.length > 0) {
    console.warn(`Warning: Missing environment variables: ${missing.join(', ')}`)
    console.warn('Using default values where applicable')
  }
}

/**
 * Debug function to log all environment variables
 * Only use in development
 */
export const debugEnv = (): void => {
  if (import.meta.env.DEV) {
    console.group('🔧 Environment Variables')
    console.table({
      API_URL: env.API_URL,
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD
    })
    console.groupEnd()
  }
}

// Validate environment on module load in development
if (import.meta.env.DEV) {
  validateEnv()
}

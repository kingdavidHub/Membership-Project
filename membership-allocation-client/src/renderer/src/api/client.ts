import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { getCookie } from '@/lib/cookies'
import { env } from '@/config/env'

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000 // 5 seconds
})

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const cookieState = getCookie('membership_access_token')
    const token = cookieState ? JSON.parse(cookieState) : null

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Extract data from axios response wrapper
    return response.data
  },
  (error: AxiosError<{ message?: string; error?: string }>) => {
    // Handle different error status codes
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.response.data?.error

      switch (status) {
        case 401:
          // 401 is handled in main.tsx queryCache for authenticated routes only
          // Don't show toast or redirect here to avoid duplicate handling
          break
        case 403:
          toast.error('You do not have permission to perform this action.')
          break
        case 404:
          toast.error(message || 'Resource not found.')
          break
        case 422:
          toast.error(message || 'Validation error. Please check your input.')
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          toast.error(message || 'An unexpected error occurred.')
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.')
    } else {
      toast.error('An unexpected error occurred.')
    }

    return Promise.reject(error)
  }
)

export default apiClient

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { getCookie } from '@/lib/cookies'

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds
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
    return response
  },
  (error: AxiosError<{ message?: string; error?: string }>) => {
    // Handle different error status codes
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.response.data?.error

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          toast.error('Session expired. Please login again.')
          // Clear auth state and redirect to login
          window.location.href = '/login'
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

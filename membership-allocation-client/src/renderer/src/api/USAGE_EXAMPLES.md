# API Usage Examples

## Login Example

```typescript
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/api/services'
import { useAuthStore } from '@/stores/auth-store'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

function LoginForm() {
  const navigate = useNavigate()
  const { setAccessToken, setUser } = useAuthStore((state) => state.auth)

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      // Response structure:
      // {
      //   status: "success",
      //   token: "eyJhbGciOiJIUzI1NiIs...",
      //   data: {
      //     user: { _id, name, email, role, active }
      //   }
      // }

      // Store the token
      setAccessToken(response.token)

      // Store the user data
      setUser(response.data.user)

      toast.success('Login successful!')
      navigate({ to: '/dashboard' })
    },
    onError: (error) => {
      // Error is handled globally by axios interceptor
      // But you can add additional handling here if needed
      console.error('Login failed:', error)
    }
  })

  const handleSubmit = (values: { email: string; password: string }) => {
    loginMutation.mutate(values)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

## Register Example

```typescript
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/api/services'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

function RegisterForm() {
  const navigate = useNavigate()

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (response) => {
      toast.success(response.message || 'Registration successful!')
      navigate({ to: '/login' })
    }
  })

  const handleSubmit = (values: { name: string; email: string; password: string }) => {
    registerMutation.mutate(values)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
    </form>
  )
}
```

## Fetch Users Example

```typescript
import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/api/services'

function UsersList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', { page: 1, limit: 10 }],
    queryFn: () => usersService.getUsers({ page: 1, limit: 10 })
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading users</div>

  return (
    <div>
      {data?.data.map((user) => (
        <div key={user._id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ))}
    </div>
  )
}
```

## Update User Example

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService } from '@/api/services'
import { toast } from 'sonner'

function UpdateUserForm({ userId }: { userId: string }) {
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: (data: { name?: string; email?: string }) =>
      usersService.updateUser(userId, data),
    onSuccess: () => {
      toast.success('User updated successfully!')
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    }
  })

  const handleSubmit = (values: { name: string; email: string }) => {
    updateMutation.mutate(values)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
    </form>
  )
}
```

## Protected Route Check

```typescript
import { useAuthStore } from '@/stores/auth-store'
import { Navigate } from '@tanstack/react-router'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((state) => state.auth.accessToken)
  const user = useAuthStore((state) => state.auth.user)

  if (!accessToken) {
    return <Navigate to="/login" />
  }

  // Check if user has required role
  if (user && user.role !== 'super-admin') {
    return <Navigate to="/unauthorized" />
  }

  return <>{children}</>
}
```

## Logout Example

```typescript
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/api/services'
import { useAuthStore } from '@/stores/auth-store'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

function LogoutButton() {
  const navigate = useNavigate()
  const reset = useAuthStore((state) => state.auth.reset)

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear auth state
      reset()
      toast.success('Logged out successfully')
      navigate({ to: '/login' })
    },
    onError: () => {
      // Even if API call fails, clear local state
      reset()
      navigate({ to: '/login' })
    }
  })

  return (
    <button onClick={() => logoutMutation.mutate()}>
      Logout
    </button>
  )
}
```

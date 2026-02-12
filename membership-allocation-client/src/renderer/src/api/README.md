# API Services

Centralized API service layer for the application.

## Structure

```
api/
├── client.ts              # Axios instance with interceptors
├── endpoints.ts           # API endpoint constants
├── types/                 # TypeScript types for API
│   ├── index.ts          # Common types
│   ├── auth.types.ts     # Auth-related types
│   ├── user.types.ts     # User-related types
│   └── task.types.ts     # Task-related types
└── services/             # API service modules
    ├── index.ts          # Barrel export
    ├── auth.service.ts   # Authentication endpoints
    └── users.service.ts  # User management endpoints
```

## Usage

### Basic Usage

```typescript
import { authService } from '@/api/services'

// Login example
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authService.login({ email, password })
    // Handle success - store token, redirect, etc.
    console.log(response.accessToken)
  } catch (error) {
    // Error handling is done globally in interceptors
    // Additional handling can be done here if needed
  }
}
```

### With React Query

```typescript
import { useMutation, useQuery } from '@tanstack/react-query'
import { authService, usersService } from '@/api/services'

// Query example
function UsersList() {
  const { data, isLoading } = useQuery({
    queryKey: ['users', { page: 1, limit: 10 }],
    queryFn: () => usersService.getUsers({ page: 1, limit: 10 })
  })

  // ...
}

// Mutation example
function LoginForm() {
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Store token and redirect
    }
  })

  const handleSubmit = (values) => {
    loginMutation.mutate(values)
  }

  // ...
}
```

## Configuration

Set your API base URL in your `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

## Features

- ✅ Centralized axios instance with interceptors
- ✅ Automatic token injection
- ✅ Global error handling with toast notifications
- ✅ TypeScript types for all endpoints
- ✅ Clean service pattern
- ✅ Easy to extend and maintain
- ✅ Works seamlessly with React Query

## Adding New Services

1. Create types in `types/your-feature.types.ts`
2. Add endpoints to `endpoints.ts`
3. Create service in `services/your-feature.service.ts`
4. Export from `services/index.ts`

Example:

```typescript
// types/product.types.ts
export interface Product {
  id: string
  name: string
  price: number
}

// endpoints.ts
export const API_ENDPOINTS = {
  // ... existing
  PRODUCTS: {
    LIST: '/products',
    DETAILS: (id: string) => `/products/${id}`
  }
}

// services/products.service.ts
export const productsService = {
  getProducts: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST)
    return data.data
  }
}

// services/index.ts
export { productsService } from './products.service'
```

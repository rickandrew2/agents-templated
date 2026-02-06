import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Global test setup
beforeAll(() => {
  // Mock environment variables
  Object.assign(process.env, {
    NODE_ENV: 'test',
    NEXTAUTH_SECRET: 'test-secret-key-minimum-32-characters',
    NEXTAUTH_URL: 'http://localhost:3000'
  })
  
  // Mock Next.js router
  vi.mock('next/navigation', () => ({
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn()
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  }))

  // Mock next-auth
  vi.mock('next-auth/react', () => ({
    useSession: () => ({
      data: null,
      status: 'unauthenticated'
    }),
    signIn: vi.fn(),
    signOut: vi.fn()
  }))

  // Mock fetch globally
  global.fetch = vi.fn()
})

// Clean up after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
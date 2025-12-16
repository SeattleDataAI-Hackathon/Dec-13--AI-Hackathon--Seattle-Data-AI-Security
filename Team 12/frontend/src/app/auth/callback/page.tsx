'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import { Loader2 } from 'lucide-react'

function CallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setToken, setUser } = useAppStore()

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token')
      
      if (token) {
        // Store the session token
        setToken(token)
        api.setToken(token)
        
        try {
          // Fetch user data using the token
          const user = await api.getCurrentUser(token)
          setUser(user)
          router.push('/dashboard')
        } catch (error) {
          console.error('Failed to get user:', error)
          router.push('/login?error=auth_failed')
        }
      } else {
        router.push('/login?error=no_token')
      }
    }

    handleCallback()
  }, [searchParams, router, setToken, setUser])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
        <p className="text-white/60">Completing authentication...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}

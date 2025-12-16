'use client'

import { motion } from 'framer-motion'
import { Github, Sparkles, ArrowLeft, Loader2, Play } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const { setToken, setUser } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    try {
      const { auth_url } = await api.getAuthUrl()
      window.location.href = auth_url
    } catch (error) {
      console.error('Failed to get auth URL:', error)
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsDemoLoading(true)
    try {
      // Use demo login endpoint
      const response = await fetch('http://localhost:8000/api/auth/demo/login?github_id=1001', {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Demo login failed. Make sure to run: python -m app.seed_data')
      }
      
      const data = await response.json()
      
      // Store token and user
      setToken(data.token)
      api.setToken(data.token)
      
      // Fetch full user data
      const user = await api.getCurrentUser(data.token)
      setUser(user)
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Demo login failed:', error)
      alert('Demo login failed. Make sure the backend is running and seed data is loaded.')
      setIsDemoLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Back link */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 btn-ghost flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl mb-2">
            Welcome to TechClub<span className="gradient-text">AI</span>
          </h1>
          <p className="text-white/60">
            Sign in to get started
          </p>
        </div>

        {/* Login card */}
        <div className="p-8 rounded-3xl glass border border-white/10">
          {/* GitHub OAuth */}
          <button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Github className="w-6 h-6" />
                Continue with GitHub
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/40 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Demo Login */}
          <button
            onClick={handleDemoLogin}
            disabled={isDemoLoading}
            className="w-full btn-secondary flex items-center justify-center gap-3 py-4 text-lg disabled:opacity-50"
          >
            {isDemoLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Play className="w-5 h-5" />
                Try Demo (No GitHub Required)
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-white/40">
            Demo uses pre-seeded user data. Run `python -m app.seed_data` first.
          </p>
        </div>

        {/* Permissions note */}
        <div className="mt-6 text-center text-sm text-white/50">
          <p>GitHub login requests access to:</p>
          <ul className="mt-2 space-y-1 text-xs">
            <li>• Your public profile & email</li>
            <li>• Create & manage repositories</li>
            <li>• Read organization data</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

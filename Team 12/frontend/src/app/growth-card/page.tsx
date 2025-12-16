'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import Navigation from '@/components/Navigation'
import GrowthCardForm from '@/components/GrowthCardForm'

export default function GrowthCardPage() {
  const router = useRouter()
  const { user, setUser, token } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const loadUser = async () => {
      try {
        api.setToken(token)
        const userData = await api.getCurrentUser(token)
        setUser(userData)
      } catch (error) {
        console.error('Failed to load user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [token, router, setUser])

  const handleSubmit = async (data: any) => {
    if (!user?.id) return

    try {
      // Update basic profile
      await api.updateUser(user.id, {
        name: data.name,
        degree: data.degree,
        major: data.major,
        experience_years: data.experience_years,
      })

      // Update growth card
      await api.updateGrowthCard(user.id, data.growth_card)

      // Refresh user data
      const updatedUser = await api.getCurrentUser(token!)
      setUser(updatedUser)

      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  }

  const handleParseIdeas = async (text: string) => {
    if (!user?.id) return null
    return await api.parseProjectIdeas(user.id, text)
  }

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-3xl">Your Growth Card</h1>
                <p className="text-white/60">
                  Define your skills, interests, and learning goals
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl glass border border-white/10"
          >
            <GrowthCardForm
              initialData={user}
              onSubmit={handleSubmit}
              onParseIdeas={handleParseIdeas}
            />
          </motion.div>
        </div>
      </div>
    </>
  )
}


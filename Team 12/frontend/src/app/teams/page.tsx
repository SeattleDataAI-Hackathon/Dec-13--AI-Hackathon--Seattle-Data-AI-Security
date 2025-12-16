'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Sparkles, Loader2, Plus, RefreshCw
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import Navigation from '@/components/Navigation'
import TeamCard from '@/components/TeamCard'

export default function TeamsPage() {
  const router = useRouter()
  const { token, teams, setTeams } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [allUsers, setAllUsers] = useState<any[]>([])

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    loadData()
  }, [token, router])

  const loadData = async () => {
    try {
      api.setToken(token!)
      const [teamsData, usersData] = await Promise.all([
        api.getTeams(),
        api.getUsers()
      ])
      setTeams(teamsData)
      setAllUsers(usersData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateTeams = async () => {
    setIsGenerating(true)
    try {
      const result = await api.generateTeams(3)
      console.log('Teams generated:', result)
      await loadData()
    } catch (error) {
      console.error('Failed to generate teams:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getMembersForTeam = (team: any) => {
    const memberIds = team.members?.map((m: any) => m.user_id) || []
    return allUsers.filter(u => memberIds.includes(u.id))
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
                Teams
              </h1>
              <p className="text-white/60">
                AI-formed teams optimized for collaborative learning
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="btn-ghost flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleGenerateTeams}
                disabled={isGenerating}
                className="btn-primary flex items-center gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                Generate Teams
              </button>
            </div>
          </motion.div>

          {/* Teams Grid */}
          {teams.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team, i) => (
                <TeamCard 
                  key={team.id} 
                  team={team} 
                  members={getMembersForTeam(team)}
                  delay={i} 
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-16 rounded-3xl bg-surface-800/50 border border-white/5 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-primary-400" />
              </div>
              <h3 className="font-display font-semibold text-2xl mb-3">
                No teams formed yet
              </h3>
              <p className="text-white/50 max-w-md mx-auto mb-8">
                Once enough members have completed their Growth Cards, 
                the AI will analyze skills and interests to form optimal teams.
              </p>
              <button
                onClick={handleGenerateTeams}
                disabled={isGenerating}
                className="btn-primary inline-flex items-center gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                Generate Teams with AI
              </button>
            </motion.div>
          )}

          {/* Available Users */}
          {allUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <h2 className="font-display font-semibold text-xl mb-4">
                Available Members ({allUsers.length})
              </h2>
              <div className="flex flex-wrap gap-3">
                {allUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 px-4 py-2 rounded-full bg-surface-800/50 border border-white/10"
                  >
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold">
                        {user.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-white/50">@{user.github_handle}</div>
                    </div>
                    {user.team_ids?.length === 0 && (
                      <span className="tag text-xs">Available</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}


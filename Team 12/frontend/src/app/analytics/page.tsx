'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, Loader2, TrendingUp, Users, Zap,
  CheckCircle2, GitCommit, Trophy
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import Navigation from '@/components/Navigation'
import StatsCard from '@/components/StatsCard'
import ProgressChart from '@/components/ProgressChart'

// Mock data for demo
const weeklyData = [
  { name: 'Week 1', tasks: 5, commits: 23 },
  { name: 'Week 2', tasks: 8, commits: 34 },
  { name: 'Week 3', tasks: 12, commits: 45 },
  { name: 'Week 4', tasks: 7, commits: 28 },
]

const skillsData = [
  { name: 'Frontend', value: 45 },
  { name: 'Backend', value: 35 },
  { name: 'DevOps', value: 15 },
  { name: 'Data', value: 5 },
]

export default function AnalyticsPage() {
  const router = useRouter()
  const { token, user, teams } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
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
      const users = await api.getUsers()
      setAllUsers(users)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate overall stats
  const totalXP = allUsers.reduce((sum, u) => sum + (u.growth_card?.stats?.xp_points || 0), 0)
  const totalTasks = allUsers.reduce((sum, u) => sum + (u.growth_card?.stats?.tasks_completed || 0), 0)
  const totalCommits = allUsers.reduce((sum, u) => sum + (u.growth_card?.stats?.commits_count || 0), 0)
  const totalPRs = allUsers.reduce((sum, u) => sum + (u.growth_card?.stats?.prs_merged || 0), 0)

  // Leaderboard
  const leaderboard = [...allUsers]
    .sort((a, b) => (b.growth_card?.stats?.xp_points || 0) - (a.growth_card?.stats?.xp_points || 0))
    .slice(0, 10)

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
            className="mb-8"
          >
            <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
              Analytics
            </h1>
            <p className="text-white/60">
              Track community progress and performance metrics
            </p>
          </motion.div>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Members"
              value={allUsers.length}
              icon={Users}
              color="primary"
              delay={0}
            />
            <StatsCard
              title="Total XP Earned"
              value={totalXP.toLocaleString()}
              icon={Zap}
              color="accent"
              delay={1}
            />
            <StatsCard
              title="Tasks Completed"
              value={totalTasks}
              icon={CheckCircle2}
              color="emerald"
              delay={2}
            />
            <StatsCard
              title="Commits Made"
              value={totalCommits}
              icon={GitCommit}
              color="amber"
              delay={3}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Charts */}
            <div className="lg:col-span-2 space-y-6">
              <ProgressChart
                data={weeklyData}
                type="area"
                dataKey="tasks"
                title="Tasks Completed Over Time"
              />
              
              <ProgressChart
                data={weeklyData}
                type="bar"
                dataKey="commits"
                title="Commit Activity"
              />
            </div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-surface-800/50 border border-white/5"
            >
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-semibold text-lg">Leaderboard</h3>
              </div>

              <div className="space-y-3">
                {leaderboard.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                  >
                    {/* Rank */}
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                      ${i === 0 ? 'bg-amber-500 text-black' : 
                        i === 1 ? 'bg-gray-300 text-black' : 
                        i === 2 ? 'bg-amber-700 text-white' : 
                        'bg-white/10 text-white/60'}
                    `}>
                      {i + 1}
                    </div>

                    {/* Avatar */}
                    {member.avatar_url ? (
                      <img 
                        src={member.avatar_url} 
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold">
                        {member.name?.charAt(0) || '?'}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{member.name}</div>
                      <div className="text-xs text-white/50">
                        {member.growth_card?.stats?.tasks_completed || 0} tasks
                      </div>
                    </div>

                    {/* XP */}
                    <div className="text-right">
                      <div className="font-mono font-bold text-primary-400">
                        {(member.growth_card?.stats?.xp_points || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">XP</div>
                    </div>
                  </motion.div>
                ))}

                {leaderboard.length === 0 && (
                  <div className="text-center py-8 text-white/40">
                    No activity yet
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Team Stats */}
          {teams.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <h2 className="font-display font-semibold text-xl mb-4">Team Performance</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team, i) => (
                  <div
                    key={team.id}
                    className="p-4 rounded-xl bg-surface-800/50 border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium truncate">{team.name}</h4>
                      <span className="text-sm text-primary-400 font-mono">
                        {team.stats?.completion_percentage?.toFixed(0) || 0}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-bar-fill"
                        style={{ width: `${team.stats?.completion_percentage || 0}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
                      <span>{team.stats?.completed_tasks || 0}/{team.stats?.total_tasks || 0} tasks</span>
                      <span>{team.members?.length || 0} members</span>
                    </div>
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


'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, Users, FolderKanban, Zap, TrendingUp,
  CheckCircle2, GitCommit, GitPullRequest, Target,
  ArrowRight, Plus
} from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import StatsCard from '@/components/StatsCard'
import TeamCard from '@/components/TeamCard'
import ProgressChart from '@/components/ProgressChart'

// Mock data for demo
const mockActivityData = [
  { name: 'Mon', commits: 4 },
  { name: 'Tue', commits: 7 },
  { name: 'Wed', commits: 3 },
  { name: 'Thu', commits: 8 },
  { name: 'Fri', commits: 12 },
  { name: 'Sat', commits: 5 },
  { name: 'Sun', commits: 2 },
]

export default function DashboardPage() {
  const { user, teams, setTeams, token } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!token) return
      
      try {
        api.setToken(token)
        const teamsData = await api.getTeams()
        setTeams(teamsData)
      } catch (error) {
        console.error('Failed to load teams:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [token, setTeams])

  const stats = user?.growth_card?.stats || {
    tasks_completed: 0,
    commits_count: 0,
    prs_merged: 0,
    xp_points: 0,
    streak_days: 0,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
          Welcome back, <span className="gradient-text">{user?.name || 'Developer'}</span>
        </h1>
        <p className="text-white/60">
          Here's what's happening with your learning journey.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="XP Points"
          value={stats.xp_points.toLocaleString()}
          icon={Zap}
          color="primary"
          trend={12}
          delay={0}
        />
        <StatsCard
          title="Tasks Completed"
          value={stats.tasks_completed}
          icon={CheckCircle2}
          color="emerald"
          delay={1}
        />
        <StatsCard
          title="Commits"
          value={stats.commits_count}
          icon={GitCommit}
          color="accent"
          delay={2}
        />
        <StatsCard
          title="PRs Merged"
          value={stats.prs_merged}
          icon={GitPullRequest}
          color="amber"
          delay={3}
        />
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <ProgressChart
            data={mockActivityData}
            type="bar"
            dataKey="commits"
            title="This Week's Activity"
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-surface-800/50 border border-white/5"
        >
          <h3 className="font-display font-semibold text-lg mb-4">Quick Actions</h3>
          
          <div className="space-y-3">
            <Link
              href="/growth-card"
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-transparent border border-primary-500/20 hover:border-primary-500/40 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Update Growth Card</div>
                <div className="text-sm text-white/50">Add new skills & goals</div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-primary-400 transition-colors" />
            </Link>

            <Link
              href="/teams"
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium">View Teams</div>
                <div className="text-sm text-white/50">Collaborate with peers</div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/projects"
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Projects</div>
                <div className="text-sm text-white/50">Track your work</div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Teams Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-2xl">Your Teams</h2>
          <Link href="/teams" className="btn-ghost text-sm flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-surface-800/50 animate-pulse" />
            ))}
          </div>
        ) : teams.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.slice(0, 3).map((team, i) => (
              <TeamCard key={team.id} team={team} delay={i} />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-surface-800/50 border border-white/5 text-center">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-lg mb-2">No teams yet</h3>
            <p className="text-white/50 mb-6">
              Complete your Growth Card and wait for AI team formation.
            </p>
            <Link href="/growth-card" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Complete Growth Card
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}


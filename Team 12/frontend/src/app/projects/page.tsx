'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FolderKanban, Github, Loader2, ExternalLink,
  CheckCircle2, Clock, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppStore, type Team } from '@/lib/store'
import { api } from '@/lib/api'
import Navigation from '@/components/Navigation'

export default function ProjectsPage() {
  const router = useRouter()
  const { token, teams, setTeams } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)

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
      const teamsData = await api.getTeams()
      setTeams(teamsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter teams that have projects
  const projectTeams = teams.filter(t => t.project_name || t.repo_url)

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
              Projects
            </h1>
            <p className="text-white/60">
              Track progress on AI-generated team projects
            </p>
          </motion.div>

          {/* Projects Grid */}
          {projectTeams.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {projectTeams.map((team, i) => (
                <ProjectCard key={team.id} team={team} delay={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-16 rounded-3xl bg-surface-800/50 border border-white/5 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mx-auto mb-6">
                <FolderKanban className="w-10 h-10 text-primary-400" />
              </div>
              <h3 className="font-display font-semibold text-2xl mb-3">
                No projects yet
              </h3>
              <p className="text-white/50 max-w-md mx-auto mb-8">
                Once teams are formed, the AI will generate tailored project ideas 
                and set up GitHub repositories automatically.
              </p>
              <Link href="/teams" className="btn-primary">
                View Teams
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}

function ProjectCard({ team, delay }: { team: Team; delay: number }) {
  const completion = team.stats?.completion_percentage || 0
  const completedTasks = team.stats?.completed_tasks || 0
  const totalTasks = team.stats?.total_tasks || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className="p-6 rounded-2xl bg-surface-800/50 border border-white/5 card-hover"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-xl mb-1">
            {team.project_name || team.name}
          </h3>
          <p className="text-sm text-white/50">by {team.name}</p>
        </div>
        {team.repo_url && (
          <a
            href={team.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <Github className="w-5 h-5" />
          </a>
        )}
      </div>

      {/* Description */}
      {team.project_description && (
        <p className="text-white/60 text-sm mb-4 line-clamp-2">
          {team.project_description}
        </p>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-white/60">Progress</span>
          <span className="font-mono text-primary-400">{completion.toFixed(0)}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.8, delay: delay * 0.1 + 0.3 }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            {completedTasks}
          </span>
          <span className="flex items-center gap-1.5 text-white/50">
            <Clock className="w-4 h-4" />
            {totalTasks - completedTasks}
          </span>
        </div>

        <Link
          href={`/teams/${team.id}`}
          className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
        >
          View Details
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )
}


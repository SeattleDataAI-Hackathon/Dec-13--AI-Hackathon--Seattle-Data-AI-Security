'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Github, Sparkles, Loader2, RefreshCw,
  CheckCircle2, Users, Zap, ExternalLink, Lightbulb
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAppStore, type Team, type Task } from '@/lib/store'
import { api } from '@/lib/api'
import Navigation from '@/components/Navigation'
import TaskList from '@/components/TaskList'
import StatsCard from '@/components/StatsCard'

export default function TeamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { token, user } = useAppStore()
  const [team, setTeam] = useState<Team | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingProject, setIsGeneratingProject] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isLoadingRecs, setIsLoadingRecs] = useState(false)

  const teamId = params.id as string

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    loadTeamData()
  }, [token, teamId, router])

  const loadTeamData = async () => {
    try {
      api.setToken(token!)
      
      const [teamData, tasksData, usersData] = await Promise.all([
        api.getTeam(teamId),
        api.getTeamTasks(teamId),
        api.getUsers()
      ])
      
      setTeam(teamData)
      setTasks(tasksData)
      
      // Get member details
      const memberIds = teamData.members?.map((m: any) => m.user_id) || []
      const teamMembers = usersData.filter((u: any) => memberIds.includes(u.id))
      setMembers(teamMembers)
    } catch (error) {
      console.error('Failed to load team:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateProject = async () => {
    // In a real app, you'd get the user's GitHub token from their session
    // For demo, we'll use a placeholder
    const githubToken = prompt('Enter your GitHub access token:')
    if (!githubToken) return

    setIsGeneratingProject(true)
    try {
      await api.generateProject(teamId, githubToken)
      await loadTeamData()
    } catch (error) {
      console.error('Failed to generate project:', error)
      alert('Failed to generate project. Check console for details.')
    } finally {
      setIsGeneratingProject(false)
    }
  }

  const handleSyncGitHub = async () => {
    const githubToken = prompt('Enter your GitHub access token:')
    if (!githubToken) return

    setIsSyncing(true)
    try {
      await api.syncGitHub(teamId, githubToken)
      await loadTeamData()
    } catch (error) {
      console.error('Failed to sync GitHub:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const loadRecommendations = async () => {
    setIsLoadingRecs(true)
    try {
      const recs = await api.getTeamRecommendations(teamId)
      setRecommendations(recs)
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setIsLoadingRecs(false)
    }
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

  if (!team) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/60 mb-4">Team not found</p>
            <Link href="/teams" className="btn-primary">Back to Teams</Link>
          </div>
        </div>
      </>
    )
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const totalTasks = tasks.length

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
            <Link
              href="/teams"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Teams
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
                  {team.name}
                </h1>
                {team.project_name && (
                  <p className="text-primary-400 font-medium text-lg">
                    {team.project_name}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {team.repo_url ? (
                  <>
                    <button
                      onClick={handleSyncGitHub}
                      disabled={isSyncing}
                      className="btn-secondary flex items-center gap-2"
                    >
                      {isSyncing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <RefreshCw className="w-5 h-5" />
                      )}
                      Sync GitHub
                    </button>
                    <a
                      href={team.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-2"
                    >
                      <Github className="w-5 h-5" />
                      View Repo
                    </a>
                  </>
                ) : (
                  <button
                    onClick={handleGenerateProject}
                    disabled={isGeneratingProject}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isGeneratingProject ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                    Generate Project
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Completion"
              value={`${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%`}
              icon={CheckCircle2}
              color="emerald"
              delay={0}
            />
            <StatsCard
              title="Tasks"
              value={`${completedTasks}/${totalTasks}`}
              icon={Zap}
              color="primary"
              delay={1}
            />
            <StatsCard
              title="Members"
              value={members.length}
              icon={Users}
              color="accent"
              delay={2}
            />
            <StatsCard
              title="Velocity"
              value={`${team.stats?.commit_velocity?.toFixed(1) || 0}/day`}
              icon={Zap}
              color="amber"
              delay={3}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {team.project_description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-2xl bg-surface-800/50 border border-white/5"
                >
                  <h3 className="font-display font-semibold text-lg mb-3">Project Description</h3>
                  <p className="text-white/70">{team.project_description}</p>
                </motion.div>
              )}

              {/* Tasks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-surface-800/50 border border-white/5"
              >
                <h3 className="font-display font-semibold text-lg mb-4">Tasks</h3>
                <TaskList tasks={tasks} />
              </motion.div>

              {/* AI Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary-400" />
                    AI Recommendations
                  </h3>
                  <button
                    onClick={loadRecommendations}
                    disabled={isLoadingRecs}
                    className="btn-ghost text-sm flex items-center gap-2"
                  >
                    {isLoadingRecs ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Get Recommendations
                  </button>
                </div>

                {recommendations ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-white/60 mb-2">Next Steps</h4>
                      <ul className="space-y-2">
                        {recommendations.next_steps?.map((step: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary-400">→</span>
                            <span className="text-white/80">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {recommendations.insights && (
                      <div>
                        <h4 className="text-sm font-medium text-white/60 mb-2">Insights</h4>
                        <p className="text-white/70">{recommendations.insights}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-white/50 text-center py-4">
                    Click "Get Recommendations" for AI-powered next steps
                  </p>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Team Members */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-surface-800/50 border border-white/5"
              >
                <h3 className="font-display font-semibold text-lg mb-4">Team Members</h3>
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
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
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{member.name}</div>
                        <div className="text-xs text-white/50">@{member.github_handle}</div>
                      </div>
                      <div className="text-xs text-primary-400 font-mono">
                        {member.growth_card?.stats?.xp_points || 0} XP
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tech Stack */}
              {team.ai_generated_scope && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 rounded-2xl bg-surface-800/50 border border-white/5"
                >
                  <h3 className="font-display font-semibold text-lg mb-3">Project Scope</h3>
                  <p className="text-sm text-white/60 whitespace-pre-line">
                    {team.ai_generated_scope}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


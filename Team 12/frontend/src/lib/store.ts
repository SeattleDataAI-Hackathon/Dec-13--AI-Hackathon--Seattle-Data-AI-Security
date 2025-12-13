import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: string
}

export interface GrowthCardStats {
  tasks_completed: number
  commits_count: number
  prs_merged: number
  xp_points: number
  streak_days: number
  completion_rate: number
}

export interface GrowthCard {
  skills: Skill[]
  interests: string[]
  explore_goals: string[]
  project_ideas: string[]
  parsed_categories: string[]
  stats: GrowthCardStats
}

export interface User {
  id: string
  name: string
  email?: string
  github_handle: string
  github_id: number
  avatar_url?: string
  degree?: string
  major?: string
  experience_years: number
  bio?: string
  growth_card: GrowthCard
  team_ids: string[]
}

export interface TeamMember {
  user_id: string
  role: string
  joined_at: string
}

export interface TeamStats {
  total_tasks: number
  completed_tasks: number
  completion_percentage: number
  commit_velocity: number
  active_members: number
}

export interface Team {
  id: string
  name: string
  members: TeamMember[]
  repo_url?: string
  repo_name?: string
  project_name?: string
  project_description?: string
  ai_generated_scope?: string
  stats: TeamStats
}

export interface Task {
  id: string
  team_id: string
  github_issue_id?: number
  github_issue_url?: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'review' | 'completed'
  assigned_to?: string
  priority: number
  estimated_hours?: number
  ai_generated: boolean
}

interface AppState {
  user: User | null
  token: string | null
  teams: Team[]
  currentTeam: Team | null
  tasks: Task[]
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setTeams: (teams: Team[]) => void
  setCurrentTeam: (team: Team | null) => void
  setTasks: (tasks: Task[]) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      teams: [],
      currentTeam: null,
      tasks: [],
      isLoading: false,
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setTeams: (teams) => set({ teams }),
      setCurrentTeam: (team) => set({ currentTeam: team }),
      setTasks: (tasks) => set({ tasks }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, token: null, teams: [], currentTeam: null, tasks: [] }),
    }),
    {
      name: 'techclub-ai-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
)


const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

class ApiClient {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(error.detail || 'Request failed')
    }

    return response.json()
  }

  // Helper to add token as query param
  private withToken(endpoint: string): string {
    if (this.token) {
      const separator = endpoint.includes('?') ? '&' : '?'
      return `${endpoint}${separator}token=${this.token}`
    }
    return endpoint
  }

  // Auth
  async getAuthUrl() {
    return this.request<{ auth_url: string }>('/auth/github/login')
  }

  async getCurrentUser(token: string) {
    return this.request<any>(`/auth/me?token=${token}`)
  }

  async logout() {
    if (!this.token) return
    return this.request<any>(`/auth/logout?token=${this.token}`, { method: 'POST' })
  }

  // Users
  async getUsers(skip = 0, limit = 50) {
    return this.request<any[]>(this.withToken(`/users?skip=${skip}&limit=${limit}`))
  }

  async getUser(userId: string) {
    return this.request<any>(this.withToken(`/users/${userId}`))
  }

  async updateUser(userId: string, data: any) {
    return this.request<any>(this.withToken(`/users/${userId}`), {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async updateGrowthCard(userId: string, growthCard: any) {
    return this.request<any>(this.withToken(`/users/${userId}/growth-card`), {
      method: 'PUT',
      body: JSON.stringify(growthCard),
    })
  }

  async parseProjectIdeas(userId: string, text: string) {
    return this.request<any>(
      this.withToken(`/users/${userId}/parse-project-ideas?project_ideas_text=${encodeURIComponent(text)}`),
      { method: 'POST' }
    )
  }

  async addSkill(userId: string, skill: any) {
    return this.request<any>(this.withToken(`/users/${userId}/add-skill`), {
      method: 'POST',
      body: JSON.stringify(skill),
    })
  }

  async getUserStats(userId: string) {
    return this.request<any>(this.withToken(`/users/${userId}/stats`))
  }

  // Teams
  async getTeams(skip = 0, limit = 50) {
    return this.request<any[]>(this.withToken(`/teams?skip=${skip}&limit=${limit}`))
  }

  async getTeam(teamId: string) {
    return this.request<any>(this.withToken(`/teams/${teamId}`))
  }

  async generateTeams(teamSize = 3) {
    return this.request<any>(this.withToken(`/teams/generate-teams?team_size=${teamSize}`), {
      method: 'POST',
    })
  }

  async generateProject(teamId: string, githubToken: string, org?: string) {
    const params = new URLSearchParams({ github_token: githubToken })
    if (org) params.append('org', org)
    
    return this.request<any>(this.withToken(`/teams/${teamId}/generate-project?${params}`), {
      method: 'POST',
    })
  }

  async getTeamTasks(teamId: string) {
    return this.request<any[]>(this.withToken(`/teams/${teamId}/tasks`))
  }

  async getTeamRecommendations(teamId: string) {
    return this.request<any>(this.withToken(`/teams/${teamId}/recommendations`))
  }

  async syncGitHub(teamId: string, githubToken: string) {
    return this.request<any>(this.withToken(`/teams/${teamId}/sync-github?github_token=${githubToken}`), {
      method: 'POST',
    })
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; service: string }>('/health')
  }
}

export const api = new ApiClient()

'use client'

import { motion } from 'framer-motion'
import { Users, Github, ArrowRight, CheckCircle2, Clock, Zap } from 'lucide-react'
import Link from 'next/link'
import type { Team } from '@/lib/store'
import clsx from 'clsx'

interface TeamCardProps {
  team: Team
  members?: any[]
  delay?: number
}

export default function TeamCard({ team, members = [], delay = 0 }: TeamCardProps) {
  const completionPercentage = team.stats?.completion_percentage || 0
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="group relative p-6 rounded-2xl bg-surface-800/50 border border-white/5 card-hover"
    >
      {/* Gradient accent on top */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg mb-1">{team.name}</h3>
          {team.project_name && (
            <p className="text-sm text-primary-400 font-medium">{team.project_name}</p>
          )}
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
        <p className="text-sm text-white/60 mb-4 line-clamp-2">
          {team.project_description}
        </p>
      )}

      {/* Members */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex -space-x-2">
          {members.slice(0, 4).map((member, i) => (
            <div
              key={member.id || i}
              className="w-8 h-8 rounded-full border-2 border-surface-800 overflow-hidden"
            >
              {member.avatar_url ? (
                <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold">
                  {member.name?.charAt(0) || '?'}
                </div>
              )}
            </div>
          ))}
          {members.length > 4 && (
            <div className="w-8 h-8 rounded-full border-2 border-surface-800 bg-surface-800 flex items-center justify-center text-xs font-medium text-white/60">
              +{members.length - 4}
            </div>
          )}
        </div>
        <span className="text-sm text-white/50 flex items-center gap-1">
          <Users className="w-4 h-4" />
          {team.members?.length || members.length} members
        </span>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-white/60">Progress</span>
          <span className="font-mono text-primary-400">{completionPercentage.toFixed(0)}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, delay: delay * 0.1 + 0.3 }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-white/50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{team.stats?.completed_tasks || 0}/{team.stats?.total_tasks || 0} tasks</span>
        </div>
        {team.stats?.commit_velocity > 0 && (
          <div className="flex items-center gap-1.5 text-white/50">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{team.stats.commit_velocity.toFixed(1)}/day</span>
          </div>
        )}
      </div>

      {/* View link */}
      <Link
        href={`/teams/${team.id}`}
        className="absolute inset-0 rounded-2xl"
      >
        <span className="sr-only">View team details</span>
      </Link>
      
      {/* Hover indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-5 h-5 text-primary-400" />
      </div>
    </motion.div>
  )
}


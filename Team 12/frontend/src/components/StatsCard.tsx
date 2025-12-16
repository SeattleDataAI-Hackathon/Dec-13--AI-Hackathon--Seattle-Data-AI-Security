'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: number
  color?: 'primary' | 'accent' | 'emerald' | 'amber'
  delay?: number
}

const colorMap = {
  primary: {
    bg: 'from-primary-500/20 to-primary-500/5',
    icon: 'text-primary-400 bg-primary-500/20',
    value: 'text-primary-400',
  },
  accent: {
    bg: 'from-accent-500/20 to-accent-500/5',
    icon: 'text-accent-400 bg-accent-500/20',
    value: 'text-accent-400',
  },
  emerald: {
    bg: 'from-emerald-500/20 to-emerald-500/5',
    icon: 'text-emerald-400 bg-emerald-500/20',
    value: 'text-emerald-400',
  },
  amber: {
    bg: 'from-amber-500/20 to-amber-500/5',
    icon: 'text-amber-400 bg-amber-500/20',
    value: 'text-amber-400',
  },
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'primary',
  delay = 0,
}: StatsCardProps) {
  const colors = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="stat-card"
    >
      {/* Background gradient */}
      <div className={clsx(
        'absolute inset-0 bg-gradient-to-br opacity-50 rounded-2xl',
        colors.bg
      )} />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            colors.icon
          )}>
            <Icon className="w-6 h-6" />
          </div>
          
          {trend !== undefined && (
            <div className={clsx(
              'text-sm font-medium px-2 py-1 rounded-lg',
              trend >= 0 
                ? 'text-emerald-400 bg-emerald-500/10' 
                : 'text-red-400 bg-red-500/10'
            )}>
              {trend >= 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>

        {/* Value */}
        <div className={clsx('font-display font-bold text-3xl mb-1', colors.value)}>
          {value}
        </div>

        {/* Title */}
        <div className="text-white/60 text-sm font-medium">{title}</div>

        {/* Subtitle */}
        {subtitle && (
          <div className="text-white/40 text-xs mt-1">{subtitle}</div>
        )}
      </div>
    </motion.div>
  )
}


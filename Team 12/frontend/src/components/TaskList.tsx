'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, Circle, Clock, AlertCircle, 
  ExternalLink, User, Timer 
} from 'lucide-react'
import clsx from 'clsx'
import type { Task } from '@/lib/store'

interface TaskListProps {
  tasks: Task[]
  onTaskClick?: (task: Task) => void
}

const statusConfig = {
  todo: {
    icon: Circle,
    color: 'text-white/40',
    bg: 'bg-white/5',
    label: 'To Do',
  },
  in_progress: {
    icon: Clock,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    label: 'In Progress',
  },
  review: {
    icon: AlertCircle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    label: 'In Review',
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    label: 'Completed',
  },
}

const priorityColors = {
  1: 'border-l-white/20',
  2: 'border-l-blue-500',
  3: 'border-l-amber-500',
  4: 'border-l-orange-500',
  5: 'border-l-red-500',
}

export default function TaskList({ tasks, onTaskClick }: TaskListProps) {
  // Group tasks by status
  const groupedTasks = tasks.reduce((acc, task) => {
    const status = task.status || 'todo'
    if (!acc[status]) acc[status] = []
    acc[status].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  const statusOrder = ['in_progress', 'todo', 'review', 'completed']

  return (
    <div className="space-y-6">
      {statusOrder.map((status) => {
        const statusTasks = groupedTasks[status] || []
        if (statusTasks.length === 0) return null
        
        const config = statusConfig[status as keyof typeof statusConfig]
        const StatusIcon = config.icon

        return (
          <div key={status}>
            {/* Status header */}
            <div className="flex items-center gap-2 mb-3">
              <StatusIcon className={clsx('w-4 h-4', config.color)} />
              <span className="text-sm font-medium text-white/80">{config.label}</span>
              <span className="text-xs text-white/40 ml-auto">
                {statusTasks.length} task{statusTasks.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              <AnimatePresence>
                {statusTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onTaskClick?.(task)}
                    className={clsx(
                      'group p-4 rounded-xl border-l-4 bg-surface-800/50 border border-white/5',
                      'hover:bg-surface-800 transition-all cursor-pointer',
                      priorityColors[task.priority as keyof typeof priorityColors] || priorityColors[1]
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white truncate">{task.title}</h4>
                          {task.ai_generated && (
                            <span className="tag-primary text-xs py-0.5">AI</span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-white/50 line-clamp-2 mb-2">
                          {task.description}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          {task.assigned_to && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Assigned
                            </span>
                          )}
                          {task.estimated_hours && (
                            <span className="flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              {task.estimated_hours}h
                            </span>
                          )}
                          {task.github_issue_id && (
                            <span className="font-mono">#{task.github_issue_id}</span>
                          )}
                        </div>
                      </div>

                      {/* GitHub link */}
                      {task.github_issue_url && (
                        <a
                          href={task.github_issue_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )
      })}

      {tasks.length === 0 && (
        <div className="text-center py-12 text-white/40">
          <Circle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No tasks yet</p>
        </div>
      )}
    </div>
  )
}


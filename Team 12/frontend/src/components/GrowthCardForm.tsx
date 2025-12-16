'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Trash2, Sparkles, Code2, Database, 
  Globe, Cpu, Cloud, Palette, X, Loader2 
} from 'lucide-react'
import clsx from 'clsx'

const skillCategories = [
  { id: 'frontend', label: 'Frontend', icon: Globe, color: 'from-blue-500 to-cyan-500' },
  { id: 'backend', label: 'Backend', icon: Database, color: 'from-green-500 to-emerald-500' },
  { id: 'data', label: 'Data Science', icon: Cpu, color: 'from-purple-500 to-pink-500' },
  { id: 'devops', label: 'DevOps', icon: Cloud, color: 'from-orange-500 to-red-500' },
  { id: 'design', label: 'Design', icon: Palette, color: 'from-pink-500 to-rose-500' },
  { id: 'mobile', label: 'Mobile', icon: Code2, color: 'from-indigo-500 to-violet-500' },
]

const skillLevels = [
  { id: 'beginner', label: 'Beginner', color: 'bg-emerald-500' },
  { id: 'intermediate', label: 'Intermediate', color: 'bg-blue-500' },
  { id: 'advanced', label: 'Advanced', color: 'bg-purple-500' },
  { id: 'expert', label: 'Expert', color: 'bg-amber-500' },
]

const popularInterests = [
  'Web Development', 'Machine Learning', 'Mobile Apps', 'Cloud Computing',
  'Cybersecurity', 'Blockchain', 'IoT', 'Game Development', 'AR/VR',
  'Data Visualization', 'APIs', 'Open Source', 'DevOps', 'AI/LLMs'
]

interface GrowthCardFormProps {
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  onParseIdeas?: (text: string) => Promise<any>
}

export default function GrowthCardForm({ initialData, onSubmit, onParseIdeas }: GrowthCardFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    degree: initialData?.degree || '',
    major: initialData?.major || '',
    experience_years: initialData?.experience_years || 0,
    skills: initialData?.growth_card?.skills || [],
    interests: initialData?.growth_card?.interests || [],
    explore_goals: initialData?.growth_card?.explore_goals || [],
    project_ideas_text: '',
  })
  
  const [activeSection, setActiveSection] = useState('profile')
  const [newSkill, setNewSkill] = useState({ name: '', level: 'intermediate', category: 'frontend' })
  const [newInterest, setNewInterest] = useState('')
  const [newGoal, setNewGoal] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [parsedIdeas, setParsedIdeas] = useState<any>(null)

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { ...newSkill }]
      }))
      setNewSkill({ name: '', level: 'intermediate', category: 'frontend' })
    }
  }

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_: any, i: number) => i !== index)
    }))
  }

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i: string) => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const addCustomInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }))
      setNewInterest('')
    }
  }

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData(prev => ({
        ...prev,
        explore_goals: [...prev.explore_goals, newGoal.trim()]
      }))
      setNewGoal('')
    }
  }

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      explore_goals: prev.explore_goals.filter((_: any, i: number) => i !== index)
    }))
  }

  const handleParseIdeas = async () => {
    if (!formData.project_ideas_text.trim() || !onParseIdeas) return
    
    setIsParsing(true)
    try {
      const result = await onParseIdeas(formData.project_ideas_text)
      setParsedIdeas(result.parsed)
    } catch (error) {
      console.error('Failed to parse ideas:', error)
    } finally {
      setIsParsing(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        name: formData.name,
        degree: formData.degree,
        major: formData.major,
        experience_years: formData.experience_years,
        growth_card: {
          skills: formData.skills,
          interests: formData.interests,
          explore_goals: formData.explore_goals,
          project_ideas: parsedIdeas?.parsed_ideas || [],
          parsed_categories: parsedIdeas?.categories || [],
          stats: initialData?.growth_card?.stats || {
            tasks_completed: 0,
            commits_count: 0,
            prs_merged: 0,
            xp_points: 0,
            streak_days: 0,
            completion_rate: 0,
          }
        }
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const sections = ['profile', 'skills', 'interests', 'goals', 'ideas']

  return (
    <div className="space-y-8">
      {/* Section tabs */}
      <div className="flex gap-2 p-1 bg-surface-800/50 rounded-xl overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={clsx(
              'flex-1 min-w-[100px] px-4 py-2.5 rounded-lg font-medium text-sm capitalize transition-all',
              activeSection === section
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            )}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Section content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Degree</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                    className="input-field"
                    placeholder="e.g., Bachelor's, Master's"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Major</label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                    className="input-field"
                    placeholder="e.g., Computer Science"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience_years}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                  className="input-field w-32"
                />
              </div>
            </div>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <div className="space-y-6">
              {/* Category selector */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {skillCategories.map((cat) => {
                  const Icon = cat.icon
                  const isSelected = newSkill.category === cat.id
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setNewSkill(prev => ({ ...prev, category: cat.id }))}
                      className={clsx(
                        'p-3 rounded-xl border transition-all duration-200',
                        isSelected
                          ? `bg-gradient-to-br ${cat.color} border-transparent text-white shadow-lg`
                          : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                      )}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-xs font-medium">{cat.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Add skill form */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field flex-1"
                  placeholder="Skill name (e.g., React, Python)"
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                />
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
                  className="input-field w-40"
                >
                  {skillLevels.map((level) => (
                    <option key={level.id} value={level.id}>{level.label}</option>
                  ))}
                </select>
                <button onClick={addSkill} className="btn-primary">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Skills list */}
              <div className="space-y-2">
                {formData.skills.map((skill: any, index: number) => {
                  const category = skillCategories.find(c => c.id === skill.category)
                  const level = skillLevels.find(l => l.id === skill.level)
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className={clsx('w-2 h-2 rounded-full', level?.color)} />
                        <span className="font-medium">{skill.name}</span>
                        <span className="tag text-xs">{category?.label}</span>
                        <span className="text-xs text-white/50">{level?.label}</span>
                      </div>
                      <button
                        onClick={() => removeSkill(index)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )
                })}
                
                {formData.skills.length === 0 && (
                  <div className="text-center py-8 text-white/40">
                    Add your first skill above
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interests Section */}
          {activeSection === 'interests' && (
            <div className="space-y-6">
              <p className="text-white/60">Select domains you're interested in or add your own.</p>
              
              <div className="flex flex-wrap gap-2">
                {popularInterests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={clsx(
                      'px-4 py-2 rounded-full text-sm font-medium transition-all',
                      formData.interests.includes(interest)
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:border-primary-500/50 hover:text-white'
                    )}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              {/* Custom interest */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Add a custom interest..."
                  onKeyDown={(e) => e.key === 'Enter' && addCustomInterest()}
                />
                <button onClick={addCustomInterest} className="btn-secondary">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Selected interests */}
              {formData.interests.filter((i: string) => !popularInterests.includes(i)).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Custom Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests
                      .filter((i: string) => !popularInterests.includes(i))
                      .map((interest: string) => (
                        <span
                          key={interest}
                          className="tag-primary flex items-center gap-2"
                        >
                          {interest}
                          <button
                            onClick={() => toggleInterest(interest)}
                            className="hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Goals Section */}
          {activeSection === 'goals' && (
            <div className="space-y-6">
              <p className="text-white/60">What do you want to explore or learn this quarter?</p>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="input-field flex-1"
                  placeholder="e.g., Learn Kubernetes, Build a mobile app..."
                  onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                />
                <button onClick={addGoal} className="btn-primary">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {formData.explore_goals.map((goal: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-accent-500/10 to-transparent border border-accent-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-accent-400" />
                      </div>
                      <span className="font-medium">{goal}</span>
                    </div>
                    <button
                      onClick={() => removeGoal(index)}
                      className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
                
                {formData.explore_goals.length === 0 && (
                  <div className="text-center py-8 text-white/40">
                    Add your first exploration goal
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ideas Section */}
          {activeSection === 'ideas' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Project Ideas (Free Text)
                </label>
                <p className="text-white/50 text-sm mb-3">
                  Describe any project ideas you have in natural language. Our AI will parse and categorize them.
                </p>
                <textarea
                  value={formData.project_ideas_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_ideas_text: e.target.value }))}
                  className="input-field min-h-[150px] resize-y"
                  placeholder="I want to build a mobile app that tracks carbon footprint, and also maybe a dashboard for visualizing crypto market data. I'm also interested in creating an AI chatbot for my university..."
                />
              </div>

              <button
                onClick={handleParseIdeas}
                disabled={isParsing || !formData.project_ideas_text.trim()}
                className="btn-secondary flex items-center gap-2"
              >
                {isParsing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                Parse with AI
              </button>

              {/* Parsed results */}
              {parsedIdeas && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 space-y-4"
                >
                  <h4 className="font-display font-semibold text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-400" />
                    AI Analysis
                  </h4>
                  
                  <div>
                    <label className="text-sm text-white/60">Identified Projects</label>
                    <ul className="mt-2 space-y-1">
                      {parsedIdeas.parsed_ideas?.map((idea: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary-400">•</span>
                          <span>{idea}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <label className="text-sm text-white/60">Categories</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {parsedIdeas.categories?.map((cat: string, i: number) => (
                        <span key={i} className="tag-accent">{cat}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-white/60">Skills Needed</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {parsedIdeas.skills_needed?.map((skill: string, i: number) => (
                        <span key={i} className="tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-sm text-white/60">Complexity: </span>
                    <span className="tag-primary capitalize">{parsedIdeas.complexity_level}</span>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Submit button */}
      <div className="flex justify-end pt-6 border-t border-white/10">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-primary flex items-center gap-2 px-8"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          Save Growth Card
        </button>
      </div>
    </div>
  )
}


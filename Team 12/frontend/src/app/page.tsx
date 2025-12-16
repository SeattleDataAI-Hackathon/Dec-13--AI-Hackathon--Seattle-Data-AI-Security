'use client'

import { motion } from 'framer-motion'
import { 
  Sparkles, Users, Github, Zap, ArrowRight, 
  Code2, Brain, Rocket, CheckCircle2 
} from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Team Formation',
    description: 'Our intelligent algorithm analyzes skills and interests to form complementary teams.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Code2,
    title: 'Project Genesis',
    description: 'AI generates tailored project ideas with complete scope, tasks, and GitHub setup.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Rocket,
    title: 'Progress Tracking',
    description: 'Real-time sync with GitHub. Every commit, PR, and issue tracked automatically.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Sparkles,
    title: 'Growth Cards',
    description: 'Dynamic profiles that evolve as you learn, showcasing your journey and achievements.',
    color: 'from-emerald-500 to-teal-500',
  },
]

const stats = [
  { value: '500+', label: 'Active Learners' },
  { value: '120', label: 'Projects Completed' },
  { value: '50K+', label: 'Lines of Code' },
  { value: '98%', label: 'Satisfaction Rate' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(217, 70, 239, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(217, 70, 239, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }} />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-white/80">AI-Powered Collaborative Learning</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6"
          >
            Learn Together,
            <br />
            <span className="gradient-text">Build Together</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10"
          >
            TechClub AI orchestrates peer learning by forming optimal teams, 
            generating tailored projects, and tracking your growth journey.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/login" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              <Github className="w-5 h-5" />
              Start with GitHub
            </Link>
            <Link href="#features" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
              Learn More
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-white/10"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-bold text-3xl md:text-4xl gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 rounded-full bg-white/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              From profile to project completion, AI guides your collaborative learning journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative p-8 rounded-3xl bg-surface-800/50 border border-white/5 overflow-hidden card-hover"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 mb-6`}>
                    <div className="w-full h-full rounded-2xl bg-surface-900 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <h3 className="font-display font-semibold text-xl mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/60">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl blur-3xl opacity-20" />
          
          <div className="relative p-12 md:p-16 rounded-3xl glass-primary text-center">
            <Sparkles className="w-12 h-12 text-primary-400 mx-auto mb-6" />
            
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Join TechClub AI and let artificial intelligence orchestrate your path to becoming a better developer.
            </p>
            
            <Link href="/login" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              <Github className="w-5 h-5" />
              Get Started Free
            </Link>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/50">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Free Forever
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                No Credit Card
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                GitHub Integration
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold">TechClub AI</span>
          </div>
          <p className="text-white/40 text-sm">
            © 2024 TechClub AI. Built for collaborative learning.
          </p>
        </div>
      </footer>
    </div>
  )
}


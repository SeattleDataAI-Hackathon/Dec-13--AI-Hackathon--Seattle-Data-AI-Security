'use client';

import {
  Bot,
  Sparkles,
  ShieldCheck,
  Zap,
  Workflow,
  ArrowRight,
  Database,
  Globe2,
  LineChart,
  Linkedin,
  Github,
  Mail,
  AlertCircle,
  Lightbulb,
  Target,
  Calendar,
  MapPin,
  FileText,
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { appConfig } from '@/config/app';
import { ClientLayout } from '@/components/homepage/client-layout';

export default function Home() {
  return (
    <ClientLayout>
      <div className="relative w-full">
        {/* Hero */}
        <section className="relative overflow-hidden w-full min-h-[600px]">
          <div className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-b from-secondary to-background" />
          <div className="absolute -top-24 right-1/2 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/2 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="container mx-auto py-20 md:py-28">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/20">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  Co-Creator: AI Marketing Copilot for Creators
                </div>
                <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight md:text-6xl">
                  Create Better Content with AI Collaboration
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl">
                  Co-Creator connects you with intelligent AI agents to brainstorm, write, design, and produce high-quality content. Built with multi-agent workflows, MCP tools, and seamless human-AI collaboration.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    <Link href="/onboarding">
                      <Sparkles className="h-4 w-4 mr-2" /> Get Started Free
                    </Link>
                  </Button>
              
                  <Button asChild variant="outline" size="lg">
                    <Link href="/chat">
                      Start Chatting <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  
                
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="inline-flex items-center gap-2">
                    <Bot className="h-4 w-4" /> AI SDK + Claude/GPT-4
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Workflow className="h-4 w-4" /> MCP Tools
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Database className="h-4 w-4" /> SQLite
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square md:aspect-[4/3] rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-2">
                  <div className="h-full w-full rounded-xl border bg-background grid place-items-center">
                    <div className="text-center px-6">
                      <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-primary/10 text-primary grid place-items-center ring-1 ring-primary/20">
                        <Sparkles className="h-7 w-7" />
                      </div>
                      <p className="font-semibold">AI Marketing Copilot</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Collaborate with specialized AI agents to plan strategies, create content, automate execution, and track what drives revenue.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full bg-secondary/30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: TrendingUp, value: '3.2x', label: 'Avg. ROI' },
                { icon: Users, value: '50+', label: 'Hours Saved' },
                { icon: Sparkles, value: '5', label: 'AI Agents' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="font-bold text-3xl md:text-4xl">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem & Opportunity */}
        <section id="problem" className="container mx-auto py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border p-8 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-md bg-destructive/10 text-destructive grid place-items-center ring-1 ring-destructive/20">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">The Problem</h2>
              </div>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                  <span>Marketing is fragmented across 10+ platforms—social media, email, local events—making it overwhelming for small businesses</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                  <span>Time and effort spent don&apos;t translate to paying customers—likes don&apos;t pay bills</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                  <span>Local opportunities (markets, fairs, partnerships) are invisible and hard to discover</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                  <span>No clear data on what marketing actually works—just guessing and hoping</span>
                </li>
              </ul>
            </div>
            <div id="opportunity" className="rounded-xl border p-8 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center ring-1 ring-primary/20">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">The Solution</h2>
              </div>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>AI agents understand your business deeply and plan marketing strategies across all channels</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Automated content creation and scheduling frees up your time to focus on customers</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Discover local events, markets, and partnership opportunities automatically in your area</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>Track what drives revenue, not vanity metrics—know exactly what&apos;s working and why</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section id="vision" className="container mx-auto py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Your AI Marketing Copilot
            </h2>
            <p className="mt-3 text-muted-foreground">
              Stop guessing, start growing. Automate marketing tasks, discover local opportunities, and get clear insights into what actually drives paying customers.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              {
                icon: Bot,
                title: 'Deep Business Context',
                desc: 'Understands your brand, products, goals, and audience—not generic prompts.',
              },
              {
                icon: Workflow,
                title: 'Multi-Channel Strategy',
                desc: 'Plans marketing across platforms and locations with clear priorities.',
              },
              {
                icon: Zap,
                title: 'Automated Execution',
                desc: 'Schedules posts, sends emails, and handles follow-ups automatically.',
              },
              {
                icon: LineChart,
                title: 'Revenue-First Analytics',
                desc: 'Tracks what drives customers, not just vanity metrics like likes.',
              },
            ].map((f, i) => (
              <div key={i} className="rounded-xl border p-6 bg-card">
                <div className="h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center ring-1 ring-primary/20">
                  <f.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold">{f.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Agents */}
        <section id="avatars" className="container mx-auto py-16 md:py-15">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Specialized AI Agents</h2>
            <p className="mt-3 text-muted-foreground">
              Meet our intelligent AI agents, each specialized to handle different aspects of your marketing workflow.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Target,
                title: 'Strategy Agent',
                desc: 'Analyzes your business and creates data-driven marketing plans with platform recommendations and content themes.',
              },
              {
                icon: FileText,
                title: 'Content Agent',
                desc: 'Generates platform-specific posts, emails, and outreach messages tailored to your brand voice.',
              },
              {
                icon: Zap,
                title: 'Execution Agent',
                desc: 'Schedules posts, sends emails, sets up reminders, and handles automated outreach sequences.',
              },
              {
                icon: BarChart3,
                title: 'Analytics Agent',
                desc: 'Tracks performance, explains what works, and automatically adjusts strategies for revenue optimization.',
              },
            ].map((agent, i) => (
              <div key={i} className="rounded-xl border bg-card p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <agent.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-center">{agent.title}</h3>
                <p className="text-sm text-muted-foreground text-center mt-2">{agent.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="container mx-auto py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Powerful Features</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Grow Sales
              </span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Agentic marketing that understands your business, plans campaigns, executes automatically, and optimizes for revenue—not just engagement.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: 'Full Business Context',
                desc: 'Unlike generic AI tools, Co-Creator learns your brand, goals, pricing, and capacity to give relevant advice—not cookie-cutter content.',
                color: 'primary',
              },
              {
                icon: Sparkles,
                title: 'AI Strategy Engine',
                desc: 'Get personalized marketing plans that prioritize revenue. Know exactly where to focus your limited time for maximum impact.',
                color: 'primary',
              },
              {
                icon: Calendar,
                title: 'Smart Content Generation',
                desc: 'Platform-specific posts, emails, and outreach crafted in your voice. Review once, or let it run on autopilot.',
                color: 'primary',
              },
              {
                icon: LineChart,
                title: 'Revenue-First Analytics',
                desc: 'Track what actually matters: sales, leads, and conversions—not vanity metrics that don&apos;t pay the bills.',
                color: 'primary',
              },
              {
                icon: MapPin,
                title: 'Local Opportunity Finder',
                desc: 'Discover markets, fairs, pop-ups, and partnership opportunities in your area matched to your products.',
                color: 'primary',
              },
              {
                icon: Mail,
                title: 'Automated Outreach',
                desc: 'From retailer pitches to event applications, Co-Creator handles the tedious outreach so you can focus on creating.',
                color: 'primary',
              },
            ].map((f, i) => (
              <div 
                key={i} 
                className="group rounded-xl border p-6 bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center ring-1 ring-primary/20 mb-4">
                  <f.icon className="h-6 w-6" />
                </div>
                <p className="mt-3 font-semibold text-lg">{f.title}</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Trusted by creative businesses worldwide</span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="container mx-auto py-16 md:py-24 bg-secondary/30 rounded-3xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">
              How <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Co-Creator</span> Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              From setup to sales in six simple steps. Your AI marketing team handles the heavy lifting while you focus on what you love.
            </p>
          </div>
          
          <div className="mt-12 max-w-4xl mx-auto">
            {[
              {
                number: '01',
                title: 'Business Context',
                desc: 'Share your brand, products, goals, and capacity. The AI learns your unique business to provide relevant strategies.',
                icon: Database,
              },
              {
                number: '02',
                title: 'AI Strategy',
                desc: 'Get a personalized marketing plan with platform recommendations, content themes, and prioritized action steps.',
                icon: Target,
              },
              {
                number: '03',
                title: 'Content Creation',
                desc: 'AI generates platform-specific posts, emails, and outreach messages in your brand voice—ready to publish.',
                icon: Sparkles,
              },
              {
                number: '04',
                title: 'Automated Execution',
                desc: 'Schedule posts, send emails, and handle follow-ups automatically. Choose your level of automation.',
                icon: Calendar,
              },
              {
                number: '05',
                title: 'Performance Analytics',
                desc: 'Track what drives revenue with real-time analytics. See conversions, not just likes and follows.',
                icon: LineChart,
              },
              {
                number: '06',
                title: 'Continuous Optimization',
                desc: 'AI learns from results and automatically adjusts your strategy to maximize sales and growth.',
                icon: Workflow,
              },
            ].map((step, i) => (
              <div key={i} className="relative flex gap-6 md:gap-8 pb-10 last:pb-0">
                {i < 5 && (
                  <div className="absolute left-8 top-20 bottom-0 w-px bg-border hidden md:block" />
                )}
                
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                    <span className="font-bold text-xl text-primary-foreground">
                      {step.number}
                    </span>
                  </div>
                </div>

                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <step.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-xl">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Get Started Now <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Architecture */}
        <section id="architecture" className="container mx-auto py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Architecture</h2>
            <p className="mt-3 text-muted-foreground">
              Multi-agent AI system with local context storage, powered by Next.js and Claude/GPT-4.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-3 overflow-x-auto">
            <div className="rounded-xl border bg-card p-4 text-center">
              <div className="mx-auto mb-2 h-10 w-10 rounded-md bg-secondary grid place-items-center">
                <Globe2 className="h-5 w-5" />
              </div>
              <p className="font-medium">Next.js UI</p>
              <p className="text-xs text-muted-foreground">React 19</p>
            </div>
            <ArrowRight className="mx-1 text-muted-foreground" />
            <div className="rounded-xl border bg-card p-4 text-center">
              <div className="mx-auto mb-2 h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center ring-1 ring-primary/20">
                <Bot className="h-5 w-5" />
              </div>
              <p className="font-medium">AI SDK</p>
              <p className="text-xs text-muted-foreground">Claude/GPT-4</p>
            </div>
            <ArrowRight className="mx-1 text-muted-foreground" />
            <div className="rounded-xl border bg-card p-4 text-center">
              <div className="mx-auto mb-2 h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center ring-1 ring-primary/20">
                <Workflow className="h-5 w-5" />
              </div>
              <p className="font-medium">MCP Tools</p>
              <p className="text-xs text-muted-foreground">Custom functions</p>
            </div>
            <ArrowRight className="mx-1 text-muted-foreground" />
            <div className="rounded-xl border bg-card p-4 text-center">
              <div className="mx-auto mb-2 h-10 w-10 rounded-md bg-secondary grid place-items-center">
                <Database className="h-5 w-5" />
              </div>
              <p className="font-medium">SQLite</p>
              <p className="text-xs text-muted-foreground">Local storage</p>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="container mx-auto py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Technology Stack</h2>
            <p className="mt-3 text-muted-foreground">
              Multi-agent AI, real-time analytics, local context storage, and automated marketing execution.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-5">
            {[
              { icon: Globe2, label: 'Next.js 15' },
              { icon: Bot, label: 'Multi-Agent AI' },
              { icon: Workflow, label: 'MCP Integration' },
              { icon: Database, label: 'Context Storage' },
              { icon: LineChart, label: 'Analytics Engine' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border p-5 bg-card text-center">
                <div className="mx-auto h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center ring-1 ring-primary/20">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-2 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section id="workflow" className="container mx-auto py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight">Intelligent Workflow</h2>
            <p className="mt-3 text-muted-foreground">
              See how messages flow through our AI-powered system with MCP tool integration.
            </p>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="container mx-auto py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Roadmap</h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {appConfig.roadmap.map((r, i) => (
              <div key={i} className="rounded-xl border p-6 bg-card">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{r.step}</p>
                <p className="mt-1 font-semibold">{r.desc}</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {r.details.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section id="team" className="container mx-auto py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Meet Our Team</h2>
            <p className="mt-3 text-muted-foreground">
              The passionate innovators behind {appConfig.company.name}, bringing together expertise
              in AI, creative technology, and collaborative platforms.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {appConfig.team.map((member, i) => (
              <div key={i} className="group text-center">
                <div className="relative mb-4 mx-auto">
                  <div className="aspect-square w-32 mx-auto overflow-hidden rounded-full border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-1">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-primary/10 border-2 border-background grid place-items-center">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-primary font-medium">{member.role}</p>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <a
                    href={member.linkedin}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={member.github}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={`${member.name} GitHub`}
                  >
                    <Github className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section id="contact" className="relative overflow-hidden w-full">
          <div className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="container mx-auto py-16 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Ready to grow your business with AI?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Stop guessing with your marketing. Start growing with data-driven strategies, automated execution, and revenue-focused insights.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg">
                  <Link href="/chat">
                    <Sparkles className="h-4 w-4 mr-2" /> Start Marketing Smarter
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/onboarding">
                    Get Started Free
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Free to start • No credit card required • 5 AI agents included
              </p>
            </div>
          </div>
        </section>
      </div>
    </ClientLayout>
  );
}

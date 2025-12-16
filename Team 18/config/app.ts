import path from 'path';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const appConfig = {
  name: 'Co-Creator',
  title: 'Co-Creator - AI-Powered Collaborative Content Platform',
  description:
    "Co-Creator: An intelligent AI collaboration platform that connects creators with AI agents to produce high-quality content. Built with MCP (Model Context Protocol) for seamless tool integration and multi-agent workflows.",
  url: 'https://co-creator.vercel.app',
  ogImage: 'https://co-creator.vercel.app/og.jpg',

  // Company Information
  company: {
    name: 'Co-Creator',
    tagline: 'AI-Powered Creative Collaboration',
    founded: '2025',
    headquarters: 'Seattle, WA',
  },

  // Contact Information
  contact: {
    email: {
      support: 'support@co-creator.ai',
      info: 'info@co-creator.ai',
      partnerships: 'partnerships@co-creator.ai',
      careers: 'careers@co-creator.ai',
    },
    phone: {
      main: '+1-800-COCREATE',
      international: '+1 (206) 555-0200',
      emergency: '+1 (800) 555-HELP',
    },
    address: {
      street: '123 Innovation Way',
      suite: 'Suite 500',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'United States',
      full: '123 Innovation Way, Suite 500, Seattle, WA 98101, United States',
    },
    hours: {
      support: '24/7 AI-Powered Support',
      office: 'Monday - Friday, 9:00 AM - 6:00 PM PST',
      weekend: 'Saturday - Sunday, 10:00 AM - 4:00 PM PST',
    },
  },

  // Social Media Links
  social: {
    facebook: 'https://www.facebook.com/cocreator',
    twitter: 'https://twitter.com/cocreator_ai',
    instagram: 'https://instagram.com/cocreator.ai',
    linkedin: 'https://linkedin.com/company/co-creator-ai',
    youtube: 'https://youtube.com/@cocreator',
    github: 'https://github.com/co-creator-ai',
    discord: 'https://discord.gg/cocreator',
  },

  // Navigation Links
  nav: {
    main: [
      { title: 'Home', href: '/' },
      { title: 'Documentation', href: '/docs' },
      { title: 'MCP Servers', href: '/mcp-servers' },
      { title: 'API', href: '/api' },
      { title: 'About', href: '/about' },
    ],
    footer: {
      product: [
        { title: 'Features', href: '/features' },
        { title: 'Documentation', href: '/docs' },
        { title: 'MCP Integration', href: '/mcp' },
        { title: 'API Reference', href: '/api' },
        { title: 'Changelog', href: '/changelog' },
      ],
      support: [
        {
          title: 'Get Started',
          href: '/chat?initialMessage=How%20do%20I%20get%20started',
        },
        {
          title: 'Add MCP Server',
          href: '/chat?initialMessage=How%20do%20I%20add%20an%20MCP%20server',
        },
        {
          title: 'Configure Models',
          href: '/chat?initialMessage=How%20do%20I%20configure%20AI%20models',
        },
        { title: 'FAQs', href: '/faq' },
        { title: 'Help Center', href: '/help' },
      ],
      developers: [
        { title: 'GitHub', href: 'https://github.com/deepakkamboj' },
        { title: 'API Documentation', href: '/docs/api' },
        { title: 'MCP Protocol', href: '/docs/mcp' },
        { title: 'Contributing', href: '/contributing' },
      ],
      legal: [
        { title: 'Terms of Service', href: '/terms' },
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Cookie Policy', href: '/cookies' },
        { title: 'License', href: '/license' },
      ],
    },
  },

  // Features & Services
  features: {
    models: ['Claude Sonnet 4', 'Qwen QWQ', 'DeepSeek R1', 'Mistral Large', 'Gemini Flash'],
    capabilities: [
      'Multi-Model Support',
      'MCP Server Integration',
      'Real-time Streaming',
      'Tool Calling',
      'Context Management',
    ],
    mcpServers: 'Playwright, Filesystem, GitHub, Google Maps, Brave Search',
    integrations: ['SSE Transport', 'stdio Transport', 'Daytona Sandbox'],
  },

  // Business Statistics
  stats: {
    users: '10K+',
    chats: '100K+',
    mcpServers: '50+',
    rating: '4.8',
    models: '8+',
    uptime: '99.9%',
  },

  // Theme Colors
  theme: {
    primary: '#0ea5e9', // sky-500
    secondary: '#06b6d4', // cyan-500
    accent: '#22d3ee', // cyan-400
    background: '#f0f9ff', // sky-50
    muted: '#e0f2fe', // sky-100
  },

  // SEO Keywords
  keywords: [
    'AI marketing',
    'marketing copilot',
    'AI agents',
    'Co-Creator',
    'marketing automation',
    'content generation',
    'marketing strategy',
    'AI marketing tools',
    'social media automation',
    'local marketing',
    'small business marketing',
    'AI-powered marketing',
  ],

  // Legal Information
  legal: {
    copyright: `© ${new Date().getFullYear()} Co-Creator LLC. All rights reserved.`,
    trademark: 'Co-Creator is a trademark of Co-Creator LLC.',
    license: 'Proprietary License',
  },

  // Google OAuth Configuration
  auth: {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      scopes: ['email', 'profile'].join(' '),
    },
  },

  // Database Configuration
  database: {
    postgres: {
      url: process.env.DATABASE_URL || '',
    },
    sqlite: {
      path: 'data/local.db',
    },
  },

  // MCP Configuration
  mcp: {
    configFile: 'public/.mcp-config.json',
    sandboxProvider: 'daytona',
    defaultTransport: 'sse',
  },

  // Email Configuration (for future use)
  email: {
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER || '',
      password: process.env.SMTP_PASSWORD || '',
    },
    from: {
      name: process.env.EMAIL_FROM_NAME || 'Co-Creator',
      email: process.env.EMAIL_FROM_ADDRESS || 'noreply@co-creator.ai',
    },
    templatesPath: path.join(process.cwd(), 'email-templates'),
    debug: process.env.EMAIL_DEBUG === 'true',
    subjects: {
      emailVerification: 'Verify Your Email Address',
      welcome: 'Welcome to Co-Creator!',
      passwordReset: 'Reset Your Password',
      newsletter: 'Co-Creator Marketing Insights - {{formatDate date}}',
    },
  },

  // Team Members
  team: [
    {
      name: 'Deepak Kamboj',
      role: 'Co-Founder & CEO',
      image: '/team/deepakkamboj.png',
      bio: "Co-Founder and CEO of Co-Creator. Passionate about democratizing AI-powered content creation and building tools that empower creators worldwide. Speaking at the AI Hackathon 2025 about the future of collaborative AI.",
      linkedin: 'https://linkedin.com/in/deepakkamboj',
      github: 'https://github.com/deepakkamboj',
      email: 'deepak@co-creator.ai',
    },
    {
      name: 'Diya Kamboj',
      role: 'Head of Product & UX',
      image: '/team/diya.svg',
      bio: "Leads Product and UX at Co-Creator, designing intuitive interfaces that make AI collaboration accessible to everyone. With a background in design thinking and user research, she ensures Co-Creator delivers exceptional creator experiences.",
      linkedin: 'https://linkedin.com/in/diyakamboj',
      github: 'https://github.com/diyakamboj',
      email: 'diya@co-creator.ai',
    },
    {
      name: 'Neha Chaurasia',
      role: 'Director of AI Strategy',
      image: '/team/neha.svg',
      bio: 'Director of AI Strategy at Co-Creator, specializing in multi-agent systems and content generation workflows. With expertise in NLP and generative AI, Neha develops intelligent agents that understand creator needs and deliver high-quality outputs.',
      linkedin: 'https://linkedin.com/in/nehachaurasia',
      github: 'https://github.com/nehachaurasia',
      email: 'neha@co-creator.ai',
    },
    {
      name: 'Drew Lackman',
      role: 'Chief Technology Officer',
      image: '/team/drew.svg',
      bio: 'Chief Technology Officer at Co-Creator, architecting scalable AI infrastructure and MCP integrations. With deep expertise in distributed systems and AI model deployment, Drew ensures Co-Creator delivers fast, reliable, and innovative AI collaboration experiences.',
      linkedin: 'https://linkedin.com/in/drewlackman',
      github: 'https://github.com/drewlackman',
      email: 'drew@co-creator.ai',
    },
  ],

  // Roadmap Phases
  roadmap: [
    {
      step: 'Phase 1',
      desc: 'Foundation - AI Chat & Content Tools',
      details: ['Multi-model AI chat', 'Content generation', 'MCP tool integration'],
    },
    {
      step: 'Phase 2',
      desc: 'Collaboration & Workflows',
      details: ['Multi-agent collaboration', 'Custom workflows', 'Template library'],
    },
    {
      step: 'Phase 3',
      desc: 'Marketplace & Monetization',
      details: ['Agent marketplace', 'Creator monetization', 'Premium features'],
    },
    {
      step: 'Phase 4',
      desc: 'Enterprise & Scale',
      details: ['Team workspaces', 'Enterprise SSO', 'Advanced analytics'],
    },
  ],
};

export type AppConfig = typeof appConfig;

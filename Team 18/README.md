# Co-Creator: AI Marketing Copilot for Creators

<p align="center">
  <strong>Turn your business context into automated, revenue-focused marketing actions</strong>
</p>

<p align="center">
  <a href="#overview"><strong>Overview</strong></a> •
  <a href="#key-features"><strong>Features</strong></a> •
  <a href="#how-it-works"><strong>How It Works</strong></a> •
  <a href="#tech-stack"><strong>Tech Stack</strong></a> •
  <a href="#getting-started"><strong>Getting Started</strong></a> •
  <a href="#mcp-integration"><strong>MCP Integration</strong></a>
</p>

---

## Overview

Co-Creator is an AI-powered marketing copilot designed specifically for **independent creators, small business owners, and local sellers** who want paying customers—not just likes and follows.

Most marketing tools generate content and stop. Co-Creator goes further by:
- Understanding your business deeply
- Creating multi-channel marketing strategies
- Executing marketing actions automatically
- Measuring real outcomes (revenue, not vanity metrics)
- Continuously adapting based on what works

**This is agentic marketing, not just generative AI.**

### Target Users

- 🎨 Independent creators (artists, makers, designers, writers)
- 🏪 Small business owners without marketing teams
- 📍 Local + online sellers focused on conversions

### Core Problems We Solve

1. **Marketing Is Fragmented** - Too many platforms, unclear priorities, constantly changing trends
2. **Effort Doesn't Convert** - Likes ≠ customers, no feedback loop from content to sales
3. **Time & Cognitive Overload** - Repetitive tasks lead to burnout and inconsistent marketing
4. **Local Opportunities Are Invisible** - Events, fairs, and partnerships are scattered and hard to discover

---

## Key Features

### 🤖 5 Specialized AI Agents

**1. Strategy Agent**
- Analyzes your business and creates data-driven marketing plans
- Platform recommendations and content calendars
- Prioritized action steps tied to revenue goals

**2. Content Agent**
- Generates platform-specific posts, emails, and outreach messages
- Matches your brand voice automatically
- Optimized for engagement and conversions

**3. Execution Agent**
- Schedules posts across platforms
- Automates email sequences
- Handles follow-ups and reminders

**4. Analytics Agent**
- Tracks performance across channels
- Explains what drives conversions (not just engagement)
- Automatically adjusts strategies for revenue optimization

**5. Local Opportunity Agent**
- Discovers nearby markets, events, fairs, and partnerships
- Smart matching by business type and goals
- Helps tap into high-conversion in-person channels

### 📊 Complete Marketing Dashboard

- **Overview** - Real-time metrics and agent activity
- **Analytics** - Revenue-focused insights and channel performance
- **Content Calendar** - Scheduled posts and AI content ideas
- **Content Library** - Manage and distribute content across platforms
- **Local Opportunities** - Discover events with match scores
- **Settings** - Business profile and marketing preferences

### 🎯 Smart Onboarding

Captures complete business context:
- Brand identity & tone
- Products & pricing
- Goals (sales, leads, event turnout)
- Location & capacity
- Preferred platforms

---

## How It Works

```
Business Context → Strategy → Execution → Measurement → Adaptation
```

### Step 1: Business Context Intake
User onboarding captures your brand, products, goals, location, and platforms. Optionally upload brand docs or connect social accounts.

### Step 2: AI Strategy Generation
Strategy Agent creates platform prioritization, posting cadence, content themes tied to sales, and local opportunity recommendations.

### Step 3: Content & Outreach
Content Agent generates platform-specific posts, email campaigns, event outreach messages, and partnership pitches—all matching your brand voice.

### Step 4: Automation & Execution
Execution Agent handles scheduled posting, email sends, follow-ups, and outreach sequences. Choose manual, review-and-approve, or fully automated modes.

### Step 5: Analytics & Learning
Analytics Agent tracks engagement, clicks, sales signals, and event outcomes. Then explains what worked, adjusts strategy automatically, and optimizes for revenue.

---

## Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** + **shadcn/ui** for modern UI components
- **Framer Motion** for animations
- **Lucide React** for icons

### AI & Agents
- **AI SDK by Vercel** - Multi-model support (Claude, GPT-4, Gemini)
- **Model Context Protocol (MCP)** - Extensible tool integration
- **Custom Agent Architecture** - 5 specialized marketing agents
- **Zod** - Type-safe schema validation

### Backend & Database
- **SQLite + Drizzle ORM** - Local-first database with TypeScript-first ORM
- **Server-Sent Events (SSE)** - Real-time streaming responses
- **Next.js API Routes** - Serverless API endpoints

### Infrastructure
- **Vercel** - Deployment and hosting
- **MCP Servers** - SSE and stdio transports for tool integration

---

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- (Optional) MCP servers for extended capabilities

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/co-creator.git
cd co-creator
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your API keys:
```env
# AI Provider Keys (add at least one)
ANTHROPIC_API_KEY=your_claude_key
OPENAI_API_KEY=your_openai_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key

# Optional: Database
DATABASE_URL=file:./data/chat.db
```

4. Initialize the database:
```bash
pnpm db:push
```

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### First Steps

1. Complete the onboarding wizard at `/onboarding`
2. Chat with the AI agents to create your marketing strategy
3. Review generated content in the Content Calendar
4. Explore local opportunities in your area
5. Track performance in the Analytics dashboard

---

## MCP Integration

Co-Creator supports the Model Context Protocol (MCP) for extending AI capabilities with custom tools.

### Adding MCP Servers

1. Click the **MCP Servers** button in the sidebar
2. Add a new server with:
   - **Name**: Descriptive server name
   - **Transport**: SSE (remote) or stdio (local)
   - **Configuration**: URL for SSE or command/args for stdio

### Supported Transports

**SSE (Server-Sent Events)** - For remote HTTP-based servers
```
URL: https://mcp.example.com/sse
```

**stdio (Standard I/O)** - For local servers
```
Command: node
Args: path/to/server.js
```

### Built-in Tools

- Weather information
- 5 Marketing agent tools (Strategy, Content, Execution, Analytics, Local Opportunity)
- Team information
- Hackathon project details

---

## Project Structure

```
ai-hackathon/
├── app/                      # Next.js app directory
│   ├── api/chat/            # Chat API endpoint
│   ├── chat/                # Chat interface
│   ├── dashboard/           # Marketing dashboard
│   │   ├── analytics/       # Analytics page
│   │   ├── content/         # Content calendar
│   │   ├── library/         # Content library
│   │   ├── opportunities/   # Local opportunities
│   │   └── settings/        # Settings page
│   ├── onboarding/          # Onboarding wizard
│   └── home.tsx             # Landing page
├── components/              # React components
│   ├── onboarding/          # Onboarding wizard components
│   ├── ui/                  # shadcn/ui components
│   └── ...                  # Other components
├── ai/                      # AI configuration
│   ├── providers.ts         # Model providers
│   └── tools.ts             # Agent tool definitions
├── lib/                     # Utility libraries
│   ├── db/                  # Database schema
│   ├── context/             # React context
│   └── ...                  # Other utilities
└── public/                  # Static assets
```

---

## Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm db:push      # Push database schema
pnpm db:studio    # Open Drizzle Studio
```

### Database Management

```bash
# Push schema changes
pnpm db:push

# Open database GUI
pnpm db:studio

# Generate migrations
pnpm db:generate
```

---

## Roadmap

### MVP (Current)
- ✅ Business onboarding
- ✅ 5 AI marketing agents
- ✅ Multi-channel strategy generation
- ✅ Content creation and scheduling
- ✅ Analytics dashboard
- ✅ Local opportunity discovery
- ✅ Content library management

### Coming Soon
- 🔄 Full automation with approval workflows
- 🔄 Revenue tracking and attribution
- 🔄 Social media account integration
- 🔄 Email platform integration
- 🔄 Event booking and RSVP management
- 🔄 Mentorship layer with creator advice

### Future Vision
- Advanced A/B testing
- Multi-business management
- White-label solutions
- Marketplace for creator partnerships
- Mobile app

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Powered by [AI SDK by Vercel](https://sdk.vercel.ai/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Model Context Protocol by [Anthropic](https://modelcontextprotocol.io)

---

<p align="center">
  Made with ❤️ for creators who want to focus on creating, not marketing
</p>
1. Enter the command to execute (e.g., `npx`)
2. Enter the command arguments (e.g., `-y @modelcontextprotocol/server-google-maps`)
   - You can enter space-separated arguments or paste a JSON array
3. Click "Add Server"

4. Click "Use" to activate the server for the current chat session.

### Available MCP Servers

You can use any MCP-compatible server with this application. You can use the [demo server](https://remote-mcp-server-authless.idosalomon.workers.dev/sse), which exposes 4 tools -
- `get_tasks_status` - Get a textual representation of the status of all tasks. Used to highlight the difference from UI tool results.
- `show_task_status` - Displays a UI for the user to see the status of tasks (as opposed to text).
- `show_user_status` - Displays a UI for the user to see the status of a user and their tasks (triggered by clicking on the user avatar in the `show_task` UI).
- `nudge_team_member` - Nudges team member (triggered by clicking `Nuge` on the `user_status` UI).

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

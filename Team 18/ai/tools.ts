import { tool } from 'ai';
import { z } from 'zod';

export const weatherTool = tool({
  description: 'Get the weather in a location',
  parameters: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }) => ({
    location,
    temperature: 72 + Math.floor(Math.random() * 21) - 10,
  }),
});

// Business Context Schema
const businessContextSchema = z.object({
  businessName: z.string().describe('The name of the business or brand'),
  businessType: z.string().describe('Type of business (e.g., artist, maker, designer, local shop)'),
  products: z.array(z.string()).describe('Products or services offered'),
  priceRange: z.string().describe('Price range (e.g., $10-$50, $100-$500)'),
  location: z.string().describe('Business location (city, state)'),
  goals: z.array(z.string()).describe('Marketing goals (e.g., increase sales, event attendance, brand awareness)'),
  platforms: z.array(z.string()).describe('Preferred platforms (e.g., Instagram, Email, Etsy, Local Events)'),
  brandVoice: z.string().optional().describe('Brand tone and voice (e.g., friendly, professional, quirky)'),
});

// Strategy Agent Tool
export const strategyAgentTool = tool({
  description: 'Generate a comprehensive marketing strategy based on business context. This agent analyzes the business and creates a data-driven marketing plan with platform recommendations, posting cadence, and content themes.',
  parameters: z.object({
    businessContext: businessContextSchema,
  }),
  execute: async ({ businessContext }) => {
    const { businessName, businessType, products, priceRange, location, goals, platforms, brandVoice } = businessContext;
    
    // Generate strategy based on inputs
    const strategy = {
      businessName,
      strategyId: `STRAT-${Date.now()}`,
      recommendations: {
        primaryPlatforms: platforms.slice(0, 2),
        secondaryPlatforms: platforms.slice(2),
        postingCadence: {
          frequency: '3-4 posts per week',
          bestTimes: ['10 AM - 12 PM', '6 PM - 8 PM'],
        },
        contentThemes: [
          `Behind-the-scenes of ${businessType} creation process`,
          `Customer success stories and testimonials`,
          `Product highlights tied to ${goals[0] || 'sales'}`,
          `Local community engagement and events`,
        ],
        localOpportunities: [
          `Farmers markets in ${location}`,
          `Local art fairs and craft shows`,
          `Community library displays`,
          `Partnership opportunities with local retailers`,
        ],
      },
      insights: [
        `Focus on ${platforms[0]} and email for your price range (${priceRange})`,
        `Local events have 3x higher conversion than social media for ${businessType}`,
        `Email campaigns work best for driving ${goals[0] || 'sales'}`,
      ],
      nextSteps: [
        'Generate platform-specific content',
        'Schedule posts for optimal times',
        'Identify upcoming local events',
      ],
    };

    return {
      success: true,
      strategy,
      message: `Marketing strategy generated for ${businessName}`,
    };
  },
});

// Content Agent Tool
export const contentAgentTool = tool({
  description: 'Generate platform-specific marketing content including social posts, emails, and outreach messages. Content is personalized to brand voice and optimized for each channel.',
  parameters: z.object({
    businessName: z.string().describe('The business name'),
    contentType: z.enum(['social_post', 'email_campaign', 'event_outreach', 'partnership_pitch']).describe('Type of content to generate'),
    platform: z.string().describe('Target platform (Instagram, Email, Facebook, etc.)'),
    theme: z.string().describe('Content theme or topic'),
    brandVoice: z.string().optional().describe('Brand voice and tone'),
    callToAction: z.string().optional().describe('Desired call to action'),
  }),
  execute: async ({ businessName, contentType, platform, theme, brandVoice, callToAction }) => {
    const contentId = `CONTENT-${Date.now()}`;
    
    let generatedContent = {};
    
    if (contentType === 'social_post') {
      generatedContent = {
        platform,
        caption: `✨ ${theme} at ${businessName}! ${brandVoice || 'Check out our latest creation'} ${callToAction || 'Shop now!'} 🎨`,
        hashtags: ['#smallbusiness', '#handmade', '#shoplocal', '#creative', '#artist'],
        bestTime: '10:00 AM',
        imagePrompt: `Professional product photo showcasing ${theme}`,
      };
    } else if (contentType === 'email_campaign') {
      generatedContent = {
        subject: `🎨 New from ${businessName}: ${theme}`,
        preview: `Exclusive look at our latest ${theme}`,
        body: `Hey there!\n\nWe're excited to share ${theme} with you. ${brandVoice || 'Our team has been working hard on this'} and we think you'll love it.\n\n${callToAction || 'Check it out now!'}\n\nBest regards,\n${businessName} Team`,
        cta: callToAction || 'Shop Now',
      };
    } else if (contentType === 'event_outreach') {
      generatedContent = {
        subject: `Partnership Opportunity: ${businessName} at ${theme}`,
        body: `Hello,\n\nI'm reaching out from ${businessName}. We're interested in participating in ${theme}. ${brandVoice || 'We create unique handcrafted products'} that would be a great fit for your event.\n\nWe'd love to discuss how we can collaborate.\n\nBest,\n${businessName}`,
      };
    } else if (contentType === 'partnership_pitch') {
      generatedContent = {
        subject: `Partnership Proposal: ${businessName}`,
        body: `Hi,\n\nI'm from ${businessName}, and I think our products would be a perfect match for your customers. ${theme}.\n\n${brandVoice || 'We focus on quality and local craftsmanship'}.\n\nWould you be open to a quick call to discuss a partnership?\n\nThanks,\n${businessName}`,
      };
    }
    
    return {
      success: true,
      contentId,
      contentType,
      content: generatedContent,
      status: 'ready_for_review',
      message: `${contentType} content generated for ${platform}`,
    };
  },
});

// Execution Agent Tool
export const executionAgentTool = tool({
  description: 'Schedule and execute marketing actions including social posts, emails, and outreach. Handles automation and reminder setup.',
  parameters: z.object({
    actionType: z.enum(['schedule_post', 'send_email', 'setup_reminder', 'outreach_sequence']).describe('Type of marketing action'),
    scheduledTime: z.string().describe('When to execute (e.g., "Tomorrow 10 AM", "Next Monday")'),
    content: z.string().describe('The content to post/send'),
    platform: z.string().optional().describe('Platform for social posts'),
    automationLevel: z.enum(['manual', 'review', 'fully_automated']).optional().describe('Level of automation'),
  }),
  execute: async ({ actionType, scheduledTime, content, platform, automationLevel }) => {
    const executionId = `EXEC-${Date.now()}`;
    
    const execution = {
      executionId,
      actionType,
      scheduledTime,
      platform: platform || 'N/A',
      automationLevel: automationLevel || 'review',
      status: automationLevel === 'fully_automated' ? 'scheduled' : 'pending_review',
      content: content.substring(0, 100) + '...',
    };
    
    return {
      success: true,
      execution,
      message: `${actionType} ${execution.status} for ${scheduledTime}`,
      nextSteps: automationLevel === 'fully_automated' 
        ? ['Action will be executed automatically']
        : ['Review and approve the scheduled action'],
    };
  },
});

// Analytics Agent Tool
export const analyticsAgentTool = tool({
  description: 'Track marketing performance and provide insights. Analyzes engagement, conversions, and revenue signals to optimize strategy.',
  parameters: z.object({
    businessName: z.string().describe('The business name'),
    timeframe: z.string().describe('Time period to analyze (e.g., "last week", "last month")'),
    metrics: z.array(z.string()).describe('Metrics to track (e.g., engagement, clicks, sales, events)'),
  }),
  execute: async ({ businessName, timeframe, metrics }) => {
    const analyticsId = `ANALYTICS-${Date.now()}`;
    
    // Generate mock analytics data
    const analytics = {
      analyticsId,
      businessName,
      timeframe,
      metrics: {
        engagement: {
          likes: Math.floor(Math.random() * 500) + 100,
          comments: Math.floor(Math.random() * 100) + 20,
          shares: Math.floor(Math.random() * 50) + 10,
          trend: '+15% vs previous period',
        },
        conversions: {
          emailSignups: Math.floor(Math.random() * 50) + 10,
          websiteClicks: Math.floor(Math.random() * 200) + 50,
          leads: Math.floor(Math.random() * 30) + 5,
          trend: '+22% vs previous period',
        },
        revenueSignals: {
          eventAttendance: Math.floor(Math.random() * 20) + 5,
          productsSold: Math.floor(Math.random() * 15) + 3,
          estimatedRevenue: `$${Math.floor(Math.random() * 2000) + 500}`,
          trend: '+18% vs previous period',
        },
      },
      insights: [
        'Email campaigns drove 3x more conversions than social posts',
        'Local events had the highest revenue conversion rate',
        'Best posting times: Weekday mornings (9-11 AM)',
        'Partnership outreach has 45% response rate',
      ],
      recommendations: [
        'Increase email frequency from 1x to 2x per week',
        'Focus more on local events - they convert better',
        'Reduce Instagram posts, redirect effort to community engagement',
      ],
    };
    
    return {
      success: true,
      analytics,
      message: `Analytics report generated for ${businessName} (${timeframe})`,
    };
  },
});

// Local Opportunity Discovery Tool
export const localOpportunityTool = tool({
  description: 'Discover local marketing opportunities including fairs, markets, events, and partnerships based on business location and type.',
  parameters: z.object({
    location: z.string().describe('Business location (city, state)'),
    businessType: z.string().describe('Type of business'),
    radius: z.string().optional().describe('Search radius (e.g., "10 miles", "city-wide")'),
  }),
  execute: async ({ location, businessType, radius }) => {
    const discoveryId = `LOCAL-${Date.now()}`;
    
    // Mock local opportunities
    const opportunities = [
      {
        type: 'Farmers Market',
        name: `${location} Weekend Farmers Market`,
        date: 'Every Saturday, 8 AM - 2 PM',
        location: `Downtown ${location}`,
        matchScore: '95%',
        reason: `Perfect for ${businessType} - high foot traffic, target demographic`,
        contact: 'market@example.com',
      },
      {
        type: 'Art Fair',
        name: 'Local Spring Art & Craft Fair',
        date: 'March 15-17, 2025',
        location: `${location} Community Center`,
        matchScore: '88%',
        reason: 'Ideal for showcasing handmade products',
        contact: 'artfair@example.com',
      },
      {
        type: 'Library Display',
        name: `${location} Public Library Local Artist Showcase`,
        date: 'Rolling monthly displays',
        location: `${location} Main Library`,
        matchScore: '82%',
        reason: 'Free exposure to community, low barrier to entry',
        contact: 'library@example.com',
      },
      {
        type: 'Retail Partnership',
        name: 'Local Boutique Collaboration',
        date: 'Ongoing',
        location: `${location} Shopping District`,
        matchScore: '90%',
        reason: `Complementary audience for ${businessType}`,
        contact: 'boutique@example.com',
      },
    ];
    
    return {
      success: true,
      discoveryId,
      location,
      radius: radius || '15 miles',
      opportunities,
      message: `Found ${opportunities.length} local opportunities in ${location}`,
      nextSteps: [
        'Review opportunities and select best matches',
        'Generate outreach messages for selected opportunities',
        'Track responses and schedule follow-ups',
      ],
    };
  },
});

// Team info tool
export const teamTool = tool({
  description:
    'This tool provides information about Co-Creator team members including Deepak Kamboj, Diya Kamboj, Neha Chaurasia, and Drew Lackman.',
  parameters: z.object({
    personName: z
      .string()
      .optional()
      .describe(
        'The name of the team member to get information about (Deepak Kamboj, Diya Kamboj, Neha Chaurasia, or Drew Lackman). If not provided, returns information about all team members.'
      ),
  }),
  execute: async ({ personName }) => {
    const teamProfiles = {
      'deepak kamboj': {
        name: 'Deepak Kamboj',
        role: 'Co-Founder & CEO',
        bio: "Co-Founder and CEO of Co-Creator. Passionate about democratizing AI-powered content creation and building tools that empower creators worldwide. Speaking at the AI Hackathon 2025 about the future of collaborative AI. Deepak has a vision to make AI accessible to every creator and believes in the power of human-AI collaboration.",
      },
      'diya kamboj': {
        name: 'Diya Kamboj',
        role: 'Head of Product & UX',
        bio: "Leads Product and UX at Co-Creator, designing intuitive interfaces that make AI collaboration accessible to everyone. With a background in design thinking and user research, she ensures Co-Creator delivers exceptional creator experiences. Diya believes great technology should be invisible and natural to use.",
      },
      'neha chaurasia': {
        name: 'Neha Chaurasia',
        role: 'Director of AI Strategy',
        bio: 'Director of AI Strategy at Co-Creator, specializing in multi-agent systems and content generation workflows. With expertise in NLP and generative AI, Neha develops intelligent agents that understand creator needs and deliver high-quality outputs. She is pioneering new approaches to AI collaboration and agent orchestration.',
      },
      'drew lackman': {
        name: 'Drew Lackman',
        role: 'Chief Technology Officer',
        bio: 'Chief Technology Officer at Co-Creator, architecting scalable AI infrastructure and MCP integrations. With deep expertise in distributed systems and AI model deployment, Drew ensures Co-Creator delivers fast, reliable, and innovative AI collaboration experiences. He is passionate about building robust, production-ready AI systems.',
      },
    };

    // If no specific person is requested, return all team members
    if (!personName) {
      return {
        information: Object.values(teamProfiles)
          .map((profile) => `${profile.name} - ${profile.role}: ${profile.bio}`)
          .join('\n\n'),
      };
    }

    // Search for the specific person (case-insensitive)
    const searchName = personName.toLowerCase().trim();
    const profile = teamProfiles[searchName as keyof typeof teamProfiles];

    if (profile) {
      return {
        information: `${profile.name} - ${profile.role}: ${profile.bio}`,
      };
    }

    // If person not found, suggest available team members
    return {
      information: `I don't have information about "${personName}". I can tell you about these Co-Creator team members: Deepak Kamboj (Co-Founder & CEO), Diya Kamboj (Head of Product & UX), Neha Chaurasia (Director of AI Strategy), and Drew Lackman (Chief Technology Officer).`,
    };
  },
});

// Hackathon info tool
export const hackathonInfoTool = tool({
  description:
    'Get information about the AI Hackathon event and Co-Creator project organized by Seattle Data, AI & Security',
  parameters: z.object({
    query: z.string().optional().describe('Optional query about the hackathon event or Co-Creator project'),
  }),
  execute: async () => {
    return {
      success: true,
      information: {
        eventName: 'AI Hackathon 2025',
        organizer: 'Seattle Data, AI & Security',
        date: 'December 13th, 2025',
        location: 'City University of Seattle',
        format: 'In-person',
        project: {
          name: 'Co-Creator',
          tagline: 'AI-Powered Creative Collaboration Platform',
          description: 'Co-Creator is an intelligent collaboration platform that connects creators with AI agents to produce high-quality content. Built with MCP (Model Context Protocol) for seamless tool integration and multi-agent workflows.',
          features: [
            'Multi-model AI chat with Claude, GPT-4, and more',
            'Intelligent content generation with context-aware AI',
            'MCP tool integration for extended capabilities',
            'Multi-agent collaboration workflows',
            'Real-time co-creation with AI assistants',
            'Persistent chat history and project management'
          ],
          techStack: [
            'Next.js 15 with React 19',
            'AI SDK with Vercel AI',
            'Model Context Protocol (MCP)',
            'SQLite with Drizzle ORM',
            'Tailwind CSS & shadcn/ui',
            'TypeScript'
          ]
        },
        fullDetails:
          'AI Hackathon 2025 | Dec 13th | City University of Seattle [In-person]. Organized by Seattle Data, AI & Security. Co-Creator is showcasing how AI agents can collaborate with humans to create better content faster. The platform demonstrates the power of MCP for tool integration and multi-agent orchestration, enabling creators to work alongside intelligent AI assistants that understand context and deliver high-quality outputs.',
      },
    };
  },
});

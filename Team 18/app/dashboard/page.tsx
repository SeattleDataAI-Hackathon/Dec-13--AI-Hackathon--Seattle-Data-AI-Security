'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  BarChart3,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const metrics = {
    revenue: { value: '$3,247', change: '+18%', positive: true },
    conversions: { value: '47', change: '+23%', positive: true },
    engagement: { value: '8.4%', change: '+2.1%', positive: true },
    roi: { value: '3.2x', change: '+0.4x', positive: true },
  };

  const agentActivity = [
    {
      agent: 'Strategy Agent',
      action: 'Created Q1 marketing plan',
      time: '2 hours ago',
      icon: Target,
      color: 'text-blue-500',
    },
    {
      agent: 'Content Agent',
      action: 'Generated 5 social posts',
      time: '4 hours ago',
      icon: Sparkles,
      color: 'text-purple-500',
    },
    {
      agent: 'Execution Agent',
      action: 'Scheduled 12 posts',
      time: '5 hours ago',
      icon: Calendar,
      color: 'text-green-500',
    },
    {
      agent: 'Local Opportunity',
      action: 'Found 3 new markets',
      time: '1 day ago',
      icon: MapPin,
      color: 'text-orange-500',
    },
  ];

  const upcomingActions = [
    { title: 'Instagram post goes live', time: 'Today, 3:00 PM', platform: 'Instagram' },
    { title: 'Email campaign sends', time: 'Tomorrow, 9:00 AM', platform: 'Email' },
    { title: 'Facebook ads review', time: 'Dec 15, 2:00 PM', platform: 'Facebook' },
    { title: 'Farmers market booth', time: 'Dec 16, 8:00 AM', platform: 'Local Event' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Marketing Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your revenue-driving marketing performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.revenue.value}</div>
            <p className="text-xs text-green-600 mt-1">
              {metrics.revenue.change} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversions.value}</div>
            <p className="text-xs text-green-600 mt-1">
              {metrics.conversions.change} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.engagement.value}</div>
            <p className="text-xs text-green-600 mt-1">
              {metrics.engagement.change} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketing ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.roi.value}</div>
            <p className="text-xs text-green-600 mt-1">
              {metrics.roi.change} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Agent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Agent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`p-2 rounded-md bg-secondary ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.agent}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline" asChild>
              <Link href="/chat">
                <Sparkles className="h-4 w-4 mr-2" />
                Chat with Agents
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingActions.map((action, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {action.time} • {action.platform}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline" asChild>
              <Link href="/dashboard/content">
                View All Scheduled Content <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:bg-secondary/50 transition-colors">
          <Link href="/dashboard/analytics">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                View Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Deep dive into your marketing performance
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:bg-secondary/50 transition-colors">
          <Link href="/dashboard/opportunities">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Local Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Discover nearby markets and events
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:bg-secondary/50 transition-colors">
          <Link href="/chat">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                New Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create a new marketing campaign
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  MousePointerClick,
  Eye,
  Mail,
  Instagram,
  Facebook,
  ArrowRight,
} from 'lucide-react';

export default function AnalyticsPage() {
  const channelPerformance = [
    {
      name: 'Instagram',
      icon: Instagram,
      reach: '12.4K',
      engagement: '8.2%',
      conversions: 23,
      revenue: '$1,840',
      trend: 'up',
      change: '+15%',
    },
    {
      name: 'Email',
      icon: Mail,
      reach: '3.2K',
      engagement: '24.1%',
      conversions: 18,
      revenue: '$1,260',
      trend: 'up',
      change: '+22%',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      reach: '8.7K',
      engagement: '4.3%',
      conversions: 6,
      revenue: '$147',
      trend: 'down',
      change: '-8%',
    },
  ];

  const topContent = [
    {
      title: 'Holiday Gift Guide Post',
      platform: 'Instagram',
      reach: '4.2K',
      engagement: '12.4%',
      conversions: 8,
    },
    {
      title: 'New Product Launch Email',
      platform: 'Email',
      reach: '2.8K',
      engagement: '31.2%',
      conversions: 12,
    },
    {
      title: 'Behind the Scenes Video',
      platform: 'Instagram',
      reach: '3.1K',
      engagement: '9.8%',
      conversions: 5,
    },
  ];

  const insights = [
    {
      title: 'Email Drives Highest ROI',
      description:
        'Your email campaigns convert 4x better than social media. Consider increasing email frequency to 2-3x per week.',
      action: 'Optimize Email Strategy',
    },
    {
      title: 'Peak Engagement: Tuesday 11 AM',
      description:
        'Posts published on Tuesday mornings get 3x more engagement. Schedule your top content for this time slot.',
      action: 'Update Schedule',
    },
    {
      title: 'Product Posts Outperform Lifestyle',
      description:
        'Direct product showcases drive 2x more conversions than lifestyle content. Balance your content mix accordingly.',
      action: 'Adjust Content Strategy',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Marketing Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Revenue-focused insights into what&apos;s working
        </p>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,247</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +23% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3K</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Conversion Rate</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +0.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Channel Performance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Channel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channelPerformance.map((channel, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="p-2 rounded-md bg-secondary">
                  <channel.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium">{channel.name}</p>
                    <p className="text-xs text-muted-foreground">Reach: {channel.reach}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{channel.engagement}</p>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{channel.conversions}</p>
                    <p className="text-xs text-muted-foreground">Conversions</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{channel.revenue}</p>
                    <p
                      className={`text-xs flex items-center gap-1 ${
                        channel.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {channel.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {channel.change}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Content */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContent.map((content, i) => (
                <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                  <p className="text-sm font-medium mb-2">{content.title}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">{content.reach}</span> reach
                    </div>
                    <div>
                      <span className="font-medium">{content.engagement}</span> engagement
                    </div>
                    <div>
                      <span className="font-medium">{content.conversions}</span> conversions
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>AI Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, i) => (
                <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                  <p className="text-sm font-medium mb-1">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                  <Button variant="outline" size="sm" className="text-xs">
                    {insight.action} <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

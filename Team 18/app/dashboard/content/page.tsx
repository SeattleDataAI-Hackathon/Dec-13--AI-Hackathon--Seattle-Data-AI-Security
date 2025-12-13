'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Instagram,
  Mail,
  Facebook,
  Plus,
  Edit,
  Trash2,
  Check,
} from 'lucide-react';
import Link from 'next/link';

export default function ContentPage() {
  const scheduledContent = [
    {
      id: 1,
      title: 'Holiday Gift Guide - Instagram Carousel',
      platform: 'Instagram',
      icon: Instagram,
      scheduledDate: 'Dec 14, 2025',
      scheduledTime: '11:00 AM',
      status: 'scheduled',
      preview: 'Check out our top 10 holiday gift ideas for jewelry lovers...',
    },
    {
      id: 2,
      title: 'New Collection Announcement',
      platform: 'Email',
      icon: Mail,
      scheduledDate: 'Dec 15, 2025',
      scheduledTime: '9:00 AM',
      status: 'scheduled',
      preview: 'Introducing our Winter Collection - 20% off launch special...',
    },
    {
      id: 3,
      title: 'Customer Testimonial Post',
      platform: 'Facebook',
      icon: Facebook,
      scheduledDate: 'Dec 14, 2025',
      scheduledTime: '3:00 PM',
      status: 'scheduled',
      preview: 'See what our happy customers are saying about their purchases...',
    },
    {
      id: 4,
      title: 'Behind the Scenes - Workshop',
      platform: 'Instagram',
      icon: Instagram,
      scheduledDate: 'Dec 16, 2025',
      scheduledTime: '10:00 AM',
      status: 'draft',
      preview: 'Take a peek at our creative process and how we make each piece...',
    },
  ];

  const contentCalendar = [
    { day: 'Monday', posts: 2, platforms: ['Instagram', 'Email'] },
    { day: 'Tuesday', posts: 1, platforms: ['Facebook'] },
    { day: 'Wednesday', posts: 3, platforms: ['Instagram', 'Email', 'Instagram'] },
    { day: 'Thursday', posts: 1, platforms: ['Email'] },
    { day: 'Friday', posts: 2, platforms: ['Instagram', 'Facebook'] },
    { day: 'Saturday', posts: 1, platforms: ['Instagram'] },
    { day: 'Sunday', posts: 0, platforms: [] },
  ];

  const contentIdeas = [
    {
      title: 'Product Photography Tips',
      reason: 'Educational content performs well with your audience',
      platforms: ['Instagram', 'Facebook'],
    },
    {
      title: 'Limited Time Flash Sale',
      reason: 'Your audience responds to urgency and exclusive offers',
      platforms: ['Email', 'Instagram'],
    },
    {
      title: 'Customer Story Feature',
      reason: 'Social proof drives 3x more conversions',
      platforms: ['Instagram', 'Email'],
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-muted-foreground mt-2">
            Manage and schedule your marketing content
          </p>
        </div>
        <Button asChild>
          <Link href="/chat">
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Link>
        </Button>
      </div>

      {/* Weekly Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>This Week&apos;s Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {contentCalendar.map((day, i) => (
              <div
                key={i}
                className={`p-3 border rounded-lg text-center ${
                  day.posts === 0 ? 'bg-secondary/20' : 'bg-secondary'
                }`}
              >
                <p className="text-xs font-medium mb-2">{day.day}</p>
                <p className="text-2xl font-bold mb-1">{day.posts}</p>
                <p className="text-xs text-muted-foreground">
                  {day.posts === 0 ? 'No posts' : day.posts === 1 ? 'post' : 'posts'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Scheduled Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled & Draft Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledContent.map((content) => (
                  <div
                    key={content.id}
                    className="p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-secondary">
                          <content.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{content.title}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {content.scheduledDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {content.scheduledTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={content.status === 'scheduled' ? 'default' : 'secondary'}>
                        {content.status === 'scheduled' ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : null}
                        {content.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{content.preview}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Ideas */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>AI Content Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentIdeas.map((idea, i) => (
                  <div key={i} className="pb-4 border-b last:border-0 last:pb-0">
                    <p className="text-sm font-medium mb-1">{idea.title}</p>
                    <p className="text-xs text-muted-foreground mb-2">{idea.reason}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {idea.platforms.map((platform, j) => (
                        <Badge key={j} variant="secondary" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <Link href="/chat">Create This Content</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

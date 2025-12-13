'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Navigation,
  Sparkles,
  Clock,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function OpportunitiesPage() {
  const localEvents = [
    {
      id: 1,
      name: 'Seattle Winter Artisan Market',
      type: 'Craft Fair',
      location: 'Pike Place Market, Seattle WA',
      date: 'Dec 20-22, 2025',
      expectedAttendance: '5,000+',
      boothFee: '$250',
      estimatedRevenue: '$800-1,200',
      matchScore: 95,
      distance: '2.3 miles',
    },
    {
      id: 2,
      name: 'Fremont Makers Market',
      type: 'Makers Market',
      location: 'Fremont Ave, Seattle WA',
      date: 'Every Sunday',
      expectedAttendance: '2,000+',
      boothFee: '$75',
      estimatedRevenue: '$300-500',
      matchScore: 88,
      distance: '4.1 miles',
    },
    {
      id: 3,
      name: 'Holiday Night Market',
      type: 'Night Market',
      location: 'Capitol Hill, Seattle WA',
      date: 'Dec 15, 18, 2025',
      expectedAttendance: '3,500+',
      boothFee: '$150',
      estimatedRevenue: '$500-800',
      matchScore: 82,
      distance: '3.7 miles',
    },
  ];

  const partnerships = [
    {
      id: 1,
      name: 'Bella Vista Boutique',
      type: 'Retail Partnership',
      description: 'Upscale boutique looking for local artisan jewelry to carry',
      commission: '40% consignment',
      potentialRevenue: '$500-1,000/month',
      matchScore: 92,
    },
    {
      id: 2,
      name: 'Green Living Co-op',
      type: 'Cross-Promotion',
      description: 'Sustainable goods store wants to feature local makers',
      commission: 'Revenue share',
      potentialRevenue: '$300-600/month',
      matchScore: 85,
    },
    {
      id: 3,
      name: 'Seattle Wedding Expo',
      type: 'Event Vendor',
      description: 'Annual wedding expo seeking jewelry vendors',
      commission: '$400 booth fee',
      potentialRevenue: '$1,500-2,500',
      matchScore: 78,
    },
  ];

  const insights = [
    {
      title: 'Peak Season Opportunity',
      description:
        'Holiday markets in December typically generate 3x normal revenue. Book early for best booth locations.',
      action: 'View Holiday Markets',
    },
    {
      title: 'Untapped Market: Capitol Hill',
      description:
        'Your target demographic over-indexes in Capitol Hill, but you haven&apos;t marketed there yet. Consider local partnerships.',
      action: 'Explore Partnerships',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Local Opportunities</h1>
          <p className="text-muted-foreground mt-2">
            Discover markets, events, and partnerships near you
          </p>
        </div>
        <Button asChild>
          <Link href="/chat">
            <Sparkles className="h-4 w-4 mr-2" />
            Find More Opportunities
          </Link>
        </Button>
      </div>

      {/* AI Insights */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {insights.map((insight, i) => (
          <Card key={i} className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
              <Button size="sm" variant="outline">
                {insight.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Local Events */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upcoming Local Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {localEvents.map((event) => (
              <div key={event.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold">{event.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {event.matchScore}% Match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.type}</p>
                  </div>
                  <Badge>{event.boothFee}</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-xs">Location</p>
                      <p className="text-xs text-muted-foreground">{event.distance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-xs">Date</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-xs">Attendance</p>
                      <p className="text-xs text-muted-foreground">{event.expectedAttendance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-xs">Est. Revenue</p>
                      <p className="text-xs text-muted-foreground">{event.estimatedRevenue}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-3">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  {event.location}
                </p>

                <div className="flex gap-2">
                  <Button size="sm">Apply Now</Button>
                  <Button size="sm" variant="outline">
                    <Navigation className="h-3 w-3 mr-1" />
                    Get Directions
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/chat">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Plan Marketing
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Partnership Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Partnership Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {partnerships.map((partner) => (
              <div key={partner.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold">{partner.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {partner.matchScore}% Match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{partner.type}</p>
                  </div>
                </div>

                <p className="text-sm mb-3">{partner.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Terms</p>
                    <p className="text-sm">{partner.commission}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Potential Revenue</p>
                    <p className="text-sm">{partner.potentialRevenue}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">Contact</Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/chat">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Generate Pitch
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

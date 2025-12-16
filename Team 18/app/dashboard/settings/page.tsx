'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Store,
  Target,
  MapPin,
  DollarSign,
  Users,
  Bell,
  Shield,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your business profile and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="Your business name" />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" placeholder="e.g., Handmade Jewelry" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your business, products, and brand voice..."
                rows={3}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" placeholder="https://yourbusiness.com" />
              </div>
              <div>
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" type="email" placeholder="contact@yourbusiness.com" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Audience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Target Audience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="ageRange">Age Range</Label>
                <Input id="ageRange" placeholder="e.g., 25-45" />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" placeholder="e.g., All, Women, Men" />
              </div>
            </div>
            <div>
              <Label htmlFor="interests">Interests & Demographics</Label>
              <Textarea
                id="interests"
                placeholder="Describe your ideal customer: interests, values, lifestyle..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Marketing Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Marketing Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="primaryGoal">Primary Goal</Label>
                <Input
                  id="primaryGoal"
                  placeholder="e.g., Increase sales, Build awareness"
                />
              </div>
              <div>
                <Label htmlFor="monthlyBudget">Monthly Marketing Budget</Label>
                <Input id="monthlyBudget" type="text" placeholder="$0 - $500" />
              </div>
            </div>
            <div>
              <Label htmlFor="platforms">Active Marketing Platforms</Label>
              <Input
                id="platforms"
                placeholder="e.g., Instagram, Email, Facebook, Local Markets"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Service Area
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Seattle" />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="WA" />
              </div>
            </div>
            <div>
              <Label htmlFor="serviceRadius">Service/Delivery Radius</Label>
              <Input id="serviceRadius" placeholder="e.g., 15 miles, Local only, Nationwide" />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="priceRange">Price Range</Label>
                <Input id="priceRange" placeholder="e.g., $50-$200" />
              </div>
              <div>
                <Label htmlFor="avgOrderValue">Average Order Value</Label>
                <Input id="avgOrderValue" placeholder="e.g., $85" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">AI Insights & Recommendations</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when AI finds new opportunities
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Content Schedule Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Reminders before scheduled posts go live
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Performance Reports</p>
                <p className="text-sm text-muted-foreground">Weekly summary of your marketing performance</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Data Sharing</p>
                <p className="text-sm text-muted-foreground">
                  Allow AI agents to learn from your marketing data
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

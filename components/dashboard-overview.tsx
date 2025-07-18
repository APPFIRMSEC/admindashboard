"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Mic, 
  Image, 
  Users, 
  TrendingUp, 
  Plus,
  Edit,
  Eye,
  Mail,
  Star
} from "lucide-react";
import Link from "next/link";
import { useSiteContext } from "@/contexts/site-context";

export function DashboardOverview() {
  const { currentSite } = useSiteContext();

  // Mock data - in a real app, this would come from your API
  const appFirmSecStats = [
    { title: "Total Blog Posts", value: "24", icon: FileText, change: "+12%", changeType: "positive" },
    { title: "Podcast Episodes", value: "18", icon: Mic, change: "+8%", changeType: "positive" },
    { title: "Media Files", value: "156", icon: Image, change: "+23%", changeType: "positive" },
    { title: "Active Users", value: "1,234", icon: Users, change: "+5%", changeType: "positive" },
    { title: "Website Traffic", value: "12,444", icon: Eye, change: "+55%", changeType: "positive"},
    { title: "Newsletter Subscribers", value: "1,234", icon: Mail, change: "-3%", changeType: "negative"},
    { title: "Blog Readers", value: "3,333", icon: Users, change: "+3", changeType: "positive"},
    { title: "Featured Posts", value: "6,999", icon: Star, change: "+9", changeType: "positive"},
  ];

  const ennieBoatEngStats = [
    { title: "Total Blog Posts", value: "15", icon: FileText, change: "+8%", changeType: "positive" },
    { title: "Media Files", value: "89", icon: Image, change: "+15%", changeType: "positive" },
    { title: "Website Traffic", value: "8,234", icon: Eye, change: "+32%", changeType: "positive"},
    { title: "Newsletter Subscribers", value: "567", icon: Mail, change: "+2%", changeType: "positive"},
    { title: "Blog Readers", value: "2,111", icon: Users, change: "+7", changeType: "positive"},
    { title: "Featured Posts", value: "3,456", icon: Star, change: "+5", changeType: "positive"},
  ];

  const stats = currentSite === "appfirmsec" ? appFirmSecStats : ennieBoatEngStats;

  const appFirmSecActivity = [
    {
      id: 1,
      type: "blog",
      title: "Getting Started with Next.js 15",
      status: "published",
      date: "2 hours ago",
      author: "John Doe"
    },
    {
      id: 2,
      type: "podcast",
      title: "Episode 23: Web Development Trends",
      status: "published",
      date: "1 day ago",
      author: "Jane Smith"
    },
    {
      id: 3,
      type: "blog",
      title: "Advanced TypeScript Patterns",
      status: "draft",
      date: "3 days ago",
      author: "Mike Johnson"
    },
    {
      id: 4,
      type: "media",
      title: "hero-image.jpg uploaded",
      status: "uploaded",
      date: "1 week ago",
      author: "Admin"
    }
  ];

  const ennieBoatEngActivity = [
    {
      id: 1,
      type: "blog",
      title: "Engineering Best Practices",
      status: "published",
      date: "2 hours ago",
      author: "John Doe"
    },
    {
      id: 2,
      type: "blog",
      title: "Modern Boat Design Principles",
      status: "published",
      date: "1 day ago",
      author: "Jane Smith"
    },
    {
      id: 3,
      type: "blog",
      title: "Marine Engineering Fundamentals",
      status: "draft",
      date: "3 days ago",
      author: "Mike Johnson"
    },
    {
      id: 4,
      type: "media",
      title: "boat-design.jpg uploaded",
      status: "uploaded",
      date: "1 week ago",
      author: "Admin"
    }
  ];

  const recentActivity = currentSite === "appfirmsec" ? appFirmSecActivity : ennieBoatEngActivity;

  const appFirmSecQuickActions = [
    { title: "New Blog Post", icon: Plus, href: "/blogs/new", color: "bg-blue-500" },
    { title: "Upload Podcast", icon: Mic, href: "/podcasts/new", color: "bg-green-500" },
    { title: "Add Media", icon: Image, href: "/media/upload", color: "bg-purple-500" },
    { title: "Site Settings", icon: Edit, href: "/settings", color: "bg-orange-500" },
  ];

  const ennieBoatEngQuickActions = [
    { title: "New Blog Post", icon: Plus, href: "/blogs/new", color: "bg-blue-500" },
    { title: "Add Media", icon: Image, href: "/media/upload", color: "bg-purple-500" },
    { title: "Site Settings", icon: Edit, href: "/settings", color: "bg-orange-500" },
  ];

  const quickActions = currentSite === "appfirmsec" ? appFirmSecQuickActions : ennieBoatEngQuickActions;

  const getStatusBadge = (status: string) => {
    const variants = {
      published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      uploaded: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      blog: FileText,
      podcast: Mic,
      media: Image
    };
    const Icon = icons[type as keyof typeof icons];
    return <Icon className="h-4 w-4" />;
  };

  const siteName = currentSite === "appfirmsec" ? "AppFirmSec" : "EnnieBoatEng";
  const siteDescription = currentSite === "appfirmsec" 
    ? "Here's what's happening with your content today." 
    : "Here's what's happening with your engineering blog today.";

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Admin!</h1>
        <p className="text-muted-foreground">
          Managing: <span className="font-semibold text-primary">{siteName}</span>
        </p>
        <p className="text-muted-foreground">
          {siteDescription}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.title}
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={action.href}>
                    <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    {action.title}
                  </Link>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      {getTypeIcon(activity.type)}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        by {activity.author} • {activity.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(activity.status)}
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
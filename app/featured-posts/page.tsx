"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FeaturedPostsEditor } from "@/components/featured-posts-editor";

// Mock data - replace with API data in a real app
const blogs = [
  {
    id: 1,
    title: "Getting Started with Next.js 15",
    featured: true,
    author: "John Doe",
    status: "published",
    date: "2 hours ago",
    excerpt: "Learn how to build modern web applications with Next.js 15..."
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    featured: false,
    author: "Mike Johnson",
    status: "draft",
    date: "3 days ago",
    excerpt: "Explore advanced TypeScript patterns for better code organization..."
  }
];

const featuredBlogs = blogs.filter(b => b.featured);

export default function FeaturedPostsPage() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <FeaturedPostsEditor />
              <h1 className="text-3xl font-bold tracking-tight text-yellow-600 flex items-center gap-2">
                <span>★</span> Featured Posts
              </h1>
              <p className="text-muted-foreground mb-4">
                These are the posts currently marked as featured.
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredBlogs.length === 0 && (
                  <div className="col-span-full text-center text-muted-foreground">
                    No featured posts yet.
                  </div>
                )}
                {featuredBlogs.map(post => (
                  <Card key={post.id} className="border-2 border-yellow-400 shadow-lg">
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>by {post.author} • {post.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2 text-muted-foreground">{post.excerpt}</p>
                      <Badge variant="secondary">{post.status}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 
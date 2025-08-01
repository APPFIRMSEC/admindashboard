"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Check, X } from "lucide-react";
import { toast } from "sonner";

type BlogPost = {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  status: string;
  featured: boolean;
  author: {
    name: string;
  };
  createdAt: string;
};

export function FeaturedPostsEditor() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load all blog posts and featured posts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load all blog posts
        const postsResponse = await fetch("/api/blogs");
        const postsData = await postsResponse.json();

        // Load featured posts
        const featuredResponse = await fetch("/api/blogs/featured");
        const featuredData = await featuredResponse.json();

        setBlogPosts(postsData.blogs || []);
        setFeaturedPosts(featuredData.featuredPosts || []);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load blog posts");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleFeatured = async (postId: string, featured: boolean) => {
    try {
      setIsSaving(true);

      const response = await fetch(`/api/blogs/${postId}/feature`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured }),
      });

      if (!response.ok) {
        throw new Error("Failed to update featured status");
      }

      const data = await response.json();

      // Update local state
      setBlogPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, featured } : post))
      );

      // Update featured posts list
      if (featured) {
        const post = blogPosts.find((p) => p.id === postId);
        if (post) {
          setFeaturedPosts((prev) => [...prev, { ...post, featured: true }]);
        }
      } else {
        setFeaturedPosts((prev) => prev.filter((p) => p.id !== postId));
      }

      toast.success(data.message);
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 px-4 lg:px-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Featured Posts Manager
          </h1>
          <p className="text-muted-foreground">
            Select which blog posts to feature on your website
          </p>
        </div>
      </div>

      {/* Featured Posts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Currently Featured Posts</CardTitle>
          <CardDescription>
            These posts will appear in the featured section on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {featuredPosts.length === 0 ? (
            <p className="text-muted-foreground">
              No featured posts yet. Select posts from below to feature them.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="border-2 border-yellow-400">
                  <CardHeader>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <CardDescription>
                      by {post.author?.name || "Unknown"} •{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2 text-muted-foreground">
                      {post.excerpt || post.content.substring(0, 100)}...
                    </p>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="secondary">{post.status}</Badge>
                      <Badge variant="outline">Featured</Badge>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => toggleFeatured(post.id, false)}
                      disabled={isSaving}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove from Featured
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Blog Posts Section */}
      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>
            Click the checkboxes to feature or unfeature posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className={post.featured ? "border-2 border-yellow-400" : ""}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription>
                    by {post.author?.name || "Unknown"} •{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-muted-foreground">
                    {post.excerpt || post.content.substring(0, 100)}...
                  </p>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">{post.status}</Badge>
                    {post.featured && <Badge variant="outline">Featured</Badge>}
                  </div>
                  <Button
                    variant={post.featured ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleFeatured(post.id, !post.featured)}
                    disabled={isSaving}
                    className="w-full"
                  >
                    {post.featured ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Remove from Featured
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Mark as Featured
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

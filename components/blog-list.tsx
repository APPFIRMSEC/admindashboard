"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  FileText
} from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { BlogEditor } from "@/components/blog-editor";
import type { BlogFormData } from "@/components/blog-editor";

export function BlogList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogFormData | null>(null);

  // Mock data - in a real app, this would come from your API
  const blogs = [
    {
      id: 1,
      title: "Getting Started with Next.js 15",
      excerpt: "Learn how to build modern web applications with Next.js 15 and its new features.",
      status: "published",
      author: "John Doe",
      publishedAt: "2024-01-15",
      views: 1234,
      slug: "getting-started-nextjs-15",
      content: "Full blog content here...",
      tags: ["nextjs", "react", "web development"],
      seoTitle: "Getting Started with Next.js 15 - Complete Guide",
      seoDescription: "Learn how to build modern web applications with Next.js 15 and its new features.",
      seoKeywords: "nextjs, react, web development, tutorial"
    },
    {
      id: 2,
      title: "Advanced TypeScript Patterns",
      excerpt: "Explore advanced TypeScript patterns and best practices for better code quality.",
      status: "published",
      author: "Jane Smith",
      publishedAt: "2024-01-10",
      views: 987,
      slug: "advanced-typescript-patterns",
      content: "Full blog content here...",
      tags: ["typescript", "patterns", "best practices"],
      seoTitle: "Advanced TypeScript Patterns - Best Practices",
      seoDescription: "Explore advanced TypeScript patterns and best practices for better code quality.",
      seoKeywords: "typescript, patterns, best practices, programming"
    },
    {
      id: 3,
      title: "Building Scalable APIs with Node.js",
      excerpt: "A comprehensive guide to building scalable REST APIs using Node.js and Express.",
      status: "draft",
      author: "Mike Johnson",
      publishedAt: null,
      views: 0,
      slug: "building-scalable-apis-nodejs",
      content: "Full blog content here...",
      tags: ["nodejs", "api", "express", "scalable"],
      seoTitle: "Building Scalable APIs with Node.js - Complete Guide",
      seoDescription: "A comprehensive guide to building scalable REST APIs using Node.js and Express.",
      seoKeywords: "nodejs, api, express, scalable, rest"
    },
    {
      id: 4,
      title: "Modern CSS Techniques",
      excerpt: "Discover modern CSS techniques and frameworks for better web design.",
      status: "scheduled",
      author: "Sarah Wilson",
      publishedAt: "2024-01-20",
      views: 0,
      slug: "modern-css-techniques",
      content: "Full blog content here...",
      tags: ["css", "web design", "frontend"],
      seoTitle: "Modern CSS Techniques - Web Design Guide",
      seoDescription: "Discover modern CSS techniques and frameworks for better web design.",
      seoKeywords: "css, web design, frontend, modern"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog content and publications
          </p>
        </div>
        <Button asChild>
          <Link href="/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Posts ({filteredBlogs.length})</CardTitle>
          <CardDescription>
            A list of all your blog posts with their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Published</TableHead>
                  <TableHead className="hidden lg:table-cell">Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{blog.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground md:hidden">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {blog.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "Not published"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {blog.author}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(blog.status)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {blog.publishedAt ? (
                          <span className="text-sm">
                            {new Date(blog.publishedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not published</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm font-medium">{blog.views.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/blogs/${blog.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => { 
                            setEditingBlog(blog); 
                            setShowEditModal(true); 
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Blog Edit Modal */}
      <Sheet open={showEditModal} onOpenChange={setShowEditModal}>
        <SheetContent 
          side="top" 
          className="w-full h-full max-h-[90vh] overflow-y-auto p-0"
        >
          <div className="w-full h-full overflow-y-auto px-4 py-4 sm:px-6">
            <SheetHeader className="mb-6">
              <SheetTitle>Edit Blog Post</SheetTitle>
            </SheetHeader>
            {editingBlog && (
              <BlogEditor 
                initialData={editingBlog} 
                onSave={() => setShowEditModal(false)} 
              />
            )}
            <SheetFooter className="flex gap-2 justify-end mt-6">
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 
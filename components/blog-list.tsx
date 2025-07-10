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

export function BlogList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock data - in a real app, this would come from your API
  const blogs = [
    {
      id: 1,
      title: "Getting Started with Next.js 15",
      slug: "getting-started-nextjs-15",
      status: "published",
      author: "John Doe",
      publishedAt: "2024-01-15",
      updatedAt: "2024-01-15",
      readTime: "5 min read",
      views: 1234,
      excerpt: "Learn how to build modern web applications with Next.js 15..."
    },
    {
      id: 2,
      title: "Advanced TypeScript Patterns",
      slug: "advanced-typescript-patterns",
      status: "draft",
      author: "Jane Smith",
      publishedAt: null,
      updatedAt: "2024-01-14",
      readTime: "8 min read",
      views: 0,
      excerpt: "Explore advanced TypeScript patterns for better code organization..."
    },
    {
      id: 3,
      title: "Building Scalable APIs with Node.js",
      slug: "building-scalable-apis-nodejs",
      status: "published",
      author: "Mike Johnson",
      publishedAt: "2024-01-10",
      updatedAt: "2024-01-12",
      readTime: "12 min read",
      views: 856,
      excerpt: "A comprehensive guide to building scalable REST APIs..."
    },
    {
      id: 4,
      title: "CSS Grid vs Flexbox: When to Use What",
      slug: "css-grid-vs-flexbox",
      status: "scheduled",
      author: "Sarah Wilson",
      publishedAt: "2024-01-20",
      updatedAt: "2024-01-13",
      readTime: "6 min read",
      views: 0,
      excerpt: "Understanding the differences between CSS Grid and Flexbox..."
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Views</TableHead>
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
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        {blog.readTime}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {blog.author}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(blog.status)}
                  </TableCell>
                  <TableCell>
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
                  <TableCell>
                    <span className="text-sm font-medium">{blog.views.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blogs/${blog.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setEditingBlog(blog); setShowEditModal(true); }}>
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
        </CardContent>
      </Card>
      {/* Blog Edit Modal */}
      <Sheet open={showEditModal} onOpenChange={setShowEditModal}>
        <SheetContent side="top" className="max-w-full w-full h-[520px] aspect-[16/5] mx-auto rounded-xl p-0 flex items-center justify-center bg-white shadow-2xl border mt-16">
          <div className="w-full h-full overflow-y-auto px-8 py-4">
            <SheetHeader>
              <SheetTitle>Edit Blog Post</SheetTitle>
            </SheetHeader>
            {editingBlog && (
              <BlogEditor initialData={editingBlog} onSave={() => setShowEditModal(false)} />
            )}
            <SheetFooter className="flex gap-2 justify-end">
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
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import Image from "next/image";

type FeaturedPostCategory = "Homepage" | "Sidebar" | "Footer";

type FeaturedPost = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  status: string;
  date: string;
  featured: boolean;
  category: FeaturedPostCategory;
  imageUrl?: string;
};

type FeaturedPostForm = {
  id: number | null;
  title: string;
  excerpt: string;
  author: string;
  status: string;
  date: string;
  featured: boolean;
  category: FeaturedPostCategory;
  imageUrl?: string;
};

const initialPosts: FeaturedPost[] = [
  {
    id: 1,
    title: "Getting Started with Next.js 15",
    excerpt: "Learn how to build modern web applications with Next.js 15...",
    author: "John Doe",
    status: "published",
    date: "2 hours ago",
    featured: true,
    category: "Homepage",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=200&q=80",
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    excerpt: "Explore advanced TypeScript patterns for better code organization...",
    author: "Mike Johnson",
    status: "draft",
    date: "3 days ago",
    featured: true,
    category: "Sidebar",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=facearea&w=400&h=200&q=80",
  },
  {
    id: 3,
    title: "Node.js API Design",
    excerpt: "Best practices for scalable APIs...",
    author: "Sarah Wilson",
    status: "published",
    date: "1 day ago",
    featured: true,
    category: "Footer",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=facearea&w=400&h=200&q=80",
  },
];

// --- BLOG POST TYPES & STATE ---
type BlogPost = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
};

type BlogPostForm = {
  id: number | null;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
};

const initialBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Welcome to the Blog!",
    content: "This is the first blog post. Edit or add more posts as you like!",
    author: "Admin",
    date: "2024-01-01",
    imageUrl: undefined,
  },
];

export function FeaturedPostsEditor() {
  const [posts, setPosts] = useState<FeaturedPost[]>(initialPosts);
  const [formData, setFormData] = useState<FeaturedPostForm>({
    id: null,
    title: "",
    excerpt: "",
    author: "",
    status: "draft",
    date: "",
    featured: true,
    category: "Homepage",
    imageUrl: undefined,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // --- BLOG POST STATE ---
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [blogFormData, setBlogFormData] = useState<BlogPostForm>({
    id: null,
    title: "",
    content: "",
    author: "",
    date: "",
    imageUrl: undefined,
  });
  const [isBlogEditing, setIsBlogEditing] = useState(false);
  const [isBlogLoading, setIsBlogLoading] = useState(false);

  const handleInputChange = (field: keyof FeaturedPostForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (post: FeaturedPost) => {
    setFormData(post);
    setIsEditing(true);
    setShowEditModal(true);
  };

  const handleDelete = (id: number) => {
    setPosts(posts.filter(p => p.id !== id));
    if (formData.id === id) setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload: use a local URL for preview
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (isEditing && formData.id !== null) {
        setPosts(posts.map(p => (p.id === formData.id ? { ...(formData as FeaturedPost), id: formData.id as number } : p)));
        setShowEditModal(false);
      } else {
        setPosts([
          ...posts,
          { ...(formData as Omit<FeaturedPost, "id">), id: Date.now() },
        ]);
      }
      setFormData({
        id: null,
        title: "",
        excerpt: "",
        author: "",
        status: "draft",
        date: "",
        featured: true,
        category: "Homepage",
        imageUrl: undefined,
      });
      setIsEditing(false);
      setIsLoading(false);
    }, 500);
  };

  // --- BLOG POST HANDLERS ---
  const handleBlogInputChange = (field: keyof BlogPostForm, value: string) => {
    setBlogFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlogImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBlogFormData(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const handleBlogEdit = (post: BlogPost) => {
    setBlogFormData(post);
    setIsBlogEditing(true);
  };

  const handleBlogDelete = (id: number) => {
    setBlogPosts(blogPosts.filter(p => p.id !== id));
    if (blogFormData.id === id) setIsBlogEditing(false);
  };

  const handleBlogSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsBlogLoading(true);
    setTimeout(() => {
      if (isBlogEditing && blogFormData.id !== null) {
        setBlogPosts(blogPosts.map(p => (p.id === blogFormData.id ? { ...(blogFormData as BlogPost), id: blogFormData.id as number } : p)));
      } else {
        setBlogPosts([
          ...blogPosts,
          { ...(blogFormData as Omit<BlogPost, "id">), id: Date.now() },
        ]);
      }
      setBlogFormData({
        id: null,
        title: "",
        content: "",
        author: "",
        date: "",
        imageUrl: undefined,
      });
      setIsBlogEditing(false);
      setIsBlogLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Featured Posts Editor</h1>
          <p className="text-muted-foreground">Add, edit, or remove featured posts</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
              <CardDescription>Information about the featured post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter post title"
                  value={formData.title}
                  onChange={e => handleInputChange("title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="A brief description of the post"
                  value={formData.excerpt}
                  onChange={e => handleInputChange("excerpt", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Featured Image</Label>
                <Input
                  id="imageUrl"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.imageUrl && (
                  <Image src={formData.imageUrl} alt="Preview" width={256} height={128} className="mt-2 rounded w-full max-w-xs h-32 object-cover border" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meta</CardTitle>
              <CardDescription>Author, status, category, and featured toggle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={e => handleInputChange("author", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={value => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={value => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Homepage">Homepage</SelectItem>
                    <SelectItem value="Sidebar">Sidebar</SelectItem>
                    <SelectItem value="Footer">Footer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="text"
                  placeholder="e.g. 2024-01-15"
                  value={formData.date}
                  onChange={e => handleInputChange("date", e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={e => handleInputChange("featured", e.target.checked)}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </CardContent>
          </Card>
          <Button type="submit" disabled={isLoading} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? (isLoading ? "Saving..." : "Save Changes") : (isLoading ? "Adding..." : "Add Featured Post")}
          </Button>
        </div>
      </form>
      {/* Edit Modal (Sheet) */}
      <Sheet open={showEditModal} onOpenChange={setShowEditModal}>
        <SheetContent side="top" className="max-w-full w-full h-[520px] aspect-[16/5] mx-auto rounded-xl p-0 flex items-center justify-center bg-white shadow-2xl border mt-16">
          <div className="w-full h-full overflow-y-auto px-8 py-4">
            <SheetHeader>
              <SheetTitle>Edit Featured Post</SheetTitle>
            </SheetHeader>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  placeholder="Enter post title"
                  value={formData.title}
                  onChange={e => handleInputChange("title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-excerpt">Excerpt</Label>
                <Textarea
                  id="edit-excerpt"
                  placeholder="A brief description of the post"
                  value={formData.excerpt}
                  onChange={e => handleInputChange("excerpt", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl">Featured Image</Label>
                <Input
                  id="edit-imageUrl"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.imageUrl && (
                  <Image src={formData.imageUrl} alt="Preview" width={256} height={128} className="mt-2 rounded w-full max-w-xs h-32 object-cover border" />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-author">Author</Label>
                <Input
                  id="edit-author"
                  value={formData.author}
                  onChange={e => handleInputChange("author", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={value => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={value => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Homepage">Homepage</SelectItem>
                    <SelectItem value="Sidebar">Sidebar</SelectItem>
                    <SelectItem value="Footer">Footer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="text"
                  placeholder="e.g. 2024-01-15"
                  value={formData.date}
                  onChange={e => handleInputChange("date", e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={formData.featured}
                  onChange={e => handleInputChange("featured", e.target.checked)}
                />
                <Label htmlFor="edit-featured">Featured</Label>
              </div>
              <SheetFooter className="flex gap-2 justify-end">
                <SheetClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </SheetClose>
                <Button type="submit" disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </SheetFooter>
            </form>
          </div>
        </SheetContent>
      </Sheet>
      {/* --- BLOG POST EDITOR --- */}
      <div className="mt-16">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Blog Post Editor</h1>
        <p className="text-muted-foreground mb-6">Add, edit, or remove blog posts</p>
        <form onSubmit={handleBlogSubmit} className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Post Details</CardTitle>
                <CardDescription>Information about the blog post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blog-title">Title</Label>
                  <Input
                    id="blog-title"
                    placeholder="Enter blog post title"
                    value={blogFormData.title}
                    onChange={e => handleBlogInputChange("title", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blog-content">Content</Label>
                  <Textarea
                    id="blog-content"
                    placeholder="Write your blog post content here..."
                    value={blogFormData.content}
                    onChange={e => handleBlogInputChange("content", e.target.value)}
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blog-imageUrl">Blog Image</Label>
                  <Input
                    id="blog-imageUrl"
                    type="file"
                    accept="image/*"
                    onChange={handleBlogImageChange}
                  />
                  {blogFormData.imageUrl && (
                    <Image src={blogFormData.imageUrl} alt="Preview" width={256} height={128} className="mt-2 rounded w-full max-w-xs h-32 object-cover border" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meta</CardTitle>
                <CardDescription>Author and date</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blog-author">Author</Label>
                  <Input
                    id="blog-author"
                    value={blogFormData.author}
                    onChange={e => handleBlogInputChange("author", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blog-date">Date</Label>
                  <Input
                    id="blog-date"
                    type="text"
                    placeholder="e.g. 2024-01-15"
                    value={blogFormData.date}
                    onChange={e => handleBlogInputChange("date", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            <Button type="submit" disabled={isBlogLoading} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {isBlogEditing ? (isBlogLoading ? "Saving..." : "Save Changes") : (isBlogLoading ? "Adding..." : "Add Blog Post")}
            </Button>
          </div>
        </form>
        {/* Blog Posts List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Current Blog Posts</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map(post => (
              <Card key={post.id} className="border-2 border-blue-400">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>by {post.author} • {post.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  {post.imageUrl && (
                    <Image src={post.imageUrl} alt={post.title} width={256} height={128} className="mb-2 rounded w-full max-w-xs h-32 object-cover border" />
                  )}
                  <p className="mb-2 text-muted-foreground">{post.content}</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleBlogEdit(post)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleBlogDelete(post.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {/* --- END BLOG POST EDITOR --- */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Current Featured Posts</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.filter(p => p.featured).map(post => (
            <Card key={post.id} className="border-2 border-yellow-400">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>by {post.author} • {post.date}</CardDescription>
              </CardHeader>
              <CardContent>
                {post.imageUrl && (
                  <Image src={post.imageUrl} alt={post.title} width={256} height={128} className="mb-2 rounded w-full max-w-xs h-32 object-cover border" />
                )}
                <p className="mb-2 text-muted-foreground">{post.excerpt}</p>
                <div className="flex gap-2 mb-2">
                  <Badge variant="secondary">{post.status}</Badge>
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 
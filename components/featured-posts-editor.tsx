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
        <SheetContent side="top" className="max-w-4xl w-full mx-auto rounded-lg p-8">
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
        </SheetContent>
      </Sheet>
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
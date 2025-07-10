"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type FeaturedPostCategory = "Homepage" | "Sidebar" | "Footer";

export type FeaturedPost = {
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

export type FeaturedPostsContextType = {
  posts: FeaturedPost[];
  setPosts: React.Dispatch<React.SetStateAction<FeaturedPost[]>>;
};

const FeaturedPostsContext = createContext<FeaturedPostsContextType | undefined>(undefined);

export function useFeaturedPosts() {
  const ctx = useContext(FeaturedPostsContext);
  if (!ctx) throw new Error("useFeaturedPosts must be used within a FeaturedPostsProvider");
  return ctx;
}

export function FeaturedPostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<FeaturedPost[]>(initialPosts);
  return (
    <FeaturedPostsContext.Provider value={{ posts, setPosts }}>
      {children}
    </FeaturedPostsContext.Provider>
  );
} 
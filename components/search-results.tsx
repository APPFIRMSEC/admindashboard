"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FileText, 
  Mic, 
  Image, 
  User,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

// Move mockResults outside the component
const mockResults = [
  {
    id: 1,
    type: "blog",
    title: "Getting Started with Next.js 15",
    excerpt: "Learn how to build modern web applications with Next.js 15...",
    url: "/blogs/1",
    author: "John Doe",
    date: "2024-01-15",
    icon: FileText
  },
  {
    id: 2,
    type: "podcast",
    title: "Episode 23: Web Development Trends",
    excerpt: "Exploring the latest trends in web development and what's coming next.",
    url: "/podcasts/1",
    author: "Jane Smith",
    date: "2024-01-15",
    icon: Mic
  },
  {
    id: 3,
    type: "media",
    title: "hero-image.jpg",
    excerpt: "Hero section background image",
    url: "/media/1",
    author: "Admin",
    date: "2024-01-15",
    icon: Image
  },
  {
    id: 4,
    type: "user",
    title: "John Doe",
    excerpt: "Admin user with full permissions",
    url: "/users/1",
    author: "System",
    date: "2024-01-01",
    icon: User
  }
];

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  type ResultType = {
    id: number;
    type: string;
    title: string;
    excerpt: string;
    url: string;
    author: string;
    date: string;
    icon: React.ElementType;
  };
  const [results, setResults] = useState<ResultType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Inside SearchResults, use useCallback with []
  const performSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter mock results based on search term
    const filtered = mockResults.filter(item => 
      item.title.toLowerCase().includes(term.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(term.toLowerCase()) ||
      item.author.toLowerCase().includes(term.toLowerCase())
    );
    
    setResults(filtered);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      blog: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      podcast: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      media: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      user: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    };
    return <Badge className={variants[type as keyof typeof variants]}>{type}</Badge>;
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground">
          Search across all content in your admin dashboard
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
          <CardDescription>Find content across blogs, podcasts, media, and users</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for anything..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchTerm && (
        <Card>
          <CardHeader>
            <CardTitle>
              Search Results ({results.length})
              {query && (
                <span className="text-muted-foreground font-normal">
                  {" "}for &quot;{query}&quot;
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {isLoading ? "Searching..." : `Found ${results.length} results`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => {
                  const Icon = result.icon;
                  return (
                    <div key={result.id} className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/50">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{result.title}</h3>
                          {getTypeBadge(result.type)}
                        </div>
                        <p className="text-sm text-muted-foreground">{result.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>by {result.author}</span>
                          <span>•</span>
                          <span>{new Date(result.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={result.url}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or browse the different sections.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Search Suggestions */}
      {!searchTerm && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Search</CardTitle>
            <CardDescription>Popular search terms and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { term: "blog posts", icon: FileText },
                { term: "podcast episodes", icon: Mic },
                { term: "media files", icon: Image },
                { term: "users", icon: User }
              ].map((suggestion) => {
                const Icon = suggestion.icon;
                return (
                  <Button
                    key={suggestion.term}
                    variant="outline"
                    className="justify-start"
                    onClick={() => setSearchTerm(suggestion.term)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {suggestion.term}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
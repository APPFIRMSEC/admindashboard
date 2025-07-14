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
  Play,
  Calendar,
  User,
  Clock,
  Download
} from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { PodcastEditor } from "@/components/podcast-editor";
import type { PodcastFormData } from "@/components/podcast-editor";

export function PodcastList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<PodcastFormData | null>(null);

  // Mock data - in a real app, this would come from your API
  const podcasts = [
    {
      id: 1,
      title: "Episode 23: Web Development Trends 2024",
      description: "Exploring the latest trends in web development and what's coming next.",
      status: "published",
      author: "Jane Smith",
      publishedAt: "2024-01-15",
      duration: "45:30",
      fileSize: "32.5 MB",
      downloads: 1234,
      audioUrl: "/podcasts/episode-23.mp3",
      slug: "episode-23-web-development-trends",
      content: "Show notes for episode 23...",
      tags: ["web development", "trends", "2024"],
      seoTitle: "Web Development Trends 2024 - Episode 23",
      seoDescription: "Exploring the latest trends in web development and what's coming next.",
      seoKeywords: "web development, trends, 2024, programming",
      episodeNumber: "23",
      seasonNumber: "1"
    },
    {
      id: 2,
      title: "Episode 22: Building Scalable APIs",
      description: "Best practices for designing and building scalable REST APIs.",
      status: "published",
      author: "Mike Johnson",
      publishedAt: "2024-01-08",
      duration: "38:15",
      fileSize: "28.1 MB",
      downloads: 987,
      audioUrl: "/podcasts/episode-22.mp3",
      slug: "episode-22-building-scalable-apis",
      content: "Show notes for episode 22...",
      tags: ["api", "scalable", "rest"],
      seoTitle: "Building Scalable APIs - Episode 22",
      seoDescription: "Best practices for designing and building scalable REST APIs.",
      seoKeywords: "api, scalable, rest, programming",
      episodeNumber: "22",
      seasonNumber: "1"
    },
    {
      id: 3,
      title: "Episode 24: The Future of AI in Development",
      description: "How AI is transforming the software development landscape.",
      status: "draft",
      author: "Sarah Wilson",
      publishedAt: null,
      duration: "52:45",
      fileSize: "0 MB",
      downloads: 0,
      audioUrl: null,
      slug: "episode-24-future-ai-development",
      content: "Show notes for episode 24...",
      tags: ["ai", "development", "future"],
      seoTitle: "The Future of AI in Development - Episode 24",
      seoDescription: "How AI is transforming the software development landscape.",
      seoKeywords: "ai, development, future, programming",
      episodeNumber: "24",
      seasonNumber: "1"
    },
    {
      id: 4,
      title: "Episode 25: DevOps Best Practices",
      description: "Essential DevOps practices for modern development teams.",
      status: "scheduled",
      author: "John Doe",
      publishedAt: "2024-01-22",
      duration: "41:20",
      fileSize: "29.8 MB",
      downloads: 0,
      audioUrl: "/podcasts/episode-25.mp3",
      slug: "episode-25-devops-best-practices",
      content: "Show notes for episode 25...",
      tags: ["devops", "best practices", "development"],
      seoTitle: "DevOps Best Practices - Episode 25",
      seoDescription: "Essential DevOps practices for modern development teams.",
      seoKeywords: "devops, best practices, development, teams",
      episodeNumber: "25",
      seasonNumber: "1"
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

  const filteredPodcasts = podcasts.filter(podcast => {
    const matchesSearch = podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         podcast.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || podcast.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Podcast Episodes</h1>
          <p className="text-muted-foreground">
            Manage your podcast episodes and audio content
          </p>
        </div>
        <Button asChild>
          <Link href="/podcasts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Episode
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter your podcast episodes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search episodes..."
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

      {/* Podcast Episodes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Episodes ({filteredPodcasts.length})</CardTitle>
          <CardDescription>
            A list of all your podcast episodes with their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Author</TableHead>
                  <TableHead className="hidden lg:table-cell">Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Published</TableHead>
                  <TableHead className="hidden lg:table-cell">Downloads</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPodcasts.map((podcast) => (
                  <TableRow key={podcast.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{podcast.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {podcast.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground md:hidden">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {podcast.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {podcast.duration}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Download className="h-3 w-3" />
                          {podcast.fileSize}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {podcast.author}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {podcast.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(podcast.status)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {podcast.publishedAt ? (
                          <span className="text-sm">
                            {new Date(podcast.publishedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not published</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm font-medium">{podcast.downloads.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {podcast.audioUrl && (
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => { 
                            setEditingPodcast({
                              title: podcast.title,
                              slug: podcast.slug,
                              description: podcast.description,
                              content: podcast.content,
                              status: podcast.status,
                              author: podcast.author,
                              tags: podcast.tags || [],
                              audioFile: podcast.audioUrl ?? "",
                              duration: podcast.duration,
                              fileSize: podcast.fileSize,
                              publishDate: podcast.publishedAt ?? "",
                              seoTitle: podcast.seoTitle,
                              seoDescription: podcast.seoDescription,
                              seoKeywords: podcast.seoKeywords,
                              episodeNumber: podcast.episodeNumber,
                              seasonNumber: podcast.seasonNumber,
                            }); 
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

      {/* Podcast Edit Modal */}
      <Sheet open={showEditModal} onOpenChange={setShowEditModal}>
        <SheetContent 
          side="top" 
          className="w-full h-full max-h-[90vh] overflow-y-auto p-0"
        >
          <div className="w-full h-full overflow-y-auto px-4 py-4 sm:px-6">
            <SheetHeader className="mb-6">
              <SheetTitle>Edit Podcast Episode</SheetTitle>
            </SheetHeader>
            {editingPodcast && (
              <PodcastEditor 
                initialData={editingPodcast} 
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
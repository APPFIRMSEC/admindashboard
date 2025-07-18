"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  Download,
  Pause,
} from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { PodcastEditor } from "@/components/podcast-editor";
import type { PodcastFormData } from "@/components/podcast-editor";
import { fetchPodcasts, deletePodcast } from "@/lib/utils";
import type { Podcast } from "@/lib/utils";
import { usePodcastRefreshStore } from "@/stores/podcast-refresh";
import { useRef } from "react";
import { toast } from "sonner";

export function PodcastList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<PodcastFormData | null>(
    null
  );
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [playingPodcastId, setPlayingPodcastId] = useState<
    string | number | null
  >(null);
  const playButtonRefs = useRef<
    Record<string | number, HTMLButtonElement | null>
  >({});
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const refreshKey = usePodcastRefreshStore((state) => state.refreshKey);
  const incrementRefreshKey = usePodcastRefreshStore(
    (state) => state.incrementRefreshKey
  );

  useEffect(() => {
    async function loadPodcasts() {
      const result = await fetchPodcasts();
      if (Array.isArray(result)) {
        setPodcasts(result);
      }
    }
    loadPodcasts();

    // Refetch podcasts when the page/tab becomes visible
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadPodcasts();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refreshKey]);

  const getStatusBadge = (status: string) => {
    const variants = {
      published:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      draft:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      scheduled:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    };
    return (
      <Badge
        className={
          variants[status.toLowerCase() as keyof typeof variants] ?? ""
        }
      >
        {status.toLowerCase()}
      </Badge>
    );
  };

  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch =
      podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || podcast.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePlayClick = (podcast: Podcast) => {
    if (playingPodcastId === podcast.id) {
      setPlayingPodcastId(null);
      setPopoverPosition(null);
    } else {
      setPlayingPodcastId(podcast.id);
      // Position the popover below the play button
      const btn = playButtonRefs.current[podcast.id];
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const popoverWidth = 240; // px, matches minWidth below
        const spaceRight = window.innerWidth - rect.left;
        let left = rect.left + window.scrollX;
        // If not enough space to the right, open to the left
        if (spaceRight < popoverWidth + 16) {
          left = rect.right + window.scrollX - popoverWidth;
        }
        setPopoverPosition({
          top: rect.bottom + window.scrollY + 4,
          left,
        });
      }
    }
  };

  const handleDelete = async (id: string | number) => {
    const res = await deletePodcast(id);
    if (res.error) {
      toast.error("Failed to delete podcast: " + res.error);
    } else {
      toast.success("Podcast deleted successfully!");
      incrementRefreshKey();
    }
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Podcast Episodes
          </h1>
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
          <CardDescription>
            Search and filter your podcast episodes
          </CardDescription>
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
                  <TableHead className="hidden lg:table-cell">
                    Duration
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Published
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Downloads
                  </TableHead>
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
                            {podcast.author?.name}
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
                        {podcast.author?.name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {podcast.duration}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(podcast.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {podcast.publishedAt ? (
                          <span className="text-sm">
                            {new Date(podcast.publishedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Not published
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm font-medium">
                        {podcast.downloads.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {podcast.audioUrl && (
                          <>
                            <Button
                              ref={(el) => {
                                playButtonRefs.current[podcast.id] = el;
                              }}
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePlayClick(podcast)}
                            >
                              {playingPodcastId === podcast.id ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            console.log(
                              "Editing podcast status:",
                              podcast.status
                            );
                            setEditingPodcast({
                              id: podcast.id,
                              title: podcast.title ?? "",
                              description: podcast.description ?? "",
                              content: podcast.content ?? "",
                              status: podcast.status
                                ? podcast.status.toString().toUpperCase().trim()
                                : "DRAFT",
                              tags: podcast.tags || [],
                              audioFile: podcast.audioUrl ?? "",
                              duration: podcast.duration
                                ? String(podcast.duration)
                                : "",
                              fileSize: podcast.fileSize
                                ? String(podcast.fileSize)
                                : "",
                              publishDate: podcast.publishedAt
                                ? new Date(podcast.publishedAt)
                                    .toISOString()
                                    .slice(0, 16)
                                : "",
                              seoTitle: podcast.seoTitle ?? "",
                              seoDescription: podcast.seoDescription ?? "",
                              seoKeywords: podcast.seoKeywords ?? "",
                              episodeNumber: podcast.episodeNumber
                                ? String(podcast.episodeNumber)
                                : "",
                              seasonNumber: podcast.seasonNumber
                                ? String(podcast.seasonNumber)
                                : "",
                            });
                            setShowEditModal(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(podcast.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Popover for audio player */}
            {playingPodcastId && popoverPosition && (
              <div
                style={{
                  position: "absolute",
                  top: popoverPosition.top,
                  left: popoverPosition.left,
                  zIndex: 1000,
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  padding: 12,
                  minWidth: 240,
                }}
              >
                <audio
                  controls
                  autoPlay
                  src={
                    filteredPodcasts.find((p) => p.id === playingPodcastId)
                      ?.audioUrl ?? undefined
                  }
                  className="w-full"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPlayingPodcastId(null);
                      setPopoverPosition(null);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
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
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Tag, X, FolderOpen } from "lucide-react";
import { createPodcast, updatePodcast } from "@/lib/utils";
import { toast } from "sonner";
import { useRef } from "react";
import type { PodcastCreatePayload } from "@/lib/utils";
import { usePodcastRefreshStore } from "@/stores/podcast-refresh";
import { MediaLibraryPicker } from "./media-library-picker";

export type PodcastFormData = {
  id?: string | number;
  title: string;
  description: string;
  content: string;
  status: string;
  tags: string[];
  audioFile: string;
  duration: string;
  fileSize: string;
  publishDate: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  episodeNumber: string;
  seasonNumber: string;
};

interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  type: string;
  url: string;
  size: string;
  mimeType: string;
  alt?: string;
  dimensions?: string;
  duration?: string;
  uploadedAt: string;
  uploader?: {
    id: string;
    name: string;
    email: string;
  };
}

export function PodcastEditor({
  initialData,
  onSave,
}: {
  initialData?: Partial<PodcastFormData>;
  onSave?: () => void;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<PodcastFormData>({
    id: undefined,
    title: "",
    description: "",
    content: "",
    status: "DRAFT",
    tags: [] as string[],
    audioFile: "",
    duration: "",
    fileSize: "",
    publishDate: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    episodeNumber: "",
    seasonNumber: "",
  });
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const progressRef = useRef<number>(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const incrementRefreshKey = usePodcastRefreshStore(
    (state) => state.incrementRefreshKey
  );

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        status:
          initialData.status && initialData.status !== ""
            ? initialData.status.toString().toUpperCase().trim()
            : prev.status,
        seasonNumber: initialData.seasonNumber
          ? String(initialData.seasonNumber)
          : "",
        episodeNumber: initialData.episodeNumber
          ? String(initialData.episodeNumber)
          : "",
        seoTitle: initialData.seoTitle ? String(initialData.seoTitle) : "",
        seoDescription: initialData.seoDescription
          ? String(initialData.seoDescription)
          : "",
        seoKeywords: initialData.seoKeywords
          ? String(initialData.seoKeywords)
          : "",
        publishDate: initialData.publishDate
          ? String(initialData.publishDate)
          : "",
        duration: initialData.duration ? String(initialData.duration) : "",
        fileSize: initialData.fileSize ? String(initialData.fileSize) : "",
        audioFile: initialData.audioFile ? String(initialData.audioFile) : "",
        tags: initialData.tags || [],
      }));
      if (initialData.audioFile) {
        setAudioPreview(String(initialData.audioFile));
      }
    }
  }, [initialData]);

  // Add navigation prevention effect
  useEffect(() => {
    if (isLoading) {
      window.onbeforeunload = (e) => {
        e.preventDefault();
        e.returnValue = "";
        return "";
      };
    } else {
      window.onbeforeunload = null;
    }
    return () => {
      window.onbeforeunload = null;
    };
  }, [isLoading]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle audio file selection and preview
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local preview without uploading
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        audioFile: url, // This will be a blob URL for now
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      }));
      setAudioPreview(url);
    }
  };

  // Handle Media Library file selection
  const handleMediaFileSelect = (file: MediaFile) => {
    setFormData((prev) => ({
      ...prev,
      audioFile: file.url,
      fileSize: file.size,
    }));
    setAudioPreview(file.url);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Simulated progress bar
    progressRef.current = 0;
    let progress = 0;
    toast(
      <div>
        <div>Saving podcast...</div>
        <div className="w-full bg-gray-200 rounded h-2 mt-2">
          <div
            className="bg-blue-500 h-2 rounded"
            style={{ width: `${progress}%`, transition: "width 0.3s" }}
          />
        </div>
        {progress >= 90 && <div className="text-xs mt-1">Finalizing...</div>}
      </div>,
      { duration: Infinity, id: "podcast-upload-progress" }
    );

    // Progress simulation
    function updateProgress() {
      if (progress < 90) {
        progress += 2;
        progressRef.current = progress;
        toast(
          <div>
            <div>Saving podcast...</div>
            <div className="w-full bg-gray-200 rounded h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${progress}%`, transition: "width 0.3s" }}
              />
            </div>
            {progress >= 90 && (
              <div className="text-xs mt-1">Finalizing...</div>
            )}
          </div>,
          { duration: Infinity, id: "podcast-upload-progress" }
        );
        progressTimerRef.current = setTimeout(updateProgress, 200);
      }
    }
    updateProgress();

    // Immediately close the form/modal so the user can continue
    if (onSave) onSave();
    else router.push("/podcasts");

    // Handle audio file upload if it's a local blob URL
    let audioUrl = formData.audioFile;
    let fileSize = formData.fileSize;
    const duration = formData.duration;

    // Check if audioFile is a blob URL (local file that needs uploading)
    if (audioUrl.startsWith("blob:")) {
      const fileInput = document.getElementById(
        "audioFile"
      ) as HTMLInputElement | null;
      const file = fileInput?.files?.[0];

      if (file) {
        // Upload to Media Library
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "podcast");
        formData.append("subcategory", "episodes");
        formData.append("alt", file.name);

        const response = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
          toast(
            <div>
              <div className="text-red-600">
                Audio upload failed: {result.error}
              </div>
              <div className="w-full bg-gray-200 rounded h-2 mt-2">
                <div
                  className="bg-red-500 h-2 rounded"
                  style={{ width: `100%`, transition: "width 0.3s" }}
                />
              </div>
            </div>,
            { id: "podcast-upload-progress", duration: 5000 }
          );
          return;
        }

        // Use the uploaded file URL
        audioUrl = result.file.url;
        fileSize = result.file.size;
      }
    }

    // Prepare podcast data, ensure status is uppercase
    const { publishDate, ...restFormData } = formData;
    const podcastPayload: PodcastCreatePayload & { publishedAt?: string } = {
      ...restFormData,
      audioUrl,
      fileSize,
      duration,
      status: formData.status.toUpperCase(),
      publishedAt: publishDate ? publishDate : undefined,
    };

    let result;
    // If editing (initialData && initialData.id), PATCH; else, POST
    if (initialData && initialData.id) {
      result = await updatePodcast(initialData.id, podcastPayload);
    } else {
      result = await createPodcast(podcastPayload);
    }
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    if ("error" in result) {
      toast(
        <div>
          <div className="text-red-600">
            Podcast save failed: {result.error}
          </div>
          <div className="w-full bg-gray-200 rounded h-2 mt-2">
            <div
              className="bg-red-500 h-2 rounded"
              style={{ width: `100%`, transition: "width 0.3s" }}
            />
          </div>
        </div>,
        { id: "podcast-upload-progress", duration: 5000 }
      );
      return;
    }
    toast(
      <div>
        <div className="text-green-600">Podcast saved successfully!</div>
        <div className="w-full bg-gray-200 rounded h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded"
            style={{ width: `100%`, transition: "width 0.3s" }}
          />
        </div>
      </div>,
      { id: "podcast-upload-progress", duration: 3000 }
    );
    incrementRefreshKey();
  };

  const handleAudioLoadedMetadata = (
    e: React.SyntheticEvent<HTMLAudioElement>
  ) => {
    const audio = e.currentTarget;
    if (!isNaN(audio.duration)) {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60)
        .toString()
        .padStart(2, "0");
      setFormData((prev) => ({
        ...prev,
        duration: `${minutes}:${seconds}`,
      }));
    }
  };
  console.log("publishDate for input:", formData);

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            New Podcast Episode
          </h1>
          <p className="text-muted-foreground">
            Create a new podcast episode for your website
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/podcasts")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Draft"}
          </Button>
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Episode Details */}
          <Card>
            <CardHeader>
              <CardTitle>Episode Details</CardTitle>
              <CardDescription>
                Basic information about your podcast episode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="seasonNumber">Season Number</Label>
                  <Input
                    id="seasonNumber"
                    placeholder="1"
                    value={formData.seasonNumber}
                    onChange={(e) =>
                      handleInputChange("seasonNumber", e.target.value)
                    }
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="episodeNumber">Episode Number</Label>
                  <Input
                    id="episodeNumber"
                    placeholder="23"
                    value={formData.episodeNumber}
                    onChange={(e) =>
                      handleInputChange("episodeNumber", e.target.value)
                    }
                    type="number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter your podcast episode title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A brief description of your podcast episode"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Audio Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Audio File</CardTitle>
              <CardDescription>Upload your podcast audio file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {initialData && initialData.id ? (
                // In edit mode: show audio file as disabled input or audio player
                formData.audioFile ? (
                  <div>
                    <Label>Current Audio File</Label>
                    <audio
                      controls
                      src={formData.audioFile}
                      className="w-full mb-2"
                    />
                    <Input
                      value={formData.audioFile}
                      disabled
                      readOnly
                      className="mb-2"
                    />
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    No audio file attached.
                  </div>
                )
              ) : (
                // In create mode: show file input
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="audioFile">Audio File</Label>
                    <div className="flex gap-2">
                      <Input
                        id="audioFile"
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioFileChange}
                        disabled={isLoading}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowMediaPicker(true)}
                        disabled={isLoading}
                      >
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Select from Media Library
                      </Button>
                    </div>
                  </div>

                  {audioPreview && (
                    <div className="space-y-2">
                      <Label>Audio Preview</Label>
                      <audio
                        controls
                        src={audioPreview}
                        className="w-full"
                        onLoadedMetadata={handleAudioLoadedMetadata}
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Show Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Show Notes</CardTitle>
              <CardDescription>
                Write detailed show notes for your episode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write detailed show notes, timestamps, and additional information..."
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                rows={15}
                className="min-h-[400px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
              <CardDescription>
                Control when and how your episode is published
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  type="datetime-local"
                  value={formData.publishDate}
                  onChange={(e) =>
                    handleInputChange("publishDate", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add tags to help categorize your episode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Tag className="h-4 w-4" />
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your episode for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  placeholder="SEO optimized title"
                  value={formData.seoTitle}
                  onChange={(e) =>
                    handleInputChange("seoTitle", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  placeholder="SEO meta description"
                  value={formData.seoDescription}
                  onChange={(e) =>
                    handleInputChange("seoDescription", e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoKeywords">SEO Keywords</Label>
                <Input
                  id="seoKeywords"
                  placeholder="keyword1, keyword2, keyword3"
                  value={formData.seoKeywords}
                  onChange={(e) =>
                    handleInputChange("seoKeywords", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Media Library Picker */}
      {showMediaPicker && (
        <MediaLibraryPicker
          fileType="audio"
          onSelect={handleMediaFileSelect}
          onClose={() => setShowMediaPicker(false)}
          title="Select Audio File"
          description="Choose an audio file from your media library"
        />
      )}
    </div>
  );
}

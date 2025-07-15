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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, Tag, X, Clock, FileAudio } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { createPodcast } from "@/lib/utils";

export type PodcastFormData = {
  title: string;
  slug: string;
  description: string;
  content: string;
  status: string;
  author: string;
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

export function PodcastEditor({
  initialData,
  onSave,
}: {
  initialData?: Partial<PodcastFormData>;
  onSave?: () => void;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    status: "draft",
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

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        tags: initialData.tags || [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle audio file selection and preview
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        audioFile: url,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      }));
      setAudioPreview(url);
    }
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

    let audioUrl = formData.audioFile;
    let fileSize = formData.fileSize;
    let duration = formData.duration;

    // If audioFile is a local object URL, upload the file directly to Supabase
    const fileInput = document.getElementById(
      "audioFile"
    ) as HTMLInputElement | null;
    const file = fileInput?.files?.[0];
    if (file) {
      const filename = `${Date.now()}-${file.name}`;
      const { data, error: uploadError } = await supabaseBrowser.storage
        .from("podcasts-audio")
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });
      if (uploadError) {
        setError("Audio upload failed: " + uploadError.message);
        setIsLoading(false);
        return;
      }
      // Get the public URL
      const { data: publicUrlData } = supabaseBrowser.storage
        .from("podcasts-audio")
        .getPublicUrl(filename);
      audioUrl = publicUrlData.publicUrl;
      fileSize = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      // Duration will be set from formData or can be calculated from audio element
    }

    // Prepare podcast data, ensure status is uppercase
    const podcastData = {
      ...formData,
      audioUrl,
      fileSize,
      duration,
      status: formData.status.toUpperCase(),
    };

    const result = await createPodcast(podcastData);
    if (result.error) {
      setError("Podcast save failed: " + result.error);
      setIsLoading(false);
      return;
    }
    setSuccess("Podcast saved successfully!");
    setIsLoading(false);
    if (onSave) onSave();
    else router.push("/podcasts");
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({ ...prev, slug }));
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
              <div className="space-y-2">
                <Label htmlFor="audioFile">Audio File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="audioFile"
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                    className="flex-1"
                  />
                  <FileAudio className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {audioPreview && (
                <div className="space-y-2">
                  <Label>Audio Preview</Label>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <audio
                      controls
                      className="w-full"
                      onLoadedMetadata={handleAudioLoadedMetadata}
                    >
                      <source src={audioPreview} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formData.duration || "Calculating..."}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileAudio className="h-3 w-3" />
                        {formData.fileSize || "Calculating..."}
                      </div>
                    </div>
                  </div>
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
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
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
    </div>
  );
}

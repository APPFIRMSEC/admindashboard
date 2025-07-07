"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Download, 
  Copy, 
  Trash2, 
  Image as ImageIcon,
  File,
  Calendar,
  FileText
} from "lucide-react";

export function MediaLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // Mock data - in a real app, this would come from your API
  const mediaFiles = [
    {
      id: 1,
      name: "hero-image.jpg",
      type: "image",
      url: "/images/hero-image.jpg",
      size: "2.4 MB",
      uploadedAt: "2024-01-15",
      dimensions: "1920x1080",
      alt: "Hero section background image"
    },
    {
      id: 2,
      name: "podcast-episode-23.mp3",
      type: "audio",
      url: "/podcasts/episode-23.mp3",
      size: "32.5 MB",
      uploadedAt: "2024-01-14",
      duration: "45:30",
      alt: "Podcast episode 23 audio file"
    },
    {
      id: 3,
      name: "about-team.jpg",
      type: "image",
      url: "/images/about-team.jpg",
      size: "1.8 MB",
      uploadedAt: "2024-01-13",
      dimensions: "1200x800",
      alt: "Team photo for about page"
    },
    {
      id: 4,
      name: "blog-post-template.pdf",
      type: "document",
      url: "/documents/blog-post-template.pdf",
      size: "156 KB",
      uploadedAt: "2024-01-12",
      pages: "3",
      alt: "Blog post writing template"
    },
    {
      id: 5,
      name: "logo-white.png",
      type: "image",
      url: "/images/logo-white.png",
      size: "45 KB",
      uploadedAt: "2024-01-11",
      dimensions: "200x60",
      alt: "White version of company logo"
    },
    {
      id: 6,
      name: "podcast-episode-22.mp3",
      type: "audio",
      url: "/podcasts/episode-22.mp3",
      size: "28.1 MB",
      uploadedAt: "2024-01-10",
      duration: "38:15",
      alt: "Podcast episode 22 audio file"
    }
  ];

  const getFileIcon = (type: string) => {
    const icons = {
      image: ImageIcon,
      audio: File,
      document: FileText
    };
    const Icon = icons[type as keyof typeof icons];
    return <Icon className="h-8 w-8" />;
  };

  const getFileTypeBadge = (type: string) => {
    const variants = {
      image: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      audio: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      document: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    };
    return <Badge className={variants[type as keyof typeof variants]}>{type}</Badge>;
  };

  const filteredFiles = mediaFiles.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.alt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    // In a real app, you'd show a toast notification
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your uploaded images, audio files, and documents
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Files</CardTitle>
          <CardDescription>Find specific files in your media library</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All Files ({filteredFiles.length})</CardTitle>
          <CardDescription>
            Browse and manage your uploaded media files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFiles.map((file) => (
              <Card 
                key={file.id} 
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedFiles.includes(file.id.toString()) ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleFileSelect(file.id.toString())}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* File Preview */}
                    <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                      {file.type === "image" ? (
                        <img 
                          src={file.url} 
                          alt={file.alt}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-muted-foreground">
                          {getFileIcon(file.type)}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-sm line-clamp-2">{file.name}</p>
                        {getFileTypeBadge(file.type)}
                      </div>
                      
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <File className="h-3 w-3" />
                          {file.size}
                        </div>
                        {file.dimensions && (
                          <div>{file.dimensions}</div>
                        )}
                        {file.duration && (
                          <div>{file.duration}</div>
                        )}
                        {file.pages && (
                          <div>{file.pages} pages</div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 pt-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(file.url);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
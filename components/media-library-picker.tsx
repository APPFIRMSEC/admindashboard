"use client";

import { useState, useEffect } from "react";
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
  Search,
  File,
  Image as ImageIcon,
  FileText,
  X,
  Loader2,
} from "lucide-react";
import Image from "next/image";

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

interface MediaLibraryPickerProps {
  fileType: "audio" | "image" | "video" | "document";
  onSelect: (file: MediaFile) => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function MediaLibraryPicker({
  fileType,
  onSelect,
  onClose,
  title = "Select from Media Library",
  description = "Choose a file from your media library",
}: MediaLibraryPickerProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch media files from API
  const fetchMediaFiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/media?type=${fileType}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch files");
      }

      setMediaFiles(result.files);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch files"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaFiles();
  }, [fileType]);

  const getFileIcon = (type: string) => {
    const icons = {
      image: ImageIcon,
      audio: File,
      video: File,
      document: FileText,
    };
    const Icon = icons[type as keyof typeof icons] || File;
    return <Icon className="h-8 w-8" />;
  };

  const getFileTypeBadge = (type: string) => {
    const variants = {
      image: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      audio:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      video:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      document:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };
    return (
      <Badge
        className={
          variants[type as keyof typeof variants] || "bg-gray-100 text-gray-800"
        }
      >
        {type}
      </Badge>
    );
  };

  const filteredFiles = mediaFiles.filter(
    (file) =>
      file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.alt && file.alt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFileSelect = (file: MediaFile) => {
    onSelect(file);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50 mb-4">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* File Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading files...</span>
            </div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No files found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search terms."
                : `No ${fileType} files in your media library.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFiles.map((file) => (
              <Card
                key={file.id}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => handleFileSelect(file)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* File Preview */}
                    <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                      {file.type === "image" ? (
                        <Image
                          src={file.url}
                          alt={file.alt || file.originalName}
                          width={400}
                          height={400}
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
                        <p className="font-medium text-sm line-clamp-2">
                          {file.originalName}
                        </p>
                        {getFileTypeBadge(file.type)}
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <File className="h-3 w-3" />
                          {file.size}
                        </div>
                        {file.dimensions && <div>{file.dimensions}</div>}
                        {file.duration && <div>{file.duration}</div>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

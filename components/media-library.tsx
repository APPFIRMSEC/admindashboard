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
  Plus,
  Search,
  Download,
  Copy,
  Trash2,
  Image as ImageIcon,
  File,
  Calendar,
  FileText,
  Loader2,
  Upload,
  X,
  AlertTriangle,
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

interface PendingFile {
  file: File;
  preview: string;
  id: string;
}

export function MediaLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch media files from API
  const fetchMediaFiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/media");
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

  // Handle file selection (preview only, no upload)
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const id = Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);

      setPendingFiles((prev) => [...prev, { file, preview, id }]);
    });

    // Clear the input
    event.target.value = "";
  };

  // Handle file upload (when user clicks upload)
  const handleUploadFiles = async () => {
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      for (const pendingFile of pendingFiles) {
        const formData = new FormData();
        formData.append("file", pendingFile.file);
        formData.append("category", "general");
        formData.append("subcategory", "general");
        formData.append("alt", pendingFile.file.name);

        const response = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Upload failed");
        }
      }

      // Clear pending files and refresh
      setPendingFiles([]);
      await fetchMediaFiles();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Remove pending file
  const removePendingFile = (id: string) => {
    setPendingFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  // Handle file deletion
  const handleDeleteFile = async (fileId: string) => {
    setIsDeleting(fileId);
    setError(null);

    try {
      const response = await fetch(`/api/media/${fileId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Delete failed");
      }

      // Remove from selected files if it was selected
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId));

      // Refresh the file list
      await fetchMediaFiles();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setIsDeleting(null);
      setDeleteConfirm(null);
    }
  };

  // Bulk delete selected files
  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;

    setIsDeleting("bulk");
    setError(null);

    try {
      for (const fileId of selectedFiles) {
        const response = await fetch(`/api/media/${fileId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Delete failed");
        }
      }

      setSelectedFiles([]);
      await fetchMediaFiles();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bulk delete failed");
    } finally {
      setIsDeleting(null);
    }
  };

  useEffect(() => {
    fetchMediaFiles();
  }, []);

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

  const handleFileSelectFromGrid = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    // In a real app, you'd show a toast notification
  };

  if (isLoading) {
    return (
      <div className="space-y-6 px-4 lg:px-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading media files...</span>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-2">
          <Input
            type="file"
            multiple
            onChange={handleFileSelect}
            accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
            className="hidden"
            id="file-upload"
          />
          <Button
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={isUploading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Select Files
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {/* Pending Files Section */}
      {pendingFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Files to Upload ({pendingFiles.length})</CardTitle>
            <CardDescription>
              Review and upload your selected files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pendingFiles.map((pendingFile) => (
                  <Card key={pendingFile.id} className="relative">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* File Preview */}
                        <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                          {pendingFile.file.type.startsWith("image/") ? (
                            <Image
                              src={pendingFile.preview}
                              alt={pendingFile.file.name}
                              width={400}
                              height={400}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-muted-foreground">
                              {getFileIcon(
                                pendingFile.file.type.startsWith("image/")
                                  ? "image"
                                  : pendingFile.file.type.startsWith("audio/")
                                  ? "audio"
                                  : pendingFile.file.type.startsWith("video/")
                                  ? "video"
                                  : "document"
                              )}
                            </div>
                          )}
                        </div>

                        {/* File Info */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <p className="font-medium text-sm line-clamp-2">
                              {pendingFile.file.name}
                            </p>
                            {getFileTypeBadge(
                              pendingFile.file.type.startsWith("image/")
                                ? "image"
                                : pendingFile.file.type.startsWith("audio/")
                                ? "audio"
                                : pendingFile.file.type.startsWith("video/")
                                ? "video"
                                : "document"
                            )}
                          </div>

                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <File className="h-3 w-3" />
                              {(pendingFile.file.size / (1024 * 1024)).toFixed(
                                2
                              )}{" "}
                              MB
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={() => removePendingFile(pendingFile.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleUploadFiles}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload {pendingFiles.length} File
                      {pendingFiles.length > 1 ? "s" : ""}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    pendingFiles.forEach((f) => URL.revokeObjectURL(f.preview));
                    setPendingFiles([]);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Files ({selectedFiles.length})</CardTitle>
            <CardDescription>Actions for selected files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => setDeleteConfirm("bulk")}
                disabled={isDeleting === "bulk"}
              >
                {isDeleting === "bulk" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setSelectedFiles([])}>
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Files</CardTitle>
          <CardDescription>
            Find specific files in your media library
          </CardDescription>
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
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No files found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Upload your first file to get started."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFiles.map((file) => (
                <Card
                  key={file.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedFiles.includes(file.id) ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleFileSelectFromGrid(file.id)}
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
                            <Calendar className="h-3 w-3" />
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <File className="h-3 w-3" />
                            {file.size}
                          </div>
                          {file.dimensions && <div>{file.dimensions}</div>}
                          {file.duration && <div>{file.duration}</div>}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(file.id);
                            }}
                            disabled={isDeleting === file.id}
                          >
                            {isDeleting === file.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-medium">Confirm Delete</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              {deleteConfirm === "bulk"
                ? `Are you sure you want to delete ${
                    selectedFiles.length
                  } file${
                    selectedFiles.length > 1 ? "s" : ""
                  }? This action cannot be undone.`
                : "Are you sure you want to delete this file? This action cannot be undone."}
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deleteConfirm === "bulk") {
                    handleBulkDelete();
                  } else {
                    handleDeleteFile(deleteConfirm);
                  }
                }}
                disabled={isDeleting === deleteConfirm}
              >
                {isDeleting === deleteConfirm ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

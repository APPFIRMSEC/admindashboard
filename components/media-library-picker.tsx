"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Folder,
  ChevronLeft,
  Home,
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
  path?: string;
  uploader?: {
    id: string;
    name: string;
    email: string;
  };
}

interface FolderItem {
  name: string;
  path: string;
  type: "folder";
}

interface MediaLibraryPickerProps {
  fileType: "audio" | "image" | "video" | "document";
  onSelect: (file: MediaFile) => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

// Available folders based on file type
const getAvailableFolders = (fileType: string): FolderItem[] => {
  const folders = {
    image: [
      { name: "About", path: "/images/about", type: "folder" as const },
      { name: "General", path: "/images/general", type: "folder" as const },
    ],
    audio: [
      { name: "Podcasts", path: "/audio/podcasts", type: "folder" as const },
      { name: "General", path: "/audio/general", type: "folder" as const },
    ],
    video: [
      { name: "General", path: "/video/general", type: "folder" as const },
    ],
    document: [
      { name: "General", path: "/documents/general", type: "folder" as const },
    ],
  };
  return folders[fileType as keyof typeof folders] || [];
};

export function MediaLibraryPicker({
  fileType,
  onSelect,
  onClose,
  title = "Select from Media Library",
  description = "Choose a file from your media library",
}: MediaLibraryPickerProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPath, setCurrentPath] = useState("/");
  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<{ name: string; path: string }>
  >([{ name: "Root", path: "/" }]);

  // Fetch media files and folders from API
  const fetchMediaFiles = async (path: string = "/") => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/media?type=${fileType.toUpperCase()}&path=${path}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch files");
      }

      setMediaFiles(result.files);

      // Get available folders for current file type
      const availableFolders = getAvailableFolders(fileType);
      setFolders(availableFolders);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch files"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaFiles(currentPath);
  }, [fileType, currentPath]);

  // Update breadcrumbs when path changes
  useEffect(() => {
    if (currentPath === "/") {
      setBreadcrumbs([{ name: "Root", path: "/" }]);
    } else {
      const pathParts = currentPath.split("/").filter(Boolean);
      const newBreadcrumbs = [{ name: "Root", path: "/" }];

      let currentPathBuilder = "";
      pathParts.forEach((part) => {
        currentPathBuilder += `/${part}`;
        newBreadcrumbs.push({
          name: part.charAt(0).toUpperCase() + part.slice(1),
          path: currentPathBuilder,
        });
      });

      setBreadcrumbs(newBreadcrumbs);
    }
  }, [currentPath]);

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

  const handleFolderClick = (folder: FolderItem) => {
    setCurrentPath(folder.path);
  };

  const handleBreadcrumbClick = (path: string) => {
    setCurrentPath(path);
  };

  const handleBackClick = () => {
    if (currentPath !== "/") {
      const pathParts = currentPath.split("/").filter(Boolean);
      pathParts.pop(); // Remove last part
      const newPath = pathParts.length > 0 ? `/${pathParts.join("/")}` : "/";
      setCurrentPath(newPath);
    }
  };

  const filteredFiles = mediaFiles.filter(
    (file) =>
      file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.alt && file.alt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (file: MediaFile) => {
    onSelect(file);
    onClose();
  };

  const allItems = [...filteredFolders, ...filteredFiles];

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

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPath("/")}
            className="p-1"
          >
            <Home className="h-4 w-4" />
          </Button>

          {currentPath !== "/" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="p-1"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          <div className="flex items-center gap-1">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center">
                {index > 0 && (
                  <span className="text-muted-foreground mx-1">/</span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBreadcrumbClick(crumb.path)}
                  className="text-sm"
                >
                  {crumb.name}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files and folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Files and Folders Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading files...</span>
            </div>
          </div>
        ) : allItems.length === 0 ? (
          <div className="text-center py-12">
            <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No files found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search terms."
                : `No ${fileType} files in this folder.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Folders */}
            {filteredFolders.map((folder) => (
              <Card
                key={folder.path}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => handleFolderClick(folder)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Folder Icon */}
                    <div className="aspect-square rounded-lg bg-blue-50 flex items-center justify-center">
                      <Folder className="h-8 w-8 text-blue-600" />
                    </div>

                    {/* Folder Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-sm line-clamp-2">
                          {folder.name}
                        </p>
                        <Badge className="bg-blue-100 text-blue-800">
                          folder
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Files */}
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

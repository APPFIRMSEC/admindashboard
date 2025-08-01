"use client";

import { useState, useEffect, useCallback } from "react";

export interface MediaFile {
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

export interface FolderItem {
  name: string;
  path: string;
  type: "folder";
  children?: FolderItem[];
}

const defaultFolderTree: FolderItem[] = [
    {
      name: "Images",
      path: "/images",
      type: "folder",
      children: [
        { name: "General", path: "/images/general", type: "folder" },
        { name: "Podcast", path: "/images/podcast", type: "folder" },
        { name: "About", path: "/images/about", type: "folder" },
      ],
    },
    {
      name: "Audio",
      path: "/audio",
      type: "folder",
      children: [
        { name: "General", path: "/audio/general", type: "folder" },
        { name: "Podcast", path: "/audio/podcast", type: "folder" },
      ],
    },
    {
      name: "Video",
      path: "/video",
      type: "folder",
      children: [
        { name: "General", path: "/video/general", type: "folder" },
      ],
    },
    {
      name: "Documents",
      path: "/documents",
      type: "folder",
      children: [
        { name: "General", path: "/documents/general", type: "folder" },
      ],
    },
]


export function useMediaLibrary() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<"single" | "bulk" | null>(
    null
  );
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");
  const [folderTree] = useState<FolderItem[]>(defaultFolderTree);

  const fetchMediaFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/media?path=${encodeURIComponent(currentPath)}&search=${encodeURIComponent(searchTerm)}`
      );
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
  }, [currentPath, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchMediaFiles();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchMediaFiles]);

  const handleUploadFiles = async () => {
    if (pendingFiles.length === 0) return;
    setIsUploading(true);
    const uploadPromises = pendingFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", currentPath.split("/")[1] || "general");
      formData.append("subcategory", currentPath.split("/")[2] || "");
      formData.append("alt", file.name);
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`Failed to upload ${file.name}`);
      return response.json();
    });

    try {
      await Promise.all(uploadPromises);
      setPendingFiles([]);
      fetchMediaFiles();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/media/${fileId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete file");
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
      fetchMediaFiles();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
      setFileToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      const deletePromises = selectedFiles.map(async (fileId) => {
        const response = await fetch(`/api/media/${fileId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error(`Failed to delete file ${fileId}`);
      });
      await Promise.all(deletePromises);
      setSelectedFiles([]);
      fetchMediaFiles();
    } catch (error) {
      console.error("Bulk delete error:", error);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const navigateToFolder = (path: string) => {
    setCurrentPath(path);
    setSelectedFiles([]);
  };
  
  const handleFileSelectFromGrid = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };
  
  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPendingFiles((prev) => [...prev, ...files]);
  };

  return {
    mediaFiles,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedFiles,
    setSelectedFiles,
    isUploading,
    pendingFiles,
    setPendingFiles,
    isDeleting,
    deleteConfirm,
    setDeleteConfirm,
    fileToDelete,
    setFileToDelete,
    currentPath,
    folderTree,
    fetchMediaFiles,
    handleUploadFiles,
    handleDeleteFile,
    handleBulkDelete,
    navigateToFolder,
    handleFileSelectFromGrid,
    handleFileUploadChange,
  };
}
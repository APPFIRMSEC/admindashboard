"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMediaLibrary } from "@/hooks/use-media-library";
import { FolderSidebar } from "./media-library/FolderSidebar";
import { Breadcrumb } from "./media-library/Breadcrumb";
import { FileGrid } from "./media-library/FileGrid";
import { DeleteDialog } from "./media-library/DeleteDialog";
import { BulkActions } from "./media-library/BulkActions";
import { UploadModal } from "./media-library/UploadModal";
import { useState } from "react";
import { Upload } from "lucide-react";

export function MediaLibrary() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const {
    mediaFiles,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedFiles,
    setSelectedFiles,
    isDeleting,
    deleteConfirm,
    setDeleteConfirm,
    fileToDelete,
    setFileToDelete,
    currentPath,
    folderTree,
    navigateToFolder,
    handleDeleteFile,
    handleBulkDelete,
    handleFileSelectFromGrid,
    fetchMediaFiles,
  } = useMediaLibrary();

  const getCurrentSubFolders = () => {
    if (currentPath === "/") return folderTree;
    const pathParts = currentPath.split("/").filter(Boolean);
    let currentLevel = folderTree;
    for (const part of pathParts) {
      const folder = currentLevel?.find(
        (f) => f.name.toLowerCase() === part.toLowerCase()
      );
      if (folder && folder.children) {
        currentLevel = folder.children;
      } else {
        return [];
      }
    }
    return currentLevel ?? [];
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">
            A File-Explorer like interface to manage all your media assets
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Folders</CardTitle>
            </CardHeader>
            <CardContent>
              <FolderSidebar
                folderTree={folderTree}
                currentPath={currentPath}
                navigateToFolder={navigateToFolder}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-3">
            <Breadcrumb
              currentPath={currentPath}
              navigateToFolder={navigateToFolder}
            />
            <div className="flex items-center gap-2 ml-auto">
              <Input
                placeholder="Search in current folder..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button
                size="sm"
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>
                Browse and manage your media files in the current folder.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileGrid
                files={mediaFiles}
                folders={getCurrentSubFolders()}
                isLoading={isLoading}
                selectedFiles={selectedFiles}
                handleFileSelectFromGrid={handleFileSelectFromGrid}
                navigateToFolder={navigateToFolder}
                setFileToDelete={setFileToDelete}
                setDeleteConfirm={setDeleteConfirm}
              />
            </CardContent>
          </Card>

          <BulkActions
            selectedFilesCount={selectedFiles.length}
            isDeleting={isDeleting}
            setDeleteConfirm={setDeleteConfirm}
            clearSelection={() => setSelectedFiles([])}
          />
        </div>
      </div>

      <DeleteDialog
        deleteConfirm={deleteConfirm}
        isDeleting={isDeleting}
        selectedFilesCount={selectedFiles.length}
        handleBulkDelete={handleBulkDelete}
        handleDeleteFile={handleDeleteFile}
        fileToDelete={fileToDelete}
        setDeleteConfirm={setDeleteConfirm}
      />

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        currentPath={currentPath}
        onUploadComplete={() => {
          setShowUploadModal(false);
          fetchMediaFiles();
        }}
      />
    </div>
  );
}

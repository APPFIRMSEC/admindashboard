"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMediaLibrary, FolderItem } from "@/hooks/use-media-library";
import { FolderSidebar } from "./media-library/FolderSidebar";
import { Breadcrumb } from "./media-library/Breadcrumb";
import { UploadSection } from "./media-library/UploadSection";
import { FileGrid } from "./media-library/FileGrid";
import { DeleteDialog } from "./media-library/DeleteDialog";
import { BulkActions } from "./media-library/BulkActions";

export function MediaLibrary() {
  const {
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
    navigateToFolder,
    handleUploadFiles,
    handleDeleteFile,
    handleBulkDelete,
    handleFileSelectFromGrid,
    handleFileUploadChange,
    fetchMediaFiles,
  } = useMediaLibrary();

  const getCurrentSubFolders = (): FolderItem[] => {
    if (currentPath === "/") return folderTree;
    const pathParts = currentPath.split("/").filter(Boolean);
    let currentLevel: FolderItem[] | undefined = folderTree;
    for (const part of pathParts) {
      const folder = currentLevel?.find(
        (f) => f.name.toLowerCase() === part.toLowerCase()
      );
      if (folder) {
        currentLevel = folder.children;
      } else {
        return [];
      }
    }
    return currentLevel || [];
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

      <Breadcrumb
        currentPath={currentPath}
        navigateToFolder={navigateToFolder}
      />

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

        <div className="lg:col-span-3 space-y-6">
          <UploadSection
            pendingFiles={pendingFiles}
            isUploading={isUploading}
            handleFileUploadChange={handleFileUploadChange}
            handleUploadFiles={handleUploadFiles}
            setPendingFiles={setPendingFiles}
            currentPath={currentPath}
          />

          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>
                Browse and manage your media files in the current folder.
              </CardDescription>
              <Input
                placeholder="Search in current folder..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
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
    </div>
  );
}

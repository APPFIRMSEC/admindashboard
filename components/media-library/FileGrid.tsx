"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  File,
  Image as ImageIcon,
  FileText,
  Folder,
  Download,
  Copy,
  Trash2,
  Loader2,
  Edit,
  Type,
  Move,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaFile, FolderItem } from "@/hooks/use-media-library";
import { useState } from "react";
import { MoveDialog } from "./MoveDialog";

interface FileGridProps {
  files: MediaFile[];
  folders: FolderItem[];
  isLoading: boolean;
  selectedFiles: string[];
  handleFileSelectFromGrid: (id: string) => void;
  navigateToFolder: (path: string) => void;
  setFileToDelete: (id: string) => void;
  setDeleteConfirm: (type: "single" | "bulk" | null) => void;
}

export function FileGrid({
  files,
  folders,
  isLoading,
  selectedFiles,
  handleFileSelectFromGrid,
  navigateToFolder,
  setFileToDelete,
  setDeleteConfirm,
}: FileGridProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: MediaFile | FolderItem | null;
    type: "file" | "folder" | null;
  } | null>(null);
  const [moveDialog, setMoveDialog] = useState<{
    isOpen: boolean;
    file: MediaFile | null;
  }>({ isOpen: false, file: null });

  const getFileIcon = (type: string) => {
    const icons = {
      image: <ImageIcon className="h-10 w-10 text-muted-foreground" />,
      audio: <File className="h-10 w-10 text-muted-foreground" />,
      video: <File className="h-10 w-10 text-muted-foreground" />,
      document: <FileText className="h-10 w-10 text-muted-foreground" />,
    };
    return icons[type as keyof typeof icons] || <File className="h-10 w-10" />;
  };

  const getFileTypeBadge = (type: string) => {
    const variants = {
      image: "bg-blue-100 text-blue-800",
      audio: "bg-green-100 text-green-800",
      video: "bg-purple-100 text-purple-800",
      document: "bg-orange-100 text-orange-800",
    };
    return (
      <Badge
        className={variants[type as keyof typeof variants] || "bg-gray-100"}
      >
        {type}
      </Badge>
    );
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    item: MediaFile | FolderItem,
    type: "file" | "folder"
  ) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      type,
    });
  };

  const handleDoubleClick = (
    item: MediaFile | FolderItem,
    type: "file" | "folder"
  ) => {
    if (type === "folder") {
      navigateToFolder((item as FolderItem).path);
    } else {
      // Open file in new tab
      window.open((item as MediaFile).url, "_blank");
    }
  };

  const handleClick = (
    e: React.MouseEvent,
    item: MediaFile | FolderItem,
    type: "file" | "folder"
  ) => {
    if (type === "file") {
      handleFileSelectFromGrid((item as MediaFile).id);
    }
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleContextMenuAction = async (action: string) => {
    if (!contextMenu?.item) return;

    const item = contextMenu.item;

    switch (action) {
      case "download":
        if (contextMenu.type === "file") {
          window.open((item as MediaFile).url, "_blank");
        }
        break;

      case "copy-link":
        if (contextMenu.type === "file") {
          navigator.clipboard.writeText((item as MediaFile).url);
        }
        break;

      case "delete":
        if (contextMenu.type === "file") {
          setFileToDelete((item as MediaFile).id);
          setDeleteConfirm("single");
        }
        break;

      case "move":
        if (contextMenu.type === "file") {
          setMoveDialog({ isOpen: true, file: item as MediaFile });
        }
        break;

      case "rename":
        // TODO: Implement rename functionality
        console.log("Rename functionality to be implemented");
        break;
    }

    closeContextMenu();
  };

  const handleMoveFile = async (fileId: string, newPath: string) => {
    try {
      const response = await fetch(`/api/media/${fileId}/move`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPath }),
      });

      if (!response.ok) {
        throw new Error("Failed to move file");
      }

      // Refresh the file list
      window.location.reload();
    } catch (error) {
      console.error("Error moving file:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (folders.length === 0 && files.length === 0) {
    return (
      <div className="text-center py-12">
        <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">Empty Folder</h3>
        <p className="text-muted-foreground">
          This folder is empty. Upload some files to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Render Folders */}
        {folders.map((folder) => (
          <Card
            key={folder.path}
            className="cursor-pointer transition-all hover:shadow-md flex flex-col items-center justify-center p-4"
            onClick={(e) => handleClick(e, folder, "folder")}
            onDoubleClick={() => handleDoubleClick(folder, "folder")}
            onContextMenu={(e) => handleContextMenu(e, folder, "folder")}
          >
            <Folder className="h-16 w-16 text-yellow-500" />
            <p className="font-medium text-sm mt-2 text-center truncate w-full">
              {folder.name}
            </p>
          </Card>
        ))}

        {/* Render Files */}
        {files.map((file) => (
          <Card
            key={file.id}
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
              selectedFiles.includes(file.id) ? "ring-2 ring-primary" : ""
            }`}
            onClick={(e) => handleClick(e, file, "file")}
            onDoubleClick={() => handleDoubleClick(file, "file")}
            onContextMenu={(e) => handleContextMenu(e, file, "file")}
          >
            <CardContent className="p-4 space-y-3">
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {file.type === "image" ? (
                  <Image
                    src={file.url}
                    alt={file.alt || file.originalName}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getFileIcon(file.type)
                )}
              </div>

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
                </div>
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(file.url, "_blank");
                  }}
                >
                  <Download className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(file.url);
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileToDelete(file.id);
                    setDeleteConfirm("single");
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white border rounded-lg shadow-lg py-2 min-w-[200px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={closeContextMenu}
        >
          {contextMenu.type === "folder" ? (
            <>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleContextMenuAction("rename")}
              >
                <Edit className="h-4 w-4" />
                Rename
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleContextMenuAction("move")}
              >
                <Move className="h-4 w-4" />
                Move
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                onClick={() => handleContextMenuAction("delete")}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleContextMenuAction("download")}
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleContextMenuAction("copy-link")}
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleContextMenuAction("rename")}
              >
                <Type className="h-4 w-4" />
                Rename
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleContextMenuAction("move")}
              >
                <Move className="h-4 w-4" />
                Move
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                onClick={() => handleContextMenuAction("delete")}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </>
          )}
        </div>
      )}

      {/* Click outside to close context menu */}
      {contextMenu && (
        <div className="fixed inset-0 z-40" onClick={closeContextMenu} />
      )}

      {/* Move Dialog */}
      <MoveDialog
        isOpen={moveDialog.isOpen}
        onClose={() => setMoveDialog({ isOpen: false, file: null })}
        file={moveDialog.file}
        onMove={handleMoveFile}
      />
    </>
  );
}

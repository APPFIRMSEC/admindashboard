"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, ChevronRight, Loader2 } from "lucide-react";
import { MediaFile } from "@/hooks/use-media-library";

interface MoveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  file: MediaFile | null;
  onMove: (fileId: string, newPath: string) => Promise<void>;
}

const AVAILABLE_FOLDERS = [
  { path: "/", name: "Root" },
  { path: "/images", name: "Images" },
  { path: "/images/general", name: "Images > General" },
  { path: "/images/podcast", name: "Images > Podcast" },
  { path: "/images/about", name: "Images > About" },
  { path: "/audio", name: "Audio" },
  { path: "/audio/general", name: "Audio > General" },
  { path: "/audio/episodes", name: "Audio > Episodes" },
  { path: "/video", name: "Video" },
  { path: "/video/general", name: "Video > General" },
  { path: "/documents", name: "Documents" },
  { path: "/documents/general", name: "Documents > General" },
];

export function MoveDialog({ isOpen, onClose, file, onMove }: MoveDialogProps) {
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [isMoving, setIsMoving] = useState(false);

  const handleMove = async () => {
    if (!file || !selectedPath) return;

    setIsMoving(true);
    try {
      await onMove(file.id, selectedPath);
      onClose();
    } catch (error) {
      console.error("Failed to move file:", error);
    } finally {
      setIsMoving(false);
    }
  };

  const handleFolderSelect = (path: string) => {
    setSelectedPath(path);
  };

  if (!file || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Move "{file.originalName}"</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Select a destination folder:
            </p>

            <div className="max-h-60 overflow-y-auto border rounded-md">
              {AVAILABLE_FOLDERS.map((folder) => (
                <button
                  key={folder.path}
                  className={`w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-2 ${
                    selectedPath === folder.path
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                  onClick={() => handleFolderSelect(folder.path)}
                >
                  <Folder className="h-4 w-4" />
                  <span className="flex-1">{folder.name}</span>
                  {selectedPath === folder.path && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isMoving}>
              Cancel
            </Button>
            <Button onClick={handleMove} disabled={!selectedPath || isMoving}>
              {isMoving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Moving...
                </>
              ) : (
                "Move File"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

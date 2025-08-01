"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface DeleteDialogProps {
  deleteConfirm: "single" | "bulk" | null;
  isDeleting: boolean;
  selectedFilesCount: number;
  handleBulkDelete: () => void;
  handleDeleteFile: (id: string) => void;
  fileToDelete: string | null;
  setDeleteConfirm: (type: "single" | "bulk" | null) => void;
}

export function DeleteDialog({
  deleteConfirm,
  isDeleting,
  selectedFilesCount,
  handleBulkDelete,
  handleDeleteFile,
  fileToDelete,
  setDeleteConfirm,
}: DeleteDialogProps) {
  if (!deleteConfirm) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            {deleteConfirm === "bulk"
              ? `Are you sure you want to delete ${selectedFilesCount} file${
                  selectedFilesCount > 1 ? "s" : ""
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
                } else if (fileToDelete) {
                  handleDeleteFile(fileToDelete);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

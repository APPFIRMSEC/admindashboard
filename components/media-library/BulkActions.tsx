"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface BulkActionsProps {
  selectedFilesCount: number;
  isDeleting: boolean;
  setDeleteConfirm: (type: "single" | "bulk" | null) => void;
  clearSelection: () => void;
}

export function BulkActions({
  selectedFilesCount,
  isDeleting,
  setDeleteConfirm,
  clearSelection,
}: BulkActionsProps) {
  if (selectedFilesCount === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected Files ({selectedFilesCount})</CardTitle>
        <CardDescription>Actions for selected files</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={() => setDeleteConfirm("bulk")}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete Selected
          </Button>
          <Button variant="outline" onClick={clearSelection}>
            Clear Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Upload, Trash2 } from "lucide-react";

interface UploadSectionProps {
  pendingFiles: File[];
  isUploading: boolean;
  handleFileUploadChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadFiles: () => void;
  setPendingFiles: React.Dispatch<React.SetStateAction<File[]>>;
  currentPath: string;
}

export function UploadSection({
  pendingFiles,
  isUploading,
  handleFileUploadChange,
  handleUploadFiles,
  setPendingFiles,
  currentPath,
}: UploadSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
        <CardDescription>
          Upload files to the current folder: <strong>{currentPath}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="file"
            multiple
            onChange={handleFileUploadChange}
            accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
            className="flex-1"
          />
          <Button
            onClick={handleUploadFiles}
            disabled={pendingFiles.length === 0 || isUploading}
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload {pendingFiles.length > 0 && `(${pendingFiles.length})`}
          </Button>
        </div>

        {pendingFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Files to Upload:</h4>
            <div className="space-y-2">
              {pendingFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded"
                >
                  <span className="text-sm truncate">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setPendingFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

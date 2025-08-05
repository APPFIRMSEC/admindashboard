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

export default function TestApiPage() {
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    file: {
      id: string;
      name: string;
      originalName: string;
      type: string;
      url: string;
      size: string;
      mimeType: string;
      alt: string;
      uploadedAt: string;
    };
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Media list test
  const [mediaFiles, setMediaFiles] = useState<
    Array<{
      id: string;
      name: string;
      originalName: string;
      type: string;
      url: string;
      size: string;
      mimeType: string;
      alt?: string;
      uploadedAt: string;
    }>
  >([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [filesError, setFilesError] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "test");
      formData.append("subcategory", "general");
      formData.append("alt", "Test upload");

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadResult(result);
      // Refresh the file list after upload
      fetchMediaFiles();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchMediaFiles = async () => {
    setIsLoadingFiles(true);
    setFilesError(null);

    try {
      const response = await fetch("/api/media");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch files");
      }

      setMediaFiles(result.files);
    } catch (error) {
      setFilesError(
        error instanceof Error ? error.message : "Failed to fetch files"
      );
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const deleteSeedData = async () => {
    try {
      const response = await fetch("/api/media/seed-cleanup", {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchMediaFiles();
        alert("Seed data deleted successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch {
      alert("Failed to delete seed data");
    }
  };

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">API Testing</h1>

      {/* Media Upload Test */}
      <Card>
        <CardHeader>
          <CardTitle>Test Media Upload</CardTitle>
          <CardDescription>Test the new media upload API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select a file to upload:
            </label>
            <Input
              type="file"
              onChange={handleFileUpload}
              disabled={isUploading}
              accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
            />
          </div>

          {isUploading && <div className="text-blue-600">Uploading...</div>}

          {uploadError && (
            <div className="text-red-600 p-4 border border-red-200 rounded-lg">
              Error: {uploadError}
            </div>
          )}

          {uploadResult && (
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <h3 className="font-medium text-green-800 mb-2">
                Upload Successful!
              </h3>
              <pre className="text-sm text-green-700 overflow-auto">
                {JSON.stringify(uploadResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media List Test */}
      <Card>
        <CardHeader>
          <CardTitle>Test Media List API</CardTitle>
          <CardDescription>
            Test fetching media files from database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={fetchMediaFiles} disabled={isLoadingFiles}>
              {isLoadingFiles ? "Loading..." : "Refresh Files"}
            </Button>
            <Button onClick={deleteSeedData} variant="destructive">
              Delete Seed Data
            </Button>
            <span className="text-sm text-muted-foreground">
              {mediaFiles.length} files found
            </span>
          </div>

          {filesError && (
            <div className="text-red-600 p-4 border border-red-200 rounded-lg">
              Error: {filesError}
            </div>
          )}

          {mediaFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Uploaded Files:</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {mediaFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 border rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {file.type}
                      </span>
                      <span className="font-medium">{file.originalName}</span>
                      <span className="text-sm text-muted-foreground">
                        ({file.size})
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

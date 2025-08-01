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
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Save, UserPlus, Trash2, FolderOpen } from "lucide-react";
import { useSiteContext } from "@/contexts/site-context";
import { MediaLibraryPicker } from "./media-library-picker";

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

interface AboutData {
  mission: string;
  vision: string;
  about: string;
  imageUrl: string;
  team: TeamMember[];
}

interface FileWithPreview {
  file: File;
  preview: string;
}

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
  uploader?: {
    id: string;
    name: string;
    email: string;
  };
}

export function EditAboutPage() {
  const { currentSite } = useSiteContext();

  // Initial empty data structure
  const initialData: AboutData = {
    mission: "",
    vision: "",
    about: "",
    imageUrl: "",
    team: [],
  };

  const [formData, setFormData] = useState<AboutData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [newTeam, setNewTeam] = useState<TeamMember>({
    name: "",
    role: "",
    imageUrl: "",
  });

  // Media Library picker states
  const [showMainImagePicker, setShowMainImagePicker] = useState(false);
  const [showTeamImagePicker, setShowTeamImagePicker] = useState<number | null>(
    null
  );
  const [showNewTeamImagePicker, setShowNewTeamImagePicker] = useState(false);

  // Store files for upload on save
  const [mainImageFile, setMainImageFile] = useState<FileWithPreview | null>(
    null
  );
  const [teamImageFiles, setTeamImageFiles] = useState<
    Map<number, FileWithPreview>
  >(new Map());
  const [newTeamImageFile, setNewTeamImageFile] =
    useState<FileWithPreview | null>(null);

  // Track images to delete on save
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // Fetch about data on component load
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(`/api/about?siteId=${currentSite}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchAboutData();
  }, [currentSite]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (mainImageFile) URL.revokeObjectURL(mainImageFile.preview);
      teamImageFiles.forEach((fileWithPreview) => {
        URL.revokeObjectURL(fileWithPreview.preview);
      });
      if (newTeamImageFile) URL.revokeObjectURL(newTeamImageFile.preview);
    };
  }, [mainImageFile, teamImageFiles, newTeamImageFile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Media Library file selection for main image
  const handleMainImageSelect = (file: MediaFile) => {
    setFormData((prev) => ({ ...prev, imageUrl: file.url }));
  };

  // Handle Media Library file selection for team member image
  const handleTeamImageSelect = (file: MediaFile, idx: number) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.map((member, i) =>
        i === idx ? { ...member, imageUrl: file.url } : member
      ),
    }));
  };

  // Handle Media Library file selection for new team member image
  const handleNewTeamImageSelect = (file: MediaFile) => {
    setNewTeam((prev) => ({ ...prev, imageUrl: file.url }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cleanup previous preview
      if (mainImageFile) URL.revokeObjectURL(mainImageFile.preview);

      const preview = URL.createObjectURL(file);
      setMainImageFile({ file, preview });
      setFormData((prev) => ({ ...prev, imageUrl: preview }));
    }
  };

  const handleTeamImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cleanup previous preview
      const existingFile = teamImageFiles.get(idx);
      if (existingFile) URL.revokeObjectURL(existingFile.preview);

      const preview = URL.createObjectURL(file);

      setTeamImageFiles((prev) => {
        const newMap = new Map(prev);
        newMap.set(idx, { file, preview });
        return newMap;
      });

      setFormData((prev) => ({
        ...prev,
        team: prev.team.map((member, i) =>
          i === idx ? { ...member, imageUrl: preview } : member
        ),
      }));
    }
  };

  const handleTeamChange = (idx: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.map((member, i) =>
        i === idx ? { ...member, [field]: value } : member
      ),
    }));
  };

  const handleAddTeam = () => {
    if (newTeam.name && newTeam.role) {
      setFormData((prev) => ({ ...prev, team: [...prev.team, newTeam] }));

      // Move new team image file to the team files map
      if (newTeamImageFile) {
        const newIndex = formData.team.length;
        setTeamImageFiles(
          (prev) => new Map(prev.set(newIndex, newTeamImageFile))
        );
        setNewTeamImageFile(null);
      }

      setNewTeam({ name: "", role: "", imageUrl: "" });
    }
  };

  const handleRemoveTeam = async (idx: number) => {
    const memberToRemove = formData.team[idx];

    // Track the team member's image for deletion on save if it's a stored image
    if (
      memberToRemove?.imageUrl &&
      memberToRemove.imageUrl !== "/placeholder.png" &&
      !memberToRemove.imageUrl.startsWith("blob:")
    ) {
      setImagesToDelete((prev) => [...prev, memberToRemove.imageUrl]);
    }

    // Cleanup local file preview
    const existingFile = teamImageFiles.get(idx);
    if (existingFile) {
      URL.revokeObjectURL(existingFile.preview);
      setTeamImageFiles((prev) => {
        const newMap = new Map(prev);
        newMap.delete(idx);
        return newMap;
      });
    }

    setFormData((prev) => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== idx),
    }));
  };

  const handleNewTeamImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cleanup previous preview
      if (newTeamImageFile) URL.revokeObjectURL(newTeamImageFile.preview);

      const preview = URL.createObjectURL(file);
      setNewTeamImageFile({ file, preview });
      setNewTeam((prev) => ({ ...prev, imageUrl: preview }));
    }
  };

  const handleDeleteImage = async (
    imageUrl: string,
    type: "main" | "team",
    teamIndex?: number
  ) => {
    if (!imageUrl || imageUrl === "/placeholder.png") {
      return;
    }

    // Check if it's a local preview (blob URL)
    const isLocalPreview = imageUrl.startsWith("blob:");

    // If it's a local preview, just clear it immediately
    if (isLocalPreview) {
      if (type === "main") {
        if (mainImageFile) URL.revokeObjectURL(mainImageFile.preview);
        setMainImageFile(null);
        setFormData((prev) => ({ ...prev, imageUrl: "" }));
      } else if (type === "team" && teamIndex !== undefined) {
        const existingFile = teamImageFiles.get(teamIndex);
        if (existingFile) URL.revokeObjectURL(existingFile.preview);
        setTeamImageFiles((prev) => {
          const newMap = new Map(prev);
          newMap.delete(teamIndex);
          return newMap;
        });
        setFormData((prev) => ({
          ...prev,
          team: prev.team.map((member, i) =>
            i === teamIndex ? { ...member, imageUrl: "" } : member
          ),
        }));
      }
      return;
    }

    // If it's a stored image, track it for deletion on save and update UI immediately
    if (!isLocalPreview) {
      // Add to images to delete on save
      setImagesToDelete((prev) => [...prev, imageUrl]);

      // Update UI immediately
      if (type === "main") {
        setFormData((prev) => ({ ...prev, imageUrl: "" }));
      } else if (type === "team" && teamIndex !== undefined) {
        setFormData((prev) => ({
          ...prev,
          team: prev.team.map((member, i) =>
            i === teamIndex ? { ...member, imageUrl: "" } : member
          ),
        }));
      }
    }
  };

  const uploadFiles = async () => {
    const uploadPromises: Promise<{
      type: string;
      index?: number;
      url: string;
    }>[] = [];

    // Upload main image if selected
    if (mainImageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append("image", mainImageFile.file);
      uploadFormData.append("oldImageUrl", formData.imageUrl || "");

      uploadPromises.push(
        fetch("/api/about/upload-image", {
          method: "POST",
          body: uploadFormData,
        }).then(async (response) => {
          if (!response.ok) throw new Error("Failed to upload main image");
          const data = await response.json();
          return { type: "main", url: data.imageUrl };
        })
      );
    }

    // Upload team member images
    for (const [index, fileWithPreview] of teamImageFiles) {
      const uploadFormData = new FormData();
      uploadFormData.append("image", fileWithPreview.file);
      uploadFormData.append(
        "oldImageUrl",
        formData.team[index]?.imageUrl || ""
      );

      uploadPromises.push(
        fetch("/api/about/upload-image", {
          method: "POST",
          body: uploadFormData,
        }).then(async (response) => {
          if (!response.ok)
            throw new Error(`Failed to upload team image ${index}`);
          const data = await response.json();
          return { type: "team", index, url: data.imageUrl };
        })
      );
    }

    // Upload new team member image if selected
    if (newTeamImageFile) {
      const uploadFormData = new FormData();
      uploadFormData.append("image", newTeamImageFile.file);
      uploadFormData.append("oldImageUrl", newTeam.imageUrl || "");

      uploadPromises.push(
        fetch("/api/about/upload-image", {
          method: "POST",
          body: uploadFormData,
        }).then(async (response) => {
          if (!response.ok) throw new Error("Failed to upload new team image");
          const data = await response.json();
          return { type: "newTeam", url: data.imageUrl };
        })
      );
    }

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload all files first
      const uploadResults = await uploadFiles();

      // Update form data with uploaded URLs
      const updatedFormData = { ...formData };

      for (const result of uploadResults) {
        if (result.type === "main") {
          updatedFormData.imageUrl = result.url;
        } else if (result.type === "team" && result.index !== undefined) {
          updatedFormData.team[result.index].imageUrl = result.url;
        } else if (result.type === "newTeam") {
          // Update the new team member that was just added
          const lastIndex = updatedFormData.team.length - 1;
          if (lastIndex >= 0) {
            updatedFormData.team[lastIndex].imageUrl = result.url;
          }
        }
      }

      // Save to database
      const response = await fetch("/api/about", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId: currentSite,
          ...updatedFormData,
        }),
      });

      if (response.ok) {
        // Delete tracked images from storage
        if (imagesToDelete.length > 0) {
          const deletePromises = imagesToDelete.map(async (imageUrl) => {
            try {
              const deleteResponse = await fetch("/api/about/delete-image", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl }),
              });
              if (!deleteResponse.ok) {
                console.error(`Failed to delete image: ${imageUrl}`);
              }
            } catch (error) {
              console.error(`Error deleting image ${imageUrl}:`, error);
            }
          });

          await Promise.all(deletePromises);
          setImagesToDelete([]); // Clear the tracked images
        }

        // Clear all file states after successful save
        if (mainImageFile) URL.revokeObjectURL(mainImageFile.preview);
        setMainImageFile(null);

        teamImageFiles.forEach((fileWithPreview) => {
          URL.revokeObjectURL(fileWithPreview.preview);
        });
        setTeamImageFiles(new Map());

        if (newTeamImageFile) URL.revokeObjectURL(newTeamImageFile.preview);
        setNewTeamImageFile(null);

        alert("About page updated successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error saving about data:", error);
      alert("Failed to save about page data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Loading about page data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit About Page</h1>
          <p className="text-muted-foreground">
            Update the about, mission, vision, and team for your site
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Mission</CardTitle>
            <CardDescription>
              What drives your organization or brand?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="about-mission"
              placeholder="Our mission is..."
              value={formData.mission}
              onChange={(e) => handleInputChange("mission", e.target.value)}
              rows={2}
              required
            />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Vision</CardTitle>
            <CardDescription>
              Where are you going? What do you aspire to?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="about-vision"
              placeholder="Our vision is..."
              value={formData.vision}
              onChange={(e) => handleInputChange("vision", e.target.value)}
              rows={2}
              required
            />
          </CardContent>
        </Card>
        <Card className="w-full lg:col-span-2">
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>
              Tell your story or describe your brand
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="about-description"
              placeholder="Write about your site or yourself..."
              value={formData.about}
              onChange={(e) => handleInputChange("about", e.target.value)}
              rows={5}
              required
            />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Main Image</CardTitle>
            <CardDescription>
              Upload a main image for your About page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  id="about-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMainImagePicker(true)}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Select from Media Library
                </Button>
              </div>
              {formData.imageUrl && (
                <div className="flex items-center gap-2">
                  <Image
                    src={formData.imageUrl || "/placeholder.png"}
                    alt="About"
                    width={256}
                    height={128}
                    className="rounded w-full max-w-xs h-32 object-cover border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteImage(formData.imageUrl, "main")}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="w-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Add, edit, or remove team members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.team.map((member, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center gap-4 border rounded-lg p-3"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <Image
                      src={member.imageUrl || "/placeholder.png"}
                      alt={member.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover border"
                    />
                    {member.imageUrl &&
                      member.imageUrl !== "/placeholder.png" && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            handleDeleteImage(member.imageUrl, "team", idx)
                          }
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleTeamImageChange(e, idx)}
                      className="w-32"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTeamImagePicker(idx)}
                      className="w-32"
                    >
                      <FolderOpen className="mr-1 h-3 w-3" />
                      Media Library
                    </Button>
                  </div>
                </div>
                <div className="flex-1 w-full grid gap-2">
                  <Input
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) =>
                      handleTeamChange(idx, "name", e.target.value)
                    }
                    required
                  />
                  <Input
                    placeholder="Role"
                    value={member.role}
                    onChange={(e) =>
                      handleTeamChange(idx, "role", e.target.value)
                    }
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveTeam(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row items-center gap-4 border rounded-lg p-3 bg-muted/50">
              <div className="flex flex-col items-center gap-2">
                <Image
                  src={newTeam.imageUrl || "/placeholder.png"}
                  alt="New Member"
                  width={64}
                  height={64}
                  className="rounded-full object-cover border"
                />
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleNewTeamImageChange}
                    className="w-32"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewTeamImagePicker(true)}
                    className="w-32"
                  >
                    <FolderOpen className="mr-1 h-3 w-3" />
                    Media Library
                  </Button>
                </div>
              </div>
              <div className="flex-1 w-full grid gap-2">
                <Input
                  placeholder="Name"
                  value={newTeam.name}
                  onChange={(e) =>
                    setNewTeam((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <Input
                  placeholder="Role"
                  value={newTeam.role}
                  onChange={(e) =>
                    setNewTeam((prev) => ({ ...prev, role: e.target.value }))
                  }
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddTeam}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="col-span-1 lg:col-span-2">
          <Button type="submit" disabled={isLoading} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {/* Media Library Pickers */}
      {showMainImagePicker && (
        <MediaLibraryPicker
          fileType="image"
          onSelect={handleMainImageSelect}
          onClose={() => setShowMainImagePicker(false)}
          title="Select Main Image"
          description="Choose an image from your media library"
        />
      )}

      {showTeamImagePicker !== null && (
        <MediaLibraryPicker
          fileType="image"
          onSelect={(file) => handleTeamImageSelect(file, showTeamImagePicker)}
          onClose={() => setShowTeamImagePicker(null)}
          title="Select Team Member Image"
          description="Choose an image from your media library"
        />
      )}

      {showNewTeamImagePicker && (
        <MediaLibraryPicker
          fileType="image"
          onSelect={handleNewTeamImageSelect}
          onClose={() => setShowNewTeamImagePicker(false)}
          title="Select New Team Member Image"
          description="Choose an image from your media library"
        />
      )}
    </div>
  );
}

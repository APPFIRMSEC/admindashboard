"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Save } from "lucide-react";
import { useSiteContext } from "@/contexts/site-context";

export function EditAboutPage() {
  const { currentSite } = useSiteContext();
  // Mock initial data per site
  const initialData = currentSite === "appfirmsec"
    ? {
        title: "About AppFirmSec",
        description: "We are a leading app security firm...",
        imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=200&q=80"
      }
    : {
        title: "About Ennie Boateng",
        description: "Ennie Boateng is a passionate blogger and engineer...",
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=facearea&w=400&h=200&q=80"
      };

  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // In a real app, save to backend here
    alert("About page updated!");
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit About Page</h1>
          <p className="text-muted-foreground">Update the about section for your site</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>About Content</CardTitle>
            <CardDescription>Update the title, description, and image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about-title">Title</Label>
              <Input
                id="about-title"
                placeholder="About Title"
                value={formData.title}
                onChange={e => handleInputChange("title", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about-description">Description</Label>
              <Textarea
                id="about-description"
                placeholder="Write about your site or yourself..."
                value={formData.description}
                onChange={e => handleInputChange("description", e.target.value)}
                rows={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about-image">Image</Label>
              <Input
                id="about-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.imageUrl && (
                <Image src={formData.imageUrl} alt="About" width={256} height={128} className="mt-2 rounded w-full max-w-xs h-32 object-cover border" />
              )}
            </div>
          </CardContent>
        </Card>
        <Button type="submit" disabled={isLoading} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
} 
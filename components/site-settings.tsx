"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Save, 
  Globe,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  RefreshCw
} from "lucide-react";

export function SiteSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Site Information
    siteName: "My Company",
    siteDescription: "A modern company website with blog and podcast",
    siteUrl: "https://mycompany.com",
    
    // Contact Information
    contactEmail: "contact@mycompany.com",
    contactPhone: "+1 (555) 123-4567",
    contactAddress: "123 Business St, City, State 12345",
    
    // Social Media
    facebookUrl: "https://facebook.com/mycompany",
    twitterUrl: "https://twitter.com/mycompany",
    instagramUrl: "https://instagram.com/mycompany",
    linkedinUrl: "https://linkedin.com/company/mycompany",
    
    // Homepage Content
    heroTitle: "Welcome to Our Company",
    heroSubtitle: "We create amazing digital experiences",
    heroButtonText: "Learn More",
    heroButtonUrl: "/about",
    
    // About Page
    aboutTitle: "About Our Company",
    aboutContent: "We are a passionate team dedicated to creating innovative solutions...",
    
    // Blog Settings
    blogTitle: "Our Blog",
    blogDescription: "Latest insights and updates from our team",
    postsPerPage: "6",
    
    // Podcast Settings
    podcastTitle: "Our Podcast",
    podcastDescription: "Listen to our latest episodes",
    episodesPerPage: "12"
  });

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you'd save to your backend here
    console.log("Saving settings:", settings);
    
    setIsLoading(false);
  };

  const handleRebuild = async () => {
    setIsLoading(true);
    
    // Simulate rebuild trigger
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you'd trigger a site rebuild here
    console.log("Triggering site rebuild...");
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-muted-foreground">
            Manage your website configuration and global settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRebuild} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Rebuild Site
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Site Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Site Information
            </CardTitle>
            <CardDescription>Basic information about your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteUrl">Site URL</Label>
              <Input
                id="siteUrl"
                value={settings.siteUrl}
                onChange={(e) => handleInputChange("siteUrl", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>How visitors can get in touch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactAddress">Address</Label>
              <Textarea
                id="contactAddress"
                value={settings.contactAddress}
                onChange={(e) => handleInputChange("contactAddress", e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebookUrl" className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                Facebook URL
              </Label>
              <Input
                id="facebookUrl"
                value={settings.facebookUrl}
                onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitterUrl" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter URL
              </Label>
              <Input
                id="twitterUrl"
                value={settings.twitterUrl}
                onChange={(e) => handleInputChange("twitterUrl", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagramUrl" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram URL
              </Label>
              <Input
                id="instagramUrl"
                value={settings.instagramUrl}
                onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn URL
              </Label>
              <Input
                id="linkedinUrl"
                value={settings.linkedinUrl}
                onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Homepage Content */}
        <Card>
          <CardHeader>
            <CardTitle>Homepage Content</CardTitle>
            <CardDescription>Customize your homepage hero section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                value={settings.heroTitle}
                onChange={(e) => handleInputChange("heroTitle", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Input
                id="heroSubtitle"
                value={settings.heroSubtitle}
                onChange={(e) => handleInputChange("heroSubtitle", e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heroButtonText">Button Text</Label>
                <Input
                  id="heroButtonText"
                  value={settings.heroButtonText}
                  onChange={(e) => handleInputChange("heroButtonText", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heroButtonUrl">Button URL</Label>
                <Input
                  id="heroButtonUrl"
                  value={settings.heroButtonUrl}
                  onChange={(e) => handleInputChange("heroButtonUrl", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Settings</CardTitle>
            <CardDescription>Configure your blog section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blogTitle">Blog Title</Label>
              <Input
                id="blogTitle"
                value={settings.blogTitle}
                onChange={(e) => handleInputChange("blogTitle", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="blogDescription">Blog Description</Label>
              <Textarea
                id="blogDescription"
                value={settings.blogDescription}
                onChange={(e) => handleInputChange("blogDescription", e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postsPerPage">Posts Per Page</Label>
              <Select value={settings.postsPerPage} onValueChange={(value) => handleInputChange("postsPerPage", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Podcast Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Podcast Settings</CardTitle>
            <CardDescription>Configure your podcast section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="podcastTitle">Podcast Title</Label>
              <Input
                id="podcastTitle"
                value={settings.podcastTitle}
                onChange={(e) => handleInputChange("podcastTitle", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="podcastDescription">Podcast Description</Label>
              <Textarea
                id="podcastDescription"
                value={settings.podcastDescription}
                onChange={(e) => handleInputChange("podcastDescription", e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="episodesPerPage">Episodes Per Page</Label>
              <Select value={settings.episodesPerPage} onValueChange={(value) => handleInputChange("episodesPerPage", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
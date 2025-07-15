"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Save, UserPlus, Trash2 } from "lucide-react";
import { useSiteContext } from "@/contexts/site-context";

export function EditAboutPage() {
  const { currentSite } = useSiteContext();
  // Mock initial data per site
  const initialData = currentSite === "appfirmsec"
    ? {
        mission: "To secure the digital world, one app at a time.",
        vision: "To be the most trusted app security partner globally.",
        about: "AppFirmSec is a leading app security firm...",
        imageUrl: "",
        team: [
          { name: "John Doe", role: "CEO", imageUrl: "" },
          { name: "Jane Smith", role: "CTO", imageUrl: "" },
        ]
      }
    : {
        mission: "To inspire and educate through engineering stories.",
        vision: "To be the go-to blog for aspiring engineers.",
        about: "Ennie Boateng is a passionate blogger and engineer...",
        imageUrl: "",
        team: [
          { name: "Ennie Boateng", role: "Founder & Writer", imageUrl: "" }
        ]
      };

  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", role: "", imageUrl: "" });

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

  const handleTeamImageChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        team: prev.team.map((member, i) => i === idx ? { ...member, imageUrl: url } : member)
      }));
    }
  };

  const handleTeamChange = (idx: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.map((member, i) => i === idx ? { ...member, [field]: value } : member)
    }));
  };

  const handleAddTeam = () => {
    if (newTeam.name && newTeam.role) {
      setFormData(prev => ({ ...prev, team: [...prev.team, newTeam] }));
      setNewTeam({ name: "", role: "", imageUrl: "" });
    }
  };

  const handleRemoveTeam = (idx: number) => {
    setFormData(prev => ({ ...prev, team: prev.team.filter((_, i) => i !== idx) }));
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
          <p className="text-muted-foreground">Update the about, mission, vision, and team for your site</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Mission</CardTitle>
            <CardDescription>What drives your organization or brand?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="about-mission"
              placeholder="Our mission is..."
              value={formData.mission}
              onChange={e => handleInputChange("mission", e.target.value)}
              rows={2}
              required
            />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Vision</CardTitle>
            <CardDescription>Where are you going? What do you aspire to?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="about-vision"
              placeholder="Our vision is..."
              value={formData.vision}
              onChange={e => handleInputChange("vision", e.target.value)}
              rows={2}
              required
            />
          </CardContent>
        </Card>
        <Card className="w-full lg:col-span-2">
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Tell your story or describe your brand</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="about-description"
              placeholder="Write about your site or yourself..."
              value={formData.about}
              onChange={e => handleInputChange("about", e.target.value)}
              rows={5}
              required
            />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Main Image</CardTitle>
            <CardDescription>Upload a main image for your About page</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              id="about-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {formData.imageUrl && (
              <Image src={formData.imageUrl || "/placeholder.png"} alt="About" width={256} height={128} className="mt-2 rounded w-full max-w-xs h-32 object-cover border" />
            )}
          </CardContent>
        </Card>
        <Card className="w-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Add, edit, or remove team members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.team.map((member, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 border rounded-lg p-3">
                <div className="flex flex-col items-center gap-2">
                  <Image src={member.imageUrl || "/placeholder.png"} alt={member.name} width={64} height={64} className="rounded-full object-cover border" />
                  <Input type="file" accept="image/*" onChange={e => handleTeamImageChange(e, idx)} className="w-32" />
                </div>
                <div className="flex-1 w-full grid gap-2">
                  <Input
                    placeholder="Name"
                    value={member.name}
                    onChange={e => handleTeamChange(idx, "name", e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Role"
                    value={member.role}
                    onChange={e => handleTeamChange(idx, "role", e.target.value)}
                    required
                  />
                </div>
                <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveTeam(idx)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row items-center gap-4 border rounded-lg p-3 bg-muted/50">
              <div className="flex flex-col items-center gap-2">
                <Image src={newTeam.imageUrl || "/placeholder.png"} alt="New Member" width={64} height={64} className="rounded-full object-cover border" />
                <Input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setNewTeam(prev => ({ ...prev, imageUrl: url }));
                  }
                }} className="w-32" />
              </div>
              <div className="flex-1 w-full grid gap-2">
                <Input
                  placeholder="Name"
                  value={newTeam.name}
                  onChange={e => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Role"
                  value={newTeam.role}
                  onChange={e => setNewTeam(prev => ({ ...prev, role: e.target.value }))}
                />
              </div>
              <Button type="button" variant="outline" size="icon" onClick={handleAddTeam}>
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
    </div>
  );
} 
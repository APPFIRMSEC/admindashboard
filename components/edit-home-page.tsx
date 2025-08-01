"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconDeviceFloppy, IconTrash, IconPlus } from "@tabler/icons-react";
import { useSiteContext } from "@/contexts/site-context";
import { toast } from "sonner";

interface Insight {
  id: string;
  title: string;
  description: string;
  link: string;
}

interface Podcast {
  id: string;
  title: string;
  description: string;
  duration: string;
  link: string;
}

interface HomePageData {
  site: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  insights?: Insight[];
  podcasts?: Podcast[];
}

export function EditHomePage() {
  const { currentSite } = useSiteContext();

  const [heroTitle, setHeroTitle] = useState("AppFirmSec:");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Your Technology Knowledge Hub"
  );
  const [heroDescription, setHeroDescription] = useState(
    "Explore the latest in cybersecurity trends, threats, and best practices"
  );

  const [insights, setInsights] = useState<Insight[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Load data from API on component mount
  useEffect(() => {
    const loadHomePageData = async () => {
      try {
        setIsInitialLoading(true);
        const response = await fetch(`/api/home-page?site=${currentSite}`);

        if (!response.ok) {
          throw new Error("Failed to load home page data");
        }

        const data = await response.json();

        if (data.homePage) {
          setHeroTitle(data.homePage.heroTitle || "AppFirmSec:");
          setHeroSubtitle(
            data.homePage.heroSubtitle || "Your Technology Knowledge Hub"
          );
          setHeroDescription(
            data.homePage.heroDescription ||
              "Explore the latest in cybersecurity trends, threats, and best practices"
          );
          setInsights(data.homePage.insights || []);
          setPodcasts(data.homePage.podcasts || []);
        } else {
          // Set default data if no home page exists
          setInsights([
            {
              id: "1",
              title: "Latest Ransomware Trends",
              description:
                "Understanding the evolving landscape of ransomware attacks and prevention strategies.",
              link: "/insights/ransomware-trends",
            },
            {
              id: "2",
              title: "Zero Trust Security Model",
              description:
                "Implementing zero trust architecture for enhanced network security.",
              link: "/insights/zero-trust-security",
            },
            {
              id: "3",
              title: "Cloud Security Best Practices",
              description:
                "Essential security measures for cloud infrastructure protection.",
              link: "/insights/cloud-security",
            },
          ]);
          setPodcasts([
            {
              id: "1",
              title: "Cybersecurity in 2024",
              description:
                "An overview of emerging threats and defense strategies for the new year.",
              duration: "45 min",
              link: "/podcasts/cybersecurity-2024",
            },
            {
              id: "2",
              title: "Incident Response Planning",
              description:
                "How to prepare and respond to security incidents effectively.",
              duration: "32 min",
              link: "/podcasts/incident-response",
            },
            {
              id: "3",
              title: "Security Awareness Training",
              description:
                "Building a security-conscious culture within your organization.",
              duration: "28 min",
              link: "/podcasts/security-awareness",
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading home page data:", error);
        toast.error("Failed to load home page data");
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (currentSite) {
      loadHomePageData();
    }
  }, [currentSite]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const homePageData: HomePageData = {
        site: currentSite,
        heroTitle,
        heroSubtitle,
        heroDescription,
        insights,
        podcasts,
      };

      const response = await fetch("/api/home-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(homePageData),
      });

      if (!response.ok) {
        throw new Error("Failed to save home page data");
      }

      const data = await response.json();
      toast.success("Home page saved successfully!");
      console.log("Saved home page data:", data);
    } catch (error) {
      console.error("Error saving home page data:", error);
      toast.error("Failed to save home page data");
    } finally {
      setIsSaving(false);
    }
  };

  const addInsight = () => {
    const newInsight: Insight = {
      id: Date.now().toString(),
      title: "",
      description: "",
      link: "",
    };
    setInsights([...insights, newInsight]);
  };

  const updateInsight = (id: string, field: keyof Insight, value: string) => {
    setInsights(
      insights.map((insight) =>
        insight.id === id ? { ...insight, [field]: value } : insight
      )
    );
  };

  const removeInsight = (id: string) => {
    setInsights(insights.filter((insight) => insight.id !== id));
  };

  const addPodcast = () => {
    const newPodcast: Podcast = {
      id: Date.now().toString(),
      title: "",
      description: "",
      duration: "",
      link: "",
    };
    setPodcasts([...podcasts, newPodcast]);
  };

  const updatePodcast = (id: string, field: keyof Podcast, value: string) => {
    setPodcasts(
      podcasts.map((podcast) =>
        podcast.id === id ? { ...podcast, [field]: value } : podcast
      )
    );
  };

  const removePodcast = (id: string) => {
    setPodcasts(podcasts.filter((podcast) => podcast.id !== id));
  };

  if (isInitialLoading) {
    return (
      <div className="space-y-6 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Edit Home Page
            </h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading home page data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Home Page</h1>
          <p className="text-muted-foreground">
            Customize your home page content including hero section, latest
            insights, and podcasts.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <IconDeviceFloppy className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="insights">Latest Insights</TabsTrigger>
          <TabsTrigger value="podcasts">Cyber Defense Podcasts</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Content</CardTitle>
              <CardDescription>
                Edit the main hero text that appears at the top of your home
                page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Hero Title</Label>
                <Input
                  id="hero-title"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Enter hero title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                <Input
                  id="hero-subtitle"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Enter hero subtitle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-description">Hero Description</Label>
                <Textarea
                  id="hero-description"
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  placeholder="Enter hero description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Latest Insights</CardTitle>
                  <CardDescription>
                    Manage the latest insights section that appears on your home
                    page.
                  </CardDescription>
                </div>
                <Button onClick={addInsight} variant="outline" size="sm">
                  <IconPlus className="h-4 w-4 mr-2" />
                  Add Insight
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => (
                <Card key={insight.id} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium">Insight {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInsight(insight.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={insight.title}
                        onChange={(e) =>
                          updateInsight(insight.id, "title", e.target.value)
                        }
                        placeholder="Enter insight title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={insight.description}
                        onChange={(e) =>
                          updateInsight(
                            insight.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Enter insight description"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Link</Label>
                      <Input
                        value={insight.link}
                        onChange={(e) =>
                          updateInsight(insight.id, "link", e.target.value)
                        }
                        placeholder="Enter insight link"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="podcasts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cyber Defense Podcasts</CardTitle>
                  <CardDescription>
                    Manage the podcasts section that appears on your home page.
                  </CardDescription>
                </div>
                <Button onClick={addPodcast} variant="outline" size="sm">
                  <IconPlus className="h-4 w-4 mr-2" />
                  Add Podcast
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {podcasts.map((podcast, index) => (
                <Card key={podcast.id} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium">Podcast {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePodcast(podcast.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={podcast.title}
                        onChange={(e) =>
                          updatePodcast(podcast.id, "title", e.target.value)
                        }
                        placeholder="Enter podcast title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={podcast.description}
                        onChange={(e) =>
                          updatePodcast(
                            podcast.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Enter podcast description"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={podcast.duration}
                          onChange={(e) =>
                            updatePodcast(
                              podcast.id,
                              "duration",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 45 min"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Link</Label>
                        <Input
                          value={podcast.link}
                          onChange={(e) =>
                            updatePodcast(podcast.id, "link", e.target.value)
                          }
                          placeholder="Enter podcast link"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

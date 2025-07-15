import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Podcast type for API responses
export interface Podcast {
  id: number;
  title: string;
  description: string;
  status: string;
  author: { id: string; name: string; email: string; role: string } | null;
  publishedAt: string | null;
  duration: string;
  fileSize: string;
  downloads: number;
  audioUrl: string | null;
  slug: string;
  content: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  episodeNumber?: string;
  seasonNumber?: string;
}

/**
 * Fetches all podcasts from the backend API.
 * @returns An array of podcast objects or an error object
 */
export async function fetchPodcasts(): Promise<Podcast[] | { error: string }> {
  const res = await fetch("/api/podcasts");
  const data = await res.json();
  if (res.ok && Array.isArray(data.podcasts)) {
    return data.podcasts;
  }
  return { error: data.error || "Failed to fetch podcasts" };
}

// Add a type for podcast creation payload
export type PodcastCreatePayload = {
  title: string;
  description: string;
  content: string;
  status: string;
  tags: string[];
  audioFile: string;
  duration: string;
  fileSize: string;
  publishDate: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  episodeNumber: string;
  seasonNumber: string;
  audioUrl: string;
};

/**
 * Creates a new podcast by POSTing to the backend API.
 * @param data The podcast data to create
 * @returns The created podcast object or an error object
 */
export async function createPodcast(
  data: PodcastCreatePayload
): Promise<Podcast | { error: string }> {
  const res = await fetch("/api/podcasts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// GET /api/podcasts/[id] - Get a podcast by ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const podcast = await db.podcast.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
    });
    if (!podcast) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
    }
    return NextResponse.json(podcast);
  } catch (error) {
    console.error("Failed to fetch podcast:", error);
    return NextResponse.json(
      { error: "Failed to fetch podcast" },
      { status: 500 }
    );
  }
}

// PATCH /api/podcasts/[id] - Update a podcast
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const data = await req.json();
  try {
    const podcast = await db.podcast.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        audioUrl: data.audioUrl,
        duration: data.duration,
        fileSize: data.fileSize,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
        // The following fields are all optional String fields in the schema
        seasonNumber: data.seasonNumber,
        episodeNumber: data.episodeNumber,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
        tags: Array.isArray(data.tags) ? data.tags.join(",") : data.tags,
        content: data.content,
      },
    });
    return NextResponse.json(podcast);
  } catch (error) {
    console.error("Failed to update podcast:", error);
    return NextResponse.json(
      { error: "Failed to update podcast" },
      { status: 400 }
    );
  }
}

// DELETE /api/podcasts/[id] - Delete a podcast
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  try {
    // Find the podcast to get the audioUrl
    const podcast = await db.podcast.findUnique({ where: { id } });
    if (!podcast) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
    }
    // Delete audio file from Supabase Storage if it exists (only old system)
    if (podcast.audioUrl) {
      // Only delete from old system (podcasts-audio bucket)
      const oldMatch = podcast.audioUrl.match(/podcasts-audio\/(.+)$/);
      if (oldMatch && oldMatch[1]) {
        await supabase.storage.from("podcasts-audio").remove([oldMatch[1]]);
      }

      // Don't delete from Media Library - files are shared resources
      // Media Library files should only be deleted when explicitly deleted from Media Library
    }
    await db.podcast.delete({ where: { id } });
    return NextResponse.json({ message: "Podcast deleted successfully" });
  } catch (error) {
    console.error("Failed to delete podcast:", error);
    return NextResponse.json(
      { error: "Failed to delete podcast" },
      { status: 400 }
    );
  }
}

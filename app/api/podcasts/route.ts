import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/podcasts - List all podcasts
export async function GET() {
  try {
    const podcasts = await db.podcast.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
    });
    return NextResponse.json({ podcasts });
  } catch (error) {
    console.error("Failed to fetch podcasts:", error);
    return NextResponse.json(
      { error: "Failed to fetch podcasts" },
      { status: 500 }
    );
  }
}

// POST /api/podcasts - Create a new podcast
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  try {
    const podcast = await db.podcast.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || "DRAFT",
        audioUrl: data.audioUrl,
        duration: data.duration,
        fileSize: data.fileSize,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
        authorId: session.user.id,
      },
    });
    return NextResponse.json(podcast, { status: 201 });
  } catch (error) {
    console.error("Failed to create podcast:", error);
    return NextResponse.json(
      { error: "Failed to create podcast" },
      { status: 400 }
    );
  }
}

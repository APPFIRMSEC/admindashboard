import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/about - Fetch about data for current site
export async function GET(req: NextRequest) {
  try {
    // Get the site from query params or use default
    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("siteId") || "appfirmsec";

    const about = await db.about.findUnique({
      where: { siteId },
    });

    if (!about) {
      // Return default data if no about record exists
      return NextResponse.json({
        mission: "",
        vision: "",
        about: "",
        imageUrl: "",
        team: [],
      });
    }

    return NextResponse.json(about);
  } catch (error) {
    console.error("Error fetching about data:", error);
    return NextResponse.json(
      { error: "Failed to fetch about data" },
      { status: 500 }
    );
  }
}

// POST /api/about - Save or update about data
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const siteId = data.siteId || "appfirmsec";

    // Validate required fields
    if (!data.mission || !data.vision || !data.about) {
      return NextResponse.json(
        { error: "Mission, vision, and about are required" },
        { status: 400 }
      );
    }

    // Upsert (create or update) the about data
    const about = await db.about.upsert({
      where: { siteId },
      update: {
        mission: data.mission,
        vision: data.vision,
        about: data.about,
        imageUrl: data.imageUrl || null,
        team: data.team || [],
        updatedAt: new Date(),
      },
      create: {
        siteId,
        mission: data.mission,
        vision: data.vision,
        about: data.about,
        imageUrl: data.imageUrl || null,
        team: data.team || [],
      },
    });

    return NextResponse.json(about);
  } catch (error) {
    console.error("Error saving about data:", error);
    return NextResponse.json(
      { error: "Failed to save about data" },
      { status: 500 }
    );
  }
}

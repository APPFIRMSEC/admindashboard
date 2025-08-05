import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/site-settings - Fetch all settings for current site
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the site from query params or use default
    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("siteId") || "appfirmsec";

    // Fetch all settings for this site
    const settings = await db.siteSetting.findMany({
      where: {
        key: {
          startsWith: `${siteId}_`,
        },
      },
    });

    // Convert to flat object for frontend
    const settingsObject: Record<string, string> = {};
    settings.forEach((setting) => {
      const key = setting.key.replace(`${siteId}_`, "");
      settingsObject[key] = setting.value;
    });

    // Return default values if no settings exist
    if (settings.length === 0) {
      return NextResponse.json({
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
        aboutContent:
          "We are a passionate team dedicated to creating innovative solutions...",

        // Blog Settings
        blogTitle: "Our Blog",
        blogDescription: "Latest insights and updates from our team",
        postsPerPage: "6",

        // Podcast Settings
        podcastTitle: "Our Podcast",
        podcastDescription: "Listen to our latest episodes",
        episodesPerPage: "12",
      });
    }

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

// POST /api/site-settings - Save or update settings for current site
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const siteId = data.siteId || "appfirmsec";

    // Validate that we have settings to save
    if (!data.settings || typeof data.settings !== "object") {
      return NextResponse.json(
        { error: "Settings object is required" },
        { status: 400 }
      );
    }

    const settings = data.settings;
    const upsertPromises: Promise<any>[] = [];

    // Create upsert operations for each setting
    Object.entries(settings).forEach(([key, value]) => {
      const settingKey = `${siteId}_${key}`;
      upsertPromises.push(
        db.siteSetting.upsert({
          where: { key: settingKey },
          update: { value: String(value) },
          create: {
            key: settingKey,
            value: String(value),
            type: "TEXT",
          },
        })
      );
    });

    // Execute all upserts
    await Promise.all(upsertPromises);

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (error) {
    console.error("Error saving site settings:", error);
    return NextResponse.json(
      { error: "Failed to save site settings" },
      { status: 500 }
    );
  }
}

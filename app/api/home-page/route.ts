import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";

// Validation schema for home page data - matches frontend structure
const homePageSchema = z.object({
  site: z.string().min(1, "Site is required"),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  insights: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        link: z.string(),
      })
    )
    .optional(),
  podcasts: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        duration: z.string(),
        link: z.string(),
      })
    )
    .optional(),
});

// GET /api/home-page - Get home page for current site
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const site = searchParams.get("site");

    if (!site) {
      return NextResponse.json(
        { error: "Site parameter is required" },
        { status: 400 }
      );
    }

    const homePage = await db.homePage.findUnique({
      where: { site },
    });

    return NextResponse.json({ homePage });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch home page";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/home-page - Save home page for current site
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validatedData = homePageSchema.parse(body);

    // Check if home page already exists for this site
    const existingHomePage = await db.homePage.findUnique({
      where: { site: validatedData.site },
    });

    let homePage;
    if (existingHomePage) {
      // Update existing home page
      homePage = await db.homePage.update({
        where: { site: validatedData.site },
        data: validatedData,
      });
    } else {
      // Create new home page
      homePage = await db.homePage.create({
        data: validatedData,
      });
    }

    return NextResponse.json({ homePage }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to save home page";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

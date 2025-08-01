import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";

// GET /api/blogs/featured - Get all featured blog posts
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const featuredPosts = await db.blogPost.findMany({
      where: {
        featured: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ featuredPosts });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch featured posts";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 
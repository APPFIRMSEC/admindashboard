import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";

// Validation schema for featured toggle
const featuredToggleSchema = z.object({
  featured: z.boolean(),
});

// PATCH /api/blogs/[id]/feature - Toggle featured status of a blog post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 Featured Posts API - Starting request");

    await requireAuth();
    console.log("✅ Authentication passed");

    const { id } = await params;
    console.log("📝 Post ID:", id);

    const body = await request.json();
    console.log("📦 Request body:", body);

    const validatedData = featuredToggleSchema.parse(body);
    console.log("✅ Validated data:", validatedData);

    // Check if blog post exists
    console.log("🔍 Looking for blog post with ID:", id);
    const existingPost = await db.blogPost.findUnique({
      where: { id },
    });
    console.log("📄 Existing post found:", existingPost ? "YES" : "NO");

    if (!existingPost) {
      console.log("❌ Blog post not found");
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    console.log("🔄 Updating featured status to:", validatedData.featured);

    // Update featured status
    const updatedPost = await db.blogPost.update({
      where: { id },
      data: {
        featured: validatedData.featured,
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
    });

    console.log("✅ Post updated successfully:", updatedPost.id);

    return NextResponse.json({
      message: `Post ${
        validatedData.featured ? "featured" : "unfeatured"
      } successfully`,
      post: updatedPost,
    });
  } catch (error: unknown) {
    console.error("💥 Featured Posts API Error:", error);
    console.error("💥 Error type:", typeof error);
    console.error(
      "💥 Error message:",
      error instanceof Error ? error.message : "Unknown error"
    );
    console.error(
      "💥 Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to update featured status";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

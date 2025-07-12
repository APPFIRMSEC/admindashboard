import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth /* requireRole  */ } from "@/lib/auth-utils";

// Validation schema for updating blog posts
const updateBlogSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  slug: z.string().min(1, "Slug is required").optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required").optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).optional(),
  featuredImage: z.string().optional(),
  publishDate: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// GET /api/blogs/[id] - Get a specific blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const blog = await db.blogPost.findUnique({
      where: { id: params.id },
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

    if (!blog) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch blog post";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PATCH /api/blogs/[id] - Update a blog post
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validatedData = updateBlogSchema.parse(body);

    // Check if blog post exists
    const existingPost = await db.blogPost.findUnique({
      where: { id: params.id },
      include: { author: true },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Check permissions - only author or admin can edit
    if (existingPost.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You can only edit your own blog posts" },
        { status: 403 }
      );
    }

    // Check if slug is being updated and if it's already taken
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugExists = await db.blogPost.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A blog post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Handle tags if provided
    let tagConnections;
    if (validatedData.tags) {
      tagConnections = {
        set: [], // Remove existing tags
        connect: validatedData.tags.map((tagName) => ({ name: tagName })),
      };
    }

    // Handle publish date
    let publishDate;
    if (validatedData.publishDate) {
      publishDate = new Date(validatedData.publishDate);
    }

    const blog = await db.blogPost.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        publishedAt:
          validatedData.status === "PUBLISHED"
            ? publishDate || new Date()
            : null,
        tags: tagConnections,
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

    return NextResponse.json(blog);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: (error as z.ZodError).errors },
        { status: 400 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Failed to update blog post";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/blogs/[id] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    // Check if blog post exists
    const existingPost = await db.blogPost.findUnique({
      where: { id: params.id },
      include: { author: true },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Check permissions - only author or admin can delete
    if (existingPost.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You can only delete your own blog posts" },
        { status: 403 }
      );
    }

    await db.blogPost.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete blog post";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";

const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  status: z
    .enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"])
    .default("DRAFT"),
  featuredImage: z.string().optional(),
  publishDate: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// GET /api/blogs - List all blog posts
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const author = searchParams.get("author") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status && status !== "all") {
      where.status = status;
    }
    if (author) {
      where.author = { name: { contains: author, mode: "insensitive" } };
    }

    const [blogs, total] = await Promise.all([
      db.blogPost.findMany({
        where,
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
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch blogs";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/blogs - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validatedData = createBlogSchema.parse(body);

    // Check if slug already exists
    const existingPost = await db.blogPost.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 400 }
      );
    }

    // Handle tags
    const tagConnections = validatedData.tags
      ? {
          connect: validatedData.tags.map((tagName) => ({ name: tagName })),
        }
      : undefined;

    // Handle publish date - convert publishDate to publishedAt
    let publishedAt = undefined;
    if (validatedData.publishDate) {
      publishedAt = new Date(validatedData.publishDate);
    } else if (validatedData.status === "PUBLISHED") {
      publishedAt = new Date();
    }

    // Create blog data without publishDate
    const blogData = {
      title: validatedData.title,
      slug: validatedData.slug,
      excerpt: validatedData.excerpt,
      content: validatedData.content,
      status: validatedData.status,
      featuredImage: validatedData.featuredImage,
      seoTitle: validatedData.seoTitle,
      seoDescription: validatedData.seoDescription,
      seoKeywords: validatedData.seoKeywords,
      authorId: user.id,
      publishedAt,
      tags: tagConnections,
    };

    const blog = await db.blogPost.create({
      data: blogData,
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

    return NextResponse.json(blog, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: (error as z.ZodError).errors },
        { status: 400 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Failed to create blog post";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

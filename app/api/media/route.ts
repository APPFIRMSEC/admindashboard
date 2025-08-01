import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};

    if (type) {
      where.type = type.toUpperCase();
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { originalName: { contains: search, mode: "insensitive" } },
        { alt: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count for pagination
    const totalCount = await db.mediaFile.count({ where });

    // Get media files with pagination
    const mediaFiles = await db.mediaFile.findMany({
      where,
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        uploadedAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    // Transform data for frontend
    const files = mediaFiles.map((file) => ({
      id: file.id,
      name: file.name,
      originalName: file.originalName,
      type: file.type.toLowerCase(),
      url: file.url,
      size: file.size,
      mimeType: file.mimeType,
      alt: file.alt,
      dimensions: file.dimensions,
      duration: file.duration,
      uploadedAt: file.uploadedAt,
      uploader: file.uploader,
    }));

    return NextResponse.json({
      success: true,
      files,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching media files:", error);
    return NextResponse.json(
      { error: "Failed to fetch media files" },
      { status: 500 }
    );
  }
}

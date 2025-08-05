import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma, MediaType } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const path = searchParams.get("path") || "/";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const where: Prisma.MediaFileWhereInput = {};

    // Filter by file type
    if (type) {
      where.type = type.toUpperCase() as MediaType;
    }

    // Filter by search term
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { originalName: { contains: search, mode: "insensitive" } },
        { alt: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by path (folder structure)
    if (path && path !== "/") {
      where.path = path;
    } else if (path === "/") {
      // When at root, only show files that are directly in root
      where.path = "/";
    }

    const totalCount = await db.mediaFile.count({ where });
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

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPath } = await req.json();

    if (!newPath) {
      return NextResponse.json(
        { error: "New path is required" },
        { status: 400 }
      );
    }

    // Get the file to check if it exists and user has permission
    const file = await db.mediaFile.findUnique({
      where: { id },
      include: { uploader: true },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Check if user has permission (uploader or admin)
    if (file.uploaderId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You don't have permission to move this file" },
        { status: 403 }
      );
    }

    // Update the file's path
    const updatedFile = await db.mediaFile.update({
      where: { id },
      data: { path: newPath },
    });

    return NextResponse.json({
      success: true,
      file: updatedFile,
    });
  } catch (error) {
    console.error("Error moving file:", error);
    return NextResponse.json({ error: "Failed to move file" }, { status: 500 });
  }
}

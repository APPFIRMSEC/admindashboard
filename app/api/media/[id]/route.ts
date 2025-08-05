import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { db } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the media file from database
    const mediaFile = await db.mediaFile.findUnique({
      where: { id },
      include: { uploader: true },
    });

    if (!mediaFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Check if user has permission to delete (uploader or admin)
    if (
      mediaFile.uploaderId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Extract file path from URL for storage deletion
    const url = mediaFile.url;
    const storagePathMatch = url.match(
      /\/storage\/v1\/object\/public\/media-files\/(.+)$/
    );

    if (storagePathMatch) {
      const storagePath = decodeURIComponent(storagePathMatch[1]);

      // Delete from Supabase Storage
      const { error: storageError } = await supabase.storage
        .from("media-files")
        .remove([storagePath]);

      if (storageError) {
        console.error("Error deleting from storage:", storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete from database
    await db.mediaFile.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the seed data (media-1)
    await db.mediaFile.delete({
      where: { id: "media-1" },
    });

    return NextResponse.json({
      success: true,
      message: "Seed data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting seed data:", error);
    return NextResponse.json(
      { error: "Failed to delete seed data" },
      { status: 500 }
    );
  }
}

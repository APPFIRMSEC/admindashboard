import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// DELETE /api/about/delete-image - Delete image from about page
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Validate that it's a valid image URL from our uploads
    if (!imageUrl.includes("supabase.co") || imageUrl === "/placeholder.png") {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }

    try {
      // Extract the file name from the URL
      const fileName = imageUrl.split("/").pop();

      if (fileName) {
        const { error } = await supabase.storage
          .from("about-images")
          .remove([fileName]);

        if (error) {
          console.error("Error deleting image from storage:", error);
          return NextResponse.json(
            { error: "Failed to delete image from storage" },
            { status: 500 }
          );
        }

        console.log(`Deleted image: ${fileName}`);

        return NextResponse.json({
          success: true,
          message: "Image deleted successfully",
        });
      } else {
        return NextResponse.json(
          { error: "Invalid image URL format" },
          { status: 400 }
        );
      }
    } catch (deleteError) {
      console.error("Error deleting image:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete image from storage" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in delete image endpoint:", error);
    return NextResponse.json(
      { error: "Failed to process delete request" },
      { status: 500 }
    );
  }
}

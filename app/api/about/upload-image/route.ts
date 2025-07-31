import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// POST /api/about/upload-image - Upload image for about page
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;
    const oldImageUrl = formData.get("oldImageUrl") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed",
        },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `about-${timestamp}.${fileExtension}`;

    // Upload to Supabase Storage
    const uploadResult = await supabase.storage
      .from("about-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadResult.error) {
      return NextResponse.json(
        { error: uploadResult.error.message },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("about-images")
      .getPublicUrl(fileName);

    // Delete old image if it exists and is not a placeholder
    if (
      oldImageUrl &&
      oldImageUrl !== "/placeholder.png" &&
      oldImageUrl.includes("supabase.co")
    ) {
      try {
        // Extract the file path from the old URL
        const oldFileName = oldImageUrl.split("/").pop();
        if (oldFileName) {
          const { error: deleteError } = await supabase.storage
            .from("about-images")
            .remove([oldFileName]);

          if (deleteError) {
            console.error("Error deleting old image:", deleteError);
          } else {
            console.log(`Deleted old image: ${oldFileName}`);
          }
        }
      } catch (deleteError) {
        console.error("Error deleting old image:", deleteError);
        // Don't fail the upload if deletion fails
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl: publicUrlData.publicUrl,
      fileName,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

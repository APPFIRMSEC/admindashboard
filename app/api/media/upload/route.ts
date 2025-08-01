import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;
    const subcategory = formData.get("subcategory") as string;
    const alt = formData.get("alt") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp", // Images
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/mp3", // Audio
      "video/mp4",
      "video/webm",
      "video/ogg", // Video
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Documents
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload a valid image, audio, video, or document file.",
        },
        { status: 400 }
      );
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `${timestamp}-${file.name}`;

    // Determine storage path based on file type
    let storagePath = "";
    if (file.type.startsWith("image/")) {
      storagePath = `images/${subcategory || "general"}/${fileName}`;
    } else if (file.type.startsWith("audio/")) {
      storagePath = `audio/${subcategory || "general"}/${fileName}`;
    } else if (file.type.startsWith("video/")) {
      storagePath = `video/${subcategory || "general"}/${fileName}`;
    } else {
      storagePath = `documents/${subcategory || "general"}/${fileName}`;
    }

    // Upload to Supabase Storage
    const uploadResult = await supabase.storage
      .from("media-files")
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadResult.error) {
      console.error("Upload error:", uploadResult.error);
      return NextResponse.json(
        { error: uploadResult.error.message },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("media-files")
      .getPublicUrl(storagePath);

    // Determine media type for database
    let mediaType = "DOCUMENT";
    if (file.type.startsWith("image/")) {
      mediaType = "IMAGE";
    } else if (file.type.startsWith("audio/")) {
      mediaType = "AUDIO";
    } else if (file.type.startsWith("video/")) {
      mediaType = "VIDEO";
    }

    // Save to database
    const mediaFile = await db.mediaFile.create({
      data: {
        name: fileName,
        originalName: file.name,
        type: mediaType as any,
        url: publicUrlData.publicUrl,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        mimeType: file.type,
        path: `/${category}/${subcategory}`,
        alt: alt || file.name,
        uploaderId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      file: {
        id: mediaFile.id,
        name: mediaFile.name,
        originalName: mediaFile.originalName,
        type: mediaFile.type,
        url: mediaFile.url,
        size: mediaFile.size,
        mimeType: mediaFile.mimeType,
        alt: mediaFile.alt,
        uploadedAt: mediaFile.uploadedAt,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

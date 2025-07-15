import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Generate a unique filename (timestamp + original name)
    const filename = `${Date.now()}-${(file as File).name}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("podcasts-audio")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: (file as File).type,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("podcasts-audio")
      .getPublicUrl(filename);

    return NextResponse.json({ url: publicUrlData.publicUrl, key: filename });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

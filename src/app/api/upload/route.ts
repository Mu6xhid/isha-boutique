// src/app/api/upload/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { Readable } from "node:stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const data = await req.formData();
    const file = data.get("file") as File | null;

    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const { secure_url } = await new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (err: UploadApiErrorResponse | undefined, res: UploadApiResponse | undefined) =>
          err || !res ? reject(err) : resolve(res)
      );
      Readable.from(buffer).pipe(upload);
    });

    return NextResponse.json({ url: secure_url });
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

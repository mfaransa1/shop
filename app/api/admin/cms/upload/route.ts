import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "shop-cms-media";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  const access = await requireAdminApiAccess();
  if (!access.ok) return access.response;

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return NextResponse.json({ error: "Choose an image file to upload." }, { status: 400 });
  }

  const file = data.get("file");
  const collection = data.get("collection");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  if (collection !== "events" && collection !== "products") return NextResponse.json({ error: "Invalid image category." }, { status: 400 });
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) return NextResponse.json({ error: "Use a JPEG, PNG, WebP or GIF image." }, { status: 415 });
  if (file.size < 1 || file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be smaller than 5 MB." }, { status: 413 });

  const objectPath = `${collection}/${crypto.randomUUID()}.${extension}`;
  const bytes = await file.arrayBuffer();
  try {
    const response = await fetch(`${access.supabaseUrl}/storage/v1/object/${BUCKET}/${objectPath}`, {
      method: "POST",
      headers: {
        apikey: access.serviceRoleKey,
        Authorization: `Bearer ${access.serviceRoleKey}`,
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      body: bytes,
      cache: "no-store",
    });
    if (!response.ok) {
      return NextResponse.json({ error: "Upload failed. Apply the SHoP CMS media migration and try again." }, { status: 502 });
    }
    const url = `${access.supabaseUrl}/storage/v1/object/public/${BUCKET}/${objectPath}`;
    return NextResponse.json({ url }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not connect to media storage." }, { status: 502 });
  }
}

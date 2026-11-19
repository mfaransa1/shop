import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Kind = "school" | "sponsor";
const statuses = ["new", "reviewing", "contacted", "approved", "declined", "closed"] as const;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function supabaseHeaders(key: string) {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > 12000) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 }); }

  // Quietly accept bot submissions caught by the honeypot.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });
  const kind = clean(body.kind, 20) as Kind;
  const organisation = clean(body.organisation, 160);
  const contactName = clean(body.contactName, 120);
  const role = clean(body.role, 100);
  const email = clean(body.email, 254).toLowerCase();
  const phone = clean(body.phone, 40);
  const location = clean(body.location, 160);
  const interest = clean(body.interest, 120);
  const scale = clean(body.scale, 80);
  const timeline = clean(body.timeline, 80);
  const message = clean(body.message, 2500);

  if (kind !== "school" && kind !== "sponsor") return NextResponse.json({ ok: false, error: "Choose a valid enquiry type." }, { status: 400 });
  if (organisation.length < 2 || contactName.length < 2 || role.length < 2) return NextResponse.json({ ok: false, error: "Enter the organisation, your name and your role." }, { status: 400 });
  if (!validEmail(email)) return NextResponse.json({ ok: false, error: "Enter a valid work email address." }, { status: 400 });
  if (phone.length < 7) return NextResponse.json({ ok: false, error: "Enter a valid phone number." }, { status: 400 });
  if (interest.length < 3 || message.length < 10) return NextResponse.json({ ok: false, error: "Select an area of interest and provide a short message." }, { status: 400 });

  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: false, error: "The enquiry service is not configured yet. Please contact SHoP directly." }, { status: 503 });
  }

  const record = {
    kind, organisation, contact_name: contactName, contact_role: role, email, phone,
    location: location || null, interest, scale: scale || null, timeline: timeline || null,
    message, status: "new",
  };

  try {
    const saved = await fetch(`${url}/rest/v1/shop_partnership_enquiries`, {
      method: "POST",
      headers: { ...supabaseHeaders(key), Prefer: "return=minimal" },
      body: JSON.stringify(record),
      cache: "no-store",
    });
    if (!saved.ok) {
      console.error(`SHoP partnership enquiry storage failed with status ${saved.status}.`);
      return NextResponse.json({ ok: false, error: "We could not save your enquiry. Please try again later." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: "We could not connect to SHoP enquiry storage. Please try again later." }, { status: 502 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.SHOP_PARTNERSHIP_TO_EMAIL || process.env.SHOP_JOIN_TO_EMAIL || "shopchesske@gmail.com";
  const sender = process.env.RESEND_FROM_EMAIL;
  if (apiKey && sender) {
    const lines = [
      `New ${kind === "school" ? "school partnership" : "sponsor / organisation"} enquiry`,
      "", `Organisation: ${organisation}`, `Contact: ${contactName}`, `Role: ${role}`,
      `Email: ${email}`, `Phone: ${phone}`, `Location: ${location || "Not provided"}`,
      `Interest: ${interest}`, `Scale / range: ${scale || "Not provided"}`,
      `Timeline: ${timeline || "Not provided"}`, "", "Message:", message,
    ];
    try {
      const sent = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: sender, to: [recipient], reply_to: email, subject: `SHoP ${kind} enquiry — ${organisation}`, text: lines.join("\n") }),
        cache: "no-store",
      });
      if (!sent.ok) console.error(`SHoP partnership notification failed with status ${sent.status}.`);
    } catch { console.error("SHoP partnership notification request failed."); }
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET() {
  const access = await requireAdminApiAccess();
  if (!access.ok) return access.response;
  try {
    const query = new URLSearchParams({ select: "*", order: "created_at.desc", limit: "300" });
    const response = await fetch(`${access.supabaseUrl}/rest/v1/shop_partnership_enquiries?${query}`, {
      headers: supabaseHeaders(access.serviceRoleKey), cache: "no-store",
    });
    if (!response.ok) return NextResponse.json({ error: "Could not load enquiries. Check that the Stage 5 database migration has been applied." }, { status: 502 });
    return NextResponse.json({ enquiries: await response.json() });
  } catch {
    return NextResponse.json({ error: "Could not connect to enquiry storage." }, { status: 502 });
  }
}

export async function PATCH(request: Request) {
  const access = await requireAdminApiAccess();
  if (!access.ok) return access.response;
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const id = clean(body.id, 50);
  const status = clean(body.status, 30);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) || !statuses.includes(status as typeof statuses[number])) {
    return NextResponse.json({ error: "Choose a valid enquiry and status." }, { status: 400 });
  }
  try {
    const query = new URLSearchParams({ id: `eq.${id}`, select: "*" });
    const response = await fetch(`${access.supabaseUrl}/rest/v1/shop_partnership_enquiries?${query}`, {
      method: "PATCH",
      headers: { ...supabaseHeaders(access.serviceRoleKey), Prefer: "return=representation" },
      body: JSON.stringify({ status }),
      cache: "no-store",
    });
    if (!response.ok) return NextResponse.json({ error: "Could not update this enquiry." }, { status: 502 });
    const rows = await response.json() as unknown[];
    if (!rows.length) return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
    return NextResponse.json({ enquiry: rows[0] });
  } catch {
    return NextResponse.json({ error: "Could not connect to enquiry storage." }, { status: 502 });
  }
}

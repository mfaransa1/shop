import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type AdminAccess =
  | { ok: true; supabaseUrl: string; serviceRoleKey: string }
  | { ok: false; response: NextResponse };

export async function requireAdminApiAccess(): Promise<AdminAccess> {
  let supabase;

  try {
    supabase = await createClient();
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Admin authentication is not configured." },
        { status: 503 }
      ),
    };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Please sign in to access membership applications." },
        { status: 401 }
      ),
    };
  }

  const allowedEmails = (process.env.SHOP_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!allowedEmails.includes(user.email.toLowerCase())) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Your account is not authorised to review applications." },
        { status: 403 }
      ),
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Application storage is not configured on the server." },
        { status: 503 }
      ),
    };
  }

  return { ok: true, supabaseUrl, serviceRoleKey };
}

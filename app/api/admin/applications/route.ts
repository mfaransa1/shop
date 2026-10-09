import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statuses = new Set(["new", "reviewing", "contacted", "accepted", "declined"]);
const applicationFields =
  "id,created_at,full_name,age,guardian_name,guardian_consent,phone,email,school,experience,interest,message,status";

export async function GET(request: Request) {
  const access = await requireAdminApiAccess();
  if (!access.ok) return access.response;

  const requestedStatus = new URL(request.url).searchParams.get("status");
  if (requestedStatus && requestedStatus !== "all" && !statuses.has(requestedStatus)) {
    return NextResponse.json({ error: "Invalid application status filter." }, { status: 400 });
  }

  const query = new URLSearchParams({
    select: applicationFields,
    order: "created_at.desc",
    limit: "100",
  });
  if (requestedStatus && requestedStatus !== "all") {
    query.set("status", `eq.${requestedStatus}`);
  }

  try {
    const response = await fetch(
      `${access.supabaseUrl}/rest/v1/join_applications?${query.toString()}`,
      {
        headers: {
          apikey: access.serviceRoleKey,
          Authorization: `Bearer ${access.serviceRoleKey}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(`SHoP admin application list failed with status ${response.status}.`);
      return NextResponse.json({ error: "Could not load applications." }, { status: 502 });
    }

    const applications = (await response.json()) as unknown;
    return NextResponse.json({ applications });
  } catch {
    return NextResponse.json({ error: "Could not connect to application storage." }, { status: 502 });
  }
}

export async function PATCH(request: Request) {
  const access = await requireAdminApiAccess();
  if (!access.ok) return access.response;

  let payload: { id?: unknown; status?: unknown };
  try {
    payload = (await request.json()) as { id?: unknown; status?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const id = typeof payload.id === "string" ? payload.id : "";
  const status = typeof payload.status === "string" ? payload.status : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid application ID." }, { status: 400 });
  }
  if (!statuses.has(status)) {
    return NextResponse.json({ error: "Invalid application status." }, { status: 400 });
  }

  const query = new URLSearchParams({
    id: `eq.${id}`,
    select: applicationFields,
  });

  try {
    const response = await fetch(
      `${access.supabaseUrl}/rest/v1/join_applications?${query.toString()}`,
      {
        method: "PATCH",
        headers: {
          apikey: access.serviceRoleKey,
          Authorization: `Bearer ${access.serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(`SHoP admin application update failed with status ${response.status}.`);
      return NextResponse.json({ error: "Could not update the application." }, { status: 502 });
    }

    const updated = (await response.json()) as unknown[];
    if (!updated.length) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    return NextResponse.json({ application: updated[0] });
  } catch {
    return NextResponse.json({ error: "Could not connect to application storage." }, { status: 502 });
  }
}

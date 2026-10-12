import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin-api-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RegistrationStatus = "pending" | "confirmed" | "waitlisted" | "cancelled";
type RegistrationRecord = {
  id: string;
  created_at: string;
  tournament_slug: string;
  tournament_name: string;
  participant_name: string;
  age: number;
  phone: string;
  email: string;
  school_or_club: string | null;
  guardian_name: string | null;
  guardian_consent: boolean;
  notes: string | null;
  status: RegistrationStatus;
  capacity_limit: number | null;
  waitlisted_at?: string | null;
};
type TournamentCapacity = {
  tournament_slug: string;
  tournament_name: string;
  capacity: number;
  baseline_occupied: number;
  auto_promote_waitlist: boolean;
  occupied_registrations: number;
  waitlisted_registrations: number;
};
type NotificationResult = "sent" | "not_configured" | "failed" | "unchanged";
type StatusRpcResult = {
  registration?: RegistrationRecord;
  promoted_registration?: RegistrationRecord | null;
  changed?: boolean;
};

const statuses = new Set<RegistrationStatus>(["pending", "confirmed", "waitlisted", "cancelled"]);
const registrationFields =
  "id,created_at,tournament_slug,tournament_name,participant_name,age,phone,email,school_or_club,guardian_name,guardian_consent,notes,status,capacity_limit,waitlisted_at";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const slugPattern = /^[a-z0-9-]{1,120}$/;

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function statusMessage(status: RegistrationStatus, participantName: string, tournamentName: string) {
  const firstName = participantName.trim().split(/\s+/)[0] || "Player";
  const messages: Record<RegistrationStatus, { subject: string; text: string }> = {
    pending: {
      subject: `SHoP registration update: ${tournamentName}`,
      text: `Hello ${firstName},\n\nYour registration for ${tournamentName} is currently pending review. SHoP will contact you when there is an update.\n\nSouthside House of Pawns (SHoP)\nKila hatua ina maana.`,
    },
    confirmed: {
      subject: `Your place is confirmed: ${tournamentName}`,
      text: `Hello ${firstName},\n\nYour registration for ${tournamentName} has been confirmed. Please keep this email and watch for any event instructions from SHoP. If you have questions, contact the SHoP organisers.\n\nSouthside House of Pawns (SHoP)\nKila hatua ina maana.`,
    },
    waitlisted: {
      subject: `Waitlist update: ${tournamentName}`,
      text: `Hello ${firstName},\n\nYour registration for ${tournamentName} has been placed on the waitlist. This is not a confirmed place. SHoP will contact you if a place becomes available.\n\nSouthside House of Pawns (SHoP)\nKila hatua ina maana.`,
    },
    cancelled: {
      subject: `Registration update: ${tournamentName}`,
      text: `Hello ${firstName},\n\nYour registration for ${tournamentName} has been marked as cancelled in the SHoP registration system. If you believe this is a mistake, please contact the organisers.\n\nSouthside House of Pawns (SHoP)\nKila hatua ina maana.`,
    },
  };
  return messages[status];
}

async function sendStatusEmail(
  registration: Pick<RegistrationRecord, "email" | "participant_name" | "tournament_name">,
  status: RegistrationStatus
): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return "not_configured";
  if (!registration.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registration.email)) return "failed";

  const message = statusMessage(status, registration.participant_name, registration.tournament_name);
  const safeTournament = escapeHtml(registration.tournament_name);
  const safeText = escapeHtml(message.text).replace(/\n/g, "<br />");
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937"><p>${safeText}</p><p><strong>Southside House of Pawns (SHoP)</strong><br />Kila hatua ina maana.<br /><span style="color:#6b7280">The board is bigger than the game.</span></p><p style="font-size:12px;color:#6b7280">Tournament: ${safeTournament}</p></div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [registration.email], subject: message.subject, text: message.text, html }),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error(`SHoP tournament status email failed with status ${response.status}.`);
      return "failed";
    }
    return "sent";
  } catch {
    console.error("SHoP tournament status email could not reach the email provider.");
    return "failed";
  }
}

export async function GET(request: Request) {
  const access = await requireAdminApiAccess();
  if (!access.ok) return access.response;

  const params = new URL(request.url).searchParams;
  const requestedStatus = params.get("status") ?? "all";
  const tournamentSlug = params.get("tournament") ?? "all";
  if (requestedStatus !== "all" && !statuses.has(requestedStatus as RegistrationStatus)) {
    return errorResponse("Invalid registration status filter.", 400);
  }
  if (tournamentSlug !== "all" && !slugPattern.test(tournamentSlug)) {
    return errorResponse("Invalid tournament filter.", 400);
  }

  const headers = { apikey: access.serviceRoleKey, Authorization: `Bearer ${access.serviceRoleKey}` };
  const query = new URLSearchParams({ select: registrationFields, order: "created_at.desc", limit: "200" });
  if (requestedStatus !== "all") query.set("status", `eq.${requestedStatus}`);
  if (tournamentSlug !== "all") query.set("tournament_slug", `eq.${tournamentSlug}`);

  try {
    const [registrationsResponse, capacitiesResponse] = await Promise.all([
      fetch(`${access.supabaseUrl}/rest/v1/tournament_registrations?${query.toString()}`, {
        headers,
        cache: "no-store",
      }),
      fetch(`${access.supabaseUrl}/rest/v1/rpc/admin_tournament_capacity_summary`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: "{}",
        cache: "no-store",
      }),
    ]);

    if (!registrationsResponse.ok || !capacitiesResponse.ok) {
      console.error("SHoP admin tournament data could not be loaded from Supabase.");
      return errorResponse("Could not load tournament registrations and capacity settings. Confirm the Phase 3 capacity migration has been applied.", 502);
    }

    const [registrations, capacities] = await Promise.all([
      registrationsResponse.json() as Promise<RegistrationRecord[]>,
      capacitiesResponse.json() as Promise<TournamentCapacity[]>,
    ]);
    return NextResponse.json({ registrations, capacities });
  } catch {
    return errorResponse("Could not connect to tournament registration storage.", 502);
  }
}

export async function PATCH(request: Request) {
  const access = await requireAdminApiAccess();
  if (!access.ok) return access.response;

  let payload: { id?: unknown; status?: unknown };
  try {
    payload = (await request.json()) as { id?: unknown; status?: unknown };
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  const id = typeof payload.id === "string" ? payload.id : "";
  const status = typeof payload.status === "string" ? payload.status : "";
  if (!uuidPattern.test(id)) return errorResponse("Invalid registration ID.", 400);
  if (!statuses.has(status as RegistrationStatus)) return errorResponse("Invalid registration status.", 400);

  try {
    const response = await fetch(`${access.supabaseUrl}/rest/v1/rpc/admin_update_tournament_registration_status`, {
      method: "POST",
      headers: {
        apikey: access.serviceRoleKey,
        Authorization: `Bearer ${access.serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_registration_id: id, p_status: status }),
      cache: "no-store",
    });

    if (!response.ok) {
      let providerMessage = "";
      try {
        const providerError = (await response.json()) as { message?: unknown; code?: unknown };
        providerMessage = `${String(providerError.message ?? "")} ${String(providerError.code ?? "")}`;
      } catch {
        // Keep provider details out of the public response.
      }
      if (/Registration not found|P0002/i.test(providerMessage)) return errorResponse("Registration not found.", 404);
      if (/No tournament places are available|capacity is not configured|P0001/i.test(providerMessage)) {
        return errorResponse("No place is currently available for this status change. Keep the player waitlisted or review tournament capacity settings.", 409);
      }
      if (/Invalid registration status|22023/i.test(providerMessage)) return errorResponse("Invalid registration status.", 400);
      console.error(`SHoP tournament registration status RPC failed with status ${response.status}.`);
      return errorResponse("Could not update this registration. Confirm the Phase 3 capacity migration has been applied.", 502);
    }

    const rpcResult = (await response.json()) as StatusRpcResult;
    const registration = rpcResult.registration;
    if (!registration) return errorResponse("The status update returned no registration.", 502);

    const changed = rpcResult.changed === true;
    const notification: NotificationResult = changed
      ? await sendStatusEmail(registration, registration.status)
      : "unchanged";
    const promotedRegistration = rpcResult.promoted_registration ?? null;
    const promotedNotification = promotedRegistration
      ? await sendStatusEmail(promotedRegistration, "confirmed")
      : undefined;

    return NextResponse.json({
      registration,
      promotedRegistration,
      notification,
      promotedNotification,
      autoPromoted: Boolean(promotedRegistration),
    });
  } catch {
    return errorResponse("Could not connect to tournament registration storage.", 502);
  }
}

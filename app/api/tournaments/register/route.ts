import { NextResponse } from "next/server";
import { getTournamentBySlug } from "@/data/events";
import { canAcceptTournamentRegistration } from "@/lib/tournament-registration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RegistrationPayload = {
  tournamentSlug?: unknown;
  fullName?: unknown;
  age?: unknown;
  phone?: unknown;
  email?: unknown;
  schoolOrClub?: unknown;
  guardianName?: unknown;
  guardianConsent?: unknown;
  notes?: unknown;
  website?: unknown;
};

type SavedRegistration = { id: string; status: "pending" | "waitlisted" };

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function badRequest(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  let payload: RegistrationPayload;
  try {
    payload = (await request.json()) as RegistrationPayload;
  } catch {
    return badRequest("Please check the registration form and try again.");
  }

  // Quietly discard bot submissions that fill the hidden honeypot field.
  if (cleanText(payload.website, 200)) {
    return NextResponse.json({ ok: true, message: "Registration received." });
  }

  const tournamentSlug = cleanText(payload.tournamentSlug, 120);
  const tournament = getTournamentBySlug(tournamentSlug);
  if (!tournament) return badRequest("We could not find that tournament.", 404);
  if (!canAcceptTournamentRegistration(tournament)) {
    return badRequest("Registration is closed for this tournament.", 409);
  }

  const fullName = cleanText(payload.fullName, 120);
  const age = Number(payload.age);
  const phone = cleanText(payload.phone, 30);
  const email = cleanText(payload.email, 254).toLowerCase();
  const schoolOrClub = cleanText(payload.schoolOrClub, 160);
  const guardianName = cleanText(payload.guardianName, 120);
  const guardianConsent = payload.guardianConsent === true;
  const notes = cleanText(payload.notes, 1000);

  if (fullName.length < 2) return badRequest("Please enter the player's full name.");
  if (!Number.isInteger(age) || age < 5 || age > 100) {
    return badRequest("Please enter a valid age between 5 and 100.");
  }
  if (phone.length < 7 || !/^[+()\d\s.-]+$/.test(phone)) {
    return badRequest("Please enter a valid phone number.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest("Please enter a valid email address.");
  }
  if (age < 18 && (!guardianName || !guardianConsent)) {
    return badRequest("Players under 18 must provide a parent or guardian name and consent.");
  }

  const supabaseUrl = (
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  )?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("SHoP tournament registration storage is not configured. Check server environment variables.");
    return badRequest("The registration service is not configured yet. Please contact SHoP or try again later.", 503);
  }

  const registration = {
    tournament_slug: tournament.slug,
    tournament_name: tournament.name,
    participant_name: fullName,
    age,
    phone,
    email,
    school_or_club: schoolOrClub || null,
    guardian_name: age < 18 ? guardianName : null,
    guardian_consent: age < 18 && guardianConsent,
    notes: notes || null,
    status: "pending",
    // Keep this as the full published capacity. The database capacity table is authoritative.
    capacity_limit: tournament.maxPlayers ?? null,
  };

  let response: Response;
  try {
    response = await fetch(
      `${supabaseUrl}/rest/v1/tournament_registrations?select=id,status`,
      {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(registration),
        cache: "no-store",
      }
    );
  } catch {
    return badRequest("We could not reach the registration service. Please try again later.", 502);
  }

  if (!response.ok) {
    let providerError = "";
    try {
      const errorPayload = (await response.json()) as { code?: unknown; message?: unknown };
      providerError = `${String(errorPayload.code ?? "")} ${String(errorPayload.message ?? "")}`;
    } catch {
      // Do not expose provider response details to the public client.
    }

    if (
      response.status === 409 ||
      providerError.includes("23505") ||
      providerError.includes("P0001") ||
      /already registered|capacity|not configured/i.test(providerError)
    ) {
      return badRequest(
        "This email may already be registered, or SHoP has not configured capacity for this tournament. Please contact SHoP if you need help.",
        409
      );
    }

    console.error(`SHoP tournament registration insert failed with status ${response.status}.`);
    return badRequest("We could not save your registration. Please try again later.", 502);
  }

  let savedRegistration: SavedRegistration | undefined;
  try {
    const rows = (await response.json()) as SavedRegistration[];
    savedRegistration = rows[0];
  } catch {
    return badRequest("Your request may have been saved, but we could not confirm its status. Please contact SHoP before submitting again.", 502);
  }

  if (!savedRegistration) {
    return badRequest("Your request may have been saved, but we could not confirm its status. Please contact SHoP before submitting again.", 502);
  }

  if (savedRegistration.status === "waitlisted") {
    return NextResponse.json({
      ok: true,
      status: "waitlisted",
      message: "The tournament has reached its current capacity. Your request has been saved to the waitlist in submission order. SHoP will contact you if a place becomes available.",
    });
  }

  return NextResponse.json({
    ok: true,
    status: savedRegistration.status,
    message: "Your registration request has been received and is pending review. SHoP will contact you using the details provided.",
  });
}

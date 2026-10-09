import { NextResponse } from "next/server";

export const runtime = "nodejs";

const allowedExperience = new Set([
  "beginner",
  "developing",
  "intermediate",
  "competitive",
]);
const allowedInterest = new Set([
  "learning",
  "playing",
  "tournaments",
  "community",
  "all",
]);

type JoinPayload = {
  fullName?: unknown;
  age?: unknown;
  guardianName?: unknown;
  guardianConsent?: unknown;
  phone?: unknown;
  email?: unknown;
  school?: unknown;
  experience?: unknown;
  interest?: unknown;
  message?: unknown;
  website?: unknown;
};

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let payload: JoinPayload;

  try {
    payload = (await request.json()) as JoinPayload;
  } catch {
    return badRequest("Please check the form and try again.");
  }

  // Honeypot: silently accept the request without forwarding obvious bot submissions.
  if (cleanText(payload.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const fullName = cleanText(payload.fullName, 120);
  const ageValue = typeof payload.age === "string" || typeof payload.age === "number"
    ? Number(payload.age)
    : Number.NaN;
  const guardianName = cleanText(payload.guardianName, 120);
  const guardianConsent = payload.guardianConsent === true;
  const phone = cleanText(payload.phone, 40);
  const email = cleanText(payload.email, 254);
  const school = cleanText(payload.school, 160);
  const experience = cleanText(payload.experience, 30);
  const interest = cleanText(payload.interest, 30);
  const message = cleanText(payload.message, 2000);

  if (!fullName || fullName.length < 2) {
    return badRequest("Please enter your full name.");
  }
  if (!Number.isInteger(ageValue) || ageValue < 5 || ageValue > 100) {
    return badRequest("Please enter a valid age between 5 and 100.");
  }
  if (!phone || phone.length < 7) {
    return badRequest("Please enter a valid phone number.");
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest("Please enter a valid email address.");
  }
  if (ageValue < 18 && (!guardianName || !guardianConsent)) {
    return badRequest(
      "Applicants under 18 must provide a parent or guardian name and confirm they have permission to apply."
    );
  }
  if (!allowedExperience.has(experience)) {
    return badRequest("Please select your chess experience level.");
  }
  if (!allowedInterest.has(interest)) {
    return badRequest("Please select what you are interested in.");
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.SHOP_JOIN_TO_EMAIL;
  const sender = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !recipient || !sender) {
    console.error(
      "SHoP Join submission is not configured. Set RESEND_API_KEY, SHOP_JOIN_TO_EMAIL, and RESEND_FROM_EMAIL."
    );
    return NextResponse.json(
      {
        ok: false,
        error:
          "The registration service is not configured yet. Please contact SHoP directly or try again later.",
      },
      { status: 503 }
    );
  }

  const lines = [
    "A new SHoP membership application was submitted.",
    "",
    `Full name: ${fullName}`,
    `Age: ${ageValue}`,
    `Phone: ${phone}`,
    `Email: ${email || "Not provided"}`,
    `Parent / guardian: ${guardianName || "Not provided"}`,
    `Guardian permission confirmed: ${ageValue < 18 ? "Yes" : "Not required (18+)"}`,
    `School / organisation: ${school || "Not provided"}`,
    `Chess experience: ${experience}`,
    `Interest: ${interest}`,
    "",
    "Additional message:",
    message || "None provided",
  ];

  let emailResponse: Response;
  try {
    emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        subject: `New SHoP application — ${fullName}`,
        text: lines.join("\n"),
        ...(email ? { reply_to: email } : {}),
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "We could not send your application right now. Please try again later.",
      },
      { status: 502 }
    );
  }

  if (!emailResponse.ok) {
    // Do not log application content or the provider's potentially sensitive response body.
    console.error(`SHoP Join email delivery failed with status ${emailResponse.status}.`);
    return NextResponse.json(
      {
        ok: false,
        error: "We could not send your application right now. Please try again later.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

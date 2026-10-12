import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { darajaAccessToken, darajaTimestamp, darajaUrl, normalizeKenyanPhone, requiredEnv } from "@/lib/daraja";
import { checkDonationRateLimit, createDonation, updateDonation } from "@/lib/donationStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanOptional(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function POST(request: Request) {
  let donationId = "";
  try {
    const body = await request.json() as { amount?: unknown; phone?: unknown; name?: unknown; email?: unknown };
    if (!Number.isInteger(body.amount) || typeof body.amount !== "number" || body.amount < 1 || body.amount > 150000) {
      return NextResponse.json({ error: "Donation amount must be a whole number between KSh 1 and KSh 150,000." }, { status: 400 });
    }
    if (typeof body.phone !== "string") return NextResponse.json({ error: "Enter your M-Pesa phone number." }, { status: 400 });
    const phone = normalizeKenyanPhone(body.phone);
    const email = cleanOptional(body.email, 254);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address or leave it blank." }, { status: 400 });
    const name = cleanOptional(body.name, 100);
    const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rateLimitSecret = requiredEnv("DONATION_RATE_LIMIT_SECRET");
    const ipHash = createHmac("sha256", rateLimitSecret).update(ip).digest("hex");
    if (!(await checkDonationRateLimit(ipHash))) {
      return NextResponse.json({ error: "Too many donation requests from this connection. Please wait a few minutes and try again." }, { status: 429 });
    }
    donationId = randomUUID();

    await createDonation({ id: donationId, amount: body.amount, phone, donor_name: name, donor_email: email, status: "pending" });

    const shortcode = requiredEnv("DARAJA_SHORTCODE");
    const passkey = requiredEnv("DARAJA_PASSKEY");
    const callbackUrl = requiredEnv("DARAJA_CALLBACK_URL");
    const callback = new URL(callbackUrl);
    if (callback.protocol !== "https:" || callback.hostname === "localhost" || callback.hostname === "127.0.0.1") {
      throw new Error("DARAJA_CALLBACK_URL must be a publicly reachable HTTPS URL.");
    }
    const transactionType = process.env.DARAJA_TRANSACTION_TYPE === "CustomerBuyGoodsOnline" ? "CustomerBuyGoodsOnline" : "CustomerPayBillOnline";
    const partyB = process.env.DARAJA_PARTY_B?.trim() || shortcode;
    const token = await darajaAccessToken();
    const timestamp = darajaTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
    const response = await fetch(darajaUrl("/mpesa/stkpush/v1/processrequest"), {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, cache: "no-store",
      body: JSON.stringify({
        BusinessShortCode: shortcode, Password: password, Timestamp: timestamp, TransactionType: transactionType,
        Amount: body.amount, PartyA: phone, PartyB: partyB, PhoneNumber: phone,
        CallBackURL: callbackUrl, AccountReference: "SHoP-DONATION", TransactionDesc: "SHoP community donation",
      }),
    });
    const data = await response.json().catch(() => null) as Record<string, unknown> | null;
    if (!response.ok || !data || data.ResponseCode !== "0" || typeof data.CheckoutRequestID !== "string") {
      await updateDonation(donationId, { status: "failed", result_description: typeof data?.errorMessage === "string" ? data.errorMessage.slice(0, 500) : "M-Pesa did not accept the request." });
      return NextResponse.json({ error: "M-Pesa could not start the payment request. Please try again later." }, { status: 502 });
    }
    await updateDonation(donationId, { merchant_request_id: data.MerchantRequestID ?? null, checkout_request_id: data.CheckoutRequestID, result_description: typeof data.CustomerMessage === "string" ? data.CustomerMessage.slice(0, 500) : null });
    return NextResponse.json({ donationId, message: typeof data.CustomerMessage === "string" ? data.CustomerMessage : "Check your phone and enter your M-Pesa PIN to approve the donation." }, { status: 202 });
  } catch (error) {
    if (donationId) {
      try { await updateDonation(donationId, { status: "failed", result_description: error instanceof Error ? error.message.slice(0, 500) : "Donation request failed." }); } catch { /* Keep the original safe error response. */ }
    }
    const message = error instanceof Error ? error.message : "Donation request could not be started.";
    const status = message.startsWith("Missing server environment variable:") ? 503 : 400;
    return NextResponse.json({ error: status === 503 ? "M-Pesa donations are not configured yet. Please contact SHoP directly." : message }, { status });
  }
}

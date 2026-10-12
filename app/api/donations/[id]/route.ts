import { NextResponse } from "next/server";
import { getDonation } from "@/lib/donationStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Donation not found." }, { status: 404 });
    const donation = await getDonation(id);
    if (!donation) return NextResponse.json({ error: "Donation not found." }, { status: 404 });
    return NextResponse.json({ status: donation.status, amount: donation.amount, receiptNumber: donation.status === "paid" ? donation.mpesa_receipt_number : null, message: donation.status === "paid" ? "Donation confirmed. Thank you for supporting SHoP." : donation.status === "failed" ? "The payment was not completed. You may start a new request if no payment was deducted." : "Waiting for verified M-Pesa payment confirmation." }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Donation status is temporarily unavailable." }, { status: 503 });
  }
}

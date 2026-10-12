import { NextResponse } from "next/server";
import { queryStkPayment } from "@/lib/daraja";
import { updateDonationByCheckout } from "@/lib/donationStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      Body?: {
        stkCallback?: {
          MerchantRequestID?: string;
          CheckoutRequestID?: string;
          ResultCode?: number;
          ResultDesc?: string;
          CallbackMetadata?: { Item?: Array<{ Name?: string; Value?: string | number }> };
        };
      };
    };
    const callback = body?.Body?.stkCallback;
    const checkoutId = callback?.CheckoutRequestID;
    if (!callback || typeof checkoutId !== "string") return NextResponse.json({ ResultCode: 0, ResultDesc: "Callback received" });

    const items = callback.CallbackMetadata?.Item ?? [];
    const metadata = Object.fromEntries(items.filter((item) => typeof item.Name === "string").map((item) => [item.Name as string, item.Value]));
    const common = {
      merchant_request_id: callback.MerchantRequestID ?? null,
      mpesa_receipt_number: typeof metadata.MpesaReceiptNumber === "string" ? metadata.MpesaReceiptNumber : null,
      callback_result_code: typeof callback.ResultCode === "number" ? callback.ResultCode : null,
      result_description: typeof callback.ResultDesc === "string" ? callback.ResultDesc.slice(0, 500) : null,
      callback_received_at: new Date().toISOString(),
    };

    // Daraja callbacks are not cryptographically signed. Treat callback data as a signal,
    // then verify the CheckoutRequestID server-to-server before marking a donation paid.
    try {
      const query = await queryStkPayment(checkoutId);
      const responseCode = String(query.ResponseCode ?? "");
      const resultCode = String(query.ResultCode ?? "");
      if (responseCode === "0" && resultCode === "0") {
        await updateDonationByCheckout(checkoutId, { ...common, status: "paid", verified_at: new Date().toISOString() });
      } else if (responseCode === "0" && resultCode !== "" && resultCode !== "0") {
        // Only a completed provider query with a non-zero result may fail a pending payment.
        await updateDonationByCheckout(checkoutId, { ...common, status: "failed", mpesa_receipt_number: null });
      } else {
        await updateDonationByCheckout(checkoutId, common);
      }
    } catch {
      // Keep the donation pending if verification is temporarily unavailable; never infer success from callback alone.
      await updateDonationByCheckout(checkoutId, common);
    }
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Callback processed" });
  } catch {
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Callback processing failed; retry may be required." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { queryStkPayment } from "@/lib/daraja";
import { shopDb } from "@/lib/shop-commerce-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StkCallback = {
  CheckoutRequestID?: string;
  MerchantRequestID?: string;
  ResultCode?: number;
  ResultDesc?: string;
  CallbackMetadata?: {
    Item?: Array<{ Name?: string; Value?: string | number }>;
  };
};

export async function POST(req: Request) {
  let checkoutId: string | undefined;

  try {
    const body = (await req.json()) as {
      Body?: { stkCallback?: StkCallback };
    };
    const callback = body?.Body?.stkCallback;
    checkoutId = callback?.CheckoutRequestID;

    if (!callback || typeof checkoutId !== "string" || !checkoutId) {
      console.warn("[SHoP Daraja order callback] Missing callback/CheckoutRequestID");
      // A malformed callback cannot be matched to an order.
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Callback received" });
    }

    const items = callback.CallbackMetadata?.Item ?? [];
    const metadata = Object.fromEntries(
      items
        .filter((item) => typeof item.Name === "string")
        .map((item) => [item.Name as string, item.Value]),
    );

    let verifiedPaid = false;
    let verifiedFailed = false;
    let verificationState = "unavailable";

    try {
      const query = await queryStkPayment(checkoutId);
      const responseCode = String(query.ResponseCode ?? "");
      const resultCode =
        query.ResultCode === undefined || query.ResultCode === null
          ? ""
          : String(query.ResultCode);

      // Only a complete successful provider query with ResultCode 0 verifies payment.
      verifiedPaid = responseCode === "0" && resultCode === "0";

      // IMPORTANT: an empty/missing ResultCode is not a failed payment.
      // Only treat it as failed when Daraja returned a completed query and a real,
      // non-zero ResultCode.
      verifiedFailed =
        responseCode === "0" &&
        resultCode !== "" &&
        resultCode !== "0";

      verificationState = verifiedPaid
        ? "paid"
        : verifiedFailed
          ? "failed"
          : "pending_or_inconclusive";

      if (responseCode !== "0" || resultCode === "") {
        console.warn("[SHoP Daraja order callback] Inconclusive STK query", {
          checkoutId,
          responseCode: responseCode || "missing",
          resultCode: resultCode || "missing",
          callbackResultCode: callback.ResultCode ?? "missing",
        });
      }
    } catch (error) {
      console.error("[SHoP Daraja order callback] STK query failed", {
        checkoutId,
        message: error instanceof Error ? error.message : "Unknown query error",
      });
    }

    const patch: Record<string, unknown> = {
      merchant_request_id: callback.MerchantRequestID ?? null,
      payment_result:
        typeof callback.ResultDesc === "string"
          ? callback.ResultDesc.slice(0, 400)
          : null,
    };

    if (verifiedPaid) {
      patch.payment_status = "paid";
      patch.order_status = "paid_review";
      patch.mpesa_receipt_number =
        typeof metadata.MpesaReceiptNumber === "string"
          ? metadata.MpesaReceiptNumber
          : null;
      patch.paid_at = new Date().toISOString();
    } else if (verifiedFailed) {
      patch.payment_status = "failed";
      patch.order_status = "cancelled";
      patch.mpesa_receipt_number = null;
    }
    // When verification is unavailable/inconclusive, keep the order pending.
    // Never cancel an order just because ResultCode is missing.

    const dbResult = await shopDb(
      `shop_orders?checkout_request_id=eq.${encodeURIComponent(checkoutId)}`,
      { method: "PATCH", body: JSON.stringify(patch) },
    );

    // shopDb implementations commonly throw on non-2xx responses. Also inspect
    // a returned Response-like value when one is provided, so a failed update
    // is not silently acknowledged.
    if (
      dbResult &&
      typeof dbResult === "object" &&
      "ok" in dbResult &&
      (dbResult as { ok?: unknown }).ok === false
    ) {
      const response = dbResult as { status?: unknown; text?: () => Promise<string> };
      const details =
        typeof response.text === "function"
          ? (await response.text()).slice(0, 500)
          : "";
      console.error("[SHoP Daraja order callback] Database PATCH returned non-OK", {
        checkoutId,
        status: response.status ?? "unknown",
        details,
      });
      return NextResponse.json(
        { ResultCode: 1, ResultDesc: "Order update failed" },
        { status: 500 },
      );
    }

    console.info("[SHoP Daraja order callback] Processed", {
      checkoutId,
      verificationState,
      callbackResultCode: callback.ResultCode ?? "missing",
      receiptPresent: typeof metadata.MpesaReceiptNumber === "string",
    });

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Callback processed" });
  } catch (error) {
    console.error("[SHoP Daraja order callback] Processing failed", {
      checkoutId: checkoutId ?? "unknown",
      message: error instanceof Error ? error.message : "Unknown callback error",
    });
    return NextResponse.json(
      { ResultCode: 1, ResultDesc: "Callback processing failed" },
      { status: 500 },
    );
  }
}

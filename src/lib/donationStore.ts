import { requiredEnv } from "@/lib/daraja";

function supabaseUrl() { return (process.env.SUPABASE_URL?.trim() || requiredEnv("NEXT_PUBLIC_SUPABASE_URL")).replace(/\/$/, ""); }
function headers(extra?: HeadersInit): HeadersInit {
  const key = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...extra };
}

export type DonationRow = {
  id: string; amount: number; phone: string; donor_name: string | null; donor_email: string | null;
  status: "pending" | "paid" | "failed"; merchant_request_id: string | null; checkout_request_id: string | null; mpesa_receipt_number: string | null;
};

export async function createDonation(row: Pick<DonationRow, "id" | "amount" | "phone" | "donor_name" | "donor_email" | "status">) {
  const response = await fetch(`${supabaseUrl()}/rest/v1/shop_donations`, { method: "POST", headers: headers({ Prefer: "return=representation" }), cache: "no-store", body: JSON.stringify(row) });
  if (!response.ok) throw new Error(`Donation could not be saved (database HTTP ${response.status}).`);
  return response.json() as Promise<DonationRow[]>;
}

export async function updateDonation(id: string, values: Record<string, unknown>) {
  const response = await fetch(`${supabaseUrl()}/rest/v1/shop_donations?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: headers({ Prefer: "return=minimal" }), cache: "no-store", body: JSON.stringify({ ...values, updated_at: new Date().toISOString() }) });
  if (!response.ok) throw new Error(`Donation status could not be saved (database HTTP ${response.status}).`);
}

export async function updateDonationByCheckout(checkoutRequestId: string, values: Record<string, unknown>) {
  const response = await fetch(`${supabaseUrl()}/rest/v1/shop_donations?checkout_request_id=eq.${encodeURIComponent(checkoutRequestId)}&status=eq.pending`, { method: "PATCH", headers: headers({ Prefer: "return=representation" }), cache: "no-store", body: JSON.stringify({ ...values, updated_at: new Date().toISOString() }) });
  if (!response.ok) throw new Error(`Donation status could not be saved (database HTTP ${response.status}).`);
  return response.json() as Promise<DonationRow[]>;
}

export async function getDonation(id: string) {
  const response = await fetch(`${supabaseUrl()}/rest/v1/shop_donations?id=eq.${encodeURIComponent(id)}&select=id,status,amount,mpesa_receipt_number&limit=1`, { headers: headers(), cache: "no-store" });
  if (!response.ok) throw new Error("Donation status could not be loaded.");
  const rows = await response.json() as Array<Pick<DonationRow, "id" | "status" | "amount" | "mpesa_receipt_number">>;
  return rows[0] ?? null;
}

export async function checkDonationRateLimit(ipHash: string): Promise<boolean> {
  const response = await fetch(`${supabaseUrl()}/rest/v1/rpc/shop_check_donation_rate_limit`, {
    method: "POST", headers: headers(), cache: "no-store", body: JSON.stringify({ p_ip_hash: ipHash }),
  });
  if (!response.ok) throw new Error("Donation request limit could not be checked.");
  return response.json() as Promise<boolean>;
}

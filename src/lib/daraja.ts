import "server-only";

export function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing server environment variable: ${name}`);
  return value;
}

function darajaBaseUrl(): string {
  const environment = (process.env.DARAJA_ENV ?? "sandbox").trim().toLowerCase();
  if (environment === "production") return "https://api.safaricom.co.ke";
  if (environment === "sandbox") return "https://sandbox.safaricom.co.ke";
  throw new Error("DARAJA_ENV must be either production or sandbox.");
}

export function normalizeKenyanPhone(input: string): string {
  const digits = input.replace(/[\s()+.-]/g, "");
  if (/^0[17]\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
  if (/^[17]\d{8}$/.test(digits)) return `254${digits}`;
  if (/^254[17]\d{8}$/.test(digits)) return digits;
  throw new Error("Enter a valid Kenyan M-Pesa number, such as 0712345678 or 254712345678.");
}

export function darajaTimestamp(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}${values.month}${values.day}${values.hour}${values.minute}${values.second}`;
}

export async function darajaAccessToken(): Promise<string> {
  const credentials = Buffer.from(`${requiredEnv("DARAJA_CONSUMER_KEY")}:${requiredEnv("DARAJA_CONSUMER_SECRET")}`).toString("base64");
  const response = await fetch(`${darajaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` }, cache: "no-store",
  });
  const data = await response.json().catch(() => null) as { access_token?: string; errorMessage?: string } | null;
  if (!response.ok || !data?.access_token) throw new Error(data?.errorMessage || `Daraja OAuth failed (${response.status}).`);
  return data.access_token;
}

export async function queryStkPayment(checkoutRequestId: string) {
  const token = await darajaAccessToken();
  const shortcode = requiredEnv("DARAJA_SHORTCODE");
  const timestamp = darajaTimestamp();
  const password = Buffer.from(`${shortcode}${requiredEnv("DARAJA_PASSKEY")}${timestamp}`).toString("base64");
  const response = await fetch(`${darajaBaseUrl()}/mpesa/stkpushquery/v1/query`, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, cache: "no-store",
    body: JSON.stringify({ BusinessShortCode: shortcode, Password: password, Timestamp: timestamp, CheckoutRequestID: checkoutRequestId }),
  });
  const data = await response.json().catch(() => null) as Record<string, unknown> | null;
  if (!response.ok || !data) throw new Error(`Daraja STK query failed (${response.status}).`);
  return data;
}

export function darajaUrl(path: string) { return `${darajaBaseUrl()}${path}`; }

export function darajaTransactionType(): "CustomerPayBillOnline" | "CustomerBuyGoodsOnline" {
  const value = process.env.DARAJA_TRANSACTION_TYPE?.trim();
  if (value === "CustomerPayBillOnline" || value === "CustomerBuyGoodsOnline") return value;
  throw new Error("Set DARAJA_TRANSACTION_TYPE explicitly to the value approved for your Daraja shortcode.");
}

export function validatePublicCallbackUrl(value: string, variableName: string): string {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname.endsWith(".ngrok-free.app") && process.env.DARAJA_ENV === "production") {
    throw new Error(`${variableName} must be a stable public HTTPS URL for the configured environment.`);
  }
  return url.toString();
}

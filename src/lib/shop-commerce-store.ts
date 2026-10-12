import { requiredEnv } from "@/lib/daraja";
const base = () => `${requiredEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "")}/rest/v1`;
const key = () => requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
export async function shopDb(path: string, init: RequestInit = {}) {
 const response = await fetch(`${base()}/${path}`, { ...init, cache: "no-store", headers: { apikey:key(), Authorization:`Bearer ${key()}`, "Content-Type":"application/json", ...(init.headers ?? {}) } });
 const text = await response.text(); let data: unknown = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
 if (!response.ok) throw new Error(`Shop database request failed (${response.status}).`);
 return { data, headers: response.headers };
}
export function escapeFilter(value: string) { return value.replace(/[(),]/g, ""); }

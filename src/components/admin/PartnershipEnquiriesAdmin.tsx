"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Enquiry = {
  id: string; kind: "school" | "sponsor"; organisation: string; contact_name: string;
  contact_role: string; email: string; phone: string; location: string | null;
  interest: string; scale: string | null; timeline: string | null; message: string;
  status: "new" | "reviewing" | "contacted" | "approved" | "declined" | "closed";
  created_at: string;
};
const statuses: Enquiry["status"][] = ["new", "reviewing", "contacted", "approved", "declined", "closed"];
const labels: Record<Enquiry["status"], string> = { new: "New", reviewing: "Reviewing", contacted: "Contacted", approved: "Approved", declined: "Declined", closed: "Closed" };

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Nairobi" }).format(date);
}

export default function PartnershipEnquiriesAdmin() {
  const router = useRouter();
  const [items, setItems] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState<"all" | "school" | "sponsor">("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/partnership-enquiries", { cache: "no-store" });
      const result = await response.json() as { enquiries?: Enquiry[]; error?: string };
      if (response.status === 401) { router.replace("/admin/login"); router.refresh(); return; }
      if (!response.ok) { setError(result.error || "Could not load enquiries."); return; }
      setItems(result.enquiries ?? []);
    } catch { setError("Could not connect to enquiry storage."); }
    finally { setLoading(false); }
  }, [router]);
  useEffect(() => { void load(); }, [load]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter(item =>
      (filter === "all" || item.kind === filter) &&
      (statusFilter === "all" || item.status === statusFilter) &&
      (!term || [item.organisation,item.contact_name,item.email,item.phone,item.interest,item.location ?? ""].some(v=>v.toLowerCase().includes(term)))
    );
  }, [items,filter,statusFilter,search]);

  async function updateStatus(id: string, status: Enquiry["status"]) {
    setUpdating(id); setError(""); setNotice("");
    try {
      const response = await fetch("/api/partnership-enquiries", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id,status}) });
      const result = await response.json() as { enquiry?: Enquiry; error?: string };
      if (response.status === 401) { router.replace("/admin/login"); router.refresh(); return; }
      if (!response.ok || !result.enquiry) { setError(result.error || "Could not update enquiry."); return; }
      setItems(current=>current.map(item=>item.id===id?result.enquiry!:item));
      setNotice("Enquiry status updated.");
    } catch { setError("Could not connect to enquiry storage."); }
    finally { setUpdating(null); }
  }

  const newCount = items.filter(item=>item.status==="new").length;
  return (
    <main className="min-h-screen bg-shop-cream px-4 py-8 text-shop-ink sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="shop-eyebrow text-shop-muted">SHoP · Admin workspace</p><h1 className="shop-display mt-3 text-4xl sm:text-5xl">Partnership enquiries.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-shop-muted">Review school programme requests and sponsor or organisational partnership proposals in one protected workspace.</p></div>
          <button onClick={()=>void load()} className="border border-shop-ink px-5 py-3 text-sm font-semibold hover:bg-white">Refresh enquiries</button>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="border border-shop-border bg-white p-5"><p className="text-xs text-shop-muted">Total enquiries</p><p className="shop-display mt-2 text-4xl">{items.length}</p></div>
          <div className="border border-shop-border bg-white p-5"><p className="text-xs text-shop-muted">Awaiting first review</p><p className="shop-display mt-2 text-4xl">{newCount}</p></div>
          <div className="border border-shop-border bg-white p-5"><p className="text-xs text-shop-muted">School / sponsor</p><p className="shop-display mt-2 text-4xl">{items.filter(x=>x.kind==="school").length} / {items.filter(x=>x.kind==="sponsor").length}</p></div>
        </div>
        <div className="mt-7 flex flex-col gap-3 border border-shop-border bg-shop-paper p-4 md:flex-row">
          <input aria-label="Search enquiries" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search organisation, contact, email…" className="min-w-0 flex-1 border border-shop-border bg-white px-4 py-3 text-sm outline-none focus:border-shop-ink" />
          <select aria-label="Enquiry type" value={filter} onChange={e=>setFilter(e.target.value as typeof filter)} className="border border-shop-border bg-white px-4 py-3 text-sm"><option value="all">All types</option><option value="school">School</option><option value="sponsor">Sponsor / organisation</option></select>
          <select aria-label="Enquiry status" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="border border-shop-border bg-white px-4 py-3 text-sm"><option value="all">All statuses</option>{statuses.map(x=><option key={x} value={x}>{labels[x]}</option>)}</select>
        </div>
        {error && <p role="alert" className="mt-4 border border-red-300 bg-red-50 p-4 text-sm text-red-900">{error}</p>}
        {notice && <p role="status" className="mt-4 border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">{notice}</p>}
        {loading ? <p className="py-12 text-sm text-shop-muted">Loading enquiries…</p> : visible.length===0 ? <div className="mt-6 border border-shop-border bg-white p-8 text-sm text-shop-muted">No enquiries match these filters.</div> : (
          <div className="mt-6 space-y-4">{visible.map(item=>(
            <article key={item.id} className="border border-shop-border bg-white p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><div className="flex flex-wrap gap-2"><span className="bg-stone-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">{item.kind==="school"?"School partnership":"Sponsor / organisation"}</span><span className="bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">{labels[item.status]}</span></div><h2 className="shop-display mt-3 text-3xl">{item.organisation}</h2><p className="mt-1 text-xs text-shop-muted">Received {dateLabel(item.created_at)}</p></div>
                <div className="flex items-center gap-2"><label className="sr-only" htmlFor={`status-${item.id}`}>Update enquiry status</label><select id={`status-${item.id}`} disabled={updating===item.id} value={item.status} onChange={e=>void updateStatus(item.id,e.target.value as Enquiry["status"])} className="border border-shop-border bg-white px-3 py-2 text-sm">{statuses.map(x=><option key={x} value={x}>{labels[x]}</option>)}</select></div>
              </div>
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <p><span className="text-shop-muted">Contact:</span> {item.contact_name} · {item.contact_role}</p>
                <p><span className="text-shop-muted">Email:</span> <a className="underline" href={`mailto:${item.email}`}>{item.email}</a></p>
                <p><span className="text-shop-muted">Phone:</span> <a className="underline" href={`tel:${item.phone}`}>{item.phone}</a></p>
                <p><span className="text-shop-muted">Location:</span> {item.location || "Not provided"}</p>
                <p><span className="text-shop-muted">Interest:</span> {item.interest}</p>
                <p><span className="text-shop-muted">Scale / range:</span> {item.scale || "Not provided"} · {item.timeline || "No timeline"}</p>
              </div>
              <p className="mt-5 whitespace-pre-wrap border-t border-shop-border pt-4 text-sm leading-7">{item.message}</p>
            </article>
          ))}</div>
        )}
      </div>
    </main>
  );
}

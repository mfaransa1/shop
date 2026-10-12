"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type RegistrationStatus = "pending" | "confirmed" | "waitlisted" | "cancelled";
type StatusFilter = RegistrationStatus | "all";

type TournamentCapacity = {
  tournament_slug: string;
  tournament_name: string;
  capacity: number;
  baseline_occupied: number;
  occupied_registrations: number;
  waitlisted_registrations: number;
  auto_promote_waitlist: boolean;
};

type TournamentRegistration = {
  id: string;
  created_at: string;
  tournament_slug: string;
  tournament_name: string;
  participant_name: string;
  age: number;
  phone: string;
  email: string;
  school_or_club: string | null;
  guardian_name: string | null;
  guardian_consent: boolean;
  notes: string | null;
  status: RegistrationStatus;
  capacity_limit: number | null;
};

const statusLabels: Record<RegistrationStatus, string> = {
  pending: "Pending review",
  confirmed: "Confirmed",
  waitlisted: "Waitlisted",
  cancelled: "Cancelled",
};

const statusStyles: Record<RegistrationStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  confirmed: "bg-emerald-100 text-emerald-900",
  waitlisted: "bg-blue-100 text-blue-900",
  cancelled: "bg-stone-200 text-stone-700",
};

const statusOptions: RegistrationStatus[] = ["pending", "confirmed", "waitlisted", "cancelled"];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  }).format(date);
}

export function AdminTournamentRegistrations({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
  const [capacities, setCapacities] = useState<TournamentCapacity[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [tournamentFilter, setTournamentFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/admin/tournament-registrations", {
        cache: "no-store",
      });
      const result = (await response.json()) as {
        registrations?: TournamentRegistration[];
        capacities?: TournamentCapacity[];
        error?: string;
      };

      if (response.status === 401) {
        router.replace("/admin/login");
        router.refresh();
        return;
      }
      if (!response.ok) {
        setErrorMessage(result.error || "Could not load tournament registrations.");
        return;
      }
      setRegistrations(result.registrations ?? []);
      setCapacities(result.capacities ?? []);
    } catch {
      setErrorMessage("Could not connect to tournament registration storage. Try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadRegistrations();
  }, [loadRegistrations]);

  const tournamentOptions = useMemo(() => {
    const bySlug = new Map<string, string>();
    registrations.forEach((registration) => {
      bySlug.set(registration.tournament_slug, registration.tournament_name);
    });
    return [...bySlug.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [registrations]);

  const visibleRegistrations = useMemo(() => {
    const term = search.trim().toLowerCase();
    return registrations.filter((registration) => {
      const matchesStatus = statusFilter === "all" || registration.status === statusFilter;
      const matchesTournament = tournamentFilter === "all" || registration.tournament_slug === tournamentFilter;
      const matchesSearch = !term || [
        registration.participant_name,
        registration.email,
        registration.phone,
        registration.tournament_name,
        registration.school_or_club ?? "",
        registration.guardian_name ?? "",
      ].some((value) => value.toLowerCase().includes(term));
      return matchesStatus && matchesTournament && matchesSearch;
    });
  }, [registrations, search, statusFilter, tournamentFilter]);

  const counts = useMemo(() => {
    return registrations.reduce<Record<RegistrationStatus, number>>(
      (total, registration) => {
        total[registration.status] += 1;
        return total;
      },
      { pending: 0, confirmed: 0, waitlisted: 0, cancelled: 0 }
    );
  }, [registrations]);

  async function updateStatus(id: string, status: RegistrationStatus) {
    setUpdatingId(id);
    setErrorMessage("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/tournament-registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const result = (await response.json()) as {
        registration?: TournamentRegistration;
        promotedRegistration?: TournamentRegistration | null;
        notification?: "sent" | "not_configured" | "failed" | "unchanged";
        promotedNotification?: "sent" | "not_configured" | "failed" | "unchanged";
        autoPromoted?: boolean;
        error?: string;
      };

      if (response.status === 401) {
        router.replace("/admin/login");
        router.refresh();
        return;
      }
      if (!response.ok || !result.registration) {
        setErrorMessage(result.error || "Could not update this registration.");
        return;
      }

      const promotedRegistration = result.promotedRegistration;
      setRegistrations((current) => {
        const next = current.map((registration) =>
          registration.id === id ? result.registration! : registration
        );
        if (!promotedRegistration) return next;
        if (next.some((registration) => registration.id === promotedRegistration.id)) {
          return next.map((registration) =>
            registration.id === promotedRegistration.id ? promotedRegistration : registration
          );
        }
        return [promotedRegistration, ...next];
      });
      const statusNotice = `Registration status updated to ${statusLabels[status]}.`;
      let notificationNotice = statusNotice;
      if (result.notification === "sent") {
        notificationNotice += " An email update was sent to the registered email address.";
      } else if (result.notification === "not_configured") {
        notificationNotice += " Email notifications are not configured; contact the player manually.";
      } else if (result.notification === "failed") {
        notificationNotice += " The email notification could not be sent; contact the player manually.";
      }

      if (result.promotedRegistration) {
        const promotedName = result.promotedRegistration.participant_name;
        if (result.promotedNotification === "sent") {
          notificationNotice += ` A place was released, so ${promotedName} was automatically promoted from the waitlist and emailed.`;
        } else if (result.promotedNotification === "not_configured") {
          notificationNotice += ` A place was released, so ${promotedName} was automatically promoted from the waitlist. Email is not configured; contact the player manually.`;
        } else {
          notificationNotice += ` A place was released, so ${promotedName} was automatically promoted from the waitlist, but their email could not be confirmed as sent. Contact the player manually.`;
        }
      }
      setNotice(notificationNotice);
      await loadRegistrations();
    } catch {
      setErrorMessage("Could not connect to the registration service. Try again.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-shop-cream text-shop-ink">
      <header className="border-b border-shop-border bg-white">
        <div className="shop-container flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-shop-muted">SHoP · Private admin</p>
            <h1 className="shop-display mt-2 text-3xl sm:text-4xl">Tournament registrations</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin" className="border border-shop-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-shop-cream">
              Membership applications
            </Link>
            <span className="hidden max-w-56 truncate text-xs text-shop-muted sm:block">{adminEmail}</span>
            <button type="button" onClick={signOut} className="border border-shop-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-shop-cream">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="shop-container py-8 sm:py-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statusOptions.map((status) => (
            <div key={status} className="border border-shop-border bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-shop-muted">{statusLabels[status]}</p>
              <p className="shop-display mt-2 text-3xl">{counts[status]}</p>
            </div>
          ))}
        </div>

        {capacities.length > 0 && (
          <section className="mt-8" aria-labelledby="capacity-overview-heading">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-shop-muted">Capacity control</p>
                <h2 id="capacity-overview-heading" className="shop-display mt-2 text-2xl">Tournament places</h2>
              </div>
              <p className="max-w-xl text-xs leading-5 text-shop-muted">Pending and confirmed registrations reserve places. New requests are placed on the waitlist when capacity is reached.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {capacities.map((capacity) => {
                const occupied = capacity.baseline_occupied + capacity.occupied_registrations;
                const remaining = Math.max(0, capacity.capacity - occupied);
                return (
                  <article key={capacity.tournament_slug} className="border border-shop-border bg-white p-5">
                    <h3 className="font-semibold leading-6">{capacity.tournament_name}</h3>
                    <p className="mt-4 text-sm text-shop-muted">{Math.min(occupied, capacity.capacity)} of {capacity.capacity} places occupied</p>
                    <div className="mt-2 h-2 overflow-hidden bg-shop-cream" role="progressbar" aria-label={`${capacity.tournament_name} capacity`} aria-valuemin={0} aria-valuemax={capacity.capacity || 1} aria-valuenow={Math.min(occupied, capacity.capacity)}>
                      <div className="h-full bg-shop-ink" style={{ width: `${capacity.capacity > 0 ? Math.min(100, (occupied / capacity.capacity) * 100) : 100}%` }} />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                      <span className="font-semibold">{remaining} {remaining === 1 ? "place" : "places"} available</span>
                      <span className="text-shop-muted">{capacity.waitlisted_registrations} waitlisted</span>
                    </div>
                    <p className="mt-3 text-[11px] text-shop-muted">FIFO promotion: {capacity.auto_promote_waitlist ? "enabled on cancellation" : "disabled"}</p>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-8 border border-shop-border bg-white p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_240px_auto] md:items-end">
            <div>
              <label htmlFor="registration-search" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-shop-muted">Search registrations</label>
              <input id="registration-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email, phone, school…" className="w-full border border-shop-border bg-white px-3 py-3 text-sm outline-none focus:border-shop-ink" />
            </div>
            <div>
              <label htmlFor="registration-status" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-shop-muted">Status</label>
              <select id="registration-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="w-full border border-shop-border bg-white px-3 py-3 text-sm outline-none focus:border-shop-ink">
                <option value="all">All statuses</option>
                {statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="registration-tournament" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-shop-muted">Tournament</label>
              <select id="registration-tournament" value={tournamentFilter} onChange={(event) => setTournamentFilter(event.target.value)} className="w-full border border-shop-border bg-white px-3 py-3 text-sm outline-none focus:border-shop-ink">
                <option value="all">All tournaments</option>
                {tournamentOptions.map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}
              </select>
            </div>
            <button type="button" onClick={() => void loadRegistrations()} disabled={loading} className="border border-shop-ink px-4 py-3 text-xs font-semibold transition-colors hover:bg-shop-ink hover:text-white disabled:cursor-wait disabled:opacity-60">
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>
          <p className="mt-4 text-xs leading-5 text-shop-muted">Showing up to the 200 most recent registrations matching the selected filters.</p>
        </section>

        {errorMessage && <div role="alert" className="mt-6 border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">{errorMessage}</div>}
        {notice && <div role="status" className="mt-6 border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">{notice}</div>}

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="border border-shop-border bg-white p-8 text-sm text-shop-muted">Loading tournament registrations…</div>
          ) : visibleRegistrations.length === 0 ? (
            <div className="border border-shop-border bg-white p-8">
              <h2 className="shop-display text-2xl">No registrations found.</h2>
              <p className="mt-3 text-sm leading-6 text-shop-muted">Try another search or filter. New registrations appear here after they have been saved.</p>
            </div>
          ) : (
            visibleRegistrations.map((registration) => (
              <article key={registration.id} className="border border-shop-border bg-white p-5 sm:p-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="shop-display text-2xl sm:text-3xl">{registration.participant_name}</h2>
                      <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${statusStyles[registration.status]}`}>
                        {statusLabels[registration.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-shop-muted">{registration.tournament_name} · Submitted {formatDate(registration.created_at)} · Age {registration.age}</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label htmlFor={`status-${registration.id}`} className="sr-only">Update status for {registration.participant_name}</label>
                    <select id={`status-${registration.id}`} value={registration.status} disabled={updatingId === registration.id} onChange={(event) => void updateStatus(registration.id, event.target.value as RegistrationStatus)} className="border border-shop-border bg-white px-3 py-2.5 text-xs font-semibold outline-none focus:border-shop-ink disabled:opacity-60">
                      {statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                    </select>
                    {updatingId === registration.id && <span className="text-xs text-shop-muted">Saving…</span>}
                  </div>
                </div>

                <dl className="mt-6 grid gap-5 border-t border-shop-border pt-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Detail label="Email" value={registration.email} />
                  <Detail label="Phone" value={registration.phone} />
                  <Detail label="School / club" value={registration.school_or_club || "Not provided"} />
                  {registration.age < 18 && <Detail label="Parent / guardian" value={`${registration.guardian_name || "Not provided"} · Consent recorded: ${registration.guardian_consent ? "Yes" : "No"}`} />}
                  <Detail label="Registration reference" value={registration.id} />
                  <Detail label="Capacity value recorded at submission" value={registration.capacity_limit === null ? "Not recorded" : String(registration.capacity_limit)} />
                </dl>
                {registration.notes && (
                  <div className="mt-5 border-t border-shop-border pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-shop-muted">Additional notes</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-shop-ink">{registration.notes}</p>
                  </div>
                )}
              </article>
            ))
          )}
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-5 text-shop-muted">Waitlist policy: when a pending or confirmed registration is cancelled or moved to the waitlist, the system automatically confirms the oldest other waitlisted registration for that tournament, using waitlist-entry time and then submission time as tie-breakers. The status change and promotion happen in one database transaction. If Resend is configured, both status notifications are attempted; if email fails, the saved statuses remain in place and organisers should contact the players manually. Tournament registrations contain personal information, including information about young players. Review it only for event administration, limit access to authorised staff, and follow SHoP&apos;s safeguarding and retention policies. A recorded guardian-consent checkbox is not independent verification of consent.</p>
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-shop-muted">{label}</dt>
      <dd className="mt-2 break-words text-sm leading-6 text-shop-ink">{value}</dd>
    </div>
  );
}

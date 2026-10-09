"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ApplicationStatus = "new" | "reviewing" | "accepted" | "declined" | "contacted";
type StatusFilter = ApplicationStatus | "all";

type Application = {
  id: string;
  created_at: string;
  full_name: string;
  age: number;
  guardian_name: string | null;
  guardian_consent: boolean;
  phone: string;
  email: string | null;
  school: string | null;
  experience: string;
  interest: string;
  message: string | null;
  status: ApplicationStatus;
};

const statusLabels: Record<ApplicationStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  contacted: "Contacted",
  accepted: "Accepted",
  declined: "Declined",
};

const statusStyles: Record<ApplicationStatus, string> = {
  new: "bg-amber-100 text-amber-900",
  reviewing: "bg-blue-100 text-blue-900",
  contacted: "bg-violet-100 text-violet-900",
  accepted: "bg-emerald-100 text-emerald-900",
  declined: "bg-red-100 text-red-900",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminApplications({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loadApplications = useCallback(async () => {
    setErrorMessage("");
    const query = statusFilter === "all" ? "" : `?status=${statusFilter}`;

    try {
      const response = await fetch(`/api/admin/applications${query}`, {
        cache: "no-store",
      });
      const result = (await response.json()) as {
        applications?: Application[];
        error?: string;
      };

      if (response.status === 401) {
        router.replace("/admin/login");
        router.refresh();
        return;
      }

      if (!response.ok) {
        setErrorMessage(result.error || "Could not load applications.");
        return;
      }

      setApplications(result.applications ?? []);
    } catch {
      setErrorMessage("Could not connect to the application service. Try again.");
    } finally {
      setLoading(false);
    }
  }, [router, statusFilter]);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const visibleApplications = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return applications;

    return applications.filter((application) =>
      [
        application.full_name,
        application.phone,
        application.email ?? "",
        application.school ?? "",
        application.experience,
        application.interest,
      ].some((value) => value.toLowerCase().includes(term))
    );
  }, [applications, search]);

  const counts = useMemo(() => {
    return applications.reduce<Record<ApplicationStatus, number>>(
      (total, application) => {
        total[application.status] += 1;
        return total;
      },
      { new: 0, reviewing: 0, contacted: 0, accepted: 0, declined: 0 }
    );
  }, [applications]);

  async function updateStatus(id: string, status: ApplicationStatus) {
    setUpdatingId(id);
    setNotice("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const result = (await response.json()) as {
        application?: Application;
        error?: string;
      };

      if (!response.ok || !result.application) {
        setErrorMessage(result.error || "Could not update this application.");
        return;
      }

      setApplications((current) =>
        current.map((application) =>
          application.id === id ? result.application! : application
        )
      );
      setNotice(`Status updated to ${statusLabels[status]}.`);
    } catch {
      setErrorMessage("Could not connect to the application service. Try again.");
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-shop-muted">
              SHoP · Private admin
            </p>
            <h1 className="shop-display mt-2 text-3xl sm:text-4xl">Membership applications</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden max-w-56 truncate text-xs text-shop-muted sm:block">{adminEmail}</span>
            <button
              type="button"
              onClick={signOut}
              className="border border-shop-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-shop-cream"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="shop-container py-8 sm:py-12">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {(Object.keys(statusLabels) as ApplicationStatus[]).map((status) => (
            <div key={status} className="border border-shop-border bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-shop-muted">{statusLabels[status]}</p>
              <p className="shop-display mt-3 text-3xl">{counts[status]}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div>
              <label htmlFor="application-search" className="block text-[10px] font-bold uppercase tracking-[0.16em] text-shop-muted">Search</label>
              <input
                id="application-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, phone, email, school…"
                className="mt-2 w-full border border-shop-border bg-white px-4 py-3 text-sm outline-none focus:border-shop-ink sm:w-72"
              />
            </div>
            <div>
              <label htmlFor="status-filter" className="block text-[10px] font-bold uppercase tracking-[0.16em] text-shop-muted">Status</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="mt-2 w-full border border-shop-border bg-white px-4 py-3 text-sm outline-none focus:border-shop-ink sm:w-44"
              >
                <option value="all">All statuses</option>
                {(Object.keys(statusLabels) as ApplicationStatus[]).map((status) => (
                  <option key={status} value={status}>{statusLabels[status]}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void loadApplications()}
            className="border border-shop-border bg-white px-4 py-3 text-sm font-semibold transition-colors hover:bg-shop-ink hover:text-white"
          >
            Refresh applications
          </button>
        </div>

        {notice ? <p role="status" className="mt-5 border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</p> : null}
        {errorMessage ? <p role="alert" className="mt-5 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMessage}</p> : null}

        <section aria-label="Membership applications" className="mt-6 space-y-4">
          {loading ? (
            <div className="border border-shop-border bg-white p-8 text-sm text-shop-muted">Loading applications…</div>
          ) : visibleApplications.length === 0 ? (
            <div className="border border-shop-border bg-white p-8">
              <h2 className="shop-display text-2xl">No applications found.</h2>
              <p className="mt-3 text-sm leading-6 text-shop-muted">Try another search or status filter. New applications will appear here once they have been saved.</p>
            </div>
          ) : (
            visibleApplications.map((application) => (
              <article key={application.id} className="border border-shop-border bg-white p-5 sm:p-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="shop-display text-2xl sm:text-3xl">{application.full_name}</h2>
                      <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${statusStyles[application.status]}`}>
                        {statusLabels[application.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-shop-muted">Submitted {formatDate(application.created_at)} · Age {application.age}</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label htmlFor={`status-${application.id}`} className="sr-only">Update status for {application.full_name}</label>
                    <select
                      id={`status-${application.id}`}
                      value={application.status}
                      disabled={updatingId === application.id}
                      onChange={(event) => void updateStatus(application.id, event.target.value as ApplicationStatus)}
                      className="border border-shop-border bg-white px-3 py-2.5 text-sm outline-none focus:border-shop-ink disabled:opacity-50"
                    >
                      {(Object.keys(statusLabels) as ApplicationStatus[]).map((status) => (
                        <option key={status} value={status}>{statusLabels[status]}</option>
                      ))}
                    </select>
                    {updatingId === application.id ? <span className="text-xs text-shop-muted">Saving…</span> : null}
                  </div>
                </div>

                <dl className="mt-6 grid gap-x-8 gap-y-5 border-t border-shop-border pt-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Detail label="Phone" value={application.phone} />
                  <Detail label="Email" value={application.email || "Not provided"} />
                  <Detail label="School / organisation" value={application.school || "Not provided"} />
                  <Detail label="Chess experience" value={application.experience} />
                  <Detail label="Interest" value={application.interest} />
                  <Detail label="Parent / guardian" value={application.guardian_name || "Not provided"} />
                  {application.age < 18 ? <Detail label="Guardian permission" value={application.guardian_consent ? "Confirmed by applicant" : "Not confirmed"} /> : null}
                </dl>

                {application.message ? (
                  <div className="mt-6 border-t border-shop-border pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-shop-muted">Additional message</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-shop-ink">{application.message}</p>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </section>

        <p className="mt-8 max-w-3xl text-xs leading-5 text-shop-muted">
          Applications contain personal information. Review them only for SHoP membership purposes, limit access to authorised staff, and follow SHoP&apos;s retention and safeguarding policies. A self-reported guardian confirmation is not independent verification of consent.
        </p>
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

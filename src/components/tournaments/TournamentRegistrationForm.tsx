"use client";

import { useState, type FormEvent } from "react";

type TournamentRegistrationFormProps = {
  tournamentSlug: string;
  tournamentName: string;
  maxPlayers?: number;
  registeredPlayers?: number;
};

type FormState = {
  fullName: string;
  age: string;
  phone: string;
  email: string;
  schoolOrClub: string;
  guardianName: string;
  guardianConsent: boolean;
  notes: string;
  website: string;
};

const initialState: FormState = {
  fullName: "",
  age: "",
  phone: "",
  email: "",
  schoolOrClub: "",
  guardianName: "",
  guardianConsent: false,
  notes: "",
  website: "",
};

export default function TournamentRegistrationForm({
  tournamentSlug,
  tournamentName,
  maxPlayers,
}: TournamentRegistrationFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [successStatus, setSuccessStatus] = useState<"pending" | "waitlisted" | null>(null);
  const age = form.age === "" ? Number.NaN : Number(form.age);
  const needsGuardian = Number.isFinite(age) && age < 18;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSuccessStatus(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/tournaments/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournamentSlug,
          fullName: form.fullName,
          age: form.age,
          phone: form.phone,
          email: form.email,
          schoolOrClub: form.schoolOrClub,
          guardianName: form.guardianName,
          guardianConsent: form.guardianConsent,
          notes: form.notes,
          website: form.website,
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
        status?: "pending" | "waitlisted";
      };

      if (!response.ok || !result.ok) {
        setError(
          result.error ||
            "We could not submit your registration. Please try again."
        );
        return;
      }

      setSuccessStatus(result.status ?? "pending");
      setSuccess(
        result.message ||
          "Your registration request has been received. SHoP will contact you using the details provided."
      );
      setForm(initialState);
    } catch {
      setError(
        "We could not reach the registration service. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border border-shop-border bg-shop-paper p-6 sm:p-8 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="shop-eyebrow text-shop-muted">Player registration</p>
          <h3 className="shop-display mt-4 text-3xl leading-none sm:text-4xl">
            Take your seat.
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-shop-muted">
            Register for {tournamentName}. We will use these details to contact
            you about your place and event arrangements.
          </p>
        </div>
        {maxPlayers !== undefined && (
          <p className="max-w-xs shrink-0 text-xs font-semibold leading-5 text-shop-muted">
            Capacity: up to {maxPlayers} players. Requests are queued in submission order when full.
          </p>
        )}
      </div>

      {success ? (
        <div
          role="status"
          aria-live="polite"
          className="border border-emerald-800/20 bg-emerald-900/[0.06] p-5"
        >
          <p className="font-semibold text-[#111111]">{successStatus === "waitlisted" ? "Added to the waitlist" : "Registration received"}</p>
          <p className="mt-2 text-sm leading-6 text-shop-muted">{success}</p>
          <button
            type="button"
            onClick={() => {
              setSuccess("");
              setSuccessStatus(null);
            }}
            className="mt-4 text-sm font-semibold underline underline-offset-4"
          >
            Register another player
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Player&apos;s full name <span aria-hidden="true">*</span>
              <input
                autoComplete="name"
                required
                maxLength={120}
                value={form.fullName}
                onChange={(event) => update("fullName", event.target.value)}
                className="mt-2 w-full border border-shop-border bg-shop-cream px-4 py-3 text-sm outline-none transition focus:border-[#111111]"
                placeholder="Full name"
              />
            </label>
            <label className="block text-sm font-medium">
              Age <span aria-hidden="true">*</span>
              <input
                type="number"
                min={5}
                max={100}
                required
                value={form.age}
                onChange={(event) => update("age", event.target.value)}
                className="mt-2 w-full border border-shop-border bg-shop-cream px-4 py-3 text-sm outline-none transition focus:border-[#111111]"
                placeholder="Age in years"
              />
            </label>
            <label className="block text-sm font-medium">
              Phone number <span aria-hidden="true">*</span>
              <input
                type="tel"
                autoComplete="tel"
                required
                minLength={7}
                maxLength={30}
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                className="mt-2 w-full border border-shop-border bg-shop-cream px-4 py-3 text-sm outline-none transition focus:border-[#111111]"
                placeholder="e.g. 07xx xxx xxx"
              />
            </label>
            <label className="block text-sm font-medium">
              Email address <span aria-hidden="true">*</span>
              <input
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                className="mt-2 w-full border border-shop-border bg-shop-cream px-4 py-3 text-sm outline-none transition focus:border-[#111111]"
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-sm font-medium sm:col-span-2">
              School or chess club <span className="font-normal text-shop-muted">(optional)</span>
              <input
                maxLength={160}
                value={form.schoolOrClub}
                onChange={(event) => update("schoolOrClub", event.target.value)}
                className="mt-2 w-full border border-shop-border bg-shop-cream px-4 py-3 text-sm outline-none transition focus:border-[#111111]"
                placeholder="School, club, or independent player"
              />
            </label>
          </div>

          {needsGuardian && (
            <fieldset className="border border-shop-border p-5 sm:p-6">
              <legend className="px-2 text-sm font-semibold">
                Parent or guardian details
              </legend>
              <label className="block text-sm font-medium">
                Parent / guardian full name <span aria-hidden="true">*</span>
                <input
                  required
                  maxLength={120}
                  value={form.guardianName}
                  onChange={(event) => update("guardianName", event.target.value)}
                  className="mt-2 w-full border border-shop-border bg-shop-cream px-4 py-3 text-sm outline-none transition focus:border-[#111111]"
                  placeholder="Parent or guardian name"
                />
              </label>
              <label className="mt-4 flex items-start gap-3 text-sm leading-6">
                <input
                  type="checkbox"
                  required
                  checked={form.guardianConsent}
                  onChange={(event) => update("guardianConsent", event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#111111]"
                />
                <span>
                  I am the parent or legal guardian and consent to this
                  tournament registration being submitted for the child.
                </span>
              </label>
            </fieldset>
          )}

          <label className="block text-sm font-medium">
            Note for the organisers <span className="font-normal text-shop-muted">(optional)</span>
            <textarea
              rows={3}
              maxLength={1000}
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
              className="mt-2 w-full resize-y border border-shop-border bg-shop-cream px-4 py-3 text-sm outline-none transition focus:border-[#111111]"
              placeholder="Anything SHoP should know?"
            />
          </label>

          <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
            <label>
              Leave this field empty
              <input
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(event) => update("website", event.target.value)}
              />
            </label>
          </div>

          {error && (
            <p role="alert" aria-live="assertive" className="text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-4 border-t border-shop-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-xs leading-5 text-shop-muted">
              Registration is a request, not a confirmed place. SHoP will contact
              you to confirm arrangements. For players under 18, a parent or
              guardian must provide consent.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex shrink-0 items-center justify-center gap-4 bg-[#111111] px-6 py-4 text-sm font-semibold text-[#F3EDE2] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit registration"}
              {!submitting && <span aria-hidden="true">→</span>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

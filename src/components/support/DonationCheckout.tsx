"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type DonationStatus = "pending" | "paid" | "failed";
type DonationResponse = { donationId?: string; message?: string; error?: string; status?: DonationStatus };

const presets = [500, 1000, 2500, 5000];

export default function DonationCheckout() {
  const [amount, setAmount] = useState("1000");
  const [customAmount, setCustomAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [donationId, setDonationId] = useState("");
  const [status, setStatus] = useState<DonationStatus | "idle">("idle");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [pollingPaused, setPollingPaused] = useState(false);
  const [statusCheckRound, setStatusCheckRound] = useState(0);
  const pollingStarted = useRef(false);

  const selectedAmount = amount === "custom" ? Number(customAmount) : Number(amount);

  useEffect(() => {
    if (!donationId || status !== "pending" || pollingStarted.current) return;
    pollingStarted.current = true;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    const poll = async () => {
      if (stopped) return;
      attempts += 1;
      try {
        const response = await fetch(`/api/donations/${encodeURIComponent(donationId)}`, { cache: "no-store" });
        const result = (await response.json()) as DonationResponse;
        if (response.ok && (result.status === "paid" || result.status === "failed")) {
          setStatus(result.status);
          setPollingPaused(false);
          setMessage(result.message ?? (result.status === "paid" ? "Donation received. Thank you for supporting SHoP." : "The payment was not completed. You can try again."));
          return;
        }
      } catch {
        // A temporary polling failure should not imply a payment failure.
      }
      if (attempts >= 30) {
        setPollingPaused(true);
        setMessage("We have not received final confirmation yet. Please check your M-Pesa messages. Do not pay again if M-Pesa shows a completed transaction. You can check the status again below.");
        return;
      }
      timer = setTimeout(poll, 4000);
    };

    void poll();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      pollingStarted.current = false;
    };
  }, [donationId, status, statusCheckRound]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!Number.isInteger(selectedAmount) || selectedAmount < 1 || selectedAmount > 150000) {
      setError("Enter a whole-number amount between KSh 1 and KSh 150,000.");
      return;
    }
    setSubmitting(true);
    setDonationId("");
    setStatus("idle");
    setPollingPaused(false);
    pollingStarted.current = false;
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedAmount, phone, name: name.trim() || undefined, email: email.trim() || undefined }),
      });
      const result = (await response.json()) as DonationResponse;
      if (!response.ok || !result.donationId) throw new Error(result.error ?? "We could not start the M-Pesa request. Please try again later.");
      setDonationId(result.donationId);
      setStatus("pending");
      setMessage(result.message ?? "Check your phone and enter your M-Pesa PIN to approve the payment request.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not start the M-Pesa request. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shop-donation-checkout mt-12 border border-shop-border bg-shop-paper p-6 text-[#111111] sm:p-10">
      <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">SECURE M-PESA DONATION</span>
      <h3 className="shop-display mt-5 max-w-2xl text-3xl leading-[0.9] text-[#171717] sm:text-4xl">Your contribution can help put another board in the room.</h3>
      <p className="mt-5 max-w-xl text-sm leading-6 text-shop-muted">Choose an amount and request an M-Pesa prompt on your phone. SHoP will only show a donation as received after the server verifies the payment status.</p>

      <form onSubmit={submit} className="mt-8 space-y-6">
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-shop-ink">Choose an amount (KSh)</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {presets.map((preset) => (
              <button key={preset} type="button" onClick={() => { setAmount(String(preset)); setCustomAmount(""); }} aria-pressed={amount === String(preset)} className={`shop-donation-amount border px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shop-ink ${amount === String(preset) ? "border-shop-ink bg-shop-ink text-[#ffffff]" : "border-shop-border bg-white text-[#111111] hover:border-shop-ink"}`}>
                {preset.toLocaleString("en-KE")}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <label htmlFor="donation-custom" className="mb-2 block text-sm font-medium text-shop-ink">Or enter another amount</label>
            <input id="donation-custom" type="number" min="1" max="150000" step="1" value={customAmount} onChange={(event) => { setCustomAmount(event.target.value); setAmount("custom"); }} placeholder="Amount in KSh" className="shop-donation-input w-full border border-shop-border bg-white px-4 py-3 text-sm text-[#111111] placeholder:text-[#6b6b6b] outline-none focus:border-shop-ink" />
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="donation-phone" className="mb-2 block text-sm font-medium text-shop-ink">M-Pesa phone number <span aria-hidden="true">*</span></label>
            <input id="donation-phone" required autoComplete="tel" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="07XX XXX XXX or 2547XX XXX XXX" className="shop-donation-input w-full border border-shop-border bg-white px-4 py-3 text-sm text-[#111111] placeholder:text-[#6b6b6b] outline-none focus:border-shop-ink" />
          </div>
          <div>
            <label htmlFor="donation-name" className="mb-2 block text-sm font-medium text-shop-ink">Name (optional)</label>
            <input id="donation-name" autoComplete="name" maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className="shop-donation-input w-full border border-shop-border bg-white px-4 py-3 text-sm text-[#111111] placeholder:text-[#6b6b6b] outline-none focus:border-shop-ink" />
          </div>
        </div>
        <div>
          <label htmlFor="donation-email" className="mb-2 block text-sm font-medium text-shop-ink">Email for your record (optional)</label>
          <input id="donation-email" type="email" autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="shop-donation-input w-full border border-shop-border bg-white px-4 py-3 text-sm text-[#111111] placeholder:text-[#6b6b6b] outline-none focus:border-shop-ink" />
        </div>

        {error && <p role="alert" className="border border-red-300 bg-red-50 p-3 text-sm text-red-900">{error}</p>}
        {message && <p role="status" aria-live="polite" className={`border p-3 text-sm leading-6 ${status === "paid" ? "border-emerald-300 bg-emerald-50 text-emerald-900" : status === "failed" ? "border-red-300 bg-red-50 text-red-900" : "border-shop-border bg-white text-shop-ink"}`}>{message}</p>}
        {status === "pending" && pollingPaused && <button type="button" onClick={() => { pollingStarted.current = false; setPollingPaused(false); setStatusCheckRound((value) => value + 1); }} className="border border-shop-ink px-5 py-3 text-sm font-semibold text-shop-ink hover:bg-white">Check payment status again</button>}
        <button type="submit" disabled={submitting || status === "pending"} className="shop-donation-submit inline-flex w-full items-center justify-center bg-[#111111] px-6 py-4 text-sm font-semibold text-[#ffffff] transition-colors hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
          {submitting ? "Starting M-Pesa request…" : status === "pending" ? "Waiting for payment confirmation…" : `Donate KSh ${Number.isFinite(selectedAmount) && selectedAmount > 0 ? selectedAmount.toLocaleString("en-KE") : "—"}`}
        </button>
        <p className="text-xs leading-5 text-shop-muted">You will approve the request on your phone using your M-Pesa PIN. SHoP will never ask you to share your PIN on this website. Do not repeat a payment while a transaction is awaiting confirmation.</p>
      </form>
    </div>
  );
}

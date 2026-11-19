"use client";

import { useState, type FormEvent } from "react";

type EnquiryKind = "school" | "sponsor";
type Props = { kind: EnquiryKind };

export default function PartnershipEnquiryForm({ kind }: Props) {
  const isSchool = kind === "school";
  const [values, setValues] = useState({
    organisation: "", contactName: "", role: "", email: "", phone: "",
    location: "", interest: "", scale: "", timeline: "", message: "", website: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setSuccess(false);
    try {
      const response = await fetch("/api/partnership-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, kind }),
      });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "We could not send your enquiry. Please try again.");
      setSuccess(true);
      setValues({ organisation: "", contactName: "", role: "", email: "", phone: "", location: "", interest: "", scale: "", timeline: "", message: "", website: "" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not send your enquiry. Please try again.");
    } finally { setBusy(false); }
  }

  const inputClass = "mt-2 w-full border border-shop-border bg-white px-4 py-3 text-sm text-shop-ink outline-none transition-colors placeholder:text-shop-muted/70 focus:border-shop-ink";
  const labelClass = "block text-sm font-semibold text-shop-ink";

  return (
    <div className="border border-shop-border bg-shop-paper p-6 sm:p-9">
      <p className="shop-eyebrow text-shop-muted">{isSchool ? "School partnership enquiry" : "Sponsor and organisational partnership"}</p>
      <h3 className="shop-display mt-4 text-3xl sm:text-4xl">{isSchool ? "Tell us about your school." : "Let’s explore what we can build together."}</h3>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-shop-muted">
        {isSchool
          ? "This form is for a teacher, school leader or authorised school representative. Please do not submit student names or sensitive information."
          : "Share your organisation’s interests and the kind of support or collaboration you would like to discuss. An enquiry is not a sponsorship commitment."}
      </p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className={labelClass} htmlFor={`${kind}-organisation`}>{isSchool ? "School name" : "Organisation / business name"} *</label><input id={`${kind}-organisation`} required maxLength={160} value={values.organisation} onChange={e=>update("organisation",e.target.value)} className={inputClass} autoComplete="organization" /></div>
          <div><label className={labelClass} htmlFor={`${kind}-contact`}>Your full name *</label><input id={`${kind}-contact`} required maxLength={120} value={values.contactName} onChange={e=>update("contactName",e.target.value)} className={inputClass} autoComplete="name" /></div>
          <div><label className={labelClass} htmlFor={`${kind}-role`}>Your role *</label><input id={`${kind}-role`} required maxLength={100} value={values.role} onChange={e=>update("role",e.target.value)} placeholder={isSchool ? "e.g. Teacher, Headteacher" : "e.g. CSR Lead, Director"} className={inputClass} /></div>
          <div><label className={labelClass} htmlFor={`${kind}-email`}>Work email *</label><input id={`${kind}-email`} type="email" required maxLength={254} value={values.email} onChange={e=>update("email",e.target.value)} className={inputClass} autoComplete="email" /></div>
          <div><label className={labelClass} htmlFor={`${kind}-phone`}>Phone number *</label><input id={`${kind}-phone`} required maxLength={40} value={values.phone} onChange={e=>update("phone",e.target.value)} className={inputClass} autoComplete="tel" /></div>
          <div><label className={labelClass} htmlFor={`${kind}-location`}>{isSchool ? "School location / county" : "Organisation location"}</label><input id={`${kind}-location`} maxLength={160} value={values.location} onChange={e=>update("location",e.target.value)} className={inputClass} placeholder="e.g. Nairobi" /></div>
          <div>
            <label className={labelClass} htmlFor={`${kind}-interest`}>{isSchool ? "What would you like to explore?" : "How would you like to support SHoP?"} *</label>
            <select id={`${kind}-interest`} required value={values.interest} onChange={e=>update("interest",e.target.value)} className={inputClass}>
              <option value="">Select an option</option>
              {(isSchool ? ["Start a school chess club","Chess lessons / coaching","School chess event","Tournament participation","Long-term school programme","Other"] : ["Financial sponsorship","Chess equipment / materials","Tournament or event support","Education and youth development","Volunteer expertise / services","Long-term strategic partnership","Other"]).map(x=><option key={x}>{x}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor={`${kind}-scale`}>{isSchool ? "Approximate number of interested learners" : "Indicative support range (optional)"}</label>
            <select id={`${kind}-scale`} value={values.scale} onChange={e=>update("scale",e.target.value)} className={inputClass}>
              <option value="">Not sure yet</option>
              {(isSchool ? ["Under 25","25–50","51–100","101–200","More than 200"] : ["In-kind support","Under KSh 50,000","KSh 50,000–150,000","KSh 150,001–500,000","Above KSh 500,000","To be discussed"]).map(x=><option key={x}>{x}</option>)}
            </select>
          </div>
          <div><label className={labelClass} htmlFor={`${kind}-timeline`}>Preferred timeline</label><select id={`${kind}-timeline`} value={values.timeline} onChange={e=>update("timeline",e.target.value)} className={inputClass}><option value="">Select if known</option>{["As soon as practical","Within 1–3 months","Within 3–6 months","Later this year","Exploratory / no fixed date"].map(x=><option key={x}>{x}</option>)}</select></div>
        </div>
        <div><label className={labelClass} htmlFor={`${kind}-message`}>Tell us a little more *</label><textarea id={`${kind}-message`} required minLength={10} maxLength={2500} rows={5} value={values.message} onChange={e=>update("message",e.target.value)} className={inputClass} placeholder={isSchool ? "Your school’s goals, current chess activities and what you would like to discuss…" : "Your organisation’s objectives and the collaboration you have in mind…"} /></div>
        <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor={`${kind}-website`}>Website</label><input id={`${kind}-website`} tabIndex={-1} autoComplete="off" value={values.website} onChange={e=>update("website",e.target.value)} /></div>
        {error && <p role="alert" className="border border-red-300 bg-red-50 p-3 text-sm text-red-900">{error}</p>}
        {success && <p role="status" aria-live="polite" className="border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">Thank you. Your enquiry has been received by SHoP. We will follow up using the contact details you provided.</p>}
        <button type="submit" disabled={busy} className="inline-flex min-h-12 items-center justify-center bg-[#111111] px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Sending enquiry…" : "Submit enquiry"}</button>
        <p className="text-xs leading-5 text-shop-muted">By submitting, you agree that SHoP may use these details to respond to this enquiry. Please do not include student personal data.</p>
      </form>
    </div>
  );
}

"use client";

export default function WhatsAppFloatingButton() {
  const number = (process.env.NEXT_PUBLIC_SHOP_WHATSAPP ?? "").replace(/[^0-9]/g, "");
  if (!number) return null;

  const message = encodeURIComponent("Hello SHoP, I would like to get in touch.");
  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact SHoP on WhatsApp"
      className="fixed bottom-5 right-5 z-[70] inline-flex min-h-14 items-center gap-3 rounded-full border border-white/20 bg-[#167a46] px-5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(0,0,0,0.22)] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#167a46]"
    >
      <span aria-hidden="true" className="text-xl">◉</span>
      <span>WhatsApp SHoP</span>
    </a>
  );
}

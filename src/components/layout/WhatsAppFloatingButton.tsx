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
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7 shrink-0" fill="currentColor"><path d="M16.02 3.2A12.65 12.65 0 0 0 5.1 22.23L3.4 28.5l6.43-1.68a12.66 12.66 0 1 0 6.19-23.62Zm0 22.96a10.3 10.3 0 0 1-5.25-1.44l-.38-.23-3.82 1 1.02-3.72-.25-.39a10.34 10.34 0 1 1 8.68 4.78Zm5.67-7.75c-.31-.16-1.84-.91-2.12-1.01-.29-.11-.5-.16-.71.16-.21.31-.81 1.01-.99 1.22-.18.21-.36.23-.67.08-.31-.16-1.31-.48-2.49-1.53-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.54-.08-.16-.71-1.7-.97-2.33-.26-.61-.52-.53-.71-.54h-.6c-.21 0-.54.08-.83.39-.29.31-1.09 1.06-1.09 2.59s1.12 3.01 1.27 3.22c.16.21 2.2 3.36 5.33 4.71.74.32 1.32.51 1.77.65.74.24 1.42.2 1.95.12.59-.09 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.29-.21-.6-.36Z"/></svg>
      <span>WhatsApp SHoP</span>
    </a>
  );
}

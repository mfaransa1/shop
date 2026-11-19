import { socialLinks, type SocialLink } from "@/data/social";

function BrandIcon({ platform }: { platform: SocialLink["platform"] }) {
  if (platform === "instagram") return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>;
  if (platform === "facebook") return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor"><path d="M13.6 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.4V13h2.8v8h3.4Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor"><path d="M18.7 5.4a5.1 5.1 0 0 1-3.2-3.1V2h-3.4v13.2a2.8 2.8 0 1 1-2-2.7v-3.5a6.2 6.2 0 1 0 5.4 6.2V8.5a8.4 8.4 0 0 0 4.9 1.6V6.7a5.2 5.2 0 0 1-1.7-1.3Z"/></svg>;
}

export default function SocialLinks({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const dark = variant === "dark";
  return (
    <nav aria-label="Social media" className="flex flex-wrap items-center gap-3">
      {socialLinks.map((social) => (
        <a key={social.platform} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`SHoP on ${social.label}`} title={social.label}
          className={`group inline-flex h-11 w-11 items-center justify-center border transition-all duration-300 hover:-translate-y-1 ${dark ? "border-[#F3EDE2]/20 text-[#F3EDE2]/65 hover:border-[#F3EDE2]/70 hover:bg-[#F3EDE2] hover:text-[#111111]" : "border-shop-border bg-white text-shop-ink hover:border-shop-ink hover:bg-shop-ink hover:text-white"}`}>
          <BrandIcon platform={social.platform} />
        </a>
      ))}
    </nav>
  );
}

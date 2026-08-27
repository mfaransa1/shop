import { socialLinks, type SocialLink } from "@/data/social";

const socialIcons: Record<SocialLink["platform"], string> = {
  instagram: "IG",
  facebook: "FB",
  tiktok: "TK",
};

export default function SocialLinks() {
  return (
    <nav
      aria-label="Social media"
      className="flex flex-wrap items-center gap-3"
    >
      {socialLinks.map((social) => (
        <a
          key={social.platform}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`SHoP on ${social.label}`}
          className="
            group inline-flex h-10 min-w-10 items-center justify-center
            border border-[#F3EDE2]/20
            px-3
            text-[9px] font-bold tracking-[0.16em]
            text-[#F3EDE2]/50
            transition-all duration-300
            hover:-translate-y-1
            hover:border-[#F3EDE2]/60
            hover:bg-[#F3EDE2]
            hover:text-[#111111]
          "
        >
          <span className="transition-transform duration-300 group-hover:scale-105">
            {socialIcons[social.platform]}
          </span>
        </a>
      ))}
    </nav>
  );
}
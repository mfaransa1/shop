export type SocialLink = {
  label: string;
  href: string;
  platform: "instagram" | "facebook" | "tiktok";
};

export const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/shop_chesske/",
    platform: "instagram",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/shopchesske/",
    platform: "facebook",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@shop_chess",
    platform: "tiktok",
  },
];
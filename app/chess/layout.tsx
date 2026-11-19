import type { Metadata } from "next";
export const metadata: Metadata = { title: { default: "Chess Game", template: "%s | SHoP" }, robots: { index: false, follow: false, noarchive: true } };
export default function ChessLayout({ children }: { children: React.ReactNode }) { return children; }

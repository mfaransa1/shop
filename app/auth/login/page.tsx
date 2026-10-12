import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Player sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const params = await searchParams;
  return <AuthForm mode="login" nextPath={params.next ?? "/dashboard"} initialNotice={params.error === "verification" ? "The verification link could not be completed. Please try the latest email link or request a new password reset." : ""} />;
}

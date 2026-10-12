"use client";

import { useEffect } from "react";

/** Marks an authenticated player's presence while this component is mounted. */
export default function OnlinePresence() {
  useEffect(() => {
    let active = true;
    const touch = async () => {
      if (!active || document.visibilityState === "hidden") return;
      try {
        await fetch("/api/community/players", { method: "POST", cache: "no-store" });
      } catch {
        // Presence is best-effort; it must not interrupt the page.
      }
    };
    void touch();
    const timer = window.setInterval(() => void touch(), 45_000);
    const onVisibility = () => { if (document.visibilityState === "visible") void touch(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return null;
}

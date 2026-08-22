"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "p1_visitor_id";
const SESSION_KEY = "p1_session_id";

function getOrCreateId(storage: Storage, key: string): string {
  let id = storage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    storage.setItem(key, id);
  }
  return id;
}

function getDevice(): "mobile" | "tablet" | "desktop" {
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const pageViewIdRef = useRef<string | null>(null);
  const enteredAtRef = useRef<number>(Date.now());

  useEffect(() => {
    // Skip tracking admin pages — only customer-facing traffic matters here.
    if (pathname?.startsWith("/admin")) return;

    const visitorId = getOrCreateId(localStorage, VISITOR_KEY);
    const sessionId = getOrCreateId(sessionStorage, SESSION_KEY);

    enteredAtRef.current = Date.now();
    pageViewIdRef.current = null;

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId,
        sessionId,
        path: pathname,
        device: getDevice(),
        referrer: document.referrer || "",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) pageViewIdRef.current = data.id;
      })
      .catch(() => {});

    const sendDuration = () => {
      if (!pageViewIdRef.current) return;
      const duration = (Date.now() - enteredAtRef.current) / 1000;
      const payload = JSON.stringify({ id: pageViewIdRef.current, duration });
      navigator.sendBeacon?.(
        "/api/analytics/duration",
        new Blob([payload], { type: "application/json" })
      );
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendDuration();
    };

    window.addEventListener("beforeunload", sendDuration);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      sendDuration();
      window.removeEventListener("beforeunload", sendDuration);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname]);

  return null;
}

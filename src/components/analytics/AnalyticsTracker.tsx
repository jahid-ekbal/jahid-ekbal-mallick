"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const HEARTBEAT_SECONDS = 15;

export function AnalyticsTracker() {
  const pathname = usePathname();
  const startedAt = useRef(0);
  const sentTotal = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
    sentTotal.current = 0;
    const referrer =
      (
        document.referrer &&
        !document.referrer.startsWith(window.location.origin)
      ) ?
        document.referrer
      : "";

    fetch("/api/analytics/collect", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pageview", path: pathname, referrer }),
    }).catch(() => undefined);

    const heartbeat = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      const elapsed = Math.round((Date.now() - startedAt.current) / 1000);
      const delta = Math.min(
        elapsed - sentTotal.current,
        HEARTBEAT_SECONDS * 2,
      );
      if (delta <= 0) return;
      sentTotal.current += delta;
      fetch("/api/analytics/collect", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "dwell",
          path: pathname,
          dwellSeconds: delta,
        }),
      }).catch(() => undefined);
    }, HEARTBEAT_SECONDS * 1000);

    const sendRemaining = () => {
      const delta = Math.round(
        Math.min(
          (Date.now() - startedAt.current) / 1000 - sentTotal.current,
          HEARTBEAT_SECONDS,
        ),
      );
      if (delta <= 0) return;
      navigator.sendBeacon?.(
        "/api/analytics/collect",
        new Blob(
          [
            JSON.stringify({
              type: "dwell",
              path: pathname,
              dwellSeconds: delta,
            }),
          ],
          { type: "application/json" },
        ),
      );
    };

    const onHide = () => {
      if (document.visibilityState === "hidden") sendRemaining();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", sendRemaining);

    return () => {
      clearInterval(heartbeat);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", sendRemaining);
    };
  }, [pathname]);

  return null;
}

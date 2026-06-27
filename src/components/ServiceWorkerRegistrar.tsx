"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        // Check for updates on every page load
        reg.update().catch(() => {});
      })
      .catch((err) => {
        console.warn("[TrainerDex SW] Registration failed:", err);
      });
  }, []);

  return null;
}

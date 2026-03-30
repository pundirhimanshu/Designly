"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function DomainSyncer() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const syncDomain = async () => {
      if (status === "authenticated" && session?.user) {
        const pendingDomain = localStorage.getItem("pending_domain");
        if (pendingDomain) {
          try {
            const res = await fetch("/api/save-domain", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ domain: pendingDomain }),
            });
            if (res.ok) {
              localStorage.removeItem("pending_domain");
            }
          } catch (error) {
            console.error("Domain Sync Error:", error);
          }
        }
      }
    };
    syncDomain();
  }, [status, session]);

  return null;
}

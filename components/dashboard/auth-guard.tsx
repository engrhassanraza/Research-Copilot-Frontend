"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LogoBadge } from "@/components/brand/logo-badge";
import { useAuthStore } from "@/stores/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  if (!hydrated || !token) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <LogoBadge className="h-10 w-10 animate-pulse-glow" />
      </div>
    );
  }

  return <>{children}</>;
}

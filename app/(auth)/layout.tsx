import Link from "next/link";

import { LogoBadge } from "@/components/brand/logo-badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-6">
      <div className="bg-radial-fade pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
      <div
        aria-hidden
        className="glow-orb pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl animate-pulse-glow"
      />

      <ThemeToggle className="absolute right-4 top-4" />

      <Link
        href="/"
        className="relative mb-5 flex items-center gap-2"
      >
        <LogoBadge className="h-8 w-8" />
        <span className="text-base font-semibold tracking-tight">
          Research Copilot
        </span>
      </Link>

      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}

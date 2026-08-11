import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div className="bg-radial-fade pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
      <div
        aria-hidden
        className="glow-orb pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl animate-pulse-glow"
      />

      <Link
        href="/"
        className="relative mb-8 flex items-center gap-2"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-950/40">
          <Sparkles className="h-4 w-4 text-white" />
        </span>
        <span className="text-base font-semibold tracking-tight">
          Research Copilot
        </span>
      </Link>

      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}

import Link from "next/link";

import { LogoBadge } from "@/components/brand/logo-badge";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <LogoBadge className="h-6 w-6" />
          <span className="text-sm font-medium">Research Copilot</span>
        </Link>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Research Copilot. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

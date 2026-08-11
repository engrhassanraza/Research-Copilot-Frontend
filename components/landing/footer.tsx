import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Sparkles className="h-3 w-3 text-white" />
          </span>
          <span className="text-sm font-medium">Research Copilot</span>
        </Link>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Research Copilot. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

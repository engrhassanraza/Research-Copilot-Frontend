import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LogoBadge } from "@/components/brand/logo-badge";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { label: "Product", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Agents", href: "/#agents" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <LogoBadge className="h-8 w-8" />
          <span className="text-base font-semibold tracking-tight">
            Research Copilot
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

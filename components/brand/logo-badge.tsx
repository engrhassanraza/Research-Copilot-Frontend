import type { ImgHTMLAttributes } from "react";

/**
 * Brand mark used everywhere in the UI (nav, sidebar, footer, auth header).
 * Renders `/public/logo.svg` — the same artwork served as the favicon via
 * `app/icon.svg` — so the icon is guaranteed identical across every surface.
 */
export function LogoBadge({
  alt = "Research Copilot",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.svg" alt={alt} {...props} />;
}

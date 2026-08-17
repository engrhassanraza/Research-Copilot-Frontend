import type { ImgHTMLAttributes } from "react";

// Shares /public/logo.svg with app/icon.svg so the favicon and UI logo stay identical.
export function LogoBadge({
  alt = "Research Copilot",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.svg" alt={alt} {...props} />;
}

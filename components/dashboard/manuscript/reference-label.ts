import type { Reference } from "@/types/api";

function lastName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] || name;
}

// Short display label for a citation chip while editing — not a style-
// accurate marker (that's computed at export time; see citation-node.ts).
export function referenceLabel(reference: Reference): string {
  const authors = reference.authors ?? [];
  let authorPart = "";
  if (authors.length === 1) authorPart = lastName(authors[0]);
  else if (authors.length > 1) authorPart = `${lastName(authors[0])} et al.`;
  const year = reference.year ? `, ${reference.year}` : "";
  if (authorPart) return `[${authorPart}${year}]`;
  return `[${reference.title.slice(0, 24)}${reference.title.length > 24 ? "…" : ""}]`;
}

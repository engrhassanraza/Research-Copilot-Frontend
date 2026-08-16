import type { Citation } from "@/types/api";

/**
 * The chat answer contains literal `[n]`-style marker text already
 * formatted server-side (instruction.md §5, Chat). This walks the
 * `citations` array in order and rewrites each marker's *next* unclaimed
 * occurrence in the text into a markdown link (`[marker](#cite-i)`) so
 * `CitationMarkdown`'s custom `a` renderer can turn it into a clickable
 * evidence trigger while everything else renders as normal markdown.
 */
export function injectCitationLinks(answer: string, citations: Citation[]): string {
  let result = answer;
  const searchFrom: Record<string, number> = {};

  citations.forEach((citation, idx) => {
    const marker = citation.marker;
    if (!marker) return;
    const from = searchFrom[marker] ?? 0;
    const pos = result.indexOf(marker, from);
    if (pos === -1) return;
    const token = `[${marker}](#cite-${idx})`;
    result = result.slice(0, pos) + token + result.slice(pos + marker.length);
    searchFrom[marker] = pos + token.length;
  });

  return result;
}

export const CITE_HREF_PREFIX = "#cite-";

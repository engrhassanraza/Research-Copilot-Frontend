import type { Citation } from "@/types/api";

// Rewrites each citation's next unclaimed `[n]` marker occurrence into a
// markdown link so CitationMarkdown's `a` renderer can make it clickable.
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

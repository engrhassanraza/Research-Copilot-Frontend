"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import { CITE_HREF_PREFIX, injectCitationLinks } from "@/components/dashboard/chat/citation-utils";
import type { Citation } from "@/types/api";

export function CitationMarkdown({
  content,
  citations = [],
  onCiteClick,
  className,
}: {
  content: string;
  citations?: Citation[];
  onCiteClick?: (citation: Citation) => void;
  className?: string;
}) {
  const withLinks = citations.length > 0 ? injectCitationLinks(content, citations) : content;

  return (
    <div className={cn("chat-prose", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            if (href?.startsWith(CITE_HREF_PREFIX)) {
              const idx = Number(href.slice(CITE_HREF_PREFIX.length));
              const citation = citations[idx];
              return (
                <button
                  type="button"
                  onClick={() => citation && onCiteClick?.(citation)}
                  className="mx-0.5 inline-flex -translate-y-0.5 items-center rounded-md bg-primary/15 px-1.5 py-0.5 align-super text-[0.7em] font-semibold text-violet-700 transition-colors hover:bg-primary/25 dark:text-violet-200"
                >
                  {children}
                </button>
              );
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-violet-600 underline underline-offset-2 dark:text-violet-300">
                {children}
              </a>
            );
          },
          p: ({ children }) => <p className="mb-3 leading-relaxed last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="mb-3 ml-5 list-disc space-y-1 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 ml-5 list-decimal space-y-1 last:mb-0">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          h1: ({ children }) => <h1 className="mb-2 mt-4 text-lg font-semibold first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 mt-4 text-base font-semibold first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-1.5 mt-3 text-sm font-semibold first:mt-0">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="mb-3 border-l-2 border-violet-500/50 pl-3 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className={cn("block overflow-x-auto rounded-xl bg-secondary/70 p-3 text-xs", className)} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded bg-secondary/70 px-1.5 py-0.5 text-[0.85em]" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <pre className="mb-3 last:mb-0">{children}</pre>,
          table: ({ children }) => (
            <div className="mb-3 overflow-x-auto rounded-xl border border-border/60 last:mb-0">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-secondary/50">{children}</thead>,
          th: ({ children }) => <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">{children}</th>,
          td: ({ children }) => <td className="border-t border-border/40 px-3 py-2">{children}</td>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          hr: () => <hr className="my-4 border-border/60" />,
        }}
      >
        {withLinks}
      </ReactMarkdown>
    </div>
  );
}

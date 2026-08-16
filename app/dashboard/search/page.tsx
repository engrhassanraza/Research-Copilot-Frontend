"use client";

import { useState } from "react";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { QueryError } from "@/components/dashboard/query-error";
import { SearchResultCard } from "@/components/dashboard/search/result-card";
import { useActiveProject } from "@/hooks/use-active-project";
import { useCreatePaper } from "@/hooks/use-papers";
import { useSearchPapers } from "@/hooks/use-search";
import { authErrorMessage } from "@/hooks/use-auth";
import type { PaperResult } from "@/types/api";

function resultKey(result: PaperResult) {
  return result.doi || result.arxiv_id || result.url || result.title;
}

export default function SearchPage() {
  const { activeProjectId, projects, isLoading } = useActiveProject();
  const [query, setQuery] = useState("");
  const [addedKeys, setAddedKeys] = useState<Set<string>>(new Set());
  const search = useSearchPapers();
  const createPaper = useCreatePaper(activeProjectId ?? "");

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    search.mutate({ query: query.trim(), limit_per_provider: 20 });
  }

  function handleAdd(result: PaperResult) {
    if (!activeProjectId) return;
    createPaper.mutate(
      {
        title: result.title,
        authors: result.authors,
        abstract: result.abstract ?? undefined,
        doi: result.doi ?? undefined,
        arxiv_id: result.arxiv_id ?? undefined,
        url: result.url ?? undefined,
        venue: result.venue ?? undefined,
        publication_year: result.year ?? undefined,
        source: "search",
      },
      {
        onSuccess: () => {
          setAddedKeys((prev) => new Set(prev).add(resultKey(result)));
          toast.success("Added to project", { description: result.title });
        },
        onError: (err) => toast.error("Couldn't add paper", { description: authErrorMessage(err, "Try again.") }),
      }
    );
  }

  if (isLoading) return null;
  if (projects.length === 0 || !activeProjectId) {
    return <EmptyProjectState description="Search Semantic Scholar, OpenAlex, Crossref, and arXiv to build your library." />;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Search papers</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Fans out to Semantic Scholar, OpenAlex, Crossref, and arXiv — deduplicated automatically.
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. retrieval augmented generation for scientific QA"
            className="pl-11"
          />
        </div>
        <Button type="submit" disabled={search.isPending || !query.trim()}>
          {search.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-3">
        {search.isPending && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {search.isError && <QueryError error={search.error} onRetry={() => search.mutate({ query: query.trim(), limit_per_provider: 20 })} />}

        {search.isSuccess && search.data.results.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">No results — try a different query.</p>
        )}

        {search.isSuccess &&
          search.data.results.map((result) => (
            <SearchResultCard
              key={resultKey(result)}
              result={result}
              onAdd={() => handleAdd(result)}
              isAdding={createPaper.isPending}
              added={addedKeys.has(resultKey(result))}
            />
          ))}
      </div>
    </div>
  );
}

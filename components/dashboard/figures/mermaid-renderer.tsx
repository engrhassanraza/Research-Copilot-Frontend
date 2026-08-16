"use client";

import { useEffect, useRef, useState } from "react";

let mermaidIdCounter = 0;

export function MermaidRenderer({ source }: { source: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      setError(null);
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "strict" });
        mermaidIdCounter += 1;
        const { svg } = await mermaid.render(`mermaid-${mermaidIdCounter}`, source);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Couldn't render diagram");
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [source]);

  if (error) {
    return <p className="text-xs text-destructive">{error}</p>;
  }

  return <div ref={containerRef} className="mermaid-container flex justify-center overflow-x-auto py-2" />;
}

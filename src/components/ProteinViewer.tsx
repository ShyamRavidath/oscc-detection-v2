"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ProteinViewerProps {
  pdbUrl: string;
  label: string;
}

type RepStyle = "cartoon" | "stick" | "sphere" | "line";

const REP_STYLES: { value: RepStyle; label: string }[] = [
  { value: "cartoon", label: "Cartoon" },
  { value: "stick", label: "Stick" },
  { value: "sphere", label: "Sphere" },
  { value: "line", label: "Line" },
];

const CHAIN_COLORS: Record<string, string> = {
  A: "0x0D4F4F",
  B: "0x7C9A72",
  C: "0xD4A03C",
  D: "0xC75C3A",
  E: "0x2AA198",
  F: "0x6B8080",
  H: "0x0D4F4F",
  L: "0xD4A03C",
};

export default function ProteinViewer({ pdbUrl, label }: ProteinViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viewerRef = useRef<any>(null);
  const [pdbData, setPdbData] = useState<string | null>(null);
  const [chains, setChains] = useState<string[]>([]);
  const [visibleChains, setVisibleChains] = useState<Set<string>>(new Set());
  const [repStyle, setRepStyle] = useState<RepStyle>("cartoon");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch PDB
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(pdbUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load PDB (${res.status})`);
        return res.text();
      })
      .then((text) => {
        setPdbData(text);
        // Parse chain IDs
        const chainSet = new Set<string>();
        for (const line of text.split("\n")) {
          if (line.startsWith("ATOM") || line.startsWith("HETATM")) {
            const chainId = line[21]?.trim();
            if (chainId) chainSet.add(chainId);
          }
        }
        const sorted = Array.from(chainSet).sort();
        setChains(sorted);
        setVisibleChains(new Set(sorted));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [pdbUrl]);

  const renderViewer = useCallback(async () => {
    if (!containerRef.current || !pdbData) return;

    // Dynamically import 3Dmol
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const $3Dmol = (await import("3dmol")) as any;

    // Clear previous
    containerRef.current.innerHTML = "";

    const viewer = $3Dmol.createViewer(containerRef.current, {
      backgroundColor: "0xFDFBF5",
      antialias: true,
    });
    viewerRef.current = viewer;

    viewer.addModel(pdbData, "pdb");

    // Apply style per chain
    for (const chain of chains) {
      if (!visibleChains.has(chain)) continue;
      const color = CHAIN_COLORS[chain] || "0x6B8080";
      const sel = { chain };
      const style: Record<string, object> = {};
      style[repStyle] = { color };
      viewer.setStyle(sel, style);
    }

    // Hide non-visible chains
    for (const chain of chains) {
      if (!visibleChains.has(chain)) {
        viewer.setStyle({ chain }, {});
      }
    }

    viewer.zoomTo();
    viewer.render();
    viewer.zoom(0.9);
    viewer.render();
  }, [pdbData, chains, visibleChains, repStyle]);

  useEffect(() => {
    renderViewer();
  }, [renderViewer]);

  function toggleChain(chain: string) {
    setVisibleChains((prev) => {
      const next = new Set(prev);
      if (next.has(chain)) {
        next.delete(chain);
      } else {
        next.add(chain);
      }
      return next;
    });
  }

  function showAllChains() {
    setVisibleChains(new Set(chains));
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Representation selector */}
        <div className="flex items-center gap-1 rounded-full bg-cream-warm/50 p-1 ring-1 ring-teal-deep/[0.04]">
          {REP_STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => setRepStyle(s.value)}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-full transition-all duration-200 ${
                repStyle === s.value
                  ? "bg-teal-deep text-cream"
                  : "text-muted hover:text-teal-deep"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Chain toggles */}
        {chains.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.1em] font-medium text-muted">Chains:</span>
            {chains.map((chain) => (
              <button
                key={chain}
                onClick={() => toggleChain(chain)}
                className={`w-7 h-7 rounded-full text-[12px] font-semibold transition-all duration-200 ring-1 ${
                  visibleChains.has(chain)
                    ? "bg-teal-deep text-cream ring-teal-deep"
                    : "bg-cream-warm text-muted ring-teal-deep/10"
                }`}
              >
                {chain}
              </button>
            ))}
            <button
              onClick={showAllChains}
              className="text-[11px] font-medium text-teal-mid hover:text-teal-deep transition-colors ml-1"
            >
              All
            </button>
          </div>
        )}
      </div>

      {/* Viewer */}
      <div className="rounded-[1.5rem] p-1.5 bg-white/60 ring-1 ring-teal-deep/[0.04]">
        <div
          className="rounded-[calc(1.5rem-6px)] bg-cream overflow-hidden relative"
          style={{
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)",
            height: "500px",
          }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-cream z-10">
              <div className="text-center">
                <svg className="animate-spin w-8 h-8 mx-auto text-teal-mid" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="mt-3 text-[13px] text-muted">Loading {label}...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-cream z-10">
              <div className="text-center max-w-xs">
                <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto mb-3 opacity-50">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="var(--coral)" strokeWidth="1.5" />
                  <path d="M24 16v10M24 30v2" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="text-[14px] font-medium text-teal-deep">Could not load structure</p>
                <p className="mt-1 text-[12px] text-muted">{error}</p>
                <p className="mt-3 text-[11px] text-muted/60">
                  Place your PDB file at <code className="font-mono bg-cream-warm px-1 rounded">{pdbUrl}</code>
                </p>
              </div>
            </div>
          )}

          <div
            ref={containerRef}
            className="w-full h-full"
            style={{ position: "relative" }}
          />
        </div>
      </div>

      {/* Caption */}
      <p className="mt-3 text-[12px] text-muted text-center">
        {label} &middot; {chains.length} chain{chains.length !== 1 ? "s" : ""} detected &middot; Drag to rotate, scroll to zoom
      </p>
    </div>
  );
}

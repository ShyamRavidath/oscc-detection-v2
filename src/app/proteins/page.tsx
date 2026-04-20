"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useInView } from "@/hooks/useInView";

const ProteinViewer = dynamic(() => import("@/components/ProteinViewer"), {
  ssr: false,
  loading: () => (
    <div className="rounded-[1.5rem] p-1.5 bg-white/60 ring-1 ring-teal-deep/[0.04]">
      <div className="rounded-[calc(1.5rem-6px)] bg-cream h-[500px] flex items-center justify-center">
        <p className="text-[13px] text-muted">Loading viewer...</p>
      </div>
    </div>
  ),
});

const PROTEINS = [
  {
    id: "design2_n5",
    label: "Nanobody Design 2 (N5)",
    pdbUrl: "/pdb/design2_n5.pdb",
    description:
      "Computationally designed nanobody targeting the hemopexin binding pocket. Optimized for thermal stability and binding affinity through iterative structure prediction.",
  },
  {
    id: "nanobody_design_1",
    label: "Nanobody Design 1 (DLDesign 0)",
    pdbUrl: "/pdb/nanobody_design_1_dldesign_0.pdb",
    description:
      "First-generation deep learning designed nanobody scaffold. Features a novel CDR3 loop geometry for enhanced hemopexin recognition.",
  },
];

export default function ProteinsPage() {
  const { ref, visible } = useInView();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const protein = PROTEINS[selectedIdx];

  return (
    <main className="min-h-[100dvh] pt-28 pb-20 noise-overlay">
      <div className="mx-auto max-w-5xl px-4 sm:px-6" ref={ref}>
        {/* Header */}
        <div className={`max-w-2xl ${visible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-sage bg-sage/[0.08] ring-1 ring-sage/10">
            Structure Explorer
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-teal-deep leading-[1.1]">
            Protein structures
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted max-w-[55ch]">
            Explore the AI-designed nanobody structures in 3D. Rotate, zoom,
            and toggle individual chains to understand binding geometry.
          </p>
        </div>

        {/* Design selector */}
        <div className={`mt-10 ${visible ? "animate-fade-up delay-200" : "opacity-0"}`}>
          <div className="flex flex-col sm:flex-row gap-3">
            {PROTEINS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setSelectedIdx(i)}
                className={`group flex-1 text-left rounded-[1.25rem] p-1 transition-all duration-300 ${
                  selectedIdx === i
                    ? "bg-teal-deep/[0.04] ring-1 ring-teal-mid/20"
                    : "bg-white/40 ring-1 ring-teal-deep/[0.03] hover:ring-teal-mid/10"
                }`}
              >
                <div className="rounded-[calc(1.25rem-4px)] bg-white p-4 sm:p-5" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)" }}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                        selectedIdx === i ? "bg-teal-mid" : "bg-muted/30"
                      }`}
                    />
                    <h3 className="text-[14px] font-semibold tracking-tight text-teal-deep">
                      {p.label}
                    </h3>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-muted ml-[22px]">
                    {p.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3D viewer */}
        <div className={`mt-8 ${visible ? "animate-fade-up delay-300" : "opacity-0"}`}>
          <ProteinViewer
            key={protein.id}
            pdbUrl={protein.pdbUrl}
            label={protein.label}
          />
        </div>

        {/* Info */}
        <div className={`mt-10 ${visible ? "animate-fade-up delay-400" : "opacity-0"}`}>
          <div className="rounded-[1.5rem] p-1.5 bg-sage/[0.04] ring-1 ring-sage/[0.06]">
            <div className="rounded-[calc(1.5rem-6px)] bg-gradient-to-br from-white to-sage-light/5 p-6 sm:p-8" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9)" }}>
              <h3 className="text-[15px] font-semibold tracking-tight text-teal-deep">
                About these structures
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted max-w-[60ch]">
                These nanobody structures were generated using AI-based protein
                design pipelines. Each is a single-domain antibody (~15 kDa)
                derived from camelid VHH scaffolds, computationally optimized for
                hemopexin binding. Replace the placeholder PDB files in{" "}
                <code className="font-mono bg-cream-warm/60 px-1 rounded text-[12px]">
                  public/pdb/
                </code>{" "}
                with your actual structures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

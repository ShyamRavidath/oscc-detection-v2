"use client";

import { useInView } from "@/hooks/useInView";
import ImpactCalculator from "@/components/ImpactCalculator";

export default function ImpactPage() {
  const { ref, visible } = useInView();

  return (
    <main className="min-h-[100dvh] pt-28 pb-20 noise-overlay">
      <div className="mx-auto max-w-6xl px-4 sm:px-6" ref={ref}>
        {/* Header */}
        <div className={`max-w-2xl ${visible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-coral bg-coral/[0.07] ring-1 ring-coral/10">
            Clinical Simulation
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-teal-deep leading-[1.1]">
            Impact calculator
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted max-w-[55ch]">
            Model the clinical and economic impact of deploying low-cost
            lateral flow screening versus traditional diagnostic pathways.
            Adjust parameters to see real-time cost/benefit analysis.
          </p>
        </div>

        {/* Calculator */}
        <div className={`mt-12 ${visible ? "animate-fade-up delay-200" : "opacity-0"}`}>
          <ImpactCalculator />
        </div>

        {/* Methodology note */}
        <div className={`mt-12 ${visible ? "animate-fade-up delay-400" : "opacity-0"}`}>
          <div className="rounded-[1.5rem] p-1.5 bg-sage/[0.04] ring-1 ring-sage/[0.06]">
            <div className="rounded-[calc(1.5rem-6px)] bg-gradient-to-br from-white to-sage-light/5 p-6 sm:p-8" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9)" }}>
              <h3 className="text-[15px] font-semibold tracking-tight text-teal-deep">
                Methodology notes
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted max-w-[60ch]">
                This calculator uses a simplified two-strategy comparison model.
                &ldquo;Lives saved&rdquo; is estimated using a 30% survival
                improvement factor for early-stage detection versus late-stage
                diagnosis, based on published OSCC staging survival data. Actual
                outcomes depend on healthcare infrastructure, follow-up care,
                and population-specific factors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

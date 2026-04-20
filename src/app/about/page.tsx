"use client";

import { useInView } from "@/hooks/useInView";
import MethodologyTimeline from "@/components/MethodologyTimeline";

const outcomes = [
  { value: "AUC > 0.93", label: "Model Performance", sub: "Cross-validated ROC area under curve" },
  { value: "~94%", label: "Sensitivity", sub: "True positive rate for OSCC detection" },
  { value: "~90%", label: "Specificity", sub: "True negative rate in healthy controls" },
  { value: "< $2", label: "Cost Per Test", sub: "Materials cost at scale production" },
];

const datasets = [
  {
    title: "Salivary Proteomics Cohort",
    desc: "Multi-site collection of saliva samples from OSCC patients (stages I-IV) and age/sex-matched healthy controls. Proteomic profiling via mass spectrometry identified 8 candidate biomarkers.",
    stats: ["n = 200+ samples", "8 biomarkers quantified", "Multi-center collection"],
  },
  {
    title: "Nanobody Design Library",
    desc: "Computationally generated library of VHH-scaffold nanobodies targeting hemopexin epitopes. Structures predicted using AlphaFold2 and refined via Rosetta energy minimization.",
    stats: ["50+ designs screened", "Top 5 candidates selected", "Thermal stability > 60C"],
  },
  {
    title: "LFA Optimization Dataset",
    desc: "Systematic evaluation of membrane materials, conjugation ratios, and flow rates. Signal intensity and line clarity quantified by image analysis across concentration gradients.",
    stats: ["12 membrane types tested", "Gold NP sizes: 20-60nm", "Optimized in 3 iterations"],
  },
];

const resources = [
  { label: "GitHub Repository", href: "#", desc: "Open-source code, model weights, and assay protocols" },
  { label: "Preprint / Publication", href: "#", desc: "Full methodology, results, and discussion" },
  { label: "WHO Oral Health Resources", href: "#", desc: "Global oral cancer burden and screening guidelines" },
  { label: "Contact / Collaborate", href: "/#contact", desc: "Reach out for partnerships and pilot programs" },
];

export default function AboutPage() {
  const { ref: headerRef, visible: headerVis } = useInView();
  const { ref: outcomesRef, visible: outcomesVis } = useInView();
  const { ref: dataRef, visible: dataVis } = useInView();
  const { ref: linksRef, visible: linksVis } = useInView();

  return (
    <main className="min-h-[100dvh] pt-28 pb-20 noise-overlay">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div ref={headerRef} className={`max-w-2xl ${headerVis ? "animate-fade-up" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-amber bg-amber/[0.08] ring-1 ring-amber/10">
            Research Context
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-teal-deep leading-[1.1]">
            About the project
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted max-w-[55ch]">
            A multidisciplinary effort to bring accurate, affordable oral
            cancer screening to the communities that need it most.
          </p>
        </div>

        {/* Timeline */}
        <div className={`mt-14 ${headerVis ? "animate-fade-up delay-200" : "opacity-0"}`}>
          <h2 className="text-xl font-bold tracking-tight text-teal-deep mb-8">Methodology</h2>
          <MethodologyTimeline />
        </div>

        {/* Key outcomes */}
        <div ref={outcomesRef} className="mt-16">
          <h2 className={`text-xl font-bold tracking-tight text-teal-deep mb-6 ${outcomesVis ? "animate-fade-up" : "opacity-0"}`}>
            Key Outcomes
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {outcomes.map((o, i) => (
              <div
                key={o.label}
                className={`group rounded-[1.25rem] p-1 bg-white/60 ring-1 ring-teal-deep/[0.03] transition-all duration-500 hover:shadow-[0_4px_20px_rgba(13,79,79,0.05)] ${
                  outcomesVis ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="rounded-[calc(1.25rem-4px)] bg-white p-5 text-center" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)" }}>
                  <div className="text-2xl font-bold tracking-tighter text-teal-deep">{o.value}</div>
                  <div className="mt-1 text-[12px] font-medium text-slate">{o.label}</div>
                  <div className="mt-0.5 text-[11px] text-muted">{o.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dataset descriptions */}
        <div ref={dataRef} className="mt-16">
          <h2 className={`text-xl font-bold tracking-tight text-teal-deep mb-6 ${dataVis ? "animate-fade-up" : "opacity-0"}`}>
            Datasets & Methods
          </h2>
          <div className="space-y-4">
            {datasets.map((d, i) => (
              <div
                key={d.title}
                className={`group rounded-[1.25rem] p-1 bg-white/60 ring-1 ring-teal-deep/[0.03] transition-all duration-500 hover:shadow-[0_4px_20px_rgba(13,79,79,0.05)] ${
                  dataVis ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="rounded-[calc(1.25rem-4px)] bg-white p-5 sm:p-6" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)" }}>
                  <h3 className="text-[15px] font-semibold tracking-tight text-teal-deep">{d.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{d.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {d.stats.map((s) => (
                      <span key={s} className="rounded-full bg-teal-deep/[0.04] px-3 py-1 text-[11px] font-medium text-teal-mid">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div ref={linksRef} className="mt-16">
          <h2 className={`text-xl font-bold tracking-tight text-teal-deep mb-6 ${linksVis ? "animate-fade-up" : "opacity-0"}`}>
            Resources & Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((r, i) => (
              <a
                key={r.label}
                href={r.href}
                className={`group rounded-[1.25rem] p-1 bg-white/60 ring-1 ring-teal-deep/[0.03] transition-all duration-500 hover:ring-teal-mid/15 hover:shadow-[0_4px_20px_rgba(13,79,79,0.06)] ${
                  linksVis ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="rounded-[calc(1.25rem-4px)] bg-white p-5 flex items-start gap-3" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)" }}>
                  <div className="mt-0.5 w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-teal-deep/[0.04] group-hover:bg-teal-mid/[0.08] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M4 10L10 4M10 4H5M10 4V9" stroke="var(--teal-mid)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold tracking-tight text-teal-deep group-hover:text-teal-mid transition-colors">
                      {r.label}
                    </h3>
                    <p className="mt-0.5 text-[12px] text-muted">{r.desc}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

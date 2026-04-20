"use client";

import { useInView } from "@/hooks/useInView";

const disciplines = [
  {
    title: "Computational Protein Design",
    desc: "AI-driven nanobody engineering using structure prediction and molecular dynamics to optimize binding affinity and thermostability.",
    color: "var(--teal-mid)",
  },
  {
    title: "Biomarker Discovery",
    desc: "Proteomic analysis of salivary biomarkers, validation cohort design, and clinical sensitivity/specificity optimization.",
    color: "var(--sage)",
  },
  {
    title: "Lateral Flow Engineering",
    desc: "Membrane selection, conjugation chemistry, flow rate optimization, and manufacturing process development for scalable production.",
    color: "var(--amber)",
  },
  {
    title: "Global Health Implementation",
    desc: "Regulatory strategy, field validation, supply chain design, and community health worker training program development.",
    color: "var(--coral)",
  },
];

export default function TeamSection() {
  const { ref, visible } = useInView();

  return (
    <section id="team" className="relative py-24 sm:py-32" ref={ref}>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Header */}
          <div className={`max-w-lg ${visible ? "animate-slide-left" : "opacity-0"}`}>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-teal-mid bg-teal-mid/[0.07] ring-1 ring-teal-mid/10">
              Interdisciplinary
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-teal-deep leading-[1.1]">
              Built at the intersection of disciplines
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
              This project sits at the convergence of computational biology, immunoengineering, diagnostics development, and global health equity. No single field could build this alone.
            </p>

            {/* DNA helix decoration */}
            <div className="mt-10 flex items-center gap-3 opacity-40">
              <svg viewBox="0 0 200 30" className="w-48">
                {[...Array(10)].map((_, i) => (
                  <g key={i}>
                    <circle cx={10 + i * 20} cy={15 + Math.sin(i * 0.7) * 8} r="2.5" fill="var(--teal-mid)" opacity={0.4 + i * 0.06} />
                    <circle cx={10 + i * 20} cy={15 - Math.sin(i * 0.7) * 8} r="2.5" fill="var(--sage)" opacity={0.4 + i * 0.06} />
                    <line x1={10 + i * 20} y1={15 + Math.sin(i * 0.7) * 8} x2={10 + i * 20} y2={15 - Math.sin(i * 0.7) * 8} stroke="var(--muted)" strokeWidth="0.5" opacity="0.3" />
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Right: Discipline cards */}
          <div className="space-y-4">
            {disciplines.map((d, i) => (
              <div
                key={d.title}
                className={`group ${visible ? "animate-slide-right" : "opacity-0"}`}
                style={{ animationDelay: `${200 + i * 120}ms` }}
              >
                <div className="rounded-[1.25rem] p-1 bg-white/60 ring-1 ring-teal-deep/[0.03] transition-all duration-500 group-hover:ring-teal-mid/10 group-hover:shadow-[0_4px_20px_rgba(13,79,79,0.05)]">
                  <div className="rounded-[calc(1.25rem-4px)] bg-white p-5 sm:p-6 flex items-start gap-4" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)" }}>
                    <div
                      className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: d.color }}
                    />
                    <div>
                      <h3 className="text-[15px] font-semibold tracking-tight text-teal-deep">{d.title}</h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{d.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

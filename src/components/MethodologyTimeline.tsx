"use client";

import { useInView } from "@/hooks/useInView";

const phases = [
  {
    phase: "Phase 1",
    title: "Biomarker Discovery",
    period: "Literature Review & Data Collection",
    description:
      "Systematic review of salivary proteomic studies identified hemopexin (HPX) as a high-confidence biomarker for OSCC. Meta-analysis of existing datasets confirmed significant differential expression between cancer and healthy cohorts.",
    color: "var(--teal-mid)",
  },
  {
    phase: "Phase 2",
    title: "ML Model Training",
    period: "Feature Engineering & Classification",
    description:
      "Trained an ensemble classifier (Logistic Regression, Random Forest, SVM) on 8 salivary protein biomarkers. Feature selection identified HPX, CP, and ORM2 as the top discriminators. Cross-validated AUC exceeded 0.93.",
    color: "var(--sage)",
  },
  {
    phase: "Phase 3",
    title: "Nanobody Design",
    period: "Computational Protein Engineering",
    description:
      "AI-based protein design pipelines generated single-domain antibodies (nanobodies) with high affinity for hemopexin. Designs were optimized for thermal stability, expression yield, and binding specificity using structure prediction and molecular dynamics.",
    color: "var(--amber)",
  },
  {
    phase: "Phase 4",
    title: "LFA Prototyping",
    period: "Assay Development & Optimization",
    description:
      "Nanobodies were conjugated to 40nm gold nanoparticles and deposited on nitrocellulose membranes. Membrane pore size, conjugate concentration, and flow rate were optimized for consistent signal at the test and control lines.",
    color: "var(--coral)",
  },
  {
    phase: "Phase 5",
    title: "Validation Studies",
    period: "Clinical Testing & Iteration",
    description:
      "Blinded validation against clinical saliva samples. Sensitivity and specificity were assessed against gold-standard histopathological diagnosis. Iterative design improvements based on field testing feedback from partner clinics.",
    color: "var(--teal-deep)",
  },
];

export default function MethodologyTimeline() {
  const { ref, visible } = useInView(0.1);

  return (
    <div ref={ref} className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-4 sm:left-8 top-0 bottom-0 w-px"
        style={{ background: "linear-gradient(to bottom, var(--teal-mid), var(--sage-light), transparent)" }}
        aria-hidden="true"
      />

      <div className="space-y-8">
        {phases.map((p, i) => (
          <div
            key={p.phase}
            className={`relative pl-12 sm:pl-20 ${visible ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: `${200 + i * 120}ms` }}
          >
            {/* Dot on timeline */}
            <div
              className="absolute left-[11px] sm:left-[27px] top-1.5 w-3 h-3 rounded-full ring-2 ring-cream"
              style={{ background: p.color }}
            />

            {/* Card */}
            <div className="group rounded-[1.25rem] p-1 bg-white/60 ring-1 ring-teal-deep/[0.03] transition-all duration-500 hover:shadow-[0_4px_20px_rgba(13,79,79,0.05)]">
              <div className="rounded-[calc(1.25rem-4px)] bg-white p-5 sm:p-6" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-[10px] uppercase tracking-[0.15em] font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: p.color, background: `${p.color}15` }}
                  >
                    {p.phase}
                  </span>
                  <span className="text-[11px] text-muted">{p.period}</span>
                </div>
                <h3 className="text-[15px] font-semibold tracking-tight text-teal-deep">
                  {p.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  {p.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

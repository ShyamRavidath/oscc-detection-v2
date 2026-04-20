"use client";

import { useInView } from "@/hooks/useInView";

export default function ScienceSection() {
  const { ref: sectionRef, visible } = useInView();

  return (
    <section id="science" className="relative py-24 sm:py-32 bg-cream-warm/30 noise-overlay" ref={sectionRef}>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <div className={`max-w-2xl ${visible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-sage bg-sage/[0.08] ring-1 ring-sage/10">
            Biomarker Science
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-teal-deep leading-[1.1]">
            Why hemopexin?
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted max-w-[55ch]">
            Hemopexin (Hx) is a glycoprotein that binds free heme with the highest affinity of any known protein. Its levels in saliva are significantly elevated in patients with oral squamous cell carcinoma (OSCC).
          </p>
        </div>

        {/* Three-column science cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg viewBox="0 0 48 48" className="w-10 h-10">
                  <circle cx="24" cy="24" r="18" fill="none" stroke="var(--teal-mid)" strokeWidth="1.5" />
                  <circle cx="24" cy="24" r="6" fill="var(--coral)" opacity="0.3" />
                  <path d="M24 6 L24 12 M24 36 L24 42 M6 24 L12 24 M36 24 L42 24" stroke="var(--teal-mid)" strokeWidth="1" strokeLinecap="round" />
                  <circle cx="24" cy="24" r="12" fill="none" stroke="var(--sage)" strokeWidth="0.75" strokeDasharray="3 2" />
                </svg>
              ),
              title: "Salivary Biomarker",
              desc: "Hemopexin concentration in saliva shows strong differential expression between OSCC patients and healthy controls, making it an ideal non-invasive biomarker for point-of-care screening.",
              detail: "AUC > 0.93 in validation studies",
            },
            {
              icon: (
                <svg viewBox="0 0 48 48" className="w-10 h-10">
                  {/* Nanobody Y-shape */}
                  <path d="M24 42 L24 24 L14 10 M24 24 L34 10" stroke="var(--teal-deep)" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <circle cx="14" cy="8" r="5" fill="none" stroke="var(--teal-deep)" strokeWidth="1.5" />
                  <circle cx="34" cy="8" r="5" fill="none" stroke="var(--teal-deep)" strokeWidth="1.5" />
                  <circle cx="14" cy="8" r="2" fill="var(--amber)" opacity="0.5" />
                  <circle cx="34" cy="8" r="2" fill="var(--amber)" opacity="0.5" />
                </svg>
              ),
              title: "AI-Designed Nanobodies",
              desc: "Using computational protein design, we engineer single-domain antibodies (nanobodies) with high affinity and specificity for hemopexin, eliminating the need for animal-derived antibodies.",
              detail: "~15 kDa, thermally stable",
            },
            {
              icon: (
                <svg viewBox="0 0 48 48" className="w-10 h-10">
                  {/* LFA strip icon */}
                  <rect x="14" y="4" width="20" height="40" rx="4" fill="none" stroke="var(--teal-mid)" strokeWidth="1.5" />
                  <line x1="18" y1="16" x2="30" y2="16" stroke="var(--coral)" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="18" y1="26" x2="30" y2="26" stroke="var(--teal-deep)" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="16" y="32" width="16" height="8" rx="2" fill="var(--sage-light)" opacity="0.3" />
                </svg>
              ),
              title: "Lateral Flow Format",
              desc: "The nanobodies are conjugated to gold nanoparticles and deployed on a nitrocellulose membrane in a familiar lateral flow format, like a pregnancy test but for cancer screening.",
              detail: "Result in 15 minutes",
            },
          ].map((card, i) => (
            <div
              key={card.title}
              className={`group relative ${visible ? "animate-fade-up" : "opacity-0"}`}
              style={{ animationDelay: `${200 + i * 150}ms` }}
            >
              {/* Outer shell - double bezel */}
              <div className="rounded-[1.5rem] p-1.5 bg-white/60 ring-1 ring-teal-deep/[0.04] transition-all duration-500 group-hover:ring-teal-mid/10 group-hover:shadow-[0_8px_32px_rgba(13,79,79,0.06)]">
                {/* Inner card */}
                <div className="rounded-[calc(1.5rem-6px)] bg-white p-7 sm:p-8 h-full" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)" }}>
                  <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-xl bg-teal-deep/[0.04] transition-colors duration-300 group-hover:bg-teal-mid/[0.08]">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-teal-deep">{card.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">{card.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-teal-deep/[0.04] px-3 py-1 text-[11px] font-medium text-teal-mid tracking-wide">
                    <span className="w-1 h-1 rounded-full bg-teal-mid" />
                    {card.detail}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hemopexin detail callout */}
        <div className={`mt-16 rounded-[2rem] p-1.5 bg-teal-deep/[0.03] ring-1 ring-teal-deep/[0.06] ${visible ? "animate-fade-up delay-700" : "opacity-0"}`}>
          <div className="rounded-[calc(2rem-6px)] bg-gradient-to-br from-white to-cream-warm/40 p-8 sm:p-10 md:p-12" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9)" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-teal-deep">
                  The hemopexin signal
                </h3>
                <p className="mt-4 text-[14px] sm:text-[15px] leading-relaxed text-muted max-w-[50ch]">
                  In OSCC patients, salivary hemopexin levels rise significantly due to tumor-induced changes in the oral microenvironment. This upregulation correlates with disease stage and provides a window for early, non-invasive detection before clinical symptoms appear.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {["Non-invasive", "High specificity", "Stage-correlated", "Cost-effective"].map((tag) => (
                    <span key={tag} className="rounded-full bg-sage/[0.08] px-3 py-1 text-[11px] font-medium text-sage ring-1 ring-sage/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                {/* Simple bar chart illustration */}
                <svg viewBox="0 0 240 160" className="w-full max-w-[260px]">
                  <text x="120" y="12" textAnchor="middle" fontSize="9" fill="var(--muted)" fontWeight="500" fontFamily="var(--font-sans)">Salivary Hemopexin Levels</text>
                  {/* Axes */}
                  <line x1="40" y1="135" x2="220" y2="135" stroke="var(--teal-deep)" strokeWidth="0.75" opacity="0.2" />
                  <line x1="40" y1="25" x2="40" y2="135" stroke="var(--teal-deep)" strokeWidth="0.75" opacity="0.2" />
                  {/* Grid lines */}
                  <line x1="40" y1="80" x2="220" y2="80" stroke="var(--teal-deep)" strokeWidth="0.5" opacity="0.06" />
                  <line x1="40" y1="52" x2="220" y2="52" stroke="var(--teal-deep)" strokeWidth="0.5" opacity="0.06" />
                  {/* Healthy bar */}
                  <rect x="70" y="100" width="50" height="35" rx="4" fill="var(--sage-light)" opacity="0.6" />
                  <text x="95" y="148" textAnchor="middle" fontSize="8" fill="var(--muted)" fontFamily="var(--font-sans)">Healthy</text>
                  {/* OSCC bar */}
                  <rect x="150" y="38" width="50" height="97" rx="4" fill="var(--coral)" opacity="0.5" />
                  <text x="175" y="148" textAnchor="middle" fontSize="8" fill="var(--muted)" fontFamily="var(--font-sans)">OSCC</text>
                  {/* Significance bracket */}
                  <line x1="95" y1="32" x2="175" y2="32" stroke="var(--teal-deep)" strokeWidth="0.75" />
                  <line x1="95" y1="32" x2="95" y2="36" stroke="var(--teal-deep)" strokeWidth="0.75" />
                  <line x1="175" y1="32" x2="175" y2="36" stroke="var(--teal-deep)" strokeWidth="0.75" />
                  <text x="135" y="28" textAnchor="middle" fontSize="8" fill="var(--coral)" fontWeight="600" fontFamily="var(--font-sans)">p &lt; 0.001</text>
                  {/* Y-axis label */}
                  <text x="14" y="82" textAnchor="middle" fontSize="7" fill="var(--muted)" fontFamily="var(--font-sans)" transform="rotate(-90, 14, 82)">[Hx] ng/mL</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

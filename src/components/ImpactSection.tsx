"use client";

import { useInView } from "@/hooks/useInView";

const stats = [
  {
    value: "377,000+",
    label: "New OSCC cases annually worldwide",
    sub: "Two-thirds in low- and middle-income countries",
  },
  {
    value: "~50%",
    label: "Five-year survival rate",
    sub: "Drops to ~30% when diagnosed at advanced stages",
  },
  {
    value: "80%+",
    label: "Survival with early detection",
    sub: "Stage I/II detection dramatically improves outcomes",
  },
];

export default function ImpactSection() {
  const { ref, visible } = useInView();

  return (
    <section id="impact" className="relative py-24 sm:py-32 bg-cream-warm/20" ref={ref}>
      {/* Decorative biology background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[10%] right-[5%] w-[200px] h-[200px] animate-morph opacity-[0.03]" style={{ background: "radial-gradient(circle, var(--sage), transparent 70%)" }} />
        <div className="absolute bottom-[15%] left-[3%] w-[250px] h-[250px] animate-morph opacity-[0.03]" style={{ background: "radial-gradient(circle, var(--teal-mid), transparent 70%)", animationDelay: "-5s" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto ${visible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-coral bg-coral/[0.07] ring-1 ring-coral/10">
            Global Impact
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-teal-deep leading-[1.1]">
            Early detection saves lives
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted mx-auto max-w-[55ch]">
            Oral cancer is the 6th most common cancer globally. Most cases are diagnosed late because existing screening methods require clinical infrastructure that doesn&apos;t exist where the burden is highest.
          </p>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`group ${visible ? "animate-fade-up" : "opacity-0"}`}
              style={{ animationDelay: `${250 + i * 150}ms` }}
            >
              <div className="rounded-[1.5rem] p-1.5 bg-white/60 ring-1 ring-teal-deep/[0.04] h-full transition-all duration-500 group-hover:shadow-[0_8px_32px_rgba(13,79,79,0.06)]">
                <div className="rounded-[calc(1.5rem-6px)] bg-white p-7 sm:p-8 h-full text-center" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)" }}>
                  <div className="text-3xl sm:text-4xl font-bold tracking-tighter text-teal-deep">
                    {stat.value}
                  </div>
                  <div className="mt-3 text-[14px] font-medium text-slate leading-snug">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-[12px] text-muted leading-snug">
                    {stat.sub}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission callout */}
        <div className={`mt-16 ${visible ? "animate-fade-up delay-700" : "opacity-0"}`}>
          <div className="rounded-[2rem] p-1.5 bg-sage/[0.06] ring-1 ring-sage/[0.08]">
            <div className="rounded-[calc(2rem-6px)] bg-gradient-to-br from-white to-sage-light/10 p-8 sm:p-10 md:p-12" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9)" }}>
              <div className="max-w-3xl mx-auto text-center">
                <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto mb-5 opacity-60">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="var(--teal-mid)" strokeWidth="1.5" />
                  <path d="M24 12 C24 12 16 20 16 26 C16 30.4 19.6 34 24 34 C28.4 34 32 30.4 32 26 C32 20 24 12 24 12Z" fill="var(--sage)" opacity="0.2" stroke="var(--sage)" strokeWidth="1" />
                </svg>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-teal-deep">
                  Screening where it&apos;s needed most
                </h3>
                <p className="mt-4 text-[14px] sm:text-[15px] leading-relaxed text-muted max-w-[55ch] mx-auto">
                  Our mission is to democratize oral cancer screening. By combining AI-designed nanobodies with the simplicity of lateral flow technology, we can bring accurate, affordable screening to community health workers in Southeast Asia, South Asia, and Sub-Saharan Africa, where OSCC prevalence is highest and diagnostic access is lowest.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {["No electricity needed", "Room-temp stable", "Trainable in minutes", "WHO-aligned"].map((tag) => (
                    <span key={tag} className="rounded-full bg-teal-deep/[0.05] px-4 py-1.5 text-[12px] font-medium text-teal-deep ring-1 ring-teal-deep/[0.06]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

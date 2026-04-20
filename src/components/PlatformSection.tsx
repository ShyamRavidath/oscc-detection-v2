"use client";

import { useInView } from "@/hooks/useInView";

const features = [
  {
    title: "AI-Engineered Nanobodies",
    desc: "Computationally designed single-domain antibodies replace traditional monoclonal antibodies, dramatically reducing production cost while maintaining high affinity for hemopexin.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <path d="M20 36 L20 20 L12 8 M20 20 L28 8" stroke="var(--teal-deep)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="12" cy="6" r="4" fill="none" stroke="var(--teal-deep)" strokeWidth="1.5" />
        <circle cx="28" cy="6" r="4" fill="none" stroke="var(--teal-deep)" strokeWidth="1.5" />
        <circle cx="12" cy="6" r="1.5" fill="var(--amber)" />
        <circle cx="28" cy="6" r="1.5" fill="var(--amber)" />
      </svg>
    ),
  },
  {
    title: "Gold Nanoparticle Conjugation",
    desc: "Nanobodies are conjugated to colloidal gold nanoparticles for visual signal generation. The characteristic red-purple color at the test line indicates a positive result.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="12" fill="var(--amber)" opacity="0.15" />
        <circle cx="20" cy="20" r="8" fill="var(--amber)" opacity="0.25" />
        <circle cx="20" cy="20" r="4" fill="var(--amber)" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Nitrocellulose Membrane",
    desc: "Optimized membrane pore size ensures consistent capillary flow rate and uniform nanobody deposition at the test and control lines for reliable results.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="8" y="12" width="24" height="16" rx="3" fill="none" stroke="var(--teal-mid)" strokeWidth="1.5" />
        <line x1="12" y1="20" x2="28" y2="20" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="26" x2="28" y2="26" stroke="var(--sage)" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Room-Temperature Stable",
    desc: "No cold chain required. The lyophilized nanobodies maintain activity at ambient temperature, enabling distribution to remote clinics and field settings.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="13" fill="none" stroke="var(--sage)" strokeWidth="1.5" />
        <path d="M20 10 L20 20 L27 24" stroke="var(--teal-deep)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="20" r="2" fill="var(--teal-deep)" />
      </svg>
    ),
  },
  {
    title: "Multiplexable Design",
    desc: "The platform architecture supports additional biomarker lines, enabling future multi-analyte panels for staging or differential diagnosis on a single strip.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="10" y="6" width="20" height="28" rx="4" fill="none" stroke="var(--teal-mid)" strokeWidth="1.5" />
        <line x1="14" y1="14" x2="26" y2="14" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" />
        <line x1="14" y1="20" x2="26" y2="20" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" />
        <line x1="14" y1="26" x2="26" y2="26" stroke="var(--teal-deep)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
  {
    title: "Open-Source Protocol",
    desc: "All design files, nanobody sequences, and assay protocols will be published openly, enabling global manufacturing and adaptation for local needs.",
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="20" cy="20" r="13" fill="none" stroke="var(--teal-deep)" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="5" fill="none" stroke="var(--teal-deep)" strokeWidth="1.5" />
        <line x1="20" y1="7" x2="20" y2="15" stroke="var(--teal-deep)" strokeWidth="1.5" />
        <line x1="20" y1="25" x2="20" y2="33" stroke="var(--teal-deep)" strokeWidth="1.5" />
        <line x1="7" y1="20" x2="15" y2="20" stroke="var(--teal-deep)" strokeWidth="1.5" />
        <line x1="25" y1="20" x2="33" y2="20" stroke="var(--teal-deep)" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function PlatformSection() {
  const { ref, visible } = useInView();

  return (
    <section id="platform" className="relative py-24 sm:py-32 bg-teal-deep noise-overlay wave-divider" ref={ref}>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className={`max-w-2xl ${visible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-teal-light/80 bg-teal-light/[0.08] ring-1 ring-teal-light/10">
            Platform Details
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-cream leading-[1.1]">
            Engineered for the real world
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-cream/50 max-w-[55ch]">
            Every component is designed for manufacturing simplicity, thermal stability, and deployment in resource-limited settings.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className={`group ${visible ? "animate-fade-up" : "opacity-0"}`}
              style={{ animationDelay: `${200 + i * 100}ms` }}
            >
              <div className="rounded-[1.25rem] p-[1px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] h-full">
                <div
                  className="rounded-[calc(1.25rem-1px)] p-6 sm:p-7 h-full transition-all duration-500 group-hover:bg-white/[0.06]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.04)",
                  }}
                >
                  <div className="mb-4 w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.06]">
                    {feat.icon}
                  </div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-cream">{feat.title}</h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-cream/40">{feat.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom comparison table */}
        <div className={`mt-16 rounded-[1.5rem] p-[1px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] ${visible ? "animate-fade-up delay-800" : "opacity-0"}`}>
          <div className="rounded-[calc(1.5rem-1px)] p-6 sm:p-8 overflow-x-auto" style={{ background: "rgba(255,255,255,0.03)" }}>
            <h3 className="text-lg font-semibold text-cream mb-6">How we compare</h3>
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="pb-3 text-cream/40 font-medium pr-4">Attribute</th>
                  <th className="pb-3 text-cream/40 font-medium pr-4">Biopsy</th>
                  <th className="pb-3 text-cream/40 font-medium pr-4">Blood ELISA</th>
                  <th className="pb-3 text-teal-light font-semibold">OSCC Detect</th>
                </tr>
              </thead>
              <tbody className="text-cream/50">
                <tr className="border-b border-white/[0.04]">
                  <td className="py-3 pr-4 text-cream/60 font-medium">Sample type</td>
                  <td className="py-3 pr-4">Tissue</td>
                  <td className="py-3 pr-4">Blood</td>
                  <td className="py-3 text-cream/80 font-medium">Saliva</td>
                </tr>
                <tr className="border-b border-white/[0.04]">
                  <td className="py-3 pr-4 text-cream/60 font-medium">Invasiveness</td>
                  <td className="py-3 pr-4">Surgical</td>
                  <td className="py-3 pr-4">Needle</td>
                  <td className="py-3 text-cream/80 font-medium">None</td>
                </tr>
                <tr className="border-b border-white/[0.04]">
                  <td className="py-3 pr-4 text-cream/60 font-medium">Time to result</td>
                  <td className="py-3 pr-4">Days</td>
                  <td className="py-3 pr-4">Hours</td>
                  <td className="py-3 text-cream/80 font-medium">15 min</td>
                </tr>
                <tr className="border-b border-white/[0.04]">
                  <td className="py-3 pr-4 text-cream/60 font-medium">Cost per test</td>
                  <td className="py-3 pr-4">$200+</td>
                  <td className="py-3 pr-4">$20-50</td>
                  <td className="py-3 text-cream/80 font-medium">&lt;$2</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-cream/60 font-medium">Equipment needed</td>
                  <td className="py-3 pr-4">Lab, pathologist</td>
                  <td className="py-3 pr-4">ELISA reader</td>
                  <td className="py-3 text-cream/80 font-medium">None</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

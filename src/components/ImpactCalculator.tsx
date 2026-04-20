"use client";

import { useState } from "react";

interface Params {
  population: number;
  prevalence: number;
  sensitivity: number;
  specificity: number;
  biopsyCost: number;
  lfaCost: number;
}

const DEFAULTS: Params = {
  population: 100000,
  prevalence: 0.005,
  sensitivity: 0.94,
  specificity: 0.90,
  biopsyCost: 200,
  lfaCost: 2,
};

interface SliderConfig {
  key: keyof Params;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  isPercent?: boolean;
}

const SLIDERS: SliderConfig[] = [
  { key: "population", label: "Population", min: 1000, max: 10000000, step: 1000, format: (v) => v.toLocaleString() },
  { key: "prevalence", label: "Prevalence", min: 0.0001, max: 0.1, step: 0.0001, format: (v) => `${(v * 100).toFixed(2)}%`, isPercent: true },
  { key: "sensitivity", label: "Sensitivity", min: 0.5, max: 1.0, step: 0.01, format: (v) => `${(v * 100).toFixed(0)}%`, isPercent: true },
  { key: "specificity", label: "Specificity", min: 0.5, max: 1.0, step: 0.01, format: (v) => `${(v * 100).toFixed(0)}%`, isPercent: true },
  { key: "biopsyCost", label: "Biopsy Cost", min: 10, max: 2000, step: 5, format: (v) => `$${v.toLocaleString()}` },
  { key: "lfaCost", label: "LFA Test Cost", min: 0.1, max: 50, step: 0.1, format: (v) => `$${v.toFixed(2)}` },
];

function computeMetrics(p: Params) {
  const truePositives = p.population * p.prevalence * p.sensitivity;
  const falseNegatives = p.population * p.prevalence * (1 - p.sensitivity);
  const falsePositives = p.population * (1 - p.prevalence) * (1 - p.specificity);
  const trueNegatives = p.population * (1 - p.prevalence) * p.specificity;

  const detectedCases = truePositives;
  const missedCases = falseNegatives;
  const totalBiopsies = truePositives + falsePositives;
  const unnecessaryBiopsies = falsePositives;

  const screeningCost = p.population * p.lfaCost;
  const biopsyCostTotal = totalBiopsies * p.biopsyCost;
  const totalCostWithScreening = screeningCost + biopsyCostTotal;

  // Without screening: assume all true cases eventually get biopsied + many symptomatic false alarms
  const totalCostWithoutScreening = p.population * p.prevalence * p.biopsyCost + p.population * 0.05 * p.biopsyCost;

  const savings = totalCostWithoutScreening - totalCostWithScreening;
  const savingsPercent = totalCostWithoutScreening > 0 ? (savings / totalCostWithoutScreening) * 100 : 0;
  const costPerDetected = detectedCases > 0 ? totalCostWithScreening / detectedCases : 0;
  const livesSaved = Math.round(detectedCases * 0.3);

  return {
    screeningCost,
    biopsyCostTotal,
    totalCostWithScreening,
    savings,
    savingsPercent,
    detectedCases: Math.round(detectedCases),
    missedCases: Math.round(missedCases),
    unnecessaryBiopsies: Math.round(unnecessaryBiopsies),
    totalBiopsies: Math.round(totalBiopsies),
    trueNegatives: Math.round(trueNegatives),
    costPerDetected,
    livesSaved,
  };
}

function formatCurrency(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

export default function ImpactCalculator() {
  const [params, setParams] = useState<Params>(DEFAULTS);

  function updateParam(key: keyof Params, value: number) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  const m = computeMetrics(params);

  const outputs: { label: string; value: string; sub?: string; color?: string }[] = [
    { label: "Cases Detected", value: m.detectedCases.toLocaleString(), sub: `of ${Math.round(params.population * params.prevalence).toLocaleString()} total`, color: "var(--sage)" },
    { label: "Lives Saved (est.)", value: m.livesSaved.toLocaleString(), sub: "Early detection advantage", color: "var(--teal-mid)" },
    { label: "Total Screening Cost", value: formatCurrency(m.totalCostWithScreening), sub: `Screen + biopsy`, color: "var(--teal-deep)" },
    { label: "Cost Savings", value: formatCurrency(Math.max(m.savings, 0)), sub: m.savingsPercent > 0 ? `${m.savingsPercent.toFixed(0)}% reduction` : "vs no screening", color: "var(--amber)" },
    { label: "Cost per Detected Case", value: formatCurrency(m.costPerDetected), color: "var(--teal-mid)" },
    { label: "Unnecessary Biopsies", value: m.unnecessaryBiopsies.toLocaleString(), sub: `of ${m.totalBiopsies.toLocaleString()} total`, color: "var(--coral)" },
    { label: "Missed Cases", value: m.missedCases.toLocaleString(), sub: `${((1 - params.sensitivity) * 100).toFixed(0)}% false negative rate`, color: "var(--coral)" },
    { label: "True Negatives", value: m.trueNegatives.toLocaleString(), sub: "Correctly cleared", color: "var(--sage)" },
  ];

  return (
    <div>
      {/* Parameter sliders */}
      <div className="rounded-[2rem] p-1.5 bg-white/60 ring-1 ring-teal-deep/[0.04]">
        <div className="rounded-[calc(2rem-6px)] bg-white p-7 sm:p-10" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)" }}>
          <h3 className="text-lg font-semibold tracking-tight text-teal-deep mb-6">
            Model Parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {SLIDERS.map((s) => (
              <div key={s.key}>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor={`param-${s.key}`} className="text-[12px] uppercase tracking-[0.1em] font-medium text-muted">
                    {s.label}
                  </label>
                  <span className="text-[13px] font-semibold text-teal-deep tabular-nums">
                    {s.format(params[s.key])}
                  </span>
                </div>
                <input
                  type="range"
                  id={`param-${s.key}`}
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={params[s.key]}
                  onChange={(e) => updateParam(s.key, parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-cream-warm accent-teal-mid"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setParams(DEFAULTS)}
              className="text-[12px] font-medium text-muted hover:text-teal-deep transition-colors"
            >
              Reset to defaults
            </button>
          </div>
        </div>
      </div>

      {/* Computed outputs */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {outputs.map((o) => (
          <div key={o.label} className="group rounded-[1.25rem] p-1 bg-white/60 ring-1 ring-teal-deep/[0.03] transition-all duration-500 hover:shadow-[0_4px_20px_rgba(13,79,79,0.05)]">
            <div className="rounded-[calc(1.25rem-4px)] bg-white p-5 h-full" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)" }}>
              <div className="w-1.5 h-1.5 rounded-full mb-3" style={{ background: o.color }} />
              <div className="text-2xl font-bold tracking-tight text-teal-deep tabular-nums">
                {o.value}
              </div>
              <div className="mt-1 text-[12px] font-medium text-slate">{o.label}</div>
              {o.sub && <div className="mt-0.5 text-[11px] text-muted">{o.sub}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

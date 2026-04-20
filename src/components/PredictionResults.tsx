"use client";

import type { PredictionResult } from "@/lib/api";

interface PredictionResultsProps {
  result: PredictionResult | null;
  error: string | null;
  onRetry: () => void;
}

function probabilityColor(p: number): string {
  if (p < 0.3) return "var(--sage)";
  if (p < 0.6) return "var(--amber)";
  return "var(--coral)";
}

function probabilityLabel(p: number): string {
  if (p < 0.3) return "Low Risk";
  if (p < 0.6) return "Moderate Risk";
  return "High Risk";
}

function RingGauge({ value, size = 140 }: { value: number; size?: number }) {
  const r = (size - 12) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - value);
  const color = probabilityColor(value);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--cream-warm)" strokeWidth="8" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tracking-tight text-teal-deep">
          {(value * 100).toFixed(1)}%
        </span>
        <span className="text-[11px] font-medium mt-0.5" style={{ color }}>
          {probabilityLabel(value)}
        </span>
      </div>
    </div>
  );
}

const MODEL_LABELS: Record<string, string> = {
  LR: "Logistic Regression",
  RF: "Random Forest",
  SVM: "Support Vector Machine",
};

export default function PredictionResults({ result, error, onRetry }: PredictionResultsProps) {
  if (error) {
    return (
      <div className="mt-8 animate-fade-up">
        <div className="rounded-[1.5rem] p-1.5 bg-coral/[0.06] ring-1 ring-coral/10">
          <div className="rounded-[calc(1.5rem-6px)] bg-white p-7 text-center" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)" }}>
            <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto mb-3 opacity-60">
              <circle cx="24" cy="24" r="20" fill="none" stroke="var(--coral)" strokeWidth="1.5" />
              <path d="M24 16v10M24 30v2" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h3 className="text-lg font-semibold text-teal-deep">Prediction Failed</h3>
            <p className="mt-2 text-[14px] text-muted max-w-[40ch] mx-auto">{error}</p>
            <button
              onClick={onRetry}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-teal-deep px-6 py-2.5 text-[13px] font-medium text-cream transition-all duration-200 hover:shadow-[0_4px_16px_rgba(13,79,79,0.25)] active:scale-[0.97]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="mt-8 animate-fade-up">
      {/* Mock indicator */}
      {result.mock && (
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-amber/[0.08] px-3 py-1 text-[11px] font-medium text-amber ring-1 ring-amber/10">
          <span className="w-1.5 h-1.5 rounded-full bg-amber" />
          Demo prediction (models not loaded)
        </div>
      )}

      {/* Main result */}
      <div className="rounded-[1.5rem] p-1.5 bg-white/60 ring-1 ring-teal-deep/[0.04]">
        <div className="rounded-[calc(1.5rem-6px)] bg-white p-7 sm:p-8" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)" }}>
          <h3 className="text-lg font-semibold tracking-tight text-teal-deep mb-6 text-center">
            Ensemble Prediction
          </h3>

          <div className="flex justify-center mb-8">
            <RingGauge value={result.probability_tumor} />
          </div>

          {/* Per-model breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(Object.entries(result.models) as [string, number][]).map(([key, prob]) => (
              <div key={key} className="rounded-xl p-1 bg-cream-warm/30 ring-1 ring-teal-deep/[0.03]">
                <div className="rounded-[calc(0.75rem-4px)] bg-white p-4 text-center">
                  <div className="text-[11px] uppercase tracking-[0.12em] font-medium text-muted mb-2">
                    {key}
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-teal-deep">
                    {(prob * 100).toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-muted mt-1">
                    {MODEL_LABELS[key]}
                  </div>
                  {/* Mini bar */}
                  <div className="mt-3 h-1.5 rounded-full bg-cream-warm overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      style={{
                        width: `${prob * 100}%`,
                        background: probabilityColor(prob),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

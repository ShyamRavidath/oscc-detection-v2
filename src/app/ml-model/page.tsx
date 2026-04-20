"use client";

import { useState, useCallback } from "react";
import { useInView } from "@/hooks/useInView";
import { predictBiomarkers, type PredictionResult } from "@/lib/api";
import BiomarkerForm from "@/components/BiomarkerForm";
import PredictionResults from "@/components/PredictionResults";

export default function MLModelPage() {
  const { ref, visible } = useInView();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFeatures, setLastFeatures] = useState<number[]>([]);

  const handleSubmit = useCallback(async (features: number[]) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setLastFeatures(features);

    try {
      const res = await predictBiomarkers(features);
      setResult(res);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not reach the prediction server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (lastFeatures.length === 8) {
      handleSubmit(lastFeatures);
    }
  }, [lastFeatures, handleSubmit]);

  return (
    <main className="min-h-[100dvh] pt-28 pb-20 noise-overlay">
      <div className="mx-auto max-w-4xl px-4 sm:px-6" ref={ref}>
        {/* Header */}
        <div className={`max-w-2xl ${visible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-teal-mid bg-teal-mid/[0.07] ring-1 ring-teal-mid/10">
            ML Inference
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-teal-deep leading-[1.1]">
            Biomarker prediction
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted max-w-[55ch]">
            Enter 8 salivary biomarker concentrations to receive a tumor
            probability estimate from our ensemble of Logistic Regression,
            Random Forest, and SVM models.
          </p>
        </div>

        {/* Form card */}
        <div className={`mt-12 ${visible ? "animate-fade-up delay-200" : "opacity-0"}`}>
          <div className="rounded-[2rem] p-1.5 bg-white/60 ring-1 ring-teal-deep/[0.04]">
            <div
              className="rounded-[calc(2rem-6px)] bg-white p-7 sm:p-10"
              style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)" }}
            >
              <BiomarkerForm onSubmit={handleSubmit} loading={loading} />
            </div>
          </div>
        </div>

        {/* Results */}
        <PredictionResults result={result} error={error} onRetry={handleRetry} />

        {/* Info callout */}
        <div className={`mt-12 ${visible ? "animate-fade-up delay-400" : "opacity-0"}`}>
          <div className="rounded-[1.5rem] p-1.5 bg-sage/[0.04] ring-1 ring-sage/[0.06]">
            <div className="rounded-[calc(1.5rem-6px)] bg-gradient-to-br from-white to-sage-light/5 p-6 sm:p-8" style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9)" }}>
              <h3 className="text-[15px] font-semibold tracking-tight text-teal-deep">
                About this model
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted max-w-[60ch]">
                The ensemble averages predictions from three classifiers trained
                on salivary proteomic data. Hemopexin (HPX) is the primary
                discriminating biomarker, with elevated levels correlating to
                OSCC presence. This is a research tool and not a certified
                diagnostic device.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Ensemble averaging", "StandardScaler normalization", "8-feature input", "Binary classification"].map((tag) => (
                  <span key={tag} className="rounded-full bg-teal-deep/[0.04] px-3 py-1 text-[11px] font-medium text-teal-mid">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

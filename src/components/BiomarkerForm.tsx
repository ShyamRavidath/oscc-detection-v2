"use client";

import { useState } from "react";
import { BIOMARKER_ORDER, BIOMARKER_INFO } from "@/lib/api";

interface BiomarkerFormProps {
  onSubmit: (features: number[]) => void;
  loading: boolean;
}

export default function BiomarkerForm({ onSubmit, loading }: BiomarkerFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const key of BIOMARKER_ORDER) {
      init[key] = "";
    }
    return init;
  });

  function handleChange(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const features = BIOMARKER_ORDER.map((key) => {
      const v = parseFloat(values[key]);
      return isNaN(v) ? 0 : v;
    });
    onSubmit(features);
  }

  function fillExample() {
    const example: Record<string, string> = {};
    for (const key of BIOMARKER_ORDER) {
      example[key] = BIOMARKER_INFO[key].placeholder;
    }
    setValues(example);
  }

  const allFilled = BIOMARKER_ORDER.every((key) => values[key] !== "" && !isNaN(parseFloat(values[key])));

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-teal-deep">
          Biomarker Values
        </h3>
        <button
          type="button"
          onClick={fillExample}
          className="text-[12px] font-medium text-teal-mid hover:text-teal-deep transition-colors"
        >
          Fill example values
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BIOMARKER_ORDER.map((key) => {
          const info = BIOMARKER_INFO[key];
          return (
            <div key={key}>
              <label
                htmlFor={`bio-${key}`}
                className="block text-[12px] uppercase tracking-[0.1em] font-medium text-muted mb-1.5"
              >
                {key}{" "}
                <span className="normal-case tracking-normal text-[11px] text-muted/60">
                  ({info.name}, {info.unit})
                </span>
              </label>
              <input
                type="number"
                id={`bio-${key}`}
                name={key}
                step="any"
                min="0"
                value={values[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={info.placeholder}
                disabled={loading}
                className="w-full rounded-xl bg-cream-warm/40 px-4 py-3 text-[14px] text-teal-deep placeholder:text-muted/30 ring-1 ring-teal-deep/[0.06] outline-none transition-all duration-200 focus:ring-teal-mid/30 focus:bg-white disabled:opacity-50"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-7">
        <button
          type="submit"
          disabled={!allFilled || loading}
          className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-teal-deep px-8 py-3.5 text-[14px] font-medium text-cream w-full sm:w-auto overflow-hidden transition-all duration-300 hover:shadow-[0_6px_24px_rgba(13,79,79,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4 relative z-10" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="relative z-10">Analyzing...</span>
            </>
          ) : (
            <>
              <span className="relative z-10">Analyze Biomarkers</span>
              <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white/10 transition-transform duration-200 group-hover:translate-x-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-deep via-teal-mid to-teal-deep opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
      </div>
    </form>
  );
}

'use client';

import { useState, useCallback } from 'react';

/* ── Constants ── */
const FEATURE_ORDER = ['HPX', 'CP', 'ORM2', 'APOA1', 'ALB', 'HP', 'C3', 'SERPINA1'] as const;
type Feature = (typeof FEATURE_ORDER)[number];
type ProteinValues = Record<Feature, number>;

const SG = 'var(--font-space-grotesk), system-ui, sans-serif';
const DM = 'var(--font-dm-mono), monospace';
const SP = 'cubic-bezier(0.16, 1, 0.3, 1)';

const INITIAL_VALUES = Object.fromEntries(
  FEATURE_ORDER.map(k => [k, 0])
) as ProteinValues;

/* ── API layer ── */
function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:5000';
}

function buildFeatureArray(values: ProteinValues): number[] {
  return FEATURE_ORDER.map(k => {
    const v = Number(values[k]);
    return isNaN(v) ? 0 : Math.min(3, Math.max(-3, v));
  });
}

type Prediction = {
  tumor: number;
  normal: number;
  models: { LR: number; RF: number; SVM: number };
};

async function callPredict(features: number[]): Promise<Prediction> {
  const res = await fetch(`${getApiBase()}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ features }),
  });
  if (!res.ok) throw new Error(`Server returned ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (typeof data.probability_tumor !== 'number' || !data.models) {
    throw new Error('Malformed response — missing probability_tumor or models');
  }
  return {
    tumor: data.probability_tumor,
    normal: 1 - data.probability_tumor,
    models: {
      LR:  typeof data.models.LR  === 'number' ? data.models.LR  : 0,
      RF:  typeof data.models.RF  === 'number' ? data.models.RF  : 0,
      SVM: typeof data.models.SVM === 'number' ? data.models.SVM : 0,
    },
  };
}

/* ── Sub-components ── */
function BiomarkerSlider({
  name,
  value,
  onChange,
}: {
  name: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = (((value - (-3)) / 6) * 100).toFixed(2);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
        <span style={{ fontFamily: SG, fontSize: 13, fontWeight: 600, color: '#ccc', letterSpacing: '0.01em' }}>
          {name}
        </span>
        <span style={{ fontFamily: DM, fontSize: 13, color: '#f09b2d', minWidth: 36, textAlign: 'right' }}>
          {value >= 0 ? '+' : ''}{value.toFixed(1)}
        </span>
      </div>
      <input
        type="range"
        min={-3}
        max={3}
        step={0.1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="cu-slider"
        aria-label={`${name} z-score`}
        style={{
          background: `linear-gradient(to right, #f09b2d ${pct}%, #18182a ${pct}%)`,
        } as React.CSSProperties}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontFamily: DM, fontSize: 10, color: '#333' }}>−3</span>
        <span style={{ fontFamily: DM, fontSize: 10, color: '#333' }}>0</span>
        <span style={{ fontFamily: DM, fontSize: 10, color: '#333' }}>+3</span>
      </div>
    </div>
  );
}

function ModelBar({ label, value }: { label: string; value: number }) {
  const isHigh = value >= 0.5;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontFamily: DM, fontSize: 12, color: '#666', letterSpacing: '0.08em' }}>{label}</span>
        <span style={{ fontFamily: DM, fontSize: 13, color: isHigh ? '#ff2d55' : '#f09b2d' }}>
          {(value * 100).toFixed(1)}%
        </span>
      </div>
      <div style={{ height: 3, background: '#0e0e1a', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${Math.round(value * 100)}%`,
          background: isHigh ? '#ff2d55' : '#f09b2d',
          borderRadius: 2,
          transition: `width 0.6s ${SP}`,
        }} />
      </div>
    </div>
  );
}

function PredictionResult({ p }: { p: Prediction }) {
  const isHigh = p.tumor >= 0.5;
  const riskColor = isHigh ? '#ff2d55' : '#f09b2d';
  const riskBg    = isHigh ? 'rgba(255,45,85,0.07)' : 'rgba(240,155,45,0.07)';
  const riskBdr   = isHigh ? 'rgba(255,45,85,0.22)' : 'rgba(240,155,45,0.22)';

  return (
    <>
      {/* Big probability */}
      <div style={{ marginBottom: 6 }}>
        <span style={{ fontFamily: DM, fontSize: 56, fontWeight: 500, color: riskColor, lineHeight: 1 }}>
          {(p.tumor * 100).toFixed(1)}
          <span style={{ fontSize: 28, color: riskColor, opacity: 0.7 }}>%</span>
        </span>
      </div>
      <div style={{ fontFamily: SG, fontSize: 12, color: '#555', marginBottom: 20 }}>tumor probability</div>

      {/* Risk badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '7px 14px', borderRadius: 4, marginBottom: 24,
        background: riskBg, border: `1px solid ${riskBdr}`,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: riskColor, flexShrink: 0, display: 'block' }} />
        <span style={{ fontFamily: SG, fontSize: 12, fontWeight: 600, color: riskColor }}>
          {isHigh ? 'High Risk — recommend follow-up' : 'Low Risk — routine monitoring'}
        </span>
      </div>

      {/* Normal row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '10px 14px', background: '#080810',
        border: '1px solid #18182a', borderRadius: 6, marginBottom: 24,
      }}>
        <span style={{ fontFamily: SG, fontSize: 13, color: '#555' }}>Normal probability</span>
        <span style={{ fontFamily: DM, fontSize: 13, color: '#666' }}>{(p.normal * 100).toFixed(1)}%</span>
      </div>

      {/* Per-model breakdown */}
      <div style={{
        fontFamily: SG, fontSize: 10, fontWeight: 600, color: '#444',
        letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14,
      }}>
        Per-model breakdown
      </div>
      <ModelBar label="LR" value={p.models.LR} />
      <ModelBar label="RF" value={p.models.RF} />
      <ModelBar label="SVM" value={p.models.SVM} />
    </>
  );
}

function SkeletonLoader() {
  return (
    <div style={{ paddingTop: 4 }}>
      {[60, 40, 75, 50, 55].map((w, i) => (
        <div
          key={i}
          style={{
            height: i === 0 ? 52 : 14,
            background: '#18182a',
            borderRadius: 4,
            width: `${w}%`,
            marginBottom: i === 0 ? 16 : 10,
            opacity: 0.5 + (i % 3) * 0.1,
          }}
        />
      ))}
    </div>
  );
}

/* ── Main component ── */
export default function PredictionPlayground() {
  const [values, setValues]         = useState<ProteinValues>(INITIAL_VALUES);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError]           = useState<string | null>(null);

  const handleChange = useCallback((name: Feature, v: number) => {
    setValues(prev => ({ ...prev, [name]: v }));
  }, []);

  const handlePredict = useCallback(async () => {
    if (isPredicting) return;
    setIsPredicting(true);
    setError(null);
    setPrediction(null);
    try {
      const features = buildFeatureArray(values);
      const result = await callPredict(features);
      setPrediction(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isNetwork =
        msg.toLowerCase().includes('fetch') ||
        msg.toLowerCase().includes('failed to fetch') ||
        msg.toLowerCase().includes('networkerror');
      setError(
        isNetwork
          ? `Backend unreachable. Set NEXT_PUBLIC_API_BASE_URL to your running Flask server.\n\nDetails: ${msg}`
          : msg
      );
    } finally {
      setIsPredicting(false);
    }
  }, [isPredicting, values]);

  const handleReset = useCallback(() => {
    setValues(INITIAL_VALUES);
    setPrediction(null);
    setError(null);
  }, []);

  return (
    <section
      id="playground"
      style={{
        background: '#07090f',
        borderTop: '1px solid #0e0e1a',
        padding: 'var(--section-py) var(--gutter)',
      }}
    >
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontFamily: SG, fontSize: 11, fontWeight: 600, color: '#555',
            letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20,
          }}>
            Inference · not clinical diagnosis
          </div>
          <h2 style={{
            fontFamily: SG,
            fontSize: 'clamp(40px, 4.5vw, 62px)',
            fontWeight: 700, color: 'white',
            lineHeight: 1.05, letterSpacing: '-0.03em', margin: '0 0 20px',
          }}>
            Prediction<br />playground
          </h2>
          <p style={{ fontFamily: SG, fontSize: 18, color: '#888', lineHeight: 1.75, maxWidth: 540, margin: 0 }}>
            Enter normalized protein levels (z-scores) and run the ensemble classifier. The same model used in the study.
          </p>
        </div>

        {/* Main grid: sliders left, output right */}
        <div
          className="r-pg-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}
        >
          {/* ── Left: input panel ── */}
          <div style={{
            background: '#0c0c18', border: '1px solid #18182a',
            borderRadius: 12, padding: '28px',
          }}>
            <div style={{
              fontFamily: SG, fontSize: 11, fontWeight: 600, color: '#555',
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24,
            }}>
              Protein levels (z-score)
            </div>

            {/* 2-col slider grid */}
            <div
              className="r-pg-sliders"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}
            >
              {FEATURE_ORDER.map(name => (
                <BiomarkerSlider
                  key={name}
                  name={name}
                  value={values[name]}
                  onChange={v => handleChange(name, v)}
                />
              ))}
            </div>

            {/* Actions row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              marginTop: 28, paddingTop: 24, borderTop: '1px solid #18182a',
            }}>
              <button
                onClick={handlePredict}
                disabled={isPredicting}
                style={{
                  fontFamily: SG, fontSize: 14, fontWeight: 600,
                  color: isPredicting ? '#555' : '#07090f',
                  background: isPredicting ? '#18182a' : '#f09b2d',
                  border: 'none', padding: '13px 28px',
                  borderRadius: 6, cursor: isPredicting ? 'not-allowed' : 'pointer',
                  transition: `all 0.2s ${SP}`,
                  letterSpacing: '0.02em', flexShrink: 0,
                }}
                onMouseEnter={e => { if (!isPredicting) (e.currentTarget as HTMLButtonElement).style.background = '#ffb347'; }}
                onMouseLeave={e => { if (!isPredicting) (e.currentTarget as HTMLButtonElement).style.background = '#f09b2d'; }}
                onMouseDown={e => { if (!isPredicting) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
                onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
              >
                {isPredicting ? 'Running Inference…' : 'Predict →'}
              </button>

              <button
                onClick={handleReset}
                disabled={isPredicting}
                style={{
                  fontFamily: SG, fontSize: 13, fontWeight: 500,
                  color: '#555', background: 'none',
                  border: '1px solid #18182a',
                  padding: '13px 20px', borderRadius: 6,
                  cursor: isPredicting ? 'not-allowed' : 'pointer',
                  transition: `color 0.2s, border-color 0.2s`,
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = '#888'; el.style.borderColor = '#333'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = '#555'; el.style.borderColor = '#18182a'; }}
              >
                Reset
              </button>

              <span style={{ fontFamily: SG, fontSize: 12, color: '#333', marginLeft: 4 }}>
                8 features → LR · RF · SVM
              </span>
            </div>
          </div>

          {/* ── Right: output panel ── */}
          <div style={{
            background: '#0c0c18', border: '1px solid #18182a',
            borderRadius: 12, padding: '28px',
            position: 'sticky', top: 88,
          }}>
            <div style={{
              fontFamily: SG, fontSize: 11, fontWeight: 600, color: '#555',
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24,
            }}>
              Model output
            </div>

            {isPredicting && <SkeletonLoader />}

            {!isPredicting && error && (
              <div style={{
                padding: '14px 16px',
                background: 'rgba(255,45,85,0.05)',
                border: '1px solid rgba(255,45,85,0.18)',
                borderRadius: 8,
              }}>
                <div style={{ fontFamily: SG, fontSize: 12, fontWeight: 600, color: '#ff2d55', marginBottom: 8 }}>
                  Inference failed
                </div>
                <div style={{
                  fontFamily: DM, fontSize: 11, color: '#888',
                  lineHeight: 1.8, whiteSpace: 'pre-line', wordBreak: 'break-word',
                }}>
                  {error}
                </div>
              </div>
            )}

            {!isPredicting && !error && prediction && (
              <PredictionResult p={prediction} />
            )}

            {!isPredicting && !error && !prediction && (
              <div>
                <div style={{ fontFamily: SG, fontSize: 15, color: '#444', lineHeight: 1.8, marginBottom: 20 }}>
                  Adjust protein levels<br />and click Predict →
                </div>
                <div style={{ fontFamily: DM, fontSize: 11, color: '#2a2a3a', lineHeight: 2 }}>
                  HPX · CP · ORM2 · APOA1<br />ALB · HP · C3 · SERPINA1
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          marginTop: 20, padding: '13px 18px',
          background: '#0c0c18', border: '1px solid #18182a', borderRadius: 6,
        }}>
          <div style={{ fontFamily: SG, fontSize: 13, color: '#444', lineHeight: 1.7 }}>
            <strong style={{ color: '#555' }}>Research use only.</strong>
            {' '}Outputs are probabilistic estimates from an internally-validated classifier. Z-scores should be computed relative to the CPTAC HNSCC cohort distribution. Results do not constitute clinical diagnosis.
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); io.disconnect(); } },
      { threshold }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView: v };
}

const SG = 'var(--font-space-grotesk), system-ui, sans-serif';
const DM = 'var(--font-dm-mono), monospace';
const SP = 'cubic-bezier(0.16, 1, 0.3, 1)';

function SliderRow({ label, unit, value, min, max, step, onChange, format }: {
  label: string; unit?: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format?: (v: number) => string;
}) {
  const fmt = format || ((v: number) => v.toLocaleString());
  const pct = ((value - min) / (max - min) * 100).toFixed(2);
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: SG, fontSize: 13, fontWeight: 500, color: '#888' }}>
          {label}
        </span>
        <span style={{ fontFamily: DM, fontSize: 13, color: '#f09b2d', fontWeight: 500 }}>
          {unit === '$' ? '$' : ''}{fmt(value)}{unit && unit !== '$' ? unit : ''}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="cu-slider"
        style={{
          background: `linear-gradient(to right, #f09b2d ${pct}%, #18182a ${pct}%)`,
        } as React.CSSProperties}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontFamily: SG, fontSize: 11, color: '#555' }}>
          {unit === '$' ? '$' : ''}{fmt(min)}{unit && unit !== '$' ? unit : ''}
        </span>
        <span style={{ fontFamily: SG, fontSize: 11, color: '#555' }}>
          {unit === '$' ? '$' : ''}{fmt(max)}{unit && unit !== '$' ? unit : ''}
        </span>
      </div>
    </div>
  );
}

export default function ClinicalUtility() {
  const [pop, setPop] = useState(10000);
  const [prev, setPrev] = useState(1.0);
  const [sens, setSens] = useState(70.4);
  const [spec, setSpec] = useState(90.6);
  const [biopsyCost, setBiopsyCost] = useState(845);
  const [lfaCost, setLfaCost] = useState(9);
  const [rounds, setRounds] = useState(1);

  const D = pop * prev / 100;
  const H = pop - D;
  const se = sens / 100;
  const sp = spec / 100;

  const TP = se * D;
  const FN = (1 - se) * D;
  const FP = (1 - sp) * H;
  const TN = sp * H;

  const PPV = (TP + FP) > 0 ? TP / (TP + FP) : 0;

  const biopsiesA = pop;
  const costA = pop * biopsyCost;
  const costPerCancerA = D > 0 ? costA / D : 0;

  const biopsiesB = TP + FP;
  const costB = pop * lfaCost + biopsiesB * biopsyCost;
  const costPerCancerB = TP > 0 ? costB / TP : 0;

  const savings = costA - costB;
  const savingsPct = costA > 0 ? (savings / costA * 100) : 0;
  const biopsiesAvoided = biopsiesA - biopsiesB;

  const seK = 1 - Math.pow(1 - se, rounds);
  const detectedK = seK * D;
  const livesSaved = Math.round(detectedK * 0.45);

  const fmt$ = (v: number) => '$' + Math.round(v).toLocaleString();
  const fmtN = (v: number) => Math.round(v).toLocaleString();
  const fmtPct = (v: number) => (v * 100).toFixed(1) + '%';
  const fmtM = (v: number) => v >= 1e6 ? '$' + (v / 1e6).toFixed(2) + 'M' : v >= 1e3 ? '$' + (v / 1e3).toFixed(0) + 'K' : '$' + Math.round(v);

  const { ref: hdrRef, inView: hdrIn } = useInView(0.15);
  const { ref: gridRef, inView: gridIn } = useInView(0.06);

  const accentSavings = savings > 0 ? '#f09b2d' : '#ff2d55';
  const borderSavings = savings > 0 ? 'rgba(240,155,45,0.18)' : 'rgba(255,45,85,0.18)';
  const bgSavings = savings > 0 ? 'rgba(240,155,45,0.04)' : 'rgba(255,45,85,0.04)';

  return (
    <section id="clinical-utility" style={{
      background: '#07090f',
      borderTop: '1px solid #0e0e1a',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient radial gradients */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-8%',
          width: '55%', height: '70%',
          background: 'radial-gradient(ellipse at 35% 45%, rgba(240,155,45,0.055) 0%, transparent 62%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-5%', right: '-6%',
          width: '50%', height: '60%',
          background: 'radial-gradient(ellipse at 65% 55%, rgba(255,45,85,0.045) 0%, transparent 62%)',
        }} />
      </div>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: 'var(--section-py) var(--gutter)', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div
          ref={hdrRef}
          style={{
            opacity: hdrIn ? 1 : 0,
            transform: hdrIn ? 'translateY(0)' : 'translateY(28px)',
            transition: `opacity 0.8s ${SP}, transform 0.8s ${SP}`,
          }}
        >
          <div style={{ fontFamily: SG, fontSize: 11, fontWeight: 600, color: '#555', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>
            Scenario modelling · not clinical evidence
          </div>
          <h2 style={{ fontFamily: SG, fontSize: 'clamp(52px, 6vw, 88px)', fontWeight: 700, color: 'white', lineHeight: 1.0, letterSpacing: '-0.03em', margin: '0 0 24px' }}>
            Screening<br />impact<br />model
          </h2>
          <p style={{ fontFamily: SG, fontSize: 18, color: '#aaa', lineHeight: 1.75, maxWidth: 560, margin: '0 0 32px' }}>
            Compares universal biopsy vs. OralSense triage. Adjust parameters to explore cost and detection tradeoffs.{' '}
            <strong style={{ color: 'white' }}>LFA triage reduces unnecessary biopsies</strong> while maintaining clinically relevant sensitivity.
          </p>
        </div>

        {/* Main grid — 440px left / 1fr right */}
        <div
          ref={gridRef}
          className="r-cu-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '440px 1fr',
            gap: 40,
            alignItems: 'start',
            opacity: gridIn ? 1 : 0,
            transform: gridIn ? 'translateY(0)' : 'translateY(32px)',
            transition: `opacity 0.9s 0.12s ${SP}, transform 0.9s 0.12s ${SP}`,
          }}
        >
          {/* Parameter panel */}
          <div style={{
            background: '#0c0c18',
            border: '1px solid #18182a',
            borderRadius: 12,
            padding: '28px',
          }}>
              <div style={{ fontFamily: SG, fontSize: 11, fontWeight: 600, color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24 }}>
                Parameters
              </div>
              <SliderRow label="Population" value={pop} min={500} max={100000} step={500}
                onChange={setPop} format={v => v.toLocaleString()} />
              <SliderRow label="Prevalence" unit="%" value={prev} min={0.1} max={15} step={0.1}
                onChange={setPrev} format={v => v.toFixed(1)} />
              <SliderRow label="Sensitivity" unit="%" value={sens} min={50} max={100} step={0.5}
                onChange={setSens} format={v => v.toFixed(1)} />
              <SliderRow label="Specificity" unit="%" value={spec} min={50} max={100} step={0.5}
                onChange={setSpec} format={v => v.toFixed(1)} />
              <div style={{ borderTop: '1px solid #18182a', margin: '8px 0 22px' }} />
              <SliderRow label="Biopsy cost" unit="$" value={biopsyCost} min={200} max={3000} step={25}
                onChange={setBiopsyCost} format={v => v.toLocaleString()} />
              <SliderRow label="LFA test cost" unit="$" value={lfaCost} min={2} max={80} step={1}
                onChange={setLfaCost} format={v => v.toLocaleString()} />
              <SliderRow label="Screening rounds k" value={rounds} min={1} max={6} step={1}
                onChange={setRounds} format={v => String(v)} />
          </div>

          {/* Outputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Savings banner */}
            <div style={{
              padding: '28px 32px',
              borderRadius: 12,
              background: bgSavings,
              border: `1px solid ${borderSavings}`,
              boxShadow: `inset 0 1px 0 ${savings > 0 ? 'rgba(240,155,45,0.07)' : 'rgba(255,45,85,0.07)'}`,
            }}>
              <div style={{ fontFamily: SG, fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 10 }}>
                {savings > 0 ? 'Estimated savings with LFA triage' : 'Additional cost with LFA triage'}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ fontFamily: DM, fontSize: 'clamp(40px, 4.5vw, 64px)', fontWeight: 500, color: accentSavings, lineHeight: 1 }}>
                  {fmtM(Math.abs(savings))}
                </div>
                <div style={{ fontFamily: SG, fontSize: 14, color: savings > 0 ? 'rgba(240,155,45,0.55)' : 'rgba(255,45,85,0.55)' }}>
                  {Math.abs(savingsPct).toFixed(1)}% vs universal biopsy
                </div>
              </div>
            </div>

            {/* Lives saved + cost bars — side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

              {/* Lives saved */}
              <div style={{
                padding: '22px 24px',
                background: '#0c0c18',
                border: '1px solid #18182a',
                borderRadius: 10,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
              }}>
                <div style={{ fontFamily: SG, fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 12 }}>
                  Additional survivors (est.)
                </div>
                <div style={{ fontFamily: DM, fontSize: 48, fontWeight: 500, color: '#ff2d55', lineHeight: 1, marginBottom: 10 }}>
                  ~{livesSaved}
                </div>
                <div style={{ fontFamily: SG, fontSize: 13, color: '#888', lineHeight: 1.5 }}>
                  after {rounds} round{rounds > 1 ? 's' : ''} vs no screening
                </div>
              </div>

              {/* Cost comparison */}
              <div style={{
                padding: '22px 24px',
                background: '#0c0c18',
                border: '1px solid #18182a',
                borderRadius: 10,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
              }}>
                <div style={{ fontFamily: SG, fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 20 }}>
                  Total cost comparison
                </div>
                {[
                  { label: 'Universal Biopsy', value: costA, max: Math.max(costA, costB), color: '#ff2d55' },
                  { label: 'LFA Triage', value: costB, max: Math.max(costA, costB), color: '#f09b2d' },
                ].map((r, i) => (
                  <div key={i} style={{ marginBottom: i === 0 ? 16 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: SG, fontSize: 12, color: '#888' }}>{r.label}</span>
                      <span style={{ fontFamily: DM, fontSize: 13, color: r.color }}>{fmtM(r.value)}</span>
                    </div>
                    <div style={{ height: 6, background: '#0e0e1a', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: '100%',
                        background: r.color, opacity: 0.75, borderRadius: 2,
                        transform: `scaleX(${r.max > 0 ? r.value / r.max : 0})`,
                        transformOrigin: 'left',
                        transition: `transform 0.5s ${SP}`,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary table */}
        <div style={{ marginTop: 32, border: '1px solid #18182a', borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0e0e1a', borderBottom: '1px solid #18182a' }}>
                {['Metric', 'Universal Biopsy', 'LFA Triage', 'Difference'].map((h, i) => (
                  <th key={i} style={{
                    fontFamily: SG, fontSize: 11, fontWeight: 600, color: '#777',
                    letterSpacing: '0.06em', padding: '12px 18px', textAlign: i === 0 ? 'left' : 'right',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Total cost', a: fmt$(costA), b: fmt$(costB), d: (savings >= 0 ? '−' : '+') + fmt$(Math.abs(savings)), pos: savings >= 0 },
                { label: 'Biopsies performed', a: fmtN(biopsiesA), b: fmtN(biopsiesB), d: '−' + fmtN(biopsiesAvoided), pos: true },
                { label: 'Cancers detected', a: fmtN(D), b: fmtN(TP), d: FN > 0.5 ? '−' + fmtN(FN) : '—', pos: false },
                { label: 'False positives', a: fmtN(H), b: fmtN(FP), d: '−' + fmtN(H - FP), pos: true },
                { label: 'PPV', a: '100%', b: fmtPct(PPV), d: '−' + ((1 - PPV) * 100).toFixed(1) + '%', pos: false },
                { label: 'Cost per cancer detected', a: fmt$(costPerCancerA), b: fmt$(costPerCancerB), d: (costPerCancerA - costPerCancerB >= 0 ? '−' : '+') + fmt$(Math.abs(costPerCancerA - costPerCancerB)), pos: costPerCancerB <= costPerCancerA },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #0e0e1a', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ fontFamily: SG, fontSize: 15, color: '#bbb', padding: '14px 18px' }}>{row.label}</td>
                  <td style={{ fontFamily: DM, fontSize: 14, color: '#888', padding: '14px 18px', textAlign: 'right' }}>{row.a}</td>
                  <td style={{ fontFamily: DM, fontSize: 14, color: '#f09b2d', padding: '14px 18px', textAlign: 'right' }}>{row.b}</td>
                  <td style={{ fontFamily: DM, fontSize: 14, color: row.pos ? '#f09b2d' : '#ff2d55', padding: '14px 18px', textAlign: 'right' }}>{row.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 20, padding: '16px 20px', background: '#0c0c18', border: '1px solid #18182a', borderRadius: 6 }}>
          <div style={{ fontFamily: SG, fontSize: 14, color: '#888', lineHeight: 1.7 }}>
            <strong style={{ color: '#aaa', fontStyle: 'normal' }}>Note: </strong>
            Scenario estimates only. Sensitivity/specificity shift with population characteristics and assay calibration. Lives-saved figures use published stage-stratified survival rates and are not prospectively validated.
          </div>
        </div>
      </div>
    </section>
  );
}

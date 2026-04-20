'use client';

import { useState } from 'react';

const TOP10 = [
  { protein: 'HPX',      rf_score: 0.043283, anova_f: 380.320, ensemble_score: 0.9361, rf_rank: 1,  anova_rank: 3,  ensemble_rank: 1,  overall_rank: 1  },
  { protein: 'CAB39L',   rf_score: 0.024568, anova_f: 396.131, ensemble_score: 0.7431, rf_rank: 5,  anova_rank: 2,  ensemble_rank: 2,  overall_rank: 2  },
  { protein: 'LYVE1',    rf_score: 0.024631, anova_f: 351.533, ensemble_score: 0.6783, rf_rank: 4,  anova_rank: 5,  ensemble_rank: 5,  overall_rank: 3  },
  { protein: 'CAVIN2',   rf_score: 0.023306, anova_f: 363.761, ensemble_score: 0.6810, rf_rank: 6,  anova_rank: 4,  ensemble_rank: 4,  overall_rank: 4  },
  { protein: 'SELENBP1', rf_score: 0.029487, anova_f: 328.738, ensemble_score: 0.7010, rf_rank: 3,  anova_rank: 8,  ensemble_rank: 3,  overall_rank: 5  },
  { protein: 'ASPA',     rf_score: 0.012330, anova_f: 423.877, ensemble_score: 0.6424, rf_rank: 17, anova_rank: 1,  ensemble_rank: 7,  overall_rank: 6  },
  { protein: 'SSC5D',    rf_score: 0.015323, anova_f: 318.297, ensemble_score: 0.5220, rf_rank: 12, anova_rank: 10, ensemble_rank: 8,  overall_rank: 7  },
  { protein: 'ABCA8',    rf_score: 0.031404, anova_f: 293.713, ensemble_score: 0.6717, rf_rank: 2,  anova_rank: 21, ensemble_rank: 6,  overall_rank: 8  },
  { protein: 'EHD2',     rf_score: 0.011831, anova_f: 344.570, ensemble_score: 0.5203, rf_rank: 19, anova_rank: 7,  ensemble_rank: 9,  overall_rank: 9  },
  { protein: 'AHSG',     rf_score: 0.011753, anova_f: 318.892, ensemble_score: 0.4817, rf_rank: 20, anova_rank: 9,  ensemble_rank: 12, overall_rank: 10 },
];

const UNIPROT: Record<string, string> = {
  HPX: 'P02790', CAB39L: 'Q9Y376', LYVE1: 'Q9Y5Y7', CAVIN2: 'Q9UKV3',
  SELENBP1: 'Q13228', ASPA: 'P45381', SSC5D: 'Q6WN34', ABCA8: 'O94911',
  EHD2: 'Q9NZN3', AHSG: 'P02765',
};

type Row = typeof TOP10[0];

const TABS = [
  {
    label: 'Random Forest',
    scoreKey: 'rf_score' as keyof Row, rankKey: 'rf_rank' as keyof Row,
    desc: 'Gini-based mean decrease in impurity across 200 decision trees (max_depth=10). Reflects how often a feature splits data toward pure class-homogeneous nodes.',
    formula: null as string | null,
  },
  {
    label: 'ANOVA F-test',
    scoreKey: 'anova_f' as keyof Row, rankKey: 'anova_rank' as keyof Row,
    desc: 'One-way F-statistic from scipy (tumor vs. normal). Measures between-class variance relative to within-class variance; higher F = greater group separation.',
    formula: null as string | null,
  },
  {
    label: 'Ensemble Consensus',
    scoreKey: 'ensemble_score' as keyof Row, rankKey: 'ensemble_rank' as keyof Row,
    desc: 'Proteins consistently informative under both model-based and statistical evidence. HPX ranks #1 — uniquely high in both RF and ANOVA after normalization.',
    formula: 'Ensemble score = mean( min-max(RF score), min-max(ANOVA F) )\nHigher score → supported by BOTH tree-based and statistical evidence.',
  },
];

function ProteinLink({ protein }: { protein: string }) {
  const uid = UNIPROT[protein];
  if (!uid) return <span>{protein}</span>;
  return (
    <a href={`https://www.uniprot.org/uniprot/${uid}`} target="_blank" rel="noopener noreferrer"
      style={{ color: 'inherit', textDecoration: 'none' }}
      onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
      onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>
      {protein}
    </a>
  );
}

function ScoreBar({ value, max, isHPX }: { value: number; max: number; isHPX: boolean }) {
  const pct = max > 0 ? value / max : 0;
  return (
    <div style={{ flex: 1, height: 4, background: '#111', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: '100%',
        background: isHPX ? '#ff2d55' : '#f09b2d', borderRadius: 2,
        transform: `scaleX(${pct})`, transformOrigin: 'left',
        transition: 'transform 0.4s ease',
      }} />
    </div>
  );
}

export default function FeatureImportance() {
  const [activeTab, setActiveTab] = useState(0);
  const t = TABS[activeTab];
  const sorted = [...TOP10].sort((a, b) => a.overall_rank - b.overall_rank);
  const maxScore = Math.max(...sorted.map(r => r[t.scoreKey] as number));

  return (
    <section id="feature-importance" style={{
      padding: 'var(--section-py) var(--gutter)', background: '#07090f',
      borderTop: '1px solid #0e0e1a',
    }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>

        {/* Header: asymmetric 2-col */}
        <div className="r-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'end', marginBottom: 56 }}>
          <h2 style={{
            fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
            fontSize: 'clamp(52px, 6vw, 80px)', fontWeight: 700, color: 'white',
            lineHeight: 1.0, letterSpacing: '-0.03em', margin: 0,
          }}>
            Protein<br />biomarker<br />ranking
          </h2>
          <div>
            <p style={{
              fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
              fontSize: 18, color: '#aaa', lineHeight: 1.8, margin: '0 0 32px',
            }}>
              Across 9,382 salivary proteins from CPTAC HNSCC (182 samples), two independent methods combined into an ensemble score.{' '}
              <strong style={{ color: 'white' }}>HPX ranks #1 overall.</strong>
            </p>
            {/* Tab bar inline with description */}
            <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #18182a' }}>
              {TABS.map((tab, i) => (
                <button key={i} onClick={() => setActiveTab(i)} style={{
                  fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif', fontSize: 13, fontWeight: 500,
                  color: activeTab === i ? '#f09b2d' : '#777',
                  letterSpacing: '0.02em',
                  background: 'none', border: 'none',
                  borderBottom: activeTab === i ? '2px solid #f09b2d' : '2px solid transparent',
                  padding: '10px 20px 10px 0', cursor: 'pointer',
                  transition: 'all 0.2s', marginBottom: -1,
                }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content: list left, sticky methodology right */}
        <div className="r-fi-content" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 48, alignItems: 'start' }}>

          {/* Left: protein list */}
          <div>
            {sorted.map((row) => {
              const isHPX = row.protein === 'HPX';
              const score = row[t.scoreKey] as number;
              const rank = row[t.rankKey] as number;
              return (
                <div key={row.protein} style={{
                  padding: '18px 20px',
                  background: isHPX ? '#ff2d5508' : 'transparent',
                  border: isHPX ? '1px solid #ff2d5530' : '1px solid transparent',
                  borderBottom: '1px solid #0e0e1a',
                  marginBottom: 0,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                    <span style={{
                      fontFamily: 'var(--font-dm-mono), monospace', fontSize: 12,
                      color: isHPX ? '#ff2d55' : '#444', width: 28, flexShrink: 0,
                    }}>#{rank}</span>
                    <span style={{
                      fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                      fontSize: 17, fontWeight: 600, color: isHPX ? 'white' : '#ddd', flex: 1,
                    }}>
                      <ProteinLink protein={row.protein} />
                    </span>
                    {isHPX && (
                      <span style={{
                        fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif', fontSize: 10, fontWeight: 600,
                        color: '#ff2d55', border: '1px solid #ff2d5540',
                        padding: '3px 10px', borderRadius: 2, letterSpacing: '0.06em',
                      }}>★ Primary</span>
                    )}
                    <span style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 14, color: isHPX ? '#ff2d55' : '#f09b2d' }}>
                      {score.toFixed(4)}
                    </span>
                  </div>
                  <div style={{ paddingLeft: 44 }}>
                    <ScoreBar value={score} max={maxScore} isHPX={isHPX} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: sticky methodology panel */}
          <div className="r-fi-sticky" style={{ position: 'sticky', top: 88 }}>
            <div style={{
              padding: '28px', background: '#0c0c18',
              border: '1px solid #18182a', borderRadius: 8,
            }}>
              <div style={{
                fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                fontSize: 11, fontWeight: 600, color: '#f09b2d',
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16,
              }}>
                {t.label}
              </div>
              <p style={{
                fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                fontSize: 15, color: '#aaa', lineHeight: 1.75, margin: 0,
              }}>
                {t.desc}
              </p>
              {t.formula && (
                <div style={{
                  fontFamily: 'var(--font-dm-mono), monospace', fontSize: 12, color: '#888',
                  background: '#080810', border: '1px solid #18182a',
                  borderRadius: 4, padding: '14px 16px', marginTop: 20, lineHeight: 1.8,
                  whiteSpace: 'pre-line',
                }}>{t.formula}</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

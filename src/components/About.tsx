'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    setM(mq.matches);
    const fn = (e: MediaQueryListEvent) => setM(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return m;
}

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
const SP = 'cubic-bezier(0.16, 1, 0.3, 1)';

const QA: { short: string; title: string; content: ReactNode }[] = [
  {
    short: 'Why oral cancer?',
    title: 'Why oral cancer? Why saliva?',
    content: (
      <>
        Oral squamous cell carcinoma carries a five-year survival rate above 80% when caught early — yet below 40% at late stage. Most patients present after stage III. Current diagnosis demands biopsy: invasive, expensive, and inaccessible in many settings.
        <br /><br />
        Saliva is an ideal primary matrix. Collection is non-invasive, repeatable, and scalable with no specialist equipment. It reflects both local oral inflammation and systemic protein shifts associated with tumour burden — while introducing known confounders (diet, infection, oral hygiene) that must be controlled.
      </>
    ),
  },
  {
    short: 'Why Hemopexin (HPX)?',
    title: 'Why Hemopexin (HPX)?',
    content: (
      <>
        HPX is a plasma glycoprotein that scavenges free heme, protecting tissue from oxidative stress. In OSCC, tumour-associated inflammation and local tissue breakdown elevate HPX detectably in saliva.
        <br /><br />
        Across our model panel, HPX ranked consistently as the highest-importance feature. Importantly, HPX is not a cancer-specific marker — it is a triage biomarker whose utility depends on panel integration, population context, and threshold calibration. Elevated HPX signals elevated risk; it does not diagnose malignancy alone.
      </>
    ),
  },
  {
    short: 'What are nanobodies?',
    title: 'What are nanobodies?',
    content: (
      <>
        Nanobodies (VHH domains) are single-domain antibody fragments derived from camelid heavy-chain antibodies. At ~15 kDa — roughly one-tenth the mass of conventional IgG — they offer a uniquely compact, thermally stable binding scaffold.
        <br /><br />
        For lateral flow applications this matters: nanobodies can be expressed in bacteria at scale, tolerate storage without refrigeration, and access epitopes that conventional antibodies cannot. Our HPX-targeting nanobody candidates were generated computationally, prioritised by pLDDT confidence scores and interface predicted aligned error (i_pAE). Wet-lab validation remains ongoing.
      </>
    ),
  },
  {
    short: 'How does the assay work?',
    title: 'How does the lateral flow assay work?',
    content: (
      <>
        The strip contains four zones: <strong style={{ color: '#ccc' }}>sample pad</strong> → <strong style={{ color: '#ccc' }}>conjugate pad</strong> (dye-labeled anti-HPX nanobodies) → <strong style={{ color: '#ccc' }}>nitrocellulose membrane</strong> (T and C lines) → <strong style={{ color: '#ccc' }}>absorbent pad</strong>.
        <br /><br />
        If HPX is present, it forms a complex with the labeled nanobody in the conjugate zone. This complex wicks to the test line (T), where a capture nanobody immobilises it — producing a visible signal. The control line (C) confirms fluid flow independently of the target. Two lines = positive. One line = negative.
      </>
    ),
  },
  {
    short: 'Machine learning model',
    title: 'Machine learning — how risk is computed',
    content: (
      <>
        Eight protein features (HPX, CP, ORM2, APOA1, ALB, HP, C3, SERPINA1) are input to four classifiers: Logistic Regression, Random Forest, Gradient Boosting, and SVM with RBF kernel. Each model was internally validated with 5-fold cross-validation.
        <br /><br />
        Logistic Regression and SVM achieved 96.1% accuracy with AUC ≥ 0.98. An ensemble approach — averaging model votes — reduces overfitting risk versus any single classifier. AUC measures the model&apos;s ability to rank true positives above true negatives across all thresholds; 0.98 indicates near-ideal separation on this cohort.
      </>
    ),
  },
  {
    short: 'Limitations',
    title: 'Limitations and next steps',
    content: (
      <>
        Confounders including oral infection, smoking, systemic inflammation, and diet variability can shift HPX independently of malignancy. These are partially addressed by panel context and threshold calibration — but not eliminated.
        <br /><br />
        Internal cross-validation is not a substitute for prospective external validation. Multi-site trials with demographically diverse cohorts are required to establish real-world thresholds, assess population fairness, and support a regulatory pathway. Computational nanobody designs require synthesis and affinity characterisation before LFA integration.
      </>
    ),
  },
];

export default function About() {
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const isMobile = useIsMobile();
  const { ref: hdrRef, inView: hdrIn } = useInView(0.15);
  const { ref: gridRef, inView: gridIn } = useInView(0.06);

  const selectQuestion = (i: number) => {
    if (i === active) return;
    setTransitioning(true);
    setTimeout(() => {
      setActive(i);
      setTransitioning(false);
    }, 180);
  };

  return (
    <section id="about" style={{
      background: '#07090f',
      borderTop: '1px solid #0e0e1a',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient gradients */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-8%',
          width: '50%', height: '65%',
          background: 'radial-gradient(ellipse at 65% 35%, rgba(240,155,45,0.045) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-5%', left: '-5%',
          width: '40%', height: '50%',
          background: 'radial-gradient(ellipse at 30% 65%, rgba(255,45,85,0.03) 0%, transparent 60%)',
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
          <h2 style={{
            fontFamily: SG,
            fontSize: 'clamp(72px, 9vw, 128px)', fontWeight: 700, color: 'white',
            lineHeight: 1.0, letterSpacing: '-0.03em', margin: '0 0 24px',
          }}>The<br />science.</h2>
          <p style={{
            fontFamily: SG,
            fontSize: 18, color: '#aaa',
            lineHeight: 1.75, margin: '0 0 48px', maxWidth: 700,
          }}>
            A salivary proteomic approach to oral cancer triage. Six questions covering the biology, the assay design, the machine learning model, and what remains to be proven.
          </p>
        </div>

        {/* Content grid — 340px nav / 1fr content */}
        <div
          ref={gridRef}
          className="r-ab-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '340px 1fr',
            gap: 72,
            borderTop: '1px solid #0e0e1a',
            paddingTop: 56,
            opacity: gridIn ? 1 : 0,
            transform: gridIn ? 'translateY(0)' : 'translateY(28px)',
            transition: `opacity 0.9s 0.1s ${SP}, transform 0.9s 0.1s ${SP}`,
          }}
        >
          {/* Left nav */}
          <div className="r-about-left-nav" style={{ position: 'sticky', top: 88, alignSelf: 'start' }}>
            {QA.map((q, i) => (
              <button
                key={i}
                className="r-about-nav-btn"
                onClick={() => selectQuestion(i)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '14px 16px',
                  background: active === i ? 'rgba(240,155,45,0.04)' : 'none',
                  border: 'none', cursor: 'pointer',
                  borderLeft: !isMobile ? (active === i ? '2px solid #f09b2d' : '2px solid transparent') : 'none',
                  borderBottom: isMobile ? (active === i ? '2px solid #f09b2d' : '2px solid transparent') : '1px solid #0e0e1a',
                  display: 'flex', alignItems: 'baseline', gap: 14,
                  opacity: active === i ? 1 : 0.5,
                  transition: `opacity 0.2s, border-color 0.2s, background 0.2s`,
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-dm-mono), monospace', fontSize: 10,
                  color: active === i ? '#f09b2d' : '#888',
                  letterSpacing: '0.12em', flexShrink: 0, paddingTop: 2,
                  transition: 'color 0.2s',
                }}>0{i + 1}</span>
                <span style={{
                  fontFamily: SG,
                  fontSize: 15, fontWeight: active === i ? 600 : 400,
                  color: active === i ? 'white' : '#aaa',
                  lineHeight: 1.4, transition: 'all 0.2s',
                }}>{q.short}</span>
              </button>
            ))}
          </div>

          {/* Right content */}
          <div>
            {/* Content with fade transition */}
            <div style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? 'translateY(10px)' : 'translateY(0)',
              transition: transitioning
                ? 'opacity 0.18s ease, transform 0.18s ease'
                : `opacity 0.32s ${SP}, transform 0.32s ${SP}`,
              maxWidth: 720,
            }}>
              <h3 style={{
                fontFamily: SG,
                fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 700, color: 'white',
                letterSpacing: '-0.025em', marginBottom: 32, lineHeight: 1.15,
              }}>{QA[active].title}</h3>
              <div style={{
                fontFamily: SG,
                fontSize: 18, color: '#aaa',
                lineHeight: 1.85,
              }}>
                {QA[active].content}
              </div>
            </div>

            {/* Prev / next */}
            <div style={{ display: 'flex', gap: 10, marginTop: 52, alignItems: 'center' }}>
              {active > 0 && (
                <button onClick={() => selectQuestion(active - 1)} style={{
                  fontFamily: SG, fontSize: 13, fontWeight: 500,
                  color: '#888', background: 'none',
                  border: '1px solid #18182a',
                  padding: '9px 18px', borderRadius: 4, cursor: 'pointer',
                  transition: `color 0.15s, border-color 0.15s, transform 0.1s`,
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = 'white'; el.style.borderColor = '#444'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = '#888'; el.style.borderColor = '#18182a'; el.style.transform = 'scale(1)'; }}
                  onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
                  onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}>
                  ← prev
                </button>
              )}
              {active < QA.length - 1 && (
                <button onClick={() => selectQuestion(active + 1)} style={{
                  fontFamily: SG, fontSize: 13, fontWeight: 500,
                  color: '#888', background: 'none',
                  border: '1px solid #18182a',
                  padding: '9px 18px', borderRadius: 4, cursor: 'pointer',
                  transition: `color 0.15s, border-color 0.15s, transform 0.1s`,
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = 'white'; el.style.borderColor = '#444'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = '#888'; el.style.borderColor = '#18182a'; el.style.transform = 'scale(1)'; }}
                  onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'; }}
                  onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}>
                  next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

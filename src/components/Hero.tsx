'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

function usePrefersReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(mq.matches);
    const fn = (e: MediaQueryListEvent) => setR(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return r;
}

function useCountUp(target: number, duration: number, active: boolean, reduced: boolean) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!active) return;
    if (reduced) { setVal(target); return; }
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - t0) / duration, 1);
      setVal(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration, reduced]);
  return val;
}

type LFAPhase = 'idle' | 'wicking' | 'tlit' | 'clit' | 'hold' | 'fade';

/* ---------------------------------------------------------------------------
   LiveLFA — animates a real lateral-flow assay cycle ~every 8 s
   Timing anchored to actual strip geometry:
   - Strip x=52, width=248
   - T-line at x=138 → 34.7% → fires at 3200 * 0.347 ≈ 1110 ms into wicking
   - C-line at x=212 → 64.5% → fires at 3200 * 0.645 ≈ 2064 ms into wicking
   - +1000 ms idle before wicking → absolute: T=2110, C=3064
--------------------------------------------------------------------------- */
function LiveLFA({
  reduced,
  onTFireRef,
}: {
  reduced: boolean;
  onTFireRef: React.RefObject<() => void>;
}) {
  const [phase, setPhase] = useState<LFAPhase>('idle');

  useEffect(() => {
    if (reduced) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const p = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    const cycle = () => {
      setPhase('idle');
      p(() => setPhase('wicking'),                        1000);
      p(() => { setPhase('tlit'); onTFireRef.current?.(); }, 2110);
      p(() => setPhase('clit'),                           3064);
      p(() => setPhase('hold'),                           4200);
      p(() => setPhase('fade'),                           6700);
      p(cycle,                                            7900);
    };

    cycle();
    return () => timers.forEach(clearTimeout);
  }, [reduced, onTFireRef]);

  const sw = 320, sh = 80, sx = 0, sy = 0;
  const tX = sx + 138, cX = sx + 212;
  const stripX = sx + 52, stripW = sw - 72;
  const tLit = phase === 'tlit' || phase === 'clit' || phase === 'hold';
  const cLit = phase === 'clit' || phase === 'hold';
  const showWick = phase !== 'idle' && !reduced;

  return (
    <>
      <style>{`
        @keyframes h-wick {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .h-wick-rect {
          transform-box: fill-box;
          transform-origin: left center;
          animation: h-wick 3200ms cubic-bezier(0.28, 0, 0.38, 1) forwards;
        }
        @keyframes r-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <svg
        viewBox="-25 -20 370 120"
        style={{
          width: '100%', height: '100%',
          opacity: phase === 'fade' ? 0 : 1,
          transition: phase === 'fade' ? 'opacity 1.2s ease' : 'none',
        }}
      >
        <defs>
          <radialGradient id="lh_amb" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#ff2d55" stopOpacity={tLit ? 0.28 : 0.14} />
            <stop offset="100%" stopColor="#ff2d55" stopOpacity="0" />
          </radialGradient>
          <filter id="lh_glow" x="-100%" y="-60%" width="300%" height="220%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="lh_strong" x="-150%" y="-80%" width="400%" height="360%">
            <feGaussianBlur stdDeviation="9" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="lh_strip" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1814" />
            <stop offset="12%" stopColor="#252320" />
            <stop offset="88%" stopColor="#252320" />
            <stop offset="100%" stopColor="#1a1814" />
          </linearGradient>
          <linearGradient id="lh_wet" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#151621" />
            <stop offset="50%" stopColor="#1b1d2c" />
            <stop offset="100%" stopColor="#151621" />
          </linearGradient>
          <clipPath id="lh_clip">
            <rect x={stripX} y={sy - 4} width={stripW} height={sh + 8} />
          </clipPath>
        </defs>

        {/* Ambient field glow */}
        <ellipse cx="160" cy="40" rx="180" ry="80" fill="url(#lh_amb)"
          style={{ transition: 'all 0.9s ease' }} />

        {/* Device casing */}
        <rect x={sx - 16} y={sy - 16} width={sw + 32} height={sh + 32} rx="10"
          fill="#141420" stroke={tLit ? '#2a1c24' : '#22222e'} strokeWidth="1.5"
          style={{ transition: 'stroke 0.7s' }} />
        {/* Window */}
        <rect x={sx + 48} y={sy - 6} width={sw - 68} height={sh + 12} rx="4"
          fill="#0a0a12" stroke="#1a1a26" strokeWidth="1" />

        {/* Dry membrane */}
        <rect x={stripX} y={sy - 4} width={stripW} height={sh + 8} rx="3" fill="url(#lh_strip)" />

        {/* Wicking front — mounts fresh each cycle, restarts animation */}
        {showWick && (
          <g clipPath="url(#lh_clip)">
            <rect
              x={stripX} y={sy - 4} width={stripW} height={sh + 8}
              fill="url(#lh_wet)"
              className="h-wick-rect"
            />
          </g>
        )}

        {/* Sample pad */}
        <ellipse cx={sx + 22} cy={sy + sh / 2} rx="18" ry="22"
          fill="#0a0a12" stroke={showWick ? '#26243c' : '#222230'} strokeWidth="1.5"
          style={{ transition: 'stroke 0.5s' }} />
        {/* Sample pad — active pulse dot */}
        {showWick && (
          <ellipse cx={sx + 22} cy={sy + sh / 2} rx="5" ry="5"
            fill="none" stroke="#f09b2d20" strokeWidth="1" />
        )}

        {/* Absorbent pad */}
        <rect x={sx + sw - 28} y={sy + 14} width="22" height={sh - 28} rx="3"
          fill="#111120" stroke="#1a1a26" strokeWidth="1" />

        {/* Flow dashes */}
        <line
          x1={sx + 42} y1={sy + sh / 2} x2={sx + sw - 34} y2={sy + sh / 2}
          stroke={showWick ? '#ff2d5535' : '#ff2d5518'} strokeWidth="1" strokeDasharray="4,5"
          style={{ transition: 'stroke 0.4s' }}
        />

        {/* T-line */}
        <g filter={(tLit && !reduced) ? 'url(#lh_strong)' : 'url(#lh_glow)'}>
          <rect x={tX} y={sy} width="14" height={sh} rx="2" fill="#ff2d55"
            opacity={reduced ? 0.95 : tLit ? 0.95 : 0.11}
            style={{ transition: 'opacity 0.45s ease' }} />
          <rect x={tX - 5} y={sy - 6} width="24" height={sh + 12} rx="4" fill="#ff2d55"
            opacity={tLit ? 0.22 : 0.03}
            style={{ transition: 'opacity 0.45s ease' }} />
        </g>

        {/* C-line */}
        <g filter={(cLit && !reduced) ? 'url(#lh_strong)' : 'url(#lh_glow)'}>
          <rect x={cX} y={sy} width="14" height={sh} rx="2" fill="#ff2d55"
            opacity={reduced ? 0.95 : cLit ? 0.95 : 0.07}
            style={{ transition: 'opacity 0.55s ease' }} />
          <rect x={cX - 5} y={sy - 6} width="24" height={sh + 12} rx="4" fill="#ff2d55"
            opacity={cLit ? 0.22 : 0.03}
            style={{ transition: 'opacity 0.55s ease' }} />
        </g>

        {/* Result readout */}
        {cLit && !reduced && (
          <text
            x="160" y={sy + sh + 22} textAnchor="middle"
            style={{
              fontFamily: 'monospace', fontSize: 8,
              fill: 'rgba(255,45,85,0.82)', letterSpacing: '0.18em',
            }}
          >
            HPX DETECTED · POSITIVE
          </text>
        )}
      </svg>
    </>
  );
}

/* ---------------------------------------------------------------------------
   Stats — inline data strip (not a big-number hero metric layout)
--------------------------------------------------------------------------- */
const STATS_DATA = [
  { target: 96.1,  fmt: (v: number) => v.toFixed(1) + '%', label: 'accuracy', color: '#f09b2d' },
  { target: 0.981, fmt: (v: number) => v.toFixed(3),        label: 'AUC',      color: '#f09b2d' },
  { target: 70.4,  fmt: (v: number) => v.toFixed(1) + '%', label: 'sensitivity', color: '#bbb' },
  { target: 15,    fmt: ()           => '<15 min',           label: 'result',   color: '#ff2d55' },
];

function StatItem({ target, fmt, label, color, active, reduced }: {
  target: number; fmt: (v: number) => string; label: string;
  color: string; active: boolean; reduced: boolean;
}) {
  const val = useCountUp(target, 1300, active, reduced);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 24, fontWeight: 500, color, lineHeight: 1 }}>
        {fmt(val)}
      </span>
      <span style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif', fontSize: 14, color: '#888', letterSpacing: '0.03em' }}>
        {label}
      </span>
    </span>
  );
}

/* ---------------------------------------------------------------------------
   Hero
--------------------------------------------------------------------------- */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [countActive, setCountActive] = useState(false);

  /* Stable callback ref — LiveLFA reads this without triggering re-runs */
  const onTFireRef = useRef<() => void>(() => {});
  const triggerRings = useCallback(() => {
    const spinDurations = [28, 20, 14];
    const spinDirections = ['normal', 'reverse', 'normal'];
    ringsRef.current.forEach((ring, i) => {
      if (!ring || reduced) return;
      ring.style.animation = 'none';
      void ring.offsetHeight; // force reflow to restart
      ring.style.animation = `h-rings-pulse 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms forwards`;
      const restoreSpin = () => {
        ring.style.animation = `r-spin ${spinDurations[i]}s linear infinite ${spinDirections[i]}`;
        ring.removeEventListener('animationend', restoreSpin);
      };
      ring.addEventListener('animationend', restoreSpin);
    });
  }, [reduced]);
  useEffect(() => { onTFireRef.current = triggerRings; }, [triggerRings]);

  /* Entry animations (WAAPI) + count-up trigger */
  useEffect(() => {
    if (reduced) { setCountActive(true); return; }

    const opts = (delay: number, dur = 700): KeyframeAnimationOptions => ({
      duration: dur, delay, fill: 'forwards', easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    });
    const slide = [
      { opacity: '0', transform: 'translateY(22px)' },
      { opacity: '1', transform: 'translateY(0)' },
    ];

    h1Ref.current?.querySelectorAll<HTMLElement>('.hw').forEach((word, i) => {
      word.animate(slide, opts(100 + i * 100));
    });
    subtitleRef.current?.animate(slide, opts(580));
    ctaRef.current?.animate(
      [{ opacity: '0', transform: 'translateY(12px)' }, { opacity: '1', transform: 'translateY(0)' }],
      opts(780, 600)
    );

    const t = setTimeout(() => setCountActive(true), 900);
    return () => clearTimeout(t);
  }, [reduced]);

  const ws: React.CSSProperties = reduced ? {} : { opacity: 0, display: 'inline-block' };

  return (
    <section className="r-hero-section" style={{
      height: '100vh', minHeight: 700,
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      background: '#07090f',
    }}>
      <style>{`
        @keyframes h-rings-pulse {
          0%   { transform: scale(1);    opacity: 0.5; }
          35%  { transform: scale(1.07); opacity: 0.9; }
          80%  { transform: scale(1.02); opacity: 0.15; }
          100% { transform: scale(1);    opacity: 0; }
        }
      `}</style>

      {/* Scan-line texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
      }} />

      {/* Left-edge calibration marks */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 32, pointerEvents: 'none', zIndex: 1 }}>
        {[15, 25, 35, 50, 65, 75, 85].map((pct, i) => (
          <div key={i} style={{ position: 'absolute', top: `${pct}%`, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: i % 2 === 0 ? 8 : 5, height: 1, background: '#ffffff18' }} />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="r-hero-main" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 var(--gutter)', position: 'relative', zIndex: 2 }}>

        {/* Left — copy */}
        <div className="r-hero-left" style={{ flex: '0 0 52%', paddingRight: 60 }}>
          <h1 ref={h1Ref} className="r-hero-h1" style={{
            fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
            fontWeight: 700, color: 'white',
            lineHeight: 1.0, letterSpacing: '-0.03em',
            margin: '0 0 28px',
            fontSize: 'clamp(88px, 10.5vw, 148px)',
          }}>
            <span className="hw" style={ws}>Detect</span>
            <br />
            <span className="hw" style={ws}>oral</span>{' '}
            <span className="hw" style={ws}>cancer</span>
            <br />
            <em style={{ fontFamily: 'var(--font-instrument-serif), serif', fontStyle: 'italic', fontWeight: 400, color: 'white', letterSpacing: '-0.01em', fontSize: '1.05em' }}>
              <span className="hw" style={ws}>from saliva.</span>
            </em>
          </h1>

          <p ref={subtitleRef} style={{
            fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
            fontSize: 20, color: '#aaa', lineHeight: 1.75, maxWidth: 460, margin: '0 0 48px',
            ...(reduced ? {} : { opacity: 0 }),
          }}>
            A nanobody lateral flow assay targeting salivary Hemopexin — rapid,
            non-invasive triage for oral squamous cell carcinoma.
          </p>

          <div ref={ctaRef} style={{
            display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center',
            ...(reduced ? {} : { opacity: 0 }),
          }}>
            <a href="#how-it-works" style={{
              fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
              fontSize: 16, fontWeight: 600, color: 'white',
              border: '1px solid rgba(255,255,255,0.28)',
              padding: '14px 34px', borderRadius: 4,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'border-color 0.2s, background 0.2s, transform 0.1s', letterSpacing: '0.01em',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.6)'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.28)'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'; }}
              onMouseDown={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(0.97)'; }}
              onMouseUp={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'; }}>
              See how it works
            </a>
            <a href="#about" style={{
              fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
              fontSize: 16, fontWeight: 400, color: '#777',
              textDecoration: 'none', transition: 'color 0.2s', letterSpacing: '0.01em',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'white'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#777'}>
              The Science ↓
            </a>
          </div>
        </div>

        {/* Right — live LFA */}
        <div className="r-hero-right" style={{ flex: '0 0 48%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {[520, 440, 360].map((size, i) => {
            const durations = [28, 20, 14];
            const directions = ['normal', 'reverse', 'normal'] as const;
            return (
              <div
                key={i}
                ref={el => { ringsRef.current[i] = el; }}
                style={{
                  position: 'absolute',
                  width: size, height: size, borderRadius: '50%',
                  border: `1px solid rgba(255,45,85,${0.04 + i * 0.03})`,
                  pointerEvents: 'none',
                  animation: reduced ? 'none' : `r-spin ${durations[i]}s linear infinite ${directions[i]}`,
                }}
              />
            );
          })}
          <div style={{ width: 380, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LiveLFA reduced={reduced} onTFireRef={onTFireRef} />
          </div>
        </div>
      </div>

      {/* Stats strip — single-line clinical data readout */}
      <div style={{ borderTop: '1px solid #111', background: 'rgba(7,9,15,0.7)', backdropFilter: 'blur(12px)', position: 'relative', zIndex: 2 }}>
        <div className="r-stats-inner" style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '22px var(--gutter)', display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 13, color: '#666', letterSpacing: '0.12em', textTransform: 'uppercase', marginRight: 28, whiteSpace: 'nowrap' }}>
            Model metrics
          </span>
          <span className="r-stats-row" style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
            {STATS_DATA.map((s, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <StatItem {...s} active={countActive} reduced={reduced} />
                {i < STATS_DATA.length - 1 && (
                  <span style={{ color: '#333', margin: '0 18px', fontSize: 14 }}>·</span>
                )}
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="r-scroll-cue" style={{ position: 'absolute', bottom: 80, right: 48, zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(#ff2d5560, transparent)' }} />
        <span style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif', fontSize: 9, fontWeight: 500, color: '#444', letterSpacing: '0.2em', writingMode: 'vertical-rl', textTransform: 'uppercase' }}>Scroll</span>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

function useReducedMotion() {
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

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function inv(a: number, b: number, v: number) { return clamp((v - a) / (b - a), 0, 1); }
function remap(ia: number, ib: number, oa: number, ob: number, v: number) { return lerp(oa, ob, inv(ia, ib, v)); }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

function useScrollProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fn = () => {
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top;
      const total = ref.current.offsetHeight - window.innerHeight;
      setProgress(clamp(-top / total, 0, 1));
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, [ref]);
  return progress;
}

function SwabScene({ p }: { p: number }) {
  const particleOpacity = easeOut(inv(0.35, 0.6, p)) * (1 - inv(0.85, 1, p));
  const sceneOpacity = 1 - easeInOut(inv(0.88, 1, p));

  const swabStartX = 720, swabEndX = 390;
  const swabStartY = 60, swabEndY = 240;
  const sx = lerp(swabStartX, swabEndX, easeOut(inv(0, 0.4, p)));
  const sy = lerp(swabStartY, swabEndY, easeOut(inv(0, 0.4, p)));
  const angle = lerp(-55, -20, easeOut(inv(0, 0.4, p)));

  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%', opacity: sceneOpacity }}>
      <defs>
        <radialGradient id="s_bgGlow" cx="50%" cy="55%">
          <stop offset="0%" stopColor="rgba(255,45,85,0.06)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="s_glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="s_softglow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="12" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="s_lipGrad" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#9b3858" />
          <stop offset="100%" stopColor="#7a2840" />
        </radialGradient>
        <radialGradient id="s_mucosaGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#8b2840" />
          <stop offset="100%" stopColor="#5a1828" />
        </radialGradient>
        <radialGradient id="s_lesionGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#ff2d55" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ff2d55" stopOpacity="0.3" />
        </radialGradient>
        <clipPath id="s_mouthClip">
          <ellipse cx="400" cy="262" rx="128" ry="90" />
        </clipPath>
      </defs>

      <rect width="800" height="500" fill="url(#s_bgGlow)" />

      {/* === ORAL ANATOMY === */}
      {/* Outer lips oval */}
      <ellipse cx="400" cy="262" rx="155" ry="114" fill="#7a2038" />
      {/* Lip inner surface */}
      <ellipse cx="400" cy="264" rx="143" ry="102" fill="#c05878" />
      {/* Oral cavity interior */}
      <ellipse cx="400" cy="266" rx="130" ry="90" fill="url(#s_mucosaGrad)" />
      {/* Upper gum ridge */}
      <path d="M 272,262 Q 336,172 400,168 Q 464,172 528,262 Q 464,212 400,208 Q 336,212 272,262 Z" fill="#b03858" />
      {/* Lower gum ridge */}
      <path d="M 272,268 Q 336,354 400,358 Q 464,354 528,268 Q 464,318 400,322 Q 336,318 272,268 Z" fill="#b03858" />
      {/* Palate (roof) */}
      <ellipse cx="400" cy="228" rx="98" ry="46" fill="#c04868" opacity={0.55} clipPath="url(#s_mouthClip)" />
      {/* Palate midline raphe */}
      <line x1="400" y1="178" x2="400" y2="250" stroke="#d05878" strokeWidth="2.5" opacity={0.4} clipPath="url(#s_mouthClip)" />

      {/* UPPER TEETH — full horseshoe arch pointing down */}
      {([
        { x: 383, w: 17, y: 178, h: 30 }, { x: 402, w: 17, y: 178, h: 30 },  // centrals
        { x: 365, w: 15, y: 181, h: 27 }, { x: 421, w: 15, y: 181, h: 27 },  // laterals
        { x: 349, w: 13, y: 185, h: 29 }, { x: 438, w: 13, y: 185, h: 29 },  // canines
        { x: 335, w: 12, y: 190, h: 25 }, { x: 453, w: 12, y: 190, h: 25 },  // 1st premolars
        { x: 322, w: 12, y: 195, h: 22 }, { x: 466, w: 12, y: 195, h: 22 },  // 2nd premolars
        { x: 307, w: 14, y: 201, h: 18 }, { x: 479, w: 14, y: 201, h: 18 },  // 1st molars
        { x: 291, w: 13, y: 208, h: 13 }, { x: 496, w: 13, y: 208, h: 13 },  // 2nd molars
      ] as { x: number; w: number; y: number; h: number }[]).map((t, i) => (
        <rect key={`ut${i}`} x={t.x} y={t.y} width={t.w} height={t.h} rx={i >= 12 ? 2 : 4}
          fill="#eeeae5" stroke="#dedad4" strokeWidth="0.5"
          opacity={i >= 12 ? 0.7 : 1} clipPath="url(#s_mouthClip)" />
      ))}

      {/* LOWER TEETH — full arch pointing up */}
      {([
        { x: 384, w: 15, y: 301, h: 24 }, { x: 401, w: 15, y: 301, h: 24 },  // centrals
        { x: 368, w: 14, y: 303, h: 22 }, { x: 418, w: 14, y: 303, h: 22 },  // laterals
        { x: 353, w: 13, y: 306, h: 24 }, { x: 434, w: 13, y: 306, h: 24 },  // canines
        { x: 339, w: 12, y: 308, h: 21 }, { x: 449, w: 12, y: 308, h: 21 },  // 1st premolars
        { x: 326, w: 12, y: 311, h: 18 }, { x: 462, w: 12, y: 311, h: 18 },  // 2nd premolars
        { x: 311, w: 14, y: 315, h: 15 }, { x: 475, w: 14, y: 315, h: 15 },  // 1st molars
      ] as { x: number; w: number; y: number; h: number }[]).map((t, i) => (
        <rect key={`lt${i}`} x={t.x} y={t.y} width={t.w} height={t.h} rx={i >= 10 ? 2 : 3}
          fill="#eeeae5" stroke="#dedad4" strokeWidth="0.5" clipPath="url(#s_mouthClip)" />
      ))}

      {/* Tongue */}
      <ellipse cx="400" cy="328" rx="90" ry="36" fill="#882030" clipPath="url(#s_mouthClip)" />
      <ellipse cx="400" cy="322" rx="72" ry="27" fill="#9a2840" opacity={0.7} clipPath="url(#s_mouthClip)" />
      <line x1="400" y1="295" x2="400" y2="355" stroke="#781828" strokeWidth="2" opacity={0.4} clipPath="url(#s_mouthClip)" />

      {/* Uvula */}
      <ellipse cx="400" cy="262" rx="8" ry="11" fill="#b03860" clipPath="url(#s_mouthClip)" />
      <path d="M 394,252 Q 400,272 406,252" fill="#a02848" clipPath="url(#s_mouthClip)" />

      {/* Lesion annotation */}
      <ellipse cx="368" cy="300" rx="13" ry="8" fill="url(#s_lesionGrad)" filter="url(#s_glow)" clipPath="url(#s_mouthClip)" />
      <g opacity={easeOut(inv(0.3, 0.55, p))}>
        <line x1="541" y1="290" x2="381" y2="300" stroke="#ff2d5540" strokeWidth="1" />
        <text x="545" y="281" fontFamily="var(--font-dm-mono),monospace" fontSize="10"
          fill="#ff2d5580" letterSpacing="1.5">ERYTHROPLAKIA</text>
        <text x="545" y="296" fontFamily="var(--font-dm-mono),monospace" fontSize="9"
          fill="#ff2d5550" letterSpacing="1">HIGH-RISK LESION</text>
      </g>

      {/* Saliva droplet particles */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const angle2 = (i / 6) * Math.PI * 2;
        const r = 14 + (i % 3) * 8;
        return (
          <circle key={i}
            cx={400 + Math.cos(angle2) * r * 0.8}
            cy={262 + Math.sin(angle2) * r * 0.4}
            r={2 + (i % 2)}
            fill="#f09b2d"
            opacity={particleOpacity * (0.25 + (i % 3) * 0.15)}
            filter="url(#s_glow)"
          />
        );
      })}

      {/* Swab */}
      <g transform={`translate(${sx},${sy}) rotate(${angle})`} opacity={clamp(inv(0, 0.2, p) * 4, 0, 1)}>
        <rect x="-3" y="12" width="6" height="190" rx="3" fill="#888" />
        <ellipse cx="0" cy="0" rx="20" ry="14" fill="#ddd" />
        <ellipse cx="0" cy="0" rx="15" ry="10" fill="white" opacity={0.8} />
        <ellipse cx="0" cy="0" rx="26" ry="18" fill="#f09b2d"
          opacity={particleOpacity * 0.25} filter="url(#s_softglow)" />
      </g>

      {/* Callout */}
      <g opacity={easeOut(inv(0.4, 0.65, p))}>
        <line x1="340" y1="310" x2="220" y2="335" stroke="#ffffff18" strokeWidth="1" />
        <text x="136" y="339" fontFamily="var(--font-dm-mono),monospace" fontSize="11"
          fill="#555" letterSpacing="2">SALIVA MATRIX</text>
        <text x="136" y="355" fontFamily="var(--font-dm-mono),monospace" fontSize="10"
          fill="#333" letterSpacing="1">HPX · CP · ORM2 · APOA1</text>
      </g>

      {/* Step label */}
      <g opacity={easeOut(inv(0.1, 0.35, p))}>
        <text x="64" y="432" fontFamily="var(--font-space-grotesk),sans-serif" fontSize="32" fontWeight="700" fill="white">Step 1</text>
        <text x="64" y="462" fontFamily="var(--font-space-grotesk),sans-serif" fontSize="16" fill="#f09b2d">Non-invasive saliva collection</text>
      </g>
    </svg>
  );
}

function BindingScene({ p }: { p: number }) {
  const sceneOpacity = easeOut(inv(0, 0.08, p)) * (1 - easeInOut(inv(0.9, 1, p)));
  const hpxAppear = easeOut(inv(0, 0.22, p));
  const nbAppear = easeOut(inv(0.05, 0.22, p));

  const nbX = lerp(680, 468, easeOut(inv(0.05, 0.55, p)));
  const nbY = lerp(130, 252, easeOut(inv(0.05, 0.55, p)));
  const dockX = lerp(nbX, 468, easeInOut(inv(0.52, 0.72, p)));
  const dockY = lerp(nbY, 252, easeInOut(inv(0.52, 0.72, p)));

  const bindGlow = easeOut(inv(0.58, 0.75, p));
  const bound = p > 0.62;

  const accentHPX = bound ? '#ff2d55' : '#f09b2d';
  const accentNb = bound ? '#ff2d55' : '#a855f7';
  const hx = 278, hy = 252;

  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%', opacity: sceneOpacity }}>
      <defs>
        <radialGradient id="b2_burst" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#ff2d55" stopOpacity="0.2" />
          <stop offset="55%" stopColor="#ff2d55" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ff2d55" stopOpacity="0" />
        </radialGradient>
        <filter id="b2_ringGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <clipPath id="b2_hpxClip">
          <circle cx={hx} cy={hy} r="118" />
        </clipPath>
        <clipPath id="b2_nbClip">
          <rect x="-68" y="-92" width="136" height="184" rx="8" />
        </clipPath>
      </defs>

      {bindGlow > 0 && (
        <circle cx={hx + 108} cy={hy} r={lerp(0, 150, bindGlow)}
          fill="url(#b2_burst)" opacity={bindGlow * 0.9} />
      )}

      {/* HPX */}
      <g opacity={hpxAppear}>
        <circle cx={hx} cy={hy} r="115" fill={accentHPX + '0d'} />
        <image
          href="/assets/hpx.png"
          x={hx - 118} y={hy - 118}
          width="236" height="236"
          clipPath="url(#b2_hpxClip)"
          style={{
            filter: bound
              ? 'drop-shadow(0 0 14px rgba(255,45,85,0.5)) drop-shadow(0 0 6px rgba(255,45,85,0.3))'
              : 'drop-shadow(0 0 8px rgba(240,155,45,0.35))',
          }}
        />
        <circle cx={hx} cy={hy} r="118" fill="none"
          stroke={accentHPX} strokeWidth="1.5" opacity={0.5}
          filter="url(#b2_ringGlow)" />
        <text x={hx} y={hy + 136} textAnchor="middle"
          fontFamily="var(--font-dm-mono),monospace" fontSize="12"
          fill={accentHPX} letterSpacing="3">HEMOPEXIN (HPX)</text>
      </g>

      {/* Nanobody */}
      <g transform={`translate(${dockX},${dockY})`} opacity={nbAppear}>
        <ellipse cx="0" cy="0" rx="72" ry="90" fill={accentNb + '10'} />
        <image
          href="/assets/nanobody.png"
          x="-68" y="-92"
          width="136" height="184"
          clipPath="url(#b2_nbClip)"
          style={{
            filter: bound
              ? 'drop-shadow(0 0 12px rgba(255,45,85,0.45)) drop-shadow(0 0 5px rgba(255,45,85,0.25))'
              : 'drop-shadow(0 0 8px rgba(168,85,247,0.4))',
          }}
        />
        <text x="0" y="103" textAnchor="middle"
          fontFamily="var(--font-dm-mono),monospace" fontSize="11"
          fill={accentNb} letterSpacing="2">NANOBODY (VHH)</text>
        <text x="0" y="118" textAnchor="middle"
          fontFamily="var(--font-dm-mono),monospace" fontSize="9" fill="#444" letterSpacing="2">
          ~15 kDa · SINGLE DOMAIN
        </text>
      </g>

      {!bound && p > 0.12 && p < 0.62 && (
        <line x1={nbX + 70} y1={nbY} x2={hx + 120} y2={hy}
          stroke={accentNb + '30'} strokeWidth="1.5" strokeDasharray="6,4" />
      )}

      {bindGlow > 0.4 && (
        <g opacity={remap(0.4, 0.75, 0, 1, bindGlow)}>
          <text x={hx + 248} y={hy - 22}
            fontFamily="var(--font-dm-mono),monospace" fontSize="13"
            fill="#ff2d55" letterSpacing="5" filter="url(#b2_ringGlow)">BOUND</text>
          <text x={hx + 248} y={hy - 6}
            fontFamily="var(--font-dm-mono),monospace" fontSize="9"
            fill="rgba(255,45,85,0.55)" letterSpacing="2">HIGH-AFFINITY COMPLEX</text>
          <line x1={hx + 242} y1={hy - 18} x2={hx + 122} y2={hy}
            stroke="rgba(255,45,85,0.2)" strokeWidth="1" strokeDasharray="4,3" />
        </g>
      )}

      <g opacity={easeOut(inv(0.05, 0.22, p))}>
        <text x="64" y="432" fontFamily="var(--font-space-grotesk),sans-serif"
          fontSize="32" fontWeight="700" fill="white">Step 2</text>
        <text x="64" y="462" fontFamily="var(--font-space-grotesk),sans-serif"
          fontSize="16" fill={bound ? '#ff2d55' : '#a855f7'}>
          {bound ? 'Nanobody–HPX complex formed' : 'Nanobody targets Hemopexin'}
        </text>
      </g>
    </svg>
  );
}

function LFAScene({ p }: { p: number }) {
  const sceneOpacity = easeOut(inv(0, 0.08, p));
  const stripIn = easeOut(inv(0, 0.22, p));
  const cLineP = easeOut(inv(0.22, 0.50, p));
  const tLineP = easeOut(inv(0.48, 0.76, p));
  const resultP = easeOut(inv(0.76, 0.95, p));

  const sw = 460, sh = 116, sx = 170, sy = 192;
  const cX = sx + 300, tX = sx + 210;

  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%', opacity: sceneOpacity }}>
      <defs>
        <linearGradient id="l_strip" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a1814" />
          <stop offset="12%" stopColor="#252320" />
          <stop offset="88%" stopColor="#252320" />
          <stop offset="100%" stopColor="#1a1814" />
        </linearGradient>
        <linearGradient id="l_case" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#141420" />
          <stop offset="100%" stopColor="#0e0e1a" />
        </linearGradient>
        <filter id="l_lineGlow" x="-100%" y="-50%" width="300%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="l_resultGlow" x="-50%" y="-100%" width="200%" height="300%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g opacity={stripIn}>
        {/* Case */}
        <rect x={sx - 22} y={sy - 22} width={sw + 44} height={sh + 44} rx="14"
          fill="url(#l_case)" stroke="#22222e" strokeWidth="1.5" />
        {/* Membrane window */}
        <rect x={sx + 65} y={sy - 10} width={sw - 100} height={sh + 20} rx="5"
          fill="#0a0a12" stroke="#1a1a26" strokeWidth="1" />
        {/* Nitrocellulose strip */}
        <rect x={sx + 68} y={sy - 7} width={sw - 106} height={sh + 14} rx="3"
          fill="url(#l_strip)" />
        {/* Sample port */}
        <ellipse cx={sx + 32} cy={sy + sh / 2} rx="24" ry="30"
          fill="#0a0a12" stroke="#222230" strokeWidth="1.5" />
        <text x={sx + 32} y={sy + sh / 2 + 5} textAnchor="middle"
          fontFamily="var(--font-dm-mono),monospace" fontSize="13" fontWeight="500" fill="#444">S</text>
        {/* Absorbent pad */}
        <rect x={sx + sw - 36} y={sy + 18} width="28" height={sh - 36} rx="4"
          fill="#111120" stroke="#1a1a26" strokeWidth="1" />

        {/* Line guides */}
        <line x1={tX - 30} y1={sy} x2={tX - 30} y2={sy + sh} stroke="#1a1a26" strokeWidth="1" />
        <line x1={cX + 30} y1={sy} x2={cX + 30} y2={sy + sh} stroke="#1a1a26" strokeWidth="1" />

        {/* Line labels */}
        <text x={tX + 8} y={sy + sh + 32} textAnchor="middle"
          fontFamily="var(--font-dm-mono),monospace" fontSize="14" fontWeight="500"
          fill={tLineP > 0.15 ? '#ff2d55' : '#333'}>T</text>
        <text x={cX + 8} y={sy + sh + 32} textAnchor="middle"
          fontFamily="var(--font-dm-mono),monospace" fontSize="14" fontWeight="500"
          fill={cLineP > 0.15 ? '#ff2d55' : '#333'}>C</text>
        <text x={tX + 8} y={sy + sh + 46} textAnchor="middle"
          fontFamily="var(--font-dm-mono),monospace" fontSize="9" fill="#333" letterSpacing="1">TEST</text>
        <text x={cX + 8} y={sy + sh + 46} textAnchor="middle"
          fontFamily="var(--font-dm-mono),monospace" fontSize="9" fill="#333" letterSpacing="1">CONTROL</text>

        {/* C line — signal red */}
        {cLineP > 0 && (
          <g opacity={cLineP} filter="url(#l_lineGlow)">
            <rect x={cX} y={sy} width="17" height={sh} rx="2" fill="#ff2d55" opacity={0.95} />
            <rect x={cX - 5} y={sy - 6} width="27" height={sh + 12} rx="5" fill="#ff2d55" opacity={0.15} />
          </g>
        )}

        {/* T line — signal red (positive) */}
        {tLineP > 0 && (
          <g opacity={tLineP} filter="url(#l_lineGlow)">
            <rect x={tX} y={sy} width="17" height={sh} rx="2" fill="#ff2d55" opacity={0.95} />
            <rect x={tX - 5} y={sy - 6} width="27" height={sh + 12} rx="5" fill="#ff2d55" opacity={0.15} />
          </g>
        )}

        {/* Flow indicator */}
        <g opacity={remap(0.1, 0.3, 0, 1, stripIn) * 0.4}>
          <line x1={sx + 58} y1={sy + sh / 2} x2={sx + sw - 45} y2={sy + sh / 2}
            stroke="#ff2d5518" strokeWidth="1" strokeDasharray="4,4" />
        </g>
      </g>

      {resultP > 0 && (
        <g opacity={resultP}>
          <text x="400" y="420" textAnchor="middle"
            fontFamily="var(--font-space-grotesk),sans-serif" fontSize="26" fontWeight="700"
            fill="#ff2d55" letterSpacing="10" filter="url(#l_resultGlow)">
            POSITIVE
          </text>
          <text x="400" y="444" textAnchor="middle"
            fontFamily="var(--font-dm-mono),monospace" fontSize="11" fill="#553030" letterSpacing="3">
            HPX DETECTED · RECOMMEND BIOPSY
          </text>
        </g>
      )}

      <g opacity={easeOut(inv(0, 0.15, p))}>
        <text x="64" y="432" fontFamily="var(--font-space-grotesk),sans-serif" fontSize="32" fontWeight="700" fill="white">Step 3</text>
        <text x="64" y="462" fontFamily="var(--font-space-grotesk),sans-serif" fontSize="16" fill="#ff2d55">Lateral flow result</text>
      </g>
    </svg>
  );
}

const STEP_FONT = 'var(--font-space-grotesk), system-ui, sans-serif';
const STEP_CARDS = [
  { num: '01', title: 'Salivary collection',  body: 'Non-invasive swab or spit. No specialist equipment.' },
  { num: '02', title: 'Nanobody binding',     body: 'Anti-HPX nanobodies in conjugate pad bind salivary Hemopexin.' },
  { num: '03', title: 'Lateral flow result',  body: 'T-line and C-line visibility indicates HPX elevation. Result in under 15 minutes.' },
];

export default function ScrollAnimation() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(wrapRef);

  if (reduced) {
    return (
      <section id="how-it-works" style={{ background: '#07090f', borderTop: '1px solid #0e0e1a', padding: 'var(--section-py) var(--gutter)' }}>
        <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
          <div style={{ fontFamily: STEP_FONT, fontSize: 11, fontWeight: 600, color: '#444', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 48 }}>
            How It Works
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {STEP_CARDS.map(c => (
              <div key={c.num} style={{ padding: '28px 24px', background: '#0c0c18', border: '1px solid #18182a', borderRadius: 8 }}>
                <div style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 11, color: '#444', letterSpacing: '0.12em', marginBottom: 16 }}>STEP {c.num}</div>
                <div style={{ fontFamily: STEP_FONT, fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 12, lineHeight: 1.2 }}>{c.title}</div>
                <div style={{ fontFamily: STEP_FONT, fontSize: 15, color: '#888', lineHeight: 1.65 }}>{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const s1 = p < 0.3 ? 1 : remap(0.3, 0.42, 1, 0, p);
  const s2 = p < 0.28 ? remap(0.22, 0.30, 0, 1, p) : p < 0.74 ? 1 : remap(0.74, 0.85, 1, 0, p);
  const s3 = p < 0.72 ? remap(0.70, 0.80, 0, 1, p) : 1;

  const s1p = remap(0, 0.35, 0, 1, p);
  const s2p = remap(0.26, 0.82, 0, 1, p);
  const s3p = remap(0.70, 1.0, 0, 1, p);

  const phase = p < 0.33 ? 0 : p < 0.76 ? 1 : 2;

  return (
    <div id="how-it-works" ref={wrapRef} style={{ height: '420vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        background: '#07090f', overflow: 'hidden',
        borderTop: '1px solid #0e0e1a',
      }}>
        {[s1, s2, s3].map((opacity, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            opacity: clamp(opacity, 0, 1),
            pointerEvents: opacity < 0.1 ? 'none' : 'auto',
          }}>
            {i === 0 && <SwabScene p={clamp(s1p, 0, 1)} />}
            {i === 1 && <BindingScene p={clamp(s2p, 0, 1)} />}
            {i === 2 && <LFAScene p={clamp(s3p, 0, 1)} />}
          </div>
        ))}

        {/* Left progress rail */}
        <div style={{
          position: 'absolute', left: 36, top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 2, height: 36,
                background: i <= phase ? '#f09b2d' : '#18182a',
                transition: 'all 0.5s', borderRadius: 2,
              }} />
              <span style={{
                fontFamily: 'var(--font-dm-mono),monospace', fontSize: 10,
                color: i <= phase ? '#f09b2d' : '#333',
                letterSpacing: '0.12em', transition: 'color 0.5s',
                whiteSpace: 'nowrap',
              }}>0{i + 1}</span>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 36, right: 40,
          fontFamily: 'var(--font-space-grotesk),system-ui,sans-serif', fontSize: 10, fontWeight: 500,
          color: '#333', letterSpacing: '0.14em',
          opacity: p < 0.04 ? 1 : 0, transition: 'opacity 0.6s',
        }}>Scroll ↓</div>
      </div>
    </div>
  );
}

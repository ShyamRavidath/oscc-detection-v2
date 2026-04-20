const STEPS = [
  {
    n: '01', title: 'Collect',
    desc: 'A simple oral swab collects saliva — no needles, no lab, no specialist required.',
    color: '#f09b2d',
  },
  {
    n: '02', title: 'Apply',
    desc: 'Sample is applied to the lateral flow strip. Labeled nanobodies in the conjugate zone bind Hemopexin if present.',
    color: '#f09b2d',
  },
  {
    n: '03', title: 'Detect',
    desc: 'HPX–nanobody complexes migrate to the test line (T). Accumulation generates a visible red signal.',
    color: '#ff2d55',
  },
  {
    n: '04', title: 'Triage',
    desc: 'Two lines = positive → refer for biopsy. One line (C only) = negative. Result in under 15 minutes.',
    color: '#ff2d55',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: 'var(--section-py) var(--gutter)', background: '#07090f' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-dm-mono), monospace', fontSize: 11, color: '#f09b2d',
          letterSpacing: '0.22em', marginBottom: 18, opacity: 0.8,
        }}>HOW IT WORKS</p>
        <h2 style={{
          fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
          fontSize: 'clamp(40px, 5vw, 54px)',
          fontWeight: 700, color: 'white', margin: '0 0 72px', lineHeight: 1.05,
          letterSpacing: '-0.02em',
        }}>From swab<br />to answer.</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ position: 'relative', paddingTop: 8 }}>
              <div style={{
                width: 36, height: 2, background: s.color, marginBottom: 22, borderRadius: 1,
              }} />
              <div style={{
                fontFamily: 'var(--font-dm-mono), monospace', fontSize: 10,
                color: s.color, letterSpacing: '0.18em', marginBottom: 12, opacity: 0.8,
              }}>{s.n}</div>
              <h3 style={{
                fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                fontSize: 26, fontWeight: 600, color: 'white', marginBottom: 16,
              }}>{s.title}</h3>
              <p style={{
                fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                fontSize: 17, color: '#aaa', lineHeight: 1.8, margin: 0,
              }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 64, paddingTop: 24,
          borderTop: '1px solid #111',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: 10, color: '#555', letterSpacing: '0.14em',
          }}>NITROCELLULOSE MEMBRANE · LATERAL FLOW FORMAT</span>
          <span style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: 10, color: '#555', letterSpacing: '0.14em',
          }}>SENSITIVITY 70.4% · SPECIFICITY 90.6%</span>
        </div>
      </div>
    </section>
  );
}

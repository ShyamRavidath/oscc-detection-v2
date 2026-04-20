'use client';

const AREAS = [
  { area: 'Proteomics', detail: 'Cohort data, biomarker validation, mass spec' },
  { area: 'Nanobody Engineering', detail: 'VHH design, expression, affinity characterisation' },
  { area: 'Assay Development', detail: 'LFA optimisation, conjugation chemistry, QC' },
  { area: 'Clinical Validation', detail: 'Prospective trials, regulatory pathway, EHR integration' },
];

export default function ContactSection() {
  return (
    <section id="contact" style={{
      background: '#07090f',
      borderTop: '1px solid #0e0e1a',
    }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: 'var(--section-py) var(--gutter)' }}>
        <div className="r-contact-grid" style={{
          display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 'clamp(48px, 6vw, 100px)',
          alignItems: 'start',
        }}>

          {/* Left: contact info */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
              fontSize: 'clamp(52px, 6vw, 80px)', fontWeight: 700, color: 'white',
              lineHeight: 1.0, letterSpacing: '-0.03em', margin: '0 0 40px',
            }}>Collaborate.</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="mailto:shyamravidath@gmail.com" style={{
                display: 'inline-flex', alignItems: 'center', gap: 14,
                fontFamily: 'var(--font-dm-mono), monospace', fontSize: 15,
                color: 'white',
                border: '1px solid #18182a',
                padding: '18px 26px', borderRadius: 6,
                textDecoration: 'none',
                background: '#0c0c18',
                transition: 'all 0.15s ease',
                maxWidth: 400,
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = '#f09b2d'; el.style.borderColor = 'rgba(240,155,45,0.35)'; el.style.textDecoration = 'underline'; el.style.textUnderlineOffset = '3px'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = 'white'; el.style.borderColor = '#18182a'; el.style.textDecoration = 'none'; }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f09b2d', flexShrink: 0 }} />
                shyamravidath@gmail.com
              </a>

              <a href="https://github.com/ShyamRavidath" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 14,
                fontFamily: 'var(--font-dm-mono), monospace', fontSize: 15,
                color: '#777',
                border: '1px solid #18182a',
                padding: '18px 26px', borderRadius: 6,
                textDecoration: 'none',
                background: 'transparent',
                transition: 'all 0.15s ease',
                maxWidth: 400,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'white'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#333'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#777'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#18182a'; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                github.com/ShyamRavidath ↗
              </a>
            </div>
          </div>

          {/* Right: areas of interest */}
          <div style={{ paddingTop: 16 }}>
            <div style={{
              fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif', fontSize: 11, fontWeight: 600,
              color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 28,
            }}>Areas of interest</div>

            {AREAS.map((item, i) => (
              <div key={i} style={{
                padding: '22px 0',
                borderBottom: '1px solid #0e0e1a',
              }}>
                <div style={{
                  fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                  fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 6,
                }}>{item.area}</div>
                <div style={{
                  fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                  fontSize: 15, color: '#888', lineHeight: 1.6,
                }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

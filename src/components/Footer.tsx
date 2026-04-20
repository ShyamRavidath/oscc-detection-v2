'use client';

const NAV = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Biomarker Ranking', href: '#feature-importance' },
  { label: 'Screening Model', href: '#clinical-utility' },
  { label: 'The Science', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#05070d', borderTop: '1px solid #0e0e1a' }}>
      <div style={{
        maxWidth: 'var(--max-w)', margin: '0 auto',
        padding: '56px var(--gutter) 32px',
      }}>
        <div className="r-footer-grid" style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr',
          gap: 'clamp(32px, 5vw, 80px)',
          paddingBottom: 40,
          borderBottom: '1px solid #0e0e1a',
          marginBottom: 28,
        }}>

          {/* Brand */}
          <div>
            <div style={{
              fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
              fontSize: 22, fontWeight: 700, color: 'white',
              letterSpacing: '-0.02em', marginBottom: 16,
            }}>OralSense</div>
            <p style={{
              fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
              fontSize: 15, color: '#555', lineHeight: 1.75,
              maxWidth: 280, margin: '0 0 24px',
            }}>
              Salivary biomarker triage for oral squamous cell carcinoma. Nanobody LFA platform targeting Hemopexin.
            </p>
            <div style={{
              fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
              fontSize: 12, color: '#555', fontStyle: 'italic',
            }}>Research project. Not a certified diagnostic device.</div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{
              fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
              fontSize: 11, fontWeight: 600, color: '#444',
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20,
            }}>Sections</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {NAV.map(l => (
                <a key={l.href} href={l.href} style={{
                  fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                  fontSize: 15, color: '#777', textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#777')}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{
              fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
              fontSize: 11, fontWeight: 600, color: '#444',
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20,
            }}>Collaborate</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <a href="mailto:shyamravidath@gmail.com" style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: 13, color: '#777', textDecoration: 'none',
                transition: 'color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f09b2d')}
                onMouseLeave={e => (e.currentTarget.style.color = '#777')}>
                shyamravidath@gmail.com
              </a>
              <a href="https://github.com/ShyamRavidath" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: 13, color: '#777', textDecoration: 'none',
                transition: 'color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = '#777')}>
                github.com/ShyamRavidath ↗
              </a>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span suppressHydrationWarning style={{
            fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
            fontSize: 13, color: '#444',
          }}>© {new Date().getFullYear()} Shyam Ravidath</span>
          <span style={{
            fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
            fontSize: 12, color: '#444',
            letterSpacing: '0.06em',
          }}>OSCC Detection · Saliva Proteomics</span>
        </div>
      </div>
    </footer>
  );
}

'use client';

const REFS = [
  {
    tag: 'RFdiffusion · Protein Design',
    authors: 'Watson JL, Juergens D, Bennett NR, et al.',
    year: '2023',
    title: 'De novo design of protein structure and function with RFdiffusion.',
    journal: 'Nature, 620(7976), 1089–1100.',
    doi: 'https://doi.org/10.1038/s41586-023-06415-8',
  },
  {
    tag: 'ProteinMPNN · Sequence Design',
    authors: 'Dauparas J, Anishchenko I, Bennett N, et al.',
    year: '2022',
    title: 'Robust deep learning–based protein sequence design using ProteinMPNN.',
    journal: 'Science, 378(6615), 49–56.',
    doi: 'https://doi.org/10.1126/science.add2187',
  },
  {
    tag: 'AlphaFold2 · Structure Prediction',
    authors: 'Jumper J, Evans R, Pritzel A, et al.',
    year: '2021',
    title: 'Highly accurate protein structure prediction with AlphaFold.',
    journal: 'Nature, 596(7873), 583–589.',
    doi: 'https://doi.org/10.1038/s41586-021-03819-2',
  },
  {
    tag: 'RoseTTAFold · Base Architecture',
    authors: 'Baek M, DiMaio F, Anishchenko I, et al.',
    year: '2021',
    title: 'Accurate prediction of protein structures and interactions using a three-track neural network.',
    journal: 'Science, 373(6557), 871–876.',
    doi: 'https://doi.org/10.1126/science.abj8754',
  },
  {
    tag: 'CPTAC HNSCC · Training Data',
    authors: 'National Cancer Institute — Clinical Proteomic Tumor Analysis Consortium.',
    year: '2022',
    title: 'Head and Neck Squamous Cell Carcinoma proteomics dataset (n=182). Accessed via cptac Python package v1.5.1.',
    journal: 'proteomics.cancer.gov/programs/cptac',
    doi: 'https://proteomics.cancer.gov/programs/cptac',
  },
  {
    tag: 'PXD025701 · External Validation',
    authors: 'ProteomeXchange Consortium.',
    year: '2022',
    title: 'ProteomeXchange Dataset PXD025701.',
    journal: 'proteomecentral.proteomexchange.org',
    doi: 'https://proteomecentral.proteomexchange.org/cgi/GetDataset?ID=PXD025701',
  },
];

export default function References() {
  return (
    <section id="references" style={{
      padding: 'var(--section-py) var(--gutter)',
      background: '#05070d',
      borderTop: '1px solid #0e0e1a',
    }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
          fontSize: 'clamp(52px, 6vw, 80px)', fontWeight: 700, color: 'white',
          letterSpacing: '-0.03em', marginBottom: 56, lineHeight: 1.0,
        }}>Sources</h2>

        {REFS.map((r, i) => (
          <div key={i} style={{
            display: 'flex', gap: 32,
            padding: '24px 0',
            borderBottom: '1px solid #0e0e1a',
          }}>
            <span style={{
              fontFamily: 'var(--font-dm-mono), monospace', fontSize: 11,
              color: '#444', width: 24, flexShrink: 0, paddingTop: 4,
              userSelect: 'none',
            }}>{String(i + 1).padStart(2, '0')}</span>
            <div style={{ flex: 1 }}>
              {r.tag && (
                <div style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-dm-mono), monospace', fontSize: 10,
                  color: '#f09b2d', letterSpacing: '0.12em',
                  border: '1px solid rgba(240,155,45,0.2)', padding: '3px 10px',
                  borderRadius: 3, marginBottom: 12, background: 'rgba(240,155,45,0.04)',
                }}>{r.tag.toUpperCase()}</div>
              )}
              <div>
                <span style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif', fontSize: 15, color: '#777', lineHeight: 1.7 }}>
                  {r.authors} ({r.year}).{' '}
                </span>
                <span style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif', fontSize: 15, color: '#ccc', fontStyle: 'italic', lineHeight: 1.7 }}>
                  {r.title}{' '}
                </span>
                <span style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: 13, color: '#888', lineHeight: 1.7 }}>
                  {r.journal}
                </span>
              </div>
              {r.doi && (
                <a href={r.doi} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-block', marginTop: 8,
                  fontFamily: 'var(--font-dm-mono), monospace', fontSize: 12,
                  color: '#555', letterSpacing: '0.06em',
                  textDecoration: 'none', transition: 'color 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f09b2d')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                  {r.doi.replace('https://', '')} ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

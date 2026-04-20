'use client';

import { useState, useEffect } from 'react';

const LINKS = [
  { label: 'How It Works',     href: '#how-it-works',     id: 'how-it-works'     },
  { label: 'Biomarker Ranking', href: '#feature-importance', id: 'feature-importance' },
  { label: 'Screening Model',  href: '#clinical-utility', id: 'clinical-utility' },
  { label: 'The Science',      href: '#about',            id: 'about'            },
  { label: 'Contact',          href: '#contact',          id: 'contact'          },
];

export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const sectionIds = LINKS.map(l => l.id);

    const update = () => {
      setScrolled(window.scrollY > 60);
      const mid = window.innerHeight / 2;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= mid) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }
      setActiveSection('');
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  /* close overlay on resize to desktop */
  useEffect(() => {
    const fn = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 64, padding: '0 var(--gutter)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(7,9,15,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid #0e0e1a' : '1px solid transparent',
        transition: 'background 0.4s, border-color 0.4s',
      }}>
        <div style={{
          fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
          fontSize: 20, fontWeight: 700,
          letterSpacing: '-0.02em', color: 'white',
          userSelect: 'none',
        }}>
          OralSense
        </div>

        {/* Desktop links */}
        <div className="r-nav-links" style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {LINKS.map(l => {
            const isActive = activeSection === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                className="nav-link"
                style={{
                  color:        isActive ? 'white' : undefined,
                  borderBottom: isActive ? '1px solid #f09b2d' : '1px solid transparent',
                  paddingBottom: 2,
                }}
              >
                {l.label}
              </a>
            );
          })}
        </div>

        {/* Hamburger */}
        <button
          className="r-nav-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          ) : (
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="0" y1="1"  x2="20" y2="1"  />
              <line x1="0" y1="8"  x2="20" y2="8"  />
              <line x1="0" y1="15" x2="20" y2="15" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile overlay */}
      <div className={`r-nav-overlay${menuOpen ? ' open' : ''}`}>
        {LINKS.map(l => (
          <a
            key={l.href}
            href={l.href}
            className="nav-link"
            style={{ color: activeSection === l.id ? 'white' : undefined }}
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}

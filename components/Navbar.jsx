// components/Navbar.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('cs_theme') || 'dark';
  });

  const prevY = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('cs_theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > prevY.current && y > 120) setHidden(true);
      else setHidden(false);
      prevY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/cards', label: 'Cards' },
    { href: '/chat', label: 'AI' },
    { href: '/callback', label: 'Callback' },
  ];

  return (
    <>
      <header
        className={`fixed left-1/2 -translate-x-1/2 z-50 w-[min(1100px,95%)] transition-transform duration-300 
          ${scrolled ? 'top-4' : 'top-6'} `}
      >
        <nav
          className="bg-white/6 dark:bg-black/30 border border-white/6 dark:border-black/30 backdrop-blur-md rounded-2xl shadow-xl px-4 py-3 flex items-center justify-between gap-4"
          aria-label="Main navigation"
          role="navigation"
        >
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-12 rounded-xl flex items-center justify-center"
            >
              <Image src="/crsaathi.png" alt="CreditSaathi Logo" width={50} height={50} />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-semibold text-white">CreditSaathi</span>
              <span className="text-xs text-slate-300">Compare • AI • Callback</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg p-1">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      active
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8872B] text-[#06202f] shadow'
                        : 'text-slate-200 hover:bg-white/5'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>

            <button
              className="p-2 rounded-md text-slate-200 hover:bg-white/5"
              aria-label="Toggle theme"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? (
                /* sun */
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v2M12 19v2M4 12H2M22 12h-2M4.9 4.9L3.5 3.5M20.5 20.5l-1.4-1.4M4.9 19.1L3.5 20.5M20.5 3.5l-1.4 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              ) : (
                /* moon */
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            <Link
              href="/cards"
              className="ml-1 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37] text-[#06202f] font-semibold shadow-md"
            >
              Compare
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              className="p-2 rounded-md text-slate-200 hover:bg-white/5"
              aria-label="Toggle theme"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v2M12 19v2M4 12H2M22 12h-2M4.9 4.9L3.5 3.5M20.5 20.5l-1.4-1.4M4.9 19.1L3.5 20.5M20.5 3.5l-1.4 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            <button
              className="p-2 rounded-md text-slate-200 hover:bg-white/5"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={links} pathname={pathname} />
    </>
  );
}

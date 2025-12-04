// components/MobileMenu.jsx
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function MobileMenu({ open = false, onClose = () => {}, links = [], pathname = '/' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <aside ref={ref} className="relative m-6 w-[92%] max-w-xs rounded-xl bg-slate-900/80 border border-white/6 p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-slate-100">Menu</div>
          <button onClick={onClose} aria-label="Close" className="text-slate-200 px-2 py-1 rounded hover:bg-white/5">✕</button>
        </div>

        <nav className="flex flex-col gap-2">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} onClick={onClose} className={`px-3 py-2 rounded-lg ${active ? 'bg-gradient-to-r from-rose-400 via-orange-300 to-amber-300 text-slate-900 font-semibold' : 'text-slate-200 hover:bg-white/5'}`}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4">
          <Link href="/cards" onClick={onClose} className="block text-center rounded-lg bg-gradient-to-r from-rose-500 via-orange-400 to-amber-300 text-slate-900 px-4 py-2 font-semibold">
            Compare Cards
          </Link>
        </div>
      </aside>
    </div>
  );
}

// components/ApplyModal.jsx
'use client';

import { useState } from 'react';

export default function ApplyModal({ card, onClose = () => {} }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [state, setState] = useState({ loading: false, error: '', success: '' });

  function onChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 16;
  }

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, error: '', success: '' });
    if (!form.name || form.name.trim().length < 2) {
      setState({ loading: false, error: 'Please provide your name.' });
      return;
    }
    if (!validateEmail(form.email)) {
      setState({ loading: false, error: 'Please provide a valid email.' });
      return;
    }
    if (!validatePhone(form.phone)) {
      setState({ loading: false, error: 'Please provide a valid phone.' });
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        note: `Apply for card: ${card.name} (id: ${card._id})`,
      };
      const res = await fetch('/api/callbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setState({ loading: false, error: data?.error || 'Failed to submit' });
        return;
      }
      setState({ loading: false, success: 'Request received. An agent will contact you soon.' });
      setForm({ name: '', email: '', phone: '' });
    } catch (err) {
      setState({ loading: false, error: 'Network error. Try again.' });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-60 w-full max-w-md rounded-2xl bg-[#071032] border border-white/6 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-lg font-semibold">Apply for</div>
            <div className="text-sm text-slate-300">{card.name} • {card.bank}</div>
          </div>
          <button onClick={onClose} className="text-slate-300">✕</button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input name="name" value={form.name} onChange={onChange} placeholder="Full name" className="w-full rounded px-3 py-2 bg-white/6 border border-white/6" />
          <input name="email" value={form.email} onChange={onChange} placeholder="Email" className="w-full rounded px-3 py-2 bg-white/6 border border-white/6" />
          <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone" className="w-full rounded px-3 py-2 bg-white/6 border border-white/6" />
          {state.error && <div className="text-rose-400">{state.error}</div>}
          {state.success && <div className="text-emerald-300">{state.success}</div>}

          <div className="flex items-center gap-2">
            <button type="submit" disabled={state.loading} className="rounded px-4 py-2 bg-[#D4AF37] text-[#06202f] font-semibold">
              {state.loading ? 'Sending...' : 'Request Agent Apply'}
            </button>
            <button type="button" onClick={onClose} className="rounded px-4 py-2 border border-white/6">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// app/callback/page.jsx
'use client';

import { useState } from 'react';

export default function CallbackPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', note: '' });
  const [state, setState] = useState({ loading: false, error: '', success: '' });

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 16;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setState({ loading: true, error: '', success: '' });

    if (!form.name || form.name.trim().length < 2) {
      setState({ loading: false, error: 'Please enter your name.', success: '' });
      return;
    }
    if (!validateEmail(form.email)) {
      setState({ loading: false, error: 'Please enter a valid email address.', success: '' });
      return;
    }
    if (!validatePhone(form.phone)) {
      setState({ loading: false, error: 'Please enter a valid phone number.', success: '' });
      return;
    }

    try {
      const res = await fetch('/api/callbacks', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok) {
        setState({ loading: false, error: data?.error || 'Server error', success: '' });
        return;
      }

      setState({
        loading: false,
        error: '',
        success: 'Thanks! Your request was received — an agent will contact you soon.',
      });
      setForm({ name: '', email: '', phone: '', note: '' });
    } catch (err) {
      setState({ loading: false, error: 'Network error. Try again.', success: '' });
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B132B] text-white py-28 px-6">
      <div className="mx-auto max-w-2xl bg-white/6 border border-white/6 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-semibold mb-2">Request a callback</h1>
        <p className="text-slate-300 mb-6">Enter your contact details and an agent will apply on your behalf.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200">Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="mt-1 block w-full rounded-md bg-transparent border border-white/6 px-3 py-2"
              placeholder="e.g. Rajesh Kumar"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-200">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                className="mt-1 block w-full rounded-md bg-transparent border border-white/6 px-3 py-2"
                placeholder="you@example.com"
                required
                type="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="mt-1 block w-full rounded-md bg-transparent border border-white/6 px-3 py-2"
                placeholder="+91 98765 43210"
                required
                inputMode="tel"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">Note (optional)</label>
            <textarea
              name="note"
              value={form.note}
              onChange={onChange}
              className="mt-1 block w-full rounded-md bg-transparent border border-white/6 px-3 py-2"
              placeholder="Any preferences or quick note for the agent..."
              rows="4"
            />
          </div>

          {state.error && <div className="text-sm text-rose-400">{state.error}</div>}
          {state.success && <div className="text-sm text-emerald-300">{state.success}</div>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-xl bg-[#D4AF37] text-[#06202f] px-4 py-2 font-semibold shadow"
              disabled={state.loading}
            >
              {state.loading ? 'Sending...' : 'Request Callback'}
            </button>

            <button
              type="button"
              onClick={() => {
                setForm({ name: '', email: '', phone: '', note: '' });
                setState({ loading: false, error: '', success: '' });
              }}
              className="rounded-xl border border-white/6 px-4 py-2"
            >
              Reset
            </button>
          </div>
        </form>

        <p className="text-sm text-slate-400 mt-4">
          We only use your contact information to connect you with an agent. Emails are sent using Resend.
        </p>
      </div>
    </div>
  );
}

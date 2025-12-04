// app/cards/page.jsx
'use client';

import { useEffect, useState } from 'react';
import CardCard from '../../components/CardCard';
import ApplyModal from '../../components/ApplyModal';

export default function CardsPage() {
  const [query, setQuery] = useState('');
  const [bank, setBank] = useState('');
  const [category, setCategory] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [error, setError] = useState('');

  async function fetchCards() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (bank) params.set('bank', bank);
      if (category) params.set('category', category);
      const res = await fetch('/api/cards?' + params.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch');
      setCards(data.cards || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0B132B] text-white py-28 px-6 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold mb-4">Find the best credit card</h1>

        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by card name, bank, rewards..."
            className="flex-1 rounded-md px-4 py-2 bg-white/6 border border-white/6 placeholder:text-slate-300"
          />
          <input
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            placeholder="Bank (optional)"
            className="w-44 rounded-md px-3 py-2 bg-white/6 border border-white/6"
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g. Travel)"
            className="w-44 rounded-md px-3 py-2 bg-white/6 border border-white/6"
          />
          <button onClick={fetchCards} className="rounded-md px-4 py-2 bg-[#D4AF37] text-[#06202f] font-semibold">
            Search
          </button>
        </div>

        {error && <div className="text-rose-400 mb-4">{error}</div>}

        {loading ? (
          <div className="text-slate-300">Loading...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.length ? (
              cards.map((c) => (
                <CardCard key={c._id} card={c} onApply={() => setSelectedCard(c)} />
              ))
            ) : (
              <div className="text-slate-300">No cards found.</div>
            )}
          </div>
        )}
      </div>

      {selectedCard && (
        <ApplyModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}

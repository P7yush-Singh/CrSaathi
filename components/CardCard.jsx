// components/CardCard.jsx
'use client';
import Image from 'next/image';

export default function CardCard({ card, onApply = () => {} }) {
  return (
    <div className="rounded-2xl p-4 bg-white/6 border border-white/6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-12 bg-white/5 rounded flex items-center justify-center text-xs font-semibold">{card.bank?.slice(0,2) || 'BK'}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-white">{card.name}</div>
              <div className="text-sm text-slate-300">{card.bank} • {card.category}</div>
            </div>
            <div className="text-sm text-[#D4AF37] font-semibold">₹{card.annualFee || 0}</div>
          </div>

          <div className="mt-3 text-sm text-slate-300">{card.rewardsText}</div>

          <div className="mt-4 flex items-center gap-2">
            <a href={`/cards/${card._id}`} className="rounded-md px-3 py-2 border border-white/6">Details</a>
            <button onClick={() => onApply(card)} className="rounded-md px-3 py-2 bg-[#D4AF37] text-[#06202f] font-semibold">Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
}

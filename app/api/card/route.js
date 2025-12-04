// app/api/cards/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import Card from '../../../models/card.model';

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const q = (url.searchParams.get('q') || '').trim();
    const bank = (url.searchParams.get('bank') || '').trim();
    const category = (url.searchParams.get('category') || '').trim();
    const minFee = parseFloat(url.searchParams.get('minFee') || '0') || 0;
    const maxFee = url.searchParams.get('maxFee') ? parseFloat(url.searchParams.get('maxFee')) : undefined;
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 100);

    const filter = {};

    if (bank) filter.bank = new RegExp(`^${escapeRegExp(bank)}`, 'i');
    if (category) filter.category = new RegExp(`^${escapeRegExp(category)}`, 'i');
    if (minFee) filter.annualFee = { $gte: minFee };
    if (typeof maxFee === 'number' && !isNaN(maxFee)) {
      filter.annualFee = Object.assign(filter.annualFee || {}, { $lte: maxFee });
    }

    // text search across name, bank, category, rewardsText
    if (q) {
      const re = new RegExp(escapeRegExp(q), 'i');
      filter.$or = [
        { name: re },
        { bank: re },
        { category: re },
        { rewardsText: re },
        { features: re },
      ];
    }

    const cards = await Card.find(filter).limit(limit).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, cards });
  } catch (err) {
    console.error('GET /api/cards error', err);
    return NextResponse.json({ ok: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

// small helper
function escapeRegExp(str = '') {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

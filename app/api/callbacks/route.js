// app/api/callbacks/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import CallbackRequest from '../../../models/callback.model';
import { sendEmail, customerConfirmationHTML, adminNotificationHTML } from '../../../lib/resend';

const RATE_LIMIT_WINDOW_SECONDS = parseInt(process.env.CALLBACK_RATE_WINDOW_SEC || '60', 10);
const RATE_LIMIT_MAX = parseInt(process.env.CALLBACK_RATE_MAX || '5', 10);
const rateMap = new Map();

function getIP(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || req.headers.get('client-ip') || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_SECONDS * 1000 });
    return false;
  }
  if (now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_SECONDS * 1000 });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }
  entry.count += 1;
  return false;
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 16;
}
function sanitizeString(s) {
  if (!s) return '';
  return String(s).trim().slice(0, 1000);
}

export async function POST(req) {
  const dev = process.env.NODE_ENV !== 'production';

  try {
    const ip = getIP(req);

    // Rate limit check
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    // parse JSON safely
    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.error('Error parsing request body:', err);
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const name = sanitizeString(body.name);
    const email = (body.email || '').toLowerCase();
    const phone = sanitizeString(body.phone);
    const note = sanitizeString(body.note);

    // validations
    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Name is required and must be at least 2 characters.' }, { status: 400 });
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
    }
    if (!validatePhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 });
    }

    // connect to DB
    try {
      await connectDB();
    } catch (dbErr) {
      console.error('Database connection error in callback route:', dbErr);
      const msg = dev ? (dbErr.message || String(dbErr)) : 'Database connection failed';
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    // create and save document
    let doc;
    try {
      doc = new CallbackRequest({ name, email, phone, note, ip, status: 'new' });
      await doc.save();
    } catch (saveErr) {
      console.error('Error saving CallbackRequest:', saveErr);
      const msg = dev ? (saveErr.message || String(saveErr)) : 'Failed to save request';
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    // send emails asynchronously but catch errors (do not block success)
    (async () => {
      try {
        const customerHtml = customerConfirmationHTML({ name });
        await sendEmail({
          to: email,
          subject: 'We received your callback request — CreditSaathi',
          html: customerHtml,
        });
      } catch (e) {
        console.error('Customer email send failed (non-fatal):', e);
      }

      try {
        const adminHtml = adminNotificationHTML({ name, email, phone, note, ip });
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
          await sendEmail({
            to: adminEmail,
            subject: 'New callback request — CreditSaathi',
            html: adminHtml,
          });
        } else {
          console.warn('ADMIN_EMAIL not configured - skipping admin notification.');
        }
      } catch (e) {
        console.error('Admin email send failed (non-fatal):', e);
      }
    })();

    return NextResponse.json({ ok: true, id: doc._id }, { status: 201 });
  } catch (err) {
    console.error('Unexpected callback route error:', err);
    const msg = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : (err.message || String(err));
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

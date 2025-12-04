// lib/resend.js

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL; // e.g. "no-reply@creditsaathi.in"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // e.g. "ops@creditsaathi.in"

if (!RESEND_API_KEY) {
  // We'll still allow app to run in dev if you don't have it, but route will throw if trying to send.
  console.warn('RESEND_API_KEY not set. Emails will not be sent.');
}

/**
 * sendEmail - minimal function to call Resend transactional email endpoint.
 * - to: string or array of strings
 * - subject: string
 * - html: string (HTML content)
 */
export async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    console.warn('Skipping sendEmail because RESEND_API_KEY is not configured.');
    return { ok: false, message: 'RESEND_API_KEY not configured' };
  }

  const payload = {
    from: RESEND_SENDER_EMAIL,
    to,
    subject,
    html,
  };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Resend API error', res.status, text);
    throw new Error(`Resend error: ${res.status} ${text}`);
  }

  const data = await res.json();
  return { ok: true, data };
}

/**
 * Templates - small helpers to build email HTML bodies
 */
export function customerConfirmationHTML({ name }) {
  return `
    <div style="font-family:system-ui,Arial,Helvetica,sans-serif; color:#061526;">
      <h2>Hello ${escapeHtml(name || '')},</h2>
      <p>Thanks — we received your callback request. An agent will contact you soon.</p>
      <p>If you didn't request this, ignore this email or contact us at ${ADMIN_EMAIL}.</p>
      <p>— CreditSaathi</p>
    </div>
  `;
}

export function adminNotificationHTML({ name, email, phone, note, ip }) {
  return `
    <div style="font-family:system-ui,Arial,Helvetica,sans-serif; color:#061526;">
      <h3>New Callback Request</h3>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(name)}</li>
        <li><strong>Email:</strong> ${escapeHtml(email)}</li>
        <li><strong>Phone:</strong> ${escapeHtml(phone)}</li>
        <li><strong>Note:</strong> ${escapeHtml(note || '')}</li>
        <li><strong>IP:</strong> ${escapeHtml(ip || '')}</li>
      </ul>
      <p><a href="http://localhost:3000/callbacks">Open callbacks dashboard</a></p>
    </div>
  `;
}

/* tiny escape to avoid accidental HTML injection */
function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

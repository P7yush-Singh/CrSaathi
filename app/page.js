// app/page.jsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B132B] text-white">
      <section className="pt-28 pb-20 px-6 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 items-center">
          {/* Left */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
              Compare. Choose. Conquer your credit.
            </h1>

            <p className="text-slate-300 max-w-2xl">
              CreditSaathi finds the perfect credit card for your lifestyle — rewards, fees, and eligibility compared side-by-side.
              Get personalised suggestions from our AI advisor and request a callback to apply easily.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/cards" className="inline-flex items-center gap-2 rounded-2xl bg-[#D4AF37] px-5 py-3 text-[#06202f] font-semibold shadow-md hover:opacity-95 transition">
                Explore Cards
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link href="/chat" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 border border-white/6 text-white/90 hover:bg-white/4 transition">
                Chat with AI Advisor
              </Link>

              <Link href="/callback" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-transparent text-slate-200 border border-white/6 hover:bg-white/3 transition">
                Request Callback
              </Link>
            </div>

            <div className="mt-3 text-sm text-slate-400">No spam. Full control — emails via Resend.</div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/6 bg-white/3 p-5 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-300">Featured</div>
                  <div className="text-lg font-semibold text-white/95">Frequent Flyer Card — Bank Aero</div>
                </div>
                <div className="text-sm text-[#D4AF37] bg-[#06202f]/10 px-2 py-1 rounded">₹2,499/yr</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-white/6 rounded-md">
                  <div className="text-xs text-slate-300">Rewards</div>
                  <div className="font-medium text-white/90">5% Travel</div>
                </div>
                <div className="p-3 bg-white/6 rounded-md">
                  <div className="text-xs text-slate-300">Lounge</div>
                  <div className="font-medium text-white/90">6 visits/yr</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button className="flex-1 rounded-lg bg-[#D4AF37] px-3 py-2 text-[#06202f] font-semibold">Apply Now</button>
                <button className="p-2 rounded-lg border border-white/6 text-white/90">Save</button>
              </div>
            </div>

            <div className="rounded-xl border border-white/6 bg-transparent p-5">
              <h3 className="text-sm text-slate-300">Why CreditSaathi?</h3>
              <ul className="mt-3 space-y-2 text-slate-300 text-sm">
                <li>Smart card comparison tailored to your spending.</li>
                <li>AI advisor suggests top matches in seconds.</li>
                <li>Request an agent callback — apply securely via agent.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* seed paragraphs */}
      <section className="px-6 md:px-12 lg:px-24 pb-32">
        <div className="mx-auto max-w-4xl space-y-6 text-slate-300">
          <h2 className="text-2xl font-semibold text-white">Test Paragraphs</h2>

          <p>
            CreditSaathi helps you understand credit card benefits without the noise. Our comparison engine highlights rewards,
            fees, eligibility and real-world value so you can make confident choices.
          </p>

          <p>
            The AI advisor can suggest cards based on your spending habits, income range, and travel preferences.
            Ask about rewards, eligibility, and which card saves you the most on groceries or travel.
          </p>

          <p>
            When you request a callback, provide a phone number and email. An agent will reach out and can complete the application
            on your behalf — you stay informed with email updates.
          </p>

          <p>
            This page contains sample paragraphs to test typing, timers, and the UI. Use them to ensure your typing test or other features work correctly.
          </p>

          <p className="text-sm text-slate-400">(These are seed paragraphs — edit or replace them anytime in <code>app/page.jsx</code>.)</p>
        </div>
      </section>
    </div>
  );
}

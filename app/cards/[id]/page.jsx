// app/cards/[id]/page.jsx
import { connectDB } from '../../../lib/db';
import Card from '../../../models/card.model';
import ApplyModal from '../../../components/ApplyModal';

export default async function CardDetail({ params }) {
  const id = params.id;
  await connectDB();
  const card = await Card.findById(id).lean();
  if (!card) {
    return (
      <div className="min-h-screen bg-[#0B132B] text-white flex items-center justify-center">
        <div className="max-w-xl p-8">Card not found.</div>
      </div>
    );
  }

  // Render a server component with the card data; client modal will be loaded on click (hydrated)
  return (
    <div className="min-h-screen bg-[#0B132B] text-white py-28 px-6 md:px-12 lg:px-24">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl p-6 bg-white/6 border border-white/6">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-white">{card.name}</h1>
              <div className="text-slate-300">{card.bank} • {card.category}</div>
              <div className="mt-4 text-slate-300">{card.rewardsText}</div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {card.features?.map((f, i) => (
                  <div key={i} className="p-3 bg-white/6 rounded">{f}</div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button id="apply-btn" className="rounded-lg bg-[#D4AF37] text-[#06202f] px-4 py-2 font-semibold">Apply</button>
                <a href="/cards" className="rounded-lg border border-white/6 px-4 py-2">Back</a>
              </div>
            </div>

            <div className="w-40">
              <div className="text-sm text-slate-300">Annual fee</div>
              <div className="text-lg font-semibold text-white">₹{card.annualFee || 0}</div>
            </div>
          </div>
        </div>

        {/* Client-side modal: we render mounting point and load component on client */}
        <div id="apply-modal-root" className="mt-6"></div>

        <script dangerouslySetInnerHTML={{
          __html: `
            (function(){
              const btn = document.getElementById('apply-btn');
              if(!btn) return;
              btn.addEventListener('click', function(){
                // create and mount client-side ApplyModal if not mounted
                if(window.__creditsaathi_apply_mounted) return;
                const root = document.getElementById('apply-modal-root');
                if(!root) return;
                window.__creditsaathi_apply_mounted = true;
                import('/components/ApplyModal.js').then(mod => {
                  const Apply = mod.default;
                  const mount = document.createElement('div');
                  root.appendChild(mount);
                  new window.ReactRenderer?.render ? window.ReactRenderer.render(Apply({ card: ${JSON.stringify(card)} , onClose: ()=>{} }), mount) : null;
                }).catch(e=>console.error('failed to load apply modal',e));
              });
            })();
          `
        }} />
      </div>
    </div>
  );
}

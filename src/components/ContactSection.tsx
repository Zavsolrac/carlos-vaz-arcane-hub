import { ExternalLink, Sparkles } from 'lucide-react';
import { CANONICAL_PORTFOLIO_URL } from '../data/defaultData';

export function ContactSection() {
  return (
    <section id="contato" className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="relative rounded-2xl bg-gradient-to-b from-[#13171f] to-[#0a0a0a] border border-[#004d4d]/60 p-6 sm:p-10 overflow-hidden text-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e9c176]/10 border border-[#e9c176]/30 text-[#e9c176] text-xs font-inter font-bold tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#00f2ff]" /> Contacto
        </div>
        <h2 className="font-cinzel text-2xl sm:text-4xl font-bold gold-gradient-text tracking-wider uppercase mb-3">
          Vamos construir algo memorável?
        </h2>
        <p className="font-lora text-sm sm:text-base text-[#d1c5b4]/80 max-w-xl mx-auto mb-8">
          Pedidos de orçamento passam pelo portfólio canónico. Este hub não publica telefone, e-mail nem WhatsApp não verificados.
        </p>
        <a
          href={CANONICAL_PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00f2ff] text-[#002022] font-inter font-bold text-sm uppercase tracking-wider"
        >
          Abrir portfólio para contacto
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}

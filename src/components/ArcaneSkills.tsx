import { Compass, Cpu, Feather, Layout, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { PILLARS } from '../data/profile';

const ICONS = [Feather, Compass, Layout, Sparkles, Cpu];

export function ArcaneSkills() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-10" aria-labelledby="pillars-heading">
      <div className="text-center mb-8">
        <p className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e9c176]/10 border border-[#e9c176]/30 text-[#e9c176] text-xs font-inter font-bold tracking-widest uppercase mb-2">
          Ofício
        </p>
        <h2 id="pillars-heading" className="font-cinzel text-2xl sm:text-3xl font-bold gold-gradient-text tracking-wider uppercase">
          Pilares
        </h2>
        <p className="font-lora text-sm sm:text-base text-[#d1c5b4]/80 max-w-2xl mx-auto mt-2">
          O mesmo ofício do portfólio canónico, aqui apenas como mapa rápido.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PILLARS.map((pillar, idx) => {
          const Icon = ICONS[idx] ?? Sparkles;
          return (
            <motion.article
              key={pillar.name}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : idx * 0.05 }}
              className="p-6 rounded-2xl bg-[#13171f] border border-[#004d4d]/50 hover:border-[#00f2ff]/60 transition-colors"
            >
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-11 h-11 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff] flex items-center justify-center">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#e5e2e1]">{pillar.name}</h3>
              </div>
              <p className="font-lora text-sm text-[#d1c5b4]/90 leading-relaxed">{pillar.summary}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

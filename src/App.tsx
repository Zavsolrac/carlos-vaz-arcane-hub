import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { ArcaneBackground } from './components/ArcaneBackground';
import { ArcaneHeader } from './components/ArcaneHeader';
import { ArcaneSkills } from './components/ArcaneSkills';
import { BioLinksSection } from './components/BioLinksSection';
import { CardStudio } from './components/CardStudio';
import { ContactSection } from './components/ContactSection';
import { Navbar } from './components/Navbar';
import { INITIAL_CARD_CONFIG, PORTALS, PROFILE } from './data/profile';
import { soundFx } from './utils/sound';

export default function App() {
  const [activeView, setActiveView] = useState<'hub' | 'generator'>('hub');
  const reduceMotion = useReducedMotion();

  return (
    <div id="inicio" className="relative min-h-screen bg-[#0a0a0a] text-[#e5e2e1] selection:bg-[#00f2ff]/30 selection:text-[#ddfcff] flex flex-col font-lora">
      <ArcaneBackground />
      <Navbar activeView={activeView} setActiveView={setActiveView} />

      <main className="relative z-10 flex-1 flex flex-col">
        <ArcaneHeader />

        <AnimatePresence mode="wait">
          {activeView === 'hub' ? (
            <motion.div
              key="hub-view"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
              className="space-y-12 pb-16"
            >
              <BioLinksSection links={PORTALS} onOpenGenerator={() => setActiveView('generator')} />

              <section className="w-full max-w-4xl mx-auto px-4">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playArcaneChime(650, 0.2);
                    setActiveView('generator');
                  }}
                  className="group w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1c232f] via-[#151c27] to-[#12161f] p-6 border border-[#e9c176]/50 hover:border-[#00f2ff] transition-all flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/40 text-[#00f2ff] flex items-center justify-center shrink-0">
                      <ImageIcon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#e5e2e1] group-hover:text-[#00f2ff] transition-colors">
                        Gerador PNG &amp; HTML
                      </h2>
                      <p className="font-lora text-xs sm:text-sm text-[#d1c5b4]/80 mt-0.5">
                        Cartão social 9:16 ou 1:1, QR real e wrapper clicável. O PNG continua a ser só imagem.
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00f2ff]/20 text-[#00f2ff] font-inter text-xs font-bold uppercase tracking-wider border border-[#00f2ff]/40">
                    Abrir ateliê
                  </span>
                </button>
              </section>

              <ArcaneSkills />
              <ContactSection />
            </motion.div>
          ) : (
            <motion.div
              key="generator-view"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
              className="pb-16"
            >
              <CardStudio initialConfig={INITIAL_CARD_CONFIG} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 border-t border-[#004d4d]/40 bg-[#07090d] py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="font-signature text-sm font-bold gold-gradient-text tracking-[0.2em] uppercase">
            {PROFILE.nameDisplay} — {PROFILE.brandDisplay}
          </p>
          <p className="font-lora text-xs text-[#d1c5b4]/60">
            Hub profissional. O portfólio completo vive em{' '}
            <a href={PROFILE.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-[#00f2ff] inline-flex items-center gap-1">
              portifoleo-carlos-vaz.vercel.app
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </p>
          <p className="text-[11px] font-inter text-[#d1c5b4]/40 pt-2">
            © {new Date().getFullYear()} Carlos Vaz. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

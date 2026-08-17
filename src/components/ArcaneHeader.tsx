import { motion, useReducedMotion } from 'motion/react';
import { ArcaneEyeMedallion } from './ArcaneEyeMedallion';

export function ArcaneHeader() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : { opacity: 0, y: 12 };

  return (
    <header className="relative flex flex-col items-center justify-center text-center pt-8 pb-6 px-4 max-w-4xl mx-auto">
      <div className="absolute top-6 w-52 h-52 bg-[#00f2ff]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-4 w-8 h-8 border-t border-l border-[#004d4d]/60 pointer-events-none" />
      <div className="absolute top-0 right-4 w-8 h-8 border-t border-r border-[#004d4d]/60 pointer-events-none" />

      <motion.div
        initial={initial}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.6 }}
        className="mb-7"
      >
        <ArcaneEyeMedallion size={110} glow={true} />
      </motion.div>

      <motion.h1
        initial={initial}
        animate={{ opacity: 1, y: 0 }}
        className="font-signature text-4xl sm:text-5xl md:text-6xl font-bold tracking-[0.08em] gold-gradient-text uppercase leading-none mb-3"
      >
        CARLOS VAZ
      </motion.h1>

      <motion.p
        initial={initial}
        animate={{ opacity: 1, y: 0 }}
        className="font-cinzel text-lg sm:text-2xl font-semibold tracking-[0.25em] text-[#d1c5b4] uppercase mb-5"
      >
        The Arcane Architect
      </motion.p>

      <motion.p
        initial={initial}
        animate={{ opacity: 1, y: 0 }}
        className="font-inter text-xs sm:text-sm md:text-base font-semibold tracking-[0.12em] text-[#00f2ff] uppercase max-w-xl mx-auto px-4 py-1.5 rounded-full bg-[#00f2ff]/5 border border-[#00f2ff]/20 mb-6"
      >
        Desenvolvedor Web · IA · Storytelling Digital
      </motion.p>

      <div className="flex items-center justify-center gap-3 w-48 mx-auto mb-6 opacity-60" aria-hidden="true">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00f2ff]" />
        <div className="w-2 h-2 rotate-45 border border-[#00f2ff] bg-[#0d1117]" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00f2ff]" />
      </div>

      <motion.p
        initial={initial}
        animate={{ opacity: 1, y: 0 }}
        className="font-lora text-base sm:text-lg text-[#e5e2e1]/90 max-w-lg mx-auto leading-relaxed italic"
      >
        Transformo ideias em experiências digitais com identidade.
      </motion.p>
    </header>
  );
}

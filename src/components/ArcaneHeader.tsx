import React from 'react';
import { motion } from 'motion/react';
import { ArcaneEyeMedallion } from './ArcaneEyeMedallion';
import { soundFx } from '../utils/sound';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onExploreProjects?: () => void;
  onOpenGenerator?: () => void;
}

export const ArcaneHeader: React.FC<HeaderProps> = ({
  onExploreProjects,
  onOpenGenerator,
}) => {
  return (
    <header className="relative flex flex-col items-center justify-center text-center pt-8 pb-6 px-4 max-w-4xl mx-auto">
      {/* Subtle background mystic glow behind the emblem */}
      <div className="absolute top-6 w-52 h-52 bg-[#00f2ff]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-12 w-64 h-64 bg-[#e9c176]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Frame corners decoration */}
      <div className="absolute top-0 left-4 w-8 h-8 border-t border-l border-[#004d4d]/60 pointer-events-none" />
      <div className="absolute top-0 right-4 w-8 h-8 border-t border-r border-[#004d4d]/60 pointer-events-none" />

      {/* Medallion */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-7 cursor-pointer"
        onClick={() => soundFx.playCastSpell()}
        title="O Oculus Arcano — Clique para canalizar energia"
      >
        <ArcaneEyeMedallion size={110} glow={true} />
      </motion.div>

      {/* Main Title: CARLOS VAZ (Identity Display with Ringbearer) */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="font-ringbearer text-4xl sm:text-5xl md:text-6xl font-bold tracking-[0.06em] gold-gradient-text uppercase leading-none drop-shadow-md mb-3 select-none"
      >
        CARLOS<br className="sm:hidden" /> VAZ
      </motion.h1>

      {/* Epithet: THE ARCANE ARCHITECT */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="font-cinzel text-lg sm:text-2xl font-semibold tracking-[0.25em] text-[#d1c5b4] uppercase mb-5 select-none"
      >
        THE ARCANE ARCHITECT
      </motion.div>

      {/* Cyan Sub-role: DESENVOLVEDOR WEB • IA • STORYTELLING DIGITAL */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="font-inter text-xs sm:text-sm md:text-base font-bold tracking-[0.14em] text-[#00f2ff] uppercase max-w-xl mx-auto px-4 py-1.5 rounded-full bg-[#00f2ff]/5 border border-[#00f2ff]/20 shadow-[0_0_15px_rgba(0,242,255,0.15)] mb-6 select-none"
      >
        DESENVOLVEDOR WEB • IA • STORYTELLING DIGITAL
      </motion.div>

      {/* Arcane subtle divider with diamond rune */}
      <div className="flex items-center justify-center gap-3 w-48 mx-auto mb-6 opacity-60">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#00f2ff]" />
        <div className="w-2 h-2 rotate-45 border border-[#00f2ff] bg-[#0d1117]" />
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#00f2ff]" />
      </div>

      {/* Manifesto / Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="font-lora text-base sm:text-lg text-[#e5e2e1]/90 max-w-lg mx-auto font-normal leading-relaxed italic"
      >
        &ldquo;Transformo ideias em experiências digitais com identidade.&rdquo;
      </motion.p>
    </header>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { DEFAULT_SKILLS } from '../data/defaultData';
import { soundFx } from '../utils/sound';
import {
  Brain,
  Layout,
  Feather,
  Server,
  Sparkles,
  Cpu,
  Code2,
  Terminal,
  Compass,
} from 'lucide-react';

const getSkillIcon = (iconName: string) => {
  switch (iconName) {
    case 'Layout':
      return Layout;
    case 'Brain':
      return Brain;
    case 'Feather':
      return Feather;
    case 'Server':
      return Server;
    default:
      return Cpu;
  }
};

export const ArcaneSkills: React.FC = () => {
  return (
    <section id="habilidades" className="w-full max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e9c176]/10 border border-[#e9c176]/30 text-[#e9c176] text-xs font-inter font-bold tracking-widest uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#00f2ff]" /> Runas de Domínio & Competências
        </div>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold gold-gradient-text tracking-wider uppercase">
          Especialidades Técnicas
        </h2>
        <p className="font-lora text-sm sm:text-base text-[#d1c5b4]/80 max-w-2xl mx-auto mt-1">
          A fusão entre a precisão da engenharia de software e a magia da inteligência artificial generativa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEFAULT_SKILLS.map((skill, idx) => {
          const IconComp = getSkillIcon(skill.iconName);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onMouseEnter={() => soundFx.playHoverWhisper()}
              className="p-6 rounded-2xl bg-[#13171f] border border-[#004d4d]/50 hover:border-[#00f2ff]/60 transition-all duration-300 shadow-xl space-y-4 hover:shadow-[0_0_20px_rgba(0,242,255,0.1)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff] flex items-center justify-center shrink-0">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#e5e2e1]">
                      {skill.name}
                    </h3>
                    <span className="text-[11px] font-inter text-[#e9c176] uppercase tracking-wider">
                      {skill.category}
                    </span>
                  </div>
                </div>

              </div>

              <p className="font-inter text-xs text-[#e5e2e1]/90">
                {skill.description}
              </p>

              <p className="font-lora text-xs text-[#d1c5b4]/70 italic border-t border-white/5 pt-2">
                &ldquo;{skill.lore}&rdquo;
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

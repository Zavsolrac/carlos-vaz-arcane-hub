import { Check, Copy, ExternalLink, Github, Globe, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useState, type MouseEvent } from 'react';
import type { PortalLink } from '../data/profile';
import { soundFx } from '../utils/sound';

interface BioLinksProps {
  links: PortalLink[];
  onOpenGenerator: () => void;
}

const ICONS = {
  Sparkles,
  Github,
  Image: ImageIcon,
  Globe,
};

export function BioLinksSection({ links, onOpenGenerator }: BioLinksProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const handleCopy = async (event: MouseEvent, link: PortalLink) => {
    event.preventDefault();
    event.stopPropagation();
    soundFx.playArcaneChime(750, 0.2);
    const fullUrl = link.url.startsWith('#')
      ? `${window.location.origin}${window.location.pathname}`
      : link.url;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(link.id);
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="w-full max-w-xl mx-auto px-4 py-4 space-y-3.5" aria-labelledby="portals-heading">
      <div className="flex items-center justify-between px-2 mb-2">
        <h2 id="portals-heading" className="font-cinzel text-xs tracking-[0.2em] text-[#e9c176] uppercase font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#00f2ff]" aria-hidden="true" /> Portais de acesso
        </h2>
      </div>

      <div className="space-y-3">
        {links.map((link, idx) => {
          const Icon = ICONS[link.iconName] ?? Globe;
          const isInternal = Boolean(link.internalView);

          const content = (
            <>
              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                    link.highlight
                      ? 'bg-[#e9c176]/15 border border-[#e9c176]/40 text-[#e9c176]'
                      : 'bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff]'
                  }`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-cinzel text-sm sm:text-base font-semibold text-[#e5e2e1] group-hover:text-[#00f2ff] transition-colors">
                      {link.title}
                    </span>
                    {link.badge && (
                      <span className="font-inter text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#00f2ff]/15 border border-[#00f2ff]/30 text-[#00f2ff]">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-lora text-xs text-[#d1c5b4]/80 mt-0.5">{link.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(event) => handleCopy(event, link)}
                  aria-label={copiedId === link.id ? 'Ligação copiada' : `Copiar ${link.title}`}
                  className="p-2 rounded-lg bg-[#0a0a0a]/70 border border-white/5 text-[#d1c5b4] hover:text-[#00f2ff] hover:border-[#00f2ff]/40 transition-colors"
                >
                  {copiedId === link.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <ExternalLink className="w-4 h-4 text-[#d1c5b4]/50 group-hover:text-[#00f2ff]" aria-hidden="true" />
              </div>
            </>
          );

          const className = `group relative flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
            link.highlight
              ? 'bg-gradient-to-r from-[#1c232f] via-[#151c27] to-[#12161f] border border-[#e9c176]/50 hover:border-[#00f2ff]'
              : 'bg-[#13171f]/80 border border-[#004d4d]/40 hover:border-[#00f2ff]/60'
          }`;

          if (isInternal) {
            return (
              <motion.button
                key={link.id}
                type="button"
                onClick={() => {
                  soundFx.playHoverWhisper();
                  onOpenGenerator();
                }}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : idx * 0.06 }}
                className={`${className} w-full text-left`}
              >
                {content}
              </motion.button>
            );
          }

          return (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playHoverWhisper()}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : idx * 0.06 }}
              className={className}
            >
              {content}
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}

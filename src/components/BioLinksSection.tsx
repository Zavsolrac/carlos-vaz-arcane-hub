import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BioLink } from '../types';
import { soundFx } from '../utils/sound';
import {
  Sparkles,
  MessageSquare,
  Cpu,
  Github,
  Linkedin,
  Compass,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Share2,
  FolderGit2,
} from 'lucide-react';

interface BioLinksProps {
  links: BioLink[];
  onSelectLink?: (link: BioLink) => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles':
      return Sparkles;
    case 'MessageSquare':
      return MessageSquare;
    case 'Cpu':
      return Cpu;
    case 'Github':
      return Github;
    case 'Linkedin':
      return Linkedin;
    case 'Compass':
      return Compass;
    case 'FolderGit2':
      return FolderGit2;
    default:
      return Globe;
  }
};

export const BioLinksSection: React.FC<BioLinksProps> = ({ links, onSelectLink }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, link: BioLink) => {
    e.preventDefault();
    e.stopPropagation();
    soundFx.playArcaneChime(750, 0.2);

    const fullUrl = link.url.startsWith('#')
      ? `${window.location.origin}${window.location.pathname}${link.url}`
      : link.url;

    navigator.clipboard.writeText(fullUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClick = (link: BioLink) => {
    soundFx.playHoverWhisper();
    if (onSelectLink) {
      onSelectLink(link);
    }
  };

  return (
    <section className="w-full max-w-xl mx-auto px-4 py-4 space-y-3.5">
      <div className="flex items-center justify-between px-2 mb-2">
        <span className="font-cinzel text-xs tracking-[0.2em] text-[#e9c176] uppercase font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#00f2ff]" /> Portais de Acesso Rápido
        </span>
        <span className="text-[11px] font-inter text-[#d1c5b4]/60 tracking-wider">
          {links.length} canais ativos
        </span>
      </div>

      <div className="space-y-3">
        {links.map((link, idx) => {
          const IconComp = getIcon(link.iconName);
          const isCopied = copiedId === link.id;

          return (
            <motion.a
              key={link.id}
              href={link.url}
              target={link.url.startsWith('#') ? '_self' : '_blank'}
              rel={link.url.startsWith('#') ? undefined : 'noopener noreferrer'}
              onClick={() => handleClick(link)}
              onMouseEnter={() => soundFx.playHoverWhisper()}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`group relative flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                link.highlight
                  ? 'bg-gradient-to-r from-[#1c232f] via-[#151c27] to-[#12161f] border border-[#e9c176]/50 shadow-[0_0_20px_rgba(233,193,118,0.12)] hover:border-[#00f2ff] hover:shadow-[0_0_25px_rgba(0,242,255,0.2)]'
                  : 'bg-[#13171f]/80 backdrop-blur-sm border border-[#004d4d]/40 hover:border-[#00f2ff]/60 hover:bg-[#161c26] hover:shadow-[0_0_20px_rgba(0,242,255,0.12)]'
              }`}
            >
              {/* Left icon with glowing background */}
              <div className="flex items-center gap-3.5 min-w-0 pr-2">
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                    link.highlight
                      ? 'bg-[#e9c176]/15 border border-[#e9c176]/40 text-[#e9c176]'
                      : 'bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff]'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                </div>

                {/* Title & Subtitle */}
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-cinzel text-sm sm:text-base font-semibold text-[#e5e2e1] group-hover:text-[#00f2ff] transition-colors truncate">
                      {link.title}
                    </h3>
                    {link.customBadge && (
                      <span className="font-inter text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#00f2ff]/15 border border-[#00f2ff]/30 text-[#00f2ff]">
                        {link.customBadge}
                      </span>
                    )}
                  </div>
                  <p className="font-lora text-xs text-[#d1c5b4]/80 truncate mt-0.5">
                    {link.subtitle}
                  </p>
                </div>
              </div>

              {/* Right action buttons: Copy & External Link arrow */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleCopy(e, link)}
                  title="Copiar link"
                  className="p-2 rounded-lg bg-[#0a0a0a]/70 border border-white/5 text-[#d1c5b4] hover:text-[#00f2ff] hover:border-[#00f2ff]/40 transition-colors opacity-75 group-hover:opacity-100"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <div className="p-2 text-[#d1c5b4]/50 group-hover:text-[#00f2ff] transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
};

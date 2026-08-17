import React, { useState } from 'react';
import { soundFx } from '../utils/sound';
import { pathWithView, type HubView } from '../lib/viewHash';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Share2,
  Download,
  Image as ImageIcon,
  BookOpen,
  Send,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  activeView: HubView;
  setActiveView: (view: HubView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
}) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const toggleAudio = () => {
    const nextState = !audioEnabled;
    soundFx.enabled = nextState;
    setAudioEnabled(nextState);
    if (nextState) {
      soundFx.playArcaneChime(660, 0.3);
    }
  };

  const handleShare = () => {
    soundFx.playArcaneChime(750, 0.2);
    if (navigator.share) {
      navigator.share({
        title: 'Carlos Vaz — The Arcane Architect',
        text: 'Desenvolvedor Web • IA • Storytelling Digital',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const navigate = (view: HubView) => {
    soundFx.playHoverWhisper();
    setActiveView(view);
    if (typeof window !== 'undefined') {
      const nextUrl = pathWithView(window.location.pathname, window.location.search, view);
      window.history.pushState({ view }, '', nextUrl);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-[#004d4d]/40 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#13171f] border border-[#e9c176]/50 flex items-center justify-center text-[#e9c176] shadow-[0_0_10px_rgba(233,193,118,0.2)] group-hover:border-[#00f2ff] group-hover:text-[#00f2ff] transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <div className="font-cinzel text-xs font-bold gold-gradient-text tracking-wider uppercase">
              Carlos Vaz
            </div>
            <div className="text-[9px] font-inter text-[#00f2ff] tracking-widest uppercase">
              The Arcane Architect
            </div>
          </div>
        </a>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-[#13171f] border border-[#004d4d]/50">
          <button
            type="button"
            onClick={() => navigate('portfolio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-inter font-bold uppercase tracking-wider transition-all ${
              activeView === 'portfolio'
                ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/40 shadow-[0_0_12px_rgba(0,242,255,0.2)]'
                : 'text-[#d1c5b4]/70 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Portfólio & Bio</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('generator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-inter font-bold uppercase tracking-wider transition-all ${
              activeView === 'generator'
                ? 'bg-[#e9c176]/20 text-[#e9c176] border border-[#e9c176]/40 shadow-[0_0_12px_rgba(233,193,118,0.2)]'
                : 'text-[#d1c5b4]/70 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Gerador .PNG & HTML</span>
          </button>
        </div>

        {/* Action Controls: Sound & Share */}
        <div className="flex items-center gap-2">
          {/* Audio Synthesizer Toggle */}
          <button
            type="button"
            onClick={toggleAudio}
            aria-label={audioEnabled ? 'Desativar sons místicos' : 'Ativar sons místicos'}
            title={audioEnabled ? 'Desativar Sons Místicos' : 'Ativar Sons Místicos'}
            className={`p-2 rounded-lg border transition-all ${
              audioEnabled
                ? 'bg-[#00f2ff]/15 border-[#00f2ff]/50 text-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.2)]'
                : 'bg-[#13171f] border-white/10 text-[#d1c5b4]/60 hover:text-white'
            }`}
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            aria-label={copiedShare ? 'Link copiado' : 'Compartilhar link'}
            title="Compartilhar Link"
            className="p-2 rounded-lg bg-[#13171f] border border-white/10 text-[#d1c5b4] hover:text-[#e9c176] hover:border-[#e9c176]/40 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

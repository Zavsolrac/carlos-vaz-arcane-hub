import { BookOpen, Image as ImageIcon, Share2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { soundFx } from '../utils/sound';

interface NavbarProps {
  activeView: 'hub' | 'generator';
  setActiveView: (view: 'hub' | 'generator') => void;
}

export function Navbar({ activeView, setActiveView }: NavbarProps) {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const toggleAudio = () => {
    const nextState = !audioEnabled;
    soundFx.enabled = nextState;
    setAudioEnabled(nextState);
    if (nextState) soundFx.playArcaneChime(660, 0.3);
  };

  const handleShare = async () => {
    soundFx.playArcaneChime(750, 0.2);
    const payload = {
      title: 'Carlos Vaz — The Arcane Architect',
      text: 'Desenvolvedor Web · IA · Storytelling Digital',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        // fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    window.setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-[#004d4d]/40 px-4 py-3" aria-label="Principal">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        <a
          href="#inicio"
          onClick={(event) => {
            event.preventDefault();
            setActiveView('hub');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 text-left group rounded-lg"
        >
          <div className="w-8 h-8 rounded-lg bg-[#13171f] border border-[#e9c176]/50 flex items-center justify-center text-[#e9c176] group-hover:border-[#00f2ff] group-hover:text-[#00f2ff] transition-colors">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="hidden sm:block">
            <div className="font-signature text-xs font-bold gold-gradient-text tracking-wider uppercase">
              Carlos Vaz
            </div>
            <div className="text-[9px] font-inter text-[#00f2ff] tracking-widest uppercase">
              The Arcane Architect
            </div>
          </div>
        </a>

        <div className="flex items-center p-1 rounded-xl bg-[#13171f] border border-[#004d4d]/50" role="tablist" aria-label="Vistas do hub">
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'hub'}
            onClick={() => {
              soundFx.playHoverWhisper();
              setActiveView('hub');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-inter font-bold uppercase tracking-wider transition-all ${
              activeView === 'hub'
                ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/40'
                : 'text-[#d1c5b4]/70 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Hub</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === 'generator'}
            onClick={() => {
              soundFx.playHoverWhisper();
              setActiveView('generator');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-inter font-bold uppercase tracking-wider transition-all ${
              activeView === 'generator'
                ? 'bg-[#e9c176]/20 text-[#e9c176] border border-[#e9c176]/40'
                : 'text-[#d1c5b4]/70 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Gerador PNG &amp; HTML</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAudio}
            aria-pressed={audioEnabled}
            aria-label={audioEnabled ? 'Desativar som' : 'Ativar som'}
            className={`p-2 rounded-lg border transition-all ${
              audioEnabled
                ? 'bg-[#00f2ff]/15 border-[#00f2ff]/50 text-[#00f2ff]'
                : 'bg-[#13171f] border-white/10 text-[#d1c5b4]/60 hover:text-white'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label={copiedShare ? 'Ligação copiada' : 'Partilhar ligação'}
            className="p-2 rounded-lg bg-[#13171f] border border-white/10 text-[#d1c5b4] hover:text-[#e9c176] hover:border-[#e9c176]/40 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}

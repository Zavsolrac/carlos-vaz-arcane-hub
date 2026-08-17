import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { ArcaneHeader } from './components/ArcaneHeader';
import { BioLinksSection } from './components/BioLinksSection';
import { ClickablePngStudio } from './components/ClickablePngStudio';
import { ProjectsShowcase } from './components/ProjectsShowcase';
import { ArcaneSkills } from './components/ArcaneSkills';
import { ContactSection } from './components/ContactSection';
import { ArcaneBackground } from './components/ArcaneBackground';
import {
  DEFAULT_PROFILE,
  DEFAULT_BIO_LINKS,
  DEFAULT_PROJECTS,
  INITIAL_PNG_CONFIG,
} from './data/defaultData';
import { ProjectItem } from './types';
import { soundFx } from './utils/sound';
import { Image as ImageIcon, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'portfolio' | 'generator'>('portfolio');
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [bioLinks] = useState(DEFAULT_BIO_LINKS);

  const handleAddProject = (newProj: ProjectItem) => {
    setProjects((prev) => [newProj, ...prev]);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#e5e2e1] selection:bg-[#00f2ff]/30 selection:text-[#ddfcff] flex flex-col font-lora">
      {/* Background constellation canvas */}
      <ArcaneBackground />

      {/* Top Navigation */}
      <Navbar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col">
        {/* Arcane Hero Header (always visible to anchor identity) */}
        <ArcaneHeader
          onExploreProjects={() => {
            setActiveView('portfolio');
            document.getElementById('projetos')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenGenerator={() => {
            setActiveView('generator');
          }}
        />

        {/* Dynamic View Transition */}
        <AnimatePresence mode="wait">
          {activeView === 'portfolio' ? (
            <motion.div
              key="portfolio-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-12 pb-16"
            >
              {/* Quick Bio Links Grid (Tactile grimoire buttons) */}
              <BioLinksSection links={bioLinks} />

              {/* Special CTA Banner: Gerador de PNG Clicável & Associação de Imagens */}
              <section className="w-full max-w-4xl mx-auto px-4">
                <div
                  onClick={() => {
                    soundFx.playArcaneChime(650, 0.2);
                    setActiveView('generator');
                  }}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-r from-[#1c232f] via-[#151c27] to-[#12161f] p-6 border border-[#e9c176]/50 shadow-[0_0_25px_rgba(233,193,118,0.15)] hover:border-[#00f2ff] hover:shadow-[0_0_30px_rgba(0,242,255,0.2)] transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/40 text-[#00f2ff] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#e5e2e1] group-hover:text-[#00f2ff] transition-colors">
                          Gerador PNG &amp; HTML
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-[#e9c176]/20 text-[#e9c176] text-[10px] font-inter font-bold uppercase tracking-wider">
                          Novo
                        </span>
                      </div>
                      <p className="font-lora text-xs sm:text-sm text-[#d1c5b4]/80 mt-0.5">
                        PNG estático 9:16 ou 1:1, QR real e wrapper HTML/Markdown clicável.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00f2ff]/20 text-[#00f2ff] font-inter text-xs font-bold uppercase tracking-wider border border-[#00f2ff]/40 group-hover:bg-[#00f2ff] group-hover:text-[#0a0a0a] transition-all">
                    <span>Abrir Ateliê</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </section>

              {/* Projects Showcase */}
              <ProjectsShowcase
                projects={projects}
                onAddProject={handleAddProject}
              />

              {/* Arcane Skills & Runes */}
              <ArcaneSkills />

              {/* Contact & WhatsApp Inquiry */}
              <ContactSection />
            </motion.div>
          ) : (
            <motion.div
              key="generator-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="pb-16"
            >
              {/* Clickable PNG Studio */}
              <ClickablePngStudio initialConfig={INITIAL_PNG_CONFIG} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#004d4d]/40 bg-[#07090d] py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="font-cinzel text-sm font-bold gold-gradient-text tracking-[0.2em] uppercase">
            {DEFAULT_PROFILE.name} — {DEFAULT_PROFILE.title}
          </div>
          <p className="font-lora text-xs text-[#d1c5b4]/60 italic max-w-md mx-auto">
            &ldquo;A tecnologia mais avançada é indistinguível da magia quando forjada com identidade.&rdquo;
          </p>
          <div className="text-[11px] font-inter text-[#d1c5b4]/40 pt-2">
            © {new Date().getFullYear()} Carlos Vaz. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

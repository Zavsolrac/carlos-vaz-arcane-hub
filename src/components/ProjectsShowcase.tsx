import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectItem, ProjectCategory, RarityLevel } from '../types';
import { CANONICAL_PORTFOLIO_URL } from '../data/defaultData';
import { soundFx } from '../utils/sound';
import {
  Sparkles,
  ExternalLink,
  Github,
  Plus,
  Filter,
  Image as ImageIcon,
  Tag,
  Code2,
  X,
  Check,
  Flame,
  Shield,
  Layers,
  Upload,
} from 'lucide-react';

interface ProjectsProps {
  projects: ProjectItem[];
  onAddProject: (newProject: ProjectItem) => void;
}

export const ProjectsShowcase: React.FC<ProjectsProps> = ({
  projects,
  onAddProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedEmbedId, setCopiedEmbedId] = useState<string | null>(null);

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<'web' | 'ai' | 'storytelling' | 'fullstack'>('web');
  const [newRarity, setNewRarity] = useState<RarityLevel>('Epic');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newHtmlInput, setNewHtmlInput] = useState('');
  const [newLiveUrl, setNewLiveUrl] = useState('');
  const [newTags, setNewTags] = useState('');

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const getRarityBadge = (rarity: RarityLevel) => {
    switch (rarity) {
      case 'Legendary':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-inter font-bold tracking-widest uppercase bg-[#e9c176]/15 border border-[#e9c176]/50 text-[#e9c176] shadow-[0_0_12px_rgba(233,193,118,0.3)]">
            <Flame className="w-3 h-3 text-[#ffdea5]" /> Lendário
          </span>
        );
      case 'Epic':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-inter font-bold tracking-widest uppercase bg-[#00f2ff]/15 border border-[#00f2ff]/50 text-[#00f2ff] shadow-[0_0_12px_rgba(0,242,255,0.25)]">
            <Sparkles className="w-3 h-3 text-[#00f2ff]" /> Épico
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-inter font-bold tracking-widest uppercase bg-[#004d4d]/30 border border-[#004d4d] text-[#ddfcff]">
            <Shield className="w-3 h-3 text-[#00f2ff]" /> Raro
          </span>
        );
    }
  };

  const handleParseHtmlForImage = () => {
    if (!newHtmlInput.trim()) return;
    try {
      if (newHtmlInput.startsWith('http') || newHtmlInput.startsWith('data:image')) {
        setNewImageUrl(newHtmlInput.trim());
        return;
      }
      const match = newHtmlInput.match(/src=["'](.*?)["']/);
      if (match && match[1]) {
        setNewImageUrl(match[1]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewImageUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundFx.playCastSpell();
    const created: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Projeto Forjado com Sucesso',
      description: newDescription.trim() || 'Sem descrição ritualística informada.',
      category: newCategory,
      rarity: newRarity,
      imageUrl:
        newImageUrl.trim() ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
        liveUrl: newLiveUrl.trim() || CANONICAL_PORTFOLIO_URL,
      tags: newTags
        ? newTags.split(',').map((t) => t.trim())
        : ['TypeScript', 'React', 'Tailwind'],
    };

    onAddProject(created);
    setIsAddModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewSubtitle('');
    setNewDescription('');
    setNewImageUrl('');
    setNewHtmlInput('');
    setNewLiveUrl('');
    setNewTags('');
  };

  const copyProjectEmbed = (p: ProjectItem) => {
    const htmlSnippet = `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" title="${p.title}">
  <img src="${p.imageUrl}" alt="${p.title} — ${p.subtitle}" style="max-width: 100%; border-radius: 8px; border: 1px solid #00f2ff;" />
</a>`;
    navigator.clipboard.writeText(htmlSnippet);
    soundFx.playArcaneChime(700, 0.2);
    setCopiedEmbedId(p.id);
    setTimeout(() => setCopiedEmbedId(null), 2000);
  };

  return (
    <section id="projetos" className="w-full max-w-6xl mx-auto px-4 py-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff] text-xs font-inter font-bold tracking-widest uppercase mb-2">
            <Layers className="w-3.5 h-3.5" /> Obras & Arquiteturas Digitais
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold gold-gradient-text tracking-wider uppercase">
            Grimório de Projetos
          </h2>
        </div>

        {/* Action button: Add new project with image association */}
        <button
          type="button"
          onClick={() => {
            soundFx.playArcaneChime(600, 0.2);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c232f] border border-[#e9c176]/50 text-[#e9c176] font-inter text-xs font-bold uppercase tracking-wider hover:bg-[#283344] hover:border-[#00f2ff] hover:text-[#00f2ff] transition-all shadow-[0_0_20px_rgba(233,193,118,0.15)]"
        >
          <Plus className="w-4 h-4" /> Forjar Novo Projeto
        </button>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {[
          { id: 'all', label: 'Todos os Rituais' },
          { id: 'ai', label: 'IA & Automação' },
          { id: 'web', label: 'Web Architecture' },
          { id: 'storytelling', label: 'Storytelling Digital' },
          { id: 'fullstack', label: 'Fullstack & APIs' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              soundFx.playHoverWhisper();
              setSelectedCategory(cat.id as ProjectCategory);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-inter font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#00f2ff]/20 border border-[#00f2ff] text-[#ddfcff] shadow-[0_0_15px_rgba(0,242,255,0.2)]'
                : 'bg-[#13171f] border border-[#004d4d]/40 text-[#d1c5b4]/80 hover:text-white hover:border-[#00f2ff]/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 && (
        <p className="font-lora text-sm text-[#d1c5b4]/80 mb-6">
          Nenhum projecto inventado é publicado aqui. O catálogo verificado vive no{' '}
          <a href={CANONICAL_PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="text-[#00f2ff]">
            portfólio canónico
          </a>
          . A criação abaixo é apenas pré-visualização local e desaparece ao recarregar.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="group relative rounded-2xl bg-[#13171f] border border-[#004d4d]/50 hover:border-[#00f2ff]/70 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,242,255,0.15)] hover:-translate-y-1"
          >
            {/* Image Preview with Hover Reveal */}
            <div className="relative h-48 w-full overflow-hidden bg-[#0a0a0a]">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#13171f] via-[#13171f]/30 to-transparent" />

              {/* Rarity Tag */}
              <div className="absolute top-3 left-3 z-10">
                {getRarityBadge(project.rarity)}
              </div>

              {/* Category Pill */}
              <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-inter text-[#d1c5b4] uppercase tracking-wider">
                {project.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-3">
              <div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#e5e2e1] group-hover:text-[#00f2ff] transition-colors leading-snug">
                  {project.title}
                </h3>
                <p className="font-lora text-xs text-[#d1c5b4]/80 mt-1 line-clamp-2">
                  {project.subtitle}
                </p>
              </div>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags.slice(0, 4).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-[#0a0a0a] border border-[#004d4d]/60 text-[10px] font-mono text-[#00f2ff]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons: Open Link / View Details / Copy HTML */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20 border border-[#00f2ff]/40 text-[#00f2ff] font-inter text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>Acessar</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playHoverWhisper();
                    setSelectedProject(project);
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-2 rounded-lg bg-[#1c232f] hover:bg-[#252f3f] border border-[#e9c176]/30 text-[#e9c176] text-xs font-inter font-semibold transition-all"
                  title="Ver detalhes & HTML"
                >
                  Detalhes
                </button>

                <button
                  type="button"
                  onClick={() => copyProjectEmbed(project)}
                  className="p-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-[#d1c5b4] hover:text-[#00f2ff] transition-all"
                  title="Copiar HTML com link de imagem clicável"
                >
                  {copiedEmbedId === project.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Code2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PROJECT DETAILS & EMBED MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#0d1117] border border-[#004d4d] rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 text-[#d1c5b4] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                {getRarityBadge(selectedProject.rarity)}
                <span className="text-xs font-inter text-[#00f2ff] uppercase tracking-wider">
                  {selectedProject.category}
                </span>
              </div>

              <div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold gold-gradient-text">
                  {selectedProject.title}
                </h3>
                <p className="font-lora text-sm text-[#d1c5b4]/90 italic mt-1">
                  {selectedProject.subtitle}
                </p>
              </div>

              {/* Large Image Preview */}
              <div className="rounded-xl overflow-hidden border border-[#004d4d]/60 max-h-64">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <div>
                <h4 className="font-cinzel text-xs font-semibold text-[#e9c176] tracking-wider uppercase mb-1">
                  Arquitetura & Propósito
                </h4>
                <p className="font-lora text-sm text-[#e5e2e1]/90 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Stats if available */}
              {selectedProject.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedProject.stats.map((stat, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#13171f] border border-[#004d4d]/50">
                      <div className="text-[10px] font-inter text-[#d1c5b4]/70 uppercase tracking-wider">
                        {stat.label}
                      </div>
                      <div className="text-sm font-cinzel font-bold text-[#00f2ff] mt-0.5">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* HTML Embed Snippet */}
              <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#004d4d]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-inter text-[#00f2ff] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" /> Código HTML Clicável Deste Projeto
                  </span>
                  <button
                    type="button"
                    onClick={() => copyProjectEmbed(selectedProject)}
                    className="px-2.5 py-1 rounded bg-[#1c232f] border border-[#e9c176]/30 text-[#e9c176] text-xs font-inter flex items-center gap-1"
                  >
                    {copiedEmbedId === selectedProject.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="w-3.5 h-3.5" /> Copiar HTML
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-[#d1c5b4] overflow-x-auto p-2 bg-[#13171f] rounded">
                  {`<a href="${selectedProject.liveUrl}" target="_blank">\n  <img src="${selectedProject.imageUrl}" alt="${selectedProject.title}" />\n</a>`}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c232f] border border-white/10 text-[#d1c5b4] hover:text-white font-inter text-xs font-bold uppercase"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00f2ff] text-[#0a0a0a] font-inter text-xs font-bold uppercase tracking-wider hover:bg-[#74f5ff] shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all"
                >
                  <span>Abrir Aplicação</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD NEW PROJECT MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-[#0d1117] border border-[#004d4d] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 text-[#d1c5b4] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#e9c176]" />
                <h3 className="font-cinzel text-lg font-bold gold-gradient-text uppercase">
                  Forjar Novo Projeto no Portfólio
                </h3>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4 text-xs font-inter">
                <div>
                  <label className="block text-[#d1c5b4] mb-1 font-medium">Título do Projeto:</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Arcanum Hub — Plataforma de IA"
                    className="w-full bg-[#0a0a0a] border border-[#004d4d] rounded-lg p-2.5 text-xs text-[#e5e2e1]"
                  />
                </div>

                <div>
                  <label className="block text-[#d1c5b4] mb-1 font-medium">Subtítulo / Resumo Curto:</label>
                  <input
                    type="text"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    placeholder="Ex: Aplicação em Next.js com agentes generativos e som espacial"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-xs text-[#e5e2e1]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#d1c5b4] mb-1 font-medium">Categoria:</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-xs text-[#00f2ff]"
                    >
                      <option value="web">Web Architecture</option>
                      <option value="ai">IA & Automação</option>
                      <option value="storytelling">Storytelling Digital</option>
                      <option value="fullstack">Fullstack</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#d1c5b4] mb-1 font-medium">Raridade:</label>
                    <select
                      value={newRarity}
                      onChange={(e) => setNewRarity(e.target.value as RarityLevel)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-xs text-[#e9c176]"
                    >
                      <option value="Legendary">Lendário (Dourado)</option>
                      <option value="Epic">Épico (Ciano)</option>
                      <option value="Rare">Raro (Teal)</option>
                    </select>
                  </div>
                </div>

                {/* Associate Image from HTML / URL / File */}
                <div className="p-3.5 rounded-xl bg-[#13171f] border border-[#004d4d]/60 space-y-2.5">
                  <label className="block text-[#00f2ff] font-bold tracking-wider uppercase">
                    Associar Imagem do Projeto (via HTML ou Upload):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHtmlInput}
                      onChange={(e) => setNewHtmlInput(e.target.value)}
                      placeholder='Ex: <img src="https://..." /> ou URL direta'
                      className="flex-1 bg-[#0a0a0a] border border-[#004d4d] rounded-lg px-3 py-2 text-xs text-[#00f2ff]"
                    />
                    <button
                      type="button"
                      onClick={handleParseHtmlForImage}
                      className="px-3 py-2 rounded-lg bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/50 font-bold"
                    >
                      Associar
                    </button>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-[#d1c5b4] hover:text-[#e9c176]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Ou Enviar Arquivo .PNG/.JPG</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {newImageUrl && (
                      <span className="text-emerald-400 text-[11px] truncate flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Imagem vinculada!
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[#d1c5b4] mb-1 font-medium">Link de Destino / URL Clicável:</label>
                  <input
                    type="url"
                    value={newLiveUrl}
                    onChange={(e) => setNewLiveUrl(e.target.value)}
                    placeholder="https://meuprojeto.dev"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-xs text-[#e5e2e1]"
                  />
                </div>

                <div>
                  <label className="block text-[#d1c5b4] mb-1 font-medium">Tags / Tecnologias (separadas por vírgula):</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="React, TypeScript, Gemini AI, Tailwind"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-xs text-[#e5e2e1]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-[#1c232f] text-[#d1c5b4] hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-[#e9c176] text-[#0a0a0a] font-bold uppercase tracking-wider hover:bg-[#ffdea5] shadow-[0_0_15px_rgba(233,193,118,0.3)]"
                  >
                    Adicionar ao Grimório
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

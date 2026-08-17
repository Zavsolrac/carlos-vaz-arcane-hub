import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ProjectItem, ProjectCategory, RarityLevel } from '../types';
import { CANONICAL_PORTFOLIO_URL } from '../data/defaultData';
import { soundFx } from '../utils/sound';
import { buildProjectClickableHtml, sanitizeProjectDestination } from '../lib/projectEmbed';
import { acceptLocalImageFile, extractImageSrcInBrowser } from '../lib/imageInput';
import { sanitizeImageSrc } from '../lib/urls';
import { Modal, useModalTitleId } from './Modal';
import {
  Sparkles,
  ExternalLink,
  Github,
  Plus,
  Image as ImageIcon,
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

function ProjectPreviewImage({ imageUrl, title }: { imageUrl: string; title: string }) {
  const safeSrc = sanitizeImageSrc(imageUrl);
  if (!safeSrc) {
    return (
      <div
        className="w-full h-full bg-gradient-to-br from-[#0a0a0a] via-[#13171f] to-[#004d4d]/40 flex items-center justify-center"
        aria-hidden="true"
      >
        <ImageIcon className="w-10 h-10 text-[#00f2ff]/40" />
      </div>
    );
  }
  return <img src={safeSrc} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />;
}

export const ProjectsShowcase: React.FC<ProjectsProps> = ({ projects, onAddProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedEmbedId, setCopiedEmbedId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const detailsTitleId = useModalTitleId('project-details');
  const detailsDescId = useModalTitleId('project-details-desc');
  const addTitleId = useModalTitleId('project-add');
  const addDescId = useModalTitleId('project-add-desc');

  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<'web' | 'ai' | 'storytelling' | 'fullstack'>('web');
  const [newRarity, setNewRarity] = useState<RarityLevel>('Epic');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newHtmlInput, setNewHtmlInput] = useState('');
  const [newLiveUrl, setNewLiveUrl] = useState('');
  const [newTags, setNewTags] = useState('');

  const filteredProjects = projects.filter((p) => selectedCategory === 'all' || p.category === selectedCategory);

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
    setImageError(null);
    if (!newHtmlInput.trim()) return;
    const src = extractImageSrcInBrowser(newHtmlInput);
    if (!src) {
      setImageError('Imagem inválida. Use http/https ou PNG/JPEG/WebP local.');
      return;
    }
    setNewImageUrl(src);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    const result = await acceptLocalImageFile(file);
    if (!result.ok) {
      setImageError(result.error);
      return;
    }
    soundFx.playArcaneChime(700, 0.2);
    setNewImageUrl(result.dataUrl);
  };

  const handleCreateProject = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    if (!newTitle.trim()) return;

    const trimmedLiveUrl = newLiveUrl.trim();
    let liveUrl = CANONICAL_PORTFOLIO_URL;
    if (trimmedLiveUrl) {
      const safeLive = sanitizeProjectDestination(trimmedLiveUrl);
      if (!safeLive) {
        setFormError('URL de destino inválida. Use http ou https sem credenciais.');
        return;
      }
      liveUrl = safeLive;
    }

    if (newImageUrl.trim() && !sanitizeImageSrc(newImageUrl)) {
      setFormError('Imagem inválida. Use http/https ou um PNG/JPEG/WebP local.');
      return;
    }

    soundFx.playCastSpell();
    const created: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Prévia local',
      description: newDescription.trim() || 'Sem descrição informada.',
      category: newCategory,
      rarity: newRarity,
      imageUrl: newImageUrl.trim(),
      liveUrl,
      tags: newTags ? newTags.split(',').map((tag) => tag.trim()).filter(Boolean) : ['Prévia local'],
    };

    onAddProject(created);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewDescription('');
    setNewImageUrl('');
    setNewHtmlInput('');
    setNewLiveUrl('');
    setNewTags('');
    setImageError(null);
  };

  const copyProjectEmbed = async (project: ProjectItem) => {
    const result = buildProjectClickableHtml({
      liveUrl: project.liveUrl,
      imageUrl: project.imageUrl,
      title: project.title,
      subtitle: project.subtitle,
    });
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    await navigator.clipboard.writeText(result.html);
    soundFx.playArcaneChime(700, 0.2);
    setCopiedEmbedId(project.id);
    window.setTimeout(() => setCopiedEmbedId(null), 2000);
  };

  const renderEmbedPreview = (project: ProjectItem) => {
    const result = buildProjectClickableHtml({
      liveUrl: project.liveUrl,
      imageUrl: project.imageUrl,
      title: project.title,
      subtitle: project.subtitle,
    });
    return result.ok ? result.html : result.error;
  };

  const safeLiveHref = (url: string) => sanitizeProjectDestination(url);

  return (
    <section id="projetos" className="w-full max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff] text-xs font-inter font-bold tracking-widest uppercase mb-2">
            <Layers className="w-3.5 h-3.5" /> Prévia local de projectos
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold gold-gradient-text tracking-wider uppercase">
            Pré-visualizar Projectos
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            soundFx.playArcaneChime(600, 0.2);
            setFormError(null);
            setImageError(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c232f] border border-[#e9c176]/50 text-[#e9c176] font-inter text-xs font-bold uppercase tracking-wider hover:bg-[#283344] hover:border-[#00f2ff] hover:text-[#00f2ff] transition-all shadow-[0_0_20px_rgba(233,193,118,0.15)]"
        >
          <Plus className="w-4 h-4" /> Adicionar à Prévia Local
        </button>
      </div>

      <p className="font-lora text-sm text-[#d1c5b4]/80 mb-6 max-w-3xl">
        Apenas pré-visualização local: não publica no portfólio canónico e desaparece ao recarregar.
      </p>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {[
          { id: 'all', label: 'Todos' },
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

      {filteredProjects.length === 0 && (
        <p className="font-lora text-sm text-[#d1c5b4]/80 mb-6">
          Nenhum projecto inventado é publicado aqui. O catálogo verificado vive no{' '}
          <a href={CANONICAL_PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="text-[#00f2ff]">
            portfólio canónico
          </a>
          .
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, idx) => {
          const liveHref = safeLiveHref(project.liveUrl);
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group relative rounded-2xl bg-[#13171f] border border-[#004d4d]/50 hover:border-[#00f2ff]/70 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,242,255,0.15)] hover:-translate-y-1"
            >
              <div className="relative h-48 w-full overflow-hidden bg-[#0a0a0a]">
                <ProjectPreviewImage imageUrl={project.imageUrl} title={project.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13171f] via-[#13171f]/30 to-transparent" />
                <div className="absolute top-3 left-3 z-10">{getRarityBadge(project.rarity)}</div>
                <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-inter text-[#d1c5b4] uppercase tracking-wider">
                  {project.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-3">
                <div>
                  <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#e5e2e1] group-hover:text-[#00f2ff] transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="font-lora text-xs text-[#d1c5b4]/80 mt-1 line-clamp-2">{project.subtitle}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-[#0a0a0a] border border-[#004d4d]/60 text-[10px] font-mono text-[#00f2ff]">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  {liveHref ? (
                    <a
                      href={liveHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20 border border-[#00f2ff]/40 text-[#00f2ff] font-inter text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Acessar
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="flex-1 text-center text-xs text-rose-300">URL inválida</span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playHoverWhisper();
                      setSelectedProject(project);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-2 rounded-lg bg-[#1c232f] hover:bg-[#252f3f] border border-[#e9c176]/30 text-[#e9c176] text-xs font-inter font-semibold transition-all"
                  >
                    Detalhes
                  </button>
                  <button
                    type="button"
                    onClick={() => copyProjectEmbed(project)}
                    aria-label={`Copiar HTML seguro de ${project.title}`}
                    className="p-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-[#d1c5b4] hover:text-[#00f2ff] transition-all"
                  >
                    {copiedEmbedId === project.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Code2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Modal open={isModalOpen && Boolean(selectedProject)} titleId={detailsTitleId} descriptionId={detailsDescId} onClose={() => setIsModalOpen(false)} className="relative w-full max-w-2xl bg-[#0d1117] border border-[#004d4d] rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {selectedProject && (
          <>
            <button type="button" onClick={() => setIsModalOpen(false)} aria-label="Fechar detalhes do projecto" className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 text-[#d1c5b4] hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              {getRarityBadge(selectedProject.rarity)}
              <span className="text-xs font-inter text-[#00f2ff] uppercase tracking-wider">{selectedProject.category}</span>
            </div>
            <div>
              <h3 id={detailsTitleId} className="font-cinzel text-xl sm:text-2xl font-bold gold-gradient-text">
                {selectedProject.title}
              </h3>
              <p id={detailsDescId} className="font-lora text-sm text-[#d1c5b4]/90 italic mt-1">
                {selectedProject.subtitle}
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-[#004d4d]/60 max-h-64">
              <ProjectPreviewImage imageUrl={selectedProject.imageUrl} title={selectedProject.title} />
            </div>
            <p className="font-lora text-sm text-[#e5e2e1]/90 leading-relaxed">{selectedProject.description}</p>
            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#004d4d]/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-inter text-[#00f2ff] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" /> HTML clicável seguro
                </span>
                <button type="button" onClick={() => copyProjectEmbed(selectedProject)} className="px-2.5 py-1 rounded bg-[#1c232f] border border-[#e9c176]/30 text-[#e9c176] text-xs font-inter flex items-center gap-1">
                  {copiedEmbedId === selectedProject.id ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado!</> : <>Copiar HTML</>}
                </button>
              </div>
              <pre className="text-[11px] font-mono text-[#d1c5b4] overflow-x-auto p-2 bg-[#13171f] rounded whitespace-pre-wrap">
                {renderEmbedPreview(selectedProject)}
              </pre>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              {selectedProject.githubUrl && sanitizeProjectDestination(selectedProject.githubUrl) && (
                <a href={sanitizeProjectDestination(selectedProject.githubUrl)!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c232f] border border-white/10 text-[#d1c5b4] hover:text-white font-inter text-xs font-bold uppercase">
                  <Github className="w-4 h-4" /> GitHub
                </a>
              )}
              {safeLiveHref(selectedProject.liveUrl) && (
                <a href={safeLiveHref(selectedProject.liveUrl)!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00f2ff] text-[#0a0a0a] font-inter text-xs font-bold uppercase tracking-wider hover:bg-[#74f5ff] shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all">
                  Abrir destino
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </>
        )}
      </Modal>

      <Modal open={isAddModalOpen} titleId={addTitleId} descriptionId={addDescId} onClose={() => setIsAddModalOpen(false)} className="relative w-full max-w-xl bg-[#0d1117] border border-[#004d4d] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <button type="button" onClick={() => setIsAddModalOpen(false)} aria-label="Fechar formulário de prévia local" className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 text-[#d1c5b4] hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#e9c176]" />
          <h3 id={addTitleId} className="font-cinzel text-lg font-bold gold-gradient-text uppercase">
            Pré-visualizar Projecto
          </h3>
        </div>
        <p id={addDescId} className="text-xs font-lora text-[#d1c5b4]/80">
          Só no browser local. Não publica no portfólio canónico e desaparece ao recarregar.
        </p>
        <form onSubmit={handleCreateProject} className="space-y-4 text-xs font-inter">
          <label className="block text-[#d1c5b4] mb-1 font-medium">Título do projecto</label>
          <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-[#0a0a0a] border border-[#004d4d] rounded-lg p-2.5 text-xs text-[#e5e2e1]" />

          <label className="block text-[#d1c5b4] mb-1 font-medium">Subtítulo</label>
          <input type="text" value={newSubtitle} onChange={(e) => setNewSubtitle(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-xs text-[#e5e2e1]" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#d1c5b4] mb-1 font-medium">Categoria</label>
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as typeof newCategory)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-xs text-[#00f2ff]">
                <option value="web">Web Architecture</option>
                <option value="ai">IA & Automação</option>
                <option value="storytelling">Storytelling Digital</option>
                <option value="fullstack">Fullstack</option>
              </select>
            </div>
            <div>
              <label className="block text-[#d1c5b4] mb-1 font-medium">Raridade</label>
              <select value={newRarity} onChange={(e) => setNewRarity(e.target.value as RarityLevel)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-xs text-[#e9c176]">
                <option value="Legendary">Lendário</option>
                <option value="Epic">Épico</option>
                <option value="Rare">Raro</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#13171f] border border-[#004d4d]/60 space-y-2.5">
            <label className="block text-[#00f2ff] font-bold tracking-wider uppercase">Imagem (opcional)</label>
            <div className="flex gap-2">
              <input type="text" value={newHtmlInput} onChange={(e) => setNewHtmlInput(e.target.value)} placeholder='URL https://… ou <img src="https://…">' className="flex-1 bg-[#0a0a0a] border border-[#004d4d] rounded-lg px-3 py-2 text-xs text-[#00f2ff]" />
              <button type="button" onClick={handleParseHtmlForImage} className="px-3 py-2 rounded-lg bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/50 font-bold">
                Associar
              </button>
            </div>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-white/10 text-[#d1c5b4] hover:text-[#e9c176]">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PNG/JPEG/WebP (máx. 10 MiB)</span>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileUpload} className="hidden" />
            </label>
            {newImageUrl && (
              <span className="text-emerald-400 text-[11px] truncate flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Imagem vinculada
              </span>
            )}
            {imageError && <p className="text-rose-300 text-[11px]">{imageError}</p>}
          </div>

          <label className="block text-[#d1c5b4] mb-1 font-medium">URL de destino (opcional)</label>
          <input type="url" value={newLiveUrl} onChange={(e) => setNewLiveUrl(e.target.value)} placeholder="https://…" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-xs text-[#e5e2e1]" />
          <p className="text-[11px] text-[#d1c5b4]/70">Em branco usa o portfólio canónico apenas como destino da prévia local.</p>

          <label className="block text-[#d1c5b4] mb-1 font-medium">Tags (separadas por vírgula)</label>
          <input type="text" value={newTags} onChange={(e) => setNewTags(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-xs text-[#e5e2e1]" />

          {formError && <p className="text-rose-300 text-xs">{formError}</p>}

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-lg bg-[#1c232f] text-[#d1c5b4] hover:text-white">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-lg bg-[#e9c176] text-[#0a0a0a] font-bold uppercase tracking-wider hover:bg-[#ffdea5] shadow-[0_0_15px_rgba(233,193,118,0.3)]">
              Adicionar à Prévia Local
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
};

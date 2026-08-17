import html2canvas from 'html2canvas';
import {
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  Image as ImageIcon,
  Info,
  Link2,
  RefreshCw,
  Sliders,
  Sparkles,
  Upload,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { ArcaneEyeMedallion } from './ArcaneEyeMedallion';
import type { PngCardConfig } from '../types';
import { CANONICAL_PORTFOLIO_URL } from '../data/defaultData';
import { buildClickableHtml, buildClickableMarkdown, buildIframeSnippet } from '../lib/embed';
import {
  assertExportSize,
  EXPORT_PRESETS,
  getPreviewScale,
  PREVIEW_WIDTH,
  type ExportFormat,
} from '../lib/exportPresets';
import { readPngSize } from '../lib/png';
import { generateQrDataUrl } from '../lib/qr';
import { sanitizeHttpUrl } from '../lib/urls';
import { soundFx } from '../utils/sound';

interface ClickablePngStudioProps {
  initialConfig: PngCardConfig;
}

export function ClickablePngStudio({ initialConfig }: ClickablePngStudioProps) {
  const [config, setConfig] = useState<PngCardConfig>(initialConfig);
  const [htmlInput, setHtmlInput] = useState('');
  const [associatedImageUrl, setAssociatedImageUrl] = useState('');
  const [copiedCodeType, setCopiedCodeType] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [activeEmbedType, setActiveEmbedType] = useState<'standard' | 'markdown' | 'iframe'>('standard');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const exportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const format = config.aspectRatio;
  const { width, height } = EXPORT_PRESETS[format];
  const scale = getPreviewScale(format);
  const filename = `carlos-vaz-arcane-card-${format}.png`;
  const safeTarget = sanitizeHttpUrl(config.targetUrl);

  useEffect(() => {
    let mounted = true;
    if (!config.showQrCode || !safeTarget) {
      setQrCodeDataUrl('');
      return;
    }
    generateQrDataUrl(safeTarget)
      .then((url) => {
        if (mounted) setQrCodeDataUrl(url);
      })
      .catch(() => {
        if (mounted) setQrCodeDataUrl('');
      });
    return () => {
      mounted = false;
    };
  }, [config.showQrCode, safeTarget]);

  const handleParseHtmlImage = () => {
    if (!htmlInput.trim()) return;
    soundFx.playArcaneChime(600, 0.2);
    if (htmlInput.startsWith('http://') || htmlInput.startsWith('https://')) {
      const url = sanitizeHttpUrl(htmlInput);
      if (!url) return;
      setAssociatedImageUrl(url);
      setConfig((prev) => ({ ...prev, bgImageUrl: url }));
      return;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput, 'text/html');
    const src = doc.querySelector('img')?.getAttribute('src') ?? htmlInput.match(/src=["'](.*?)["']/)?.[1];
    if (!src) return;
    if (src.startsWith('data:image/png') || src.startsWith('data:image/jpeg') || src.startsWith('data:image/webp')) {
      setAssociatedImageUrl(src);
      setConfig((prev) => ({ ...prev, bgImageUrl: src }));
      return;
    }
    const url = sanitizeHttpUrl(src);
    if (!url) return;
    setAssociatedImageUrl(url);
    setConfig((prev) => ({ ...prev, bgImageUrl: url }));
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return;
    soundFx.playArcaneChime(700, 0.2);
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result;
      if (typeof dataUrl !== 'string') return;
      setAssociatedImageUrl(dataUrl);
      setConfig((prev) => ({ ...prev, bgImageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadPng = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    setExportError(null);
    soundFx.playCastSpell();
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise((resolve) => window.setTimeout(resolve, 120));
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 1,
        width,
        height,
        windowWidth: width,
        windowHeight: height,
        useCORS: true,
        logging: false,
      });
      assertExportSize(canvas.width, canvas.height, format);
      const pngData = canvas.toDataURL('image/png');
      const pngSize = readPngSize(pngData);
      assertExportSize(pngSize.width, pngSize.height, format);
      const link = document.createElement('a');
      link.href = pngData;
      link.download = `carlos-vaz-arcane-hub-${format === 'story' ? '9x16-story' : '1x1-square'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Falha ao exportar PNG.');
    } finally {
      setIsExporting(false);
    }
  };

  const htmlCode = useMemo(
    () =>
      buildClickableHtml({
        targetUrl: config.targetUrl,
        imageSrc: associatedImageUrl.startsWith('http') ? associatedImageUrl : '',
        fallbackFilename: filename,
        alt: `${config.name} — ${config.title}`,
      }),
    [associatedImageUrl, config.name, config.targetUrl, config.title, filename],
  );

  const markdownCode = useMemo(
    () =>
      buildClickableMarkdown({
        targetUrl: config.targetUrl,
        imageSrc: associatedImageUrl.startsWith('http') ? associatedImageUrl : '',
        fallbackFilename: filename,
        alt: `${config.name} — ${config.title}`,
      }),
    [associatedImageUrl, config.name, config.targetUrl, config.title, filename],
  );

  const iframeCode = useMemo(
    () => buildIframeSnippet(typeof window === 'undefined' ? '' : window.location.origin, `${config.name} — ${config.title}`),
    [config.name, config.title],
  );

  const handleCopyCode = async (code: string | null, type: string) => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    soundFx.playArcaneChime(800, 0.15);
    setCopiedCodeType(type);
    window.setTimeout(() => setCopiedCodeType(null), 2500);
  };

  return (
    <section id="gerador-png" className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e9c176]/10 border border-[#e9c176]/30 text-[#e9c176] text-xs font-inter font-bold tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#00f2ff]" />
          Ateliê de Social Assets & Gerador de Links Clicáveis
        </div>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold gold-gradient-text tracking-wider uppercase mb-2">
          Social Assets & Cartões Interativos
        </h2>
        <p className="font-lora text-sm sm:text-base text-[#d1c5b4]/80 max-w-2xl mx-auto">
          Gere cartões em formato <span className="text-[#00f2ff]">9:16 (Story)</span> e <span className="text-[#e9c176]">1:1 (Feed)</span>,
          baixe como PNG estático ou copie HTML/Markdown clicável.
        </p>
      </div>

      <div className="mb-8 p-4 rounded-xl bg-[#13171f] border border-[#00f2ff]/30 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs font-inter text-[#d1c5b4]">
        <div className="p-2 rounded-lg bg-[#00f2ff]/10 text-[#00f2ff] shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="font-bold text-[#e5e2e1] uppercase tracking-wider block">Dois entregáveis independentes</span>
          <p className="text-[#d1c5b4]/80 leading-relaxed font-lora">
            <strong className="text-[#e9c176]">PNG estático:</strong> 1080×1920 ou 1080×1080. Não contém hyperlink.
            <br />
            <strong className="text-[#00f2ff]">HTML & Markdown:</strong> o clique vive no wrapper, não no ficheiro PNG.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#13171f] rounded-xl p-5 border border-[#004d4d]/50 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Sliders className="w-5 h-5 text-[#e9c176]" />
              <h3 className="font-cinzel text-base font-semibold">1. Formato & URL de destino</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['story', 'square'] as ExportFormat[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setConfig({ ...config, aspectRatio: item })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold uppercase ${
                    format === item
                      ? 'bg-[#00f2ff]/20 border border-[#00f2ff] text-[#00f2ff]'
                      : 'bg-[#0a0a0a] border border-white/10 text-[#d1c5b4]'
                  }`}
                >
                  {item === 'story' ? 'Status / Story (9:16)' : 'Feed / Avatar (1:1)'}
                </button>
              ))}
            </div>
            <label className="block text-xs">
              <span className="block text-[#d1c5b4] font-medium mb-1 uppercase tracking-wider">URL http/https</span>
              <input
                type="url"
                value={config.targetUrl}
                onChange={(event) => setConfig({ ...config, targetUrl: event.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#004d4d]/60 rounded-lg px-3 py-2.5 text-xs text-[#00f2ff] font-mono"
              />
            </label>
            {!safeTarget && <p className="text-xs text-rose-300">URL inválida. Apenas http ou https.</p>}
            <label className="flex items-center gap-2.5 text-[#d1c5b4] text-xs">
              <input
                type="checkbox"
                checked={config.showQrCode}
                onChange={(event) => setConfig({ ...config, showQrCode: event.target.checked })}
              />
              QR real no PNG
            </label>
            <button
              type="button"
              onClick={() => setConfig({ ...config, targetUrl: CANONICAL_PORTFOLIO_URL })}
              className="px-2.5 py-1 rounded bg-[#0a0a0a] border border-white/10 text-[11px] text-[#d1c5b4]"
            >
              Portfólio canónico
            </button>
          </div>

          <div className="bg-[#13171f] rounded-xl p-5 border border-[#004d4d]/50 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Link2 className="w-5 h-5 text-[#00f2ff]" />
              <h3 className="font-cinzel text-base font-semibold">2. Identidade visual & textos</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label>
                <span className="block text-[#d1c5b4] mb-1">Nome</span>
                <input value={config.name} onChange={(event) => setConfig({ ...config, name: event.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2" />
              </label>
              <label>
                <span className="block text-[#d1c5b4] mb-1">Marca</span>
                <input value={config.title} onChange={(event) => setConfig({ ...config, title: event.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2" />
              </label>
            </div>
            <label className="block text-xs">
              <span className="block text-[#d1c5b4] mb-1">Função</span>
              <input value={config.tagline} onChange={(event) => setConfig({ ...config, tagline: event.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-[#00f2ff]" />
            </label>
            <label className="block text-xs">
              <span className="block text-[#d1c5b4] mb-1">CTA</span>
              <input value={config.ctaText} onChange={(event) => setConfig({ ...config, ctaText: event.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-[#e9c176]" />
            </label>
          </div>

          <div className="bg-[#13171f] rounded-xl p-5 border border-[#004d4d]/50 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <ImageIcon className="w-5 h-5 text-[#00f2ff]" />
              <h3 className="font-cinzel text-base font-semibold">3. Imagem de fundo (local)</h3>
            </div>
            <p className="text-xs font-lora text-[#d1c5b4]/80">Upload PNG/JPEG/WebP. O ficheiro não sai do browser.</p>
            <textarea
              rows={2}
              value={htmlInput}
              onChange={(event) => setHtmlInput(event.target.value)}
              placeholder='URL https://… ou <img src="https://…">'
              className="w-full bg-[#0a0a0a] border border-[#004d4d]/60 rounded-lg p-3 text-xs font-mono text-[#00f2ff]"
            />
            <div className="flex flex-wrap gap-2.5">
              <button type="button" onClick={handleParseHtmlImage} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#00f2ff]/15 border border-[#00f2ff]/40 text-[#00f2ff] text-xs font-bold uppercase">
                <Code2 className="w-4 h-4" /> Associar URL
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/png,image/jpeg,image/webp" className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1c232f] border border-[#e9c176]/40 text-[#e9c176] text-xs font-bold uppercase">
                <Upload className="w-4 h-4" /> Upload local
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="font-cinzel text-xs text-[#e9c176] tracking-wider uppercase font-semibold">
              Preview {EXPORT_PRESETS[format].ratioLabel} · exportação {width}×{height}
            </span>
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#e9c176] text-[#131313] font-inter font-bold text-xs uppercase disabled:opacity-50"
            >
              {isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              Baixar PNG
            </button>
          </div>
          {exportError && <p className="w-full mb-3 text-xs text-rose-300">{exportError}</p>}
          <div className="relative rounded-2xl p-2 bg-gradient-to-b from-[#00f2ff]/20 via-transparent to-[#e9c176]/20" style={{ width: PREVIEW_WIDTH + 16 }}>
            <div className="overflow-hidden rounded-xl" style={{ width: PREVIEW_WIDTH, height: height * scale }}>
              <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                <StudioCard config={config} qrCodeDataUrl={qrCodeDataUrl} width={width} height={height} />
              </div>
            </div>
          </div>
          <div aria-hidden="true" style={{ position: 'fixed', left: -20000, top: 0, width, height, pointerEvents: 'none' }}>
            <div ref={exportRef} id="arcane-export-root" data-export-format={format} style={{ width, height }}>
              <StudioCard config={config} qrCodeDataUrl={qrCodeDataUrl} width={width} height={height} />
            </div>
          </div>

          <div className="w-full mt-8 bg-[#13171f] rounded-xl p-4 border border-[#004d4d]/50 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#00f2ff]" />
                <span className="font-cinzel text-xs font-semibold uppercase">Wrapper clicável</span>
              </div>
              <div className="flex gap-1">
                {(['standard', 'markdown', 'iframe'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveEmbedType(type)}
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      activeEmbedType === type ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/50' : 'text-[#d1c5b4]/70'
                    }`}
                  >
                    {type === 'standard' ? 'HTML Link' : type === 'markdown' ? 'Markdown' : 'iFrame'}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <pre className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg p-3 text-[11px] font-mono text-[#00f2ff] overflow-x-auto whitespace-pre-wrap max-h-36">
                {(activeEmbedType === 'standard' ? htmlCode : activeEmbedType === 'markdown' ? markdownCode : iframeCode) ?? 'URL inválida.'}
              </pre>
              <button
                type="button"
                onClick={() =>
                  handleCopyCode(
                    activeEmbedType === 'standard' ? htmlCode : activeEmbedType === 'markdown' ? markdownCode : iframeCode,
                    activeEmbedType,
                  )
                }
                className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#1c232f] border border-[#e9c176]/40 text-[#e9c176] text-[10px] font-bold uppercase"
              >
                {copiedCodeType === activeEmbedType ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
              </button>
            </div>
            <p className="text-[11px] font-lora text-[#d1c5b4]/70">
              {activeEmbedType === 'standard' && 'O PNG não contém hyperlink. Este HTML envolve a imagem com um link seguro.'}
              {activeEmbedType === 'markdown' && 'Markdown para README ou Notion. O clique é do Markdown, não do PNG.'}
              {activeEmbedType === 'iframe' && 'Incorpora este hub. Origem limitada a http/https da página actual.'}
            </p>
            {safeTarget && (
              <a href={safeTarget} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] text-[#00f2ff]">
                Testar destino <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StudioCard({
  config,
  qrCodeDataUrl,
  width,
  height,
}: {
  config: PngCardConfig;
  qrCodeDataUrl: string;
  width: number;
  height: number;
}) {
  const isStory = height > width;
  return (
    <div
      style={{
        width,
        height,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
        padding: isStory ? '96px 88px 80px' : '72px 80px 64px',
        color: '#e5e2e1',
        backgroundColor: '#0d1117',
        backgroundImage: config.bgImageUrl
          ? `linear-gradient(to bottom, rgba(10,10,10,0.88), rgba(13,17,23,0.96)), url(${config.bgImageUrl})`
          : 'radial-gradient(circle at 50% 15%, rgba(0, 242, 255, 0.08) 0%, rgba(13, 17, 23, 1) 75%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid rgba(0,77,77,0.8)',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          padding: '8px 18px',
          borderRadius: 999,
          background: 'rgba(233,193,118,0.10)',
          border: '1px solid rgba(233,193,118,0.35)',
          color: '#e9c176',
          fontFamily: 'Inter, sans-serif',
          fontSize: isStory ? 18 : 16,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        {config.badgeText || 'PORTFÓLIO OFICIAL'}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isStory ? 24 : 16 }}>
        <ArcaneEyeMedallion size={isStory ? 220 : 156} />
        <h3 className="font-ringbearer gold-gradient-text" style={{ margin: 0, fontSize: isStory ? 72 : 56, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {config.name}
        </h3>
        <p className="font-cinzel" style={{ margin: 0, fontSize: isStory ? 26 : 20, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d1c5b4' }}>
          {config.title}
        </p>
        <p
          style={{
            margin: 0,
            padding: '10px 18px',
            borderRadius: 999,
            background: 'rgba(0,242,255,0.10)',
            border: '1px solid rgba(0,242,255,0.32)',
            color: '#00f2ff',
            fontFamily: 'Inter, sans-serif',
            fontSize: isStory ? 20 : 16,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            maxWidth: 780,
          }}
        >
          {config.tagline}
        </p>
        {isStory && (
          <p className="font-lora" style={{ margin: 0, fontSize: 28, fontStyle: 'italic', maxWidth: 760 }}>
            “{config.description}”
          </p>
        )}
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: '100%',
            padding: isStory ? '22px 28px' : '18px 24px',
            borderRadius: 16,
            background: 'linear-gradient(90deg, rgba(0,242,255,0.18), rgba(0,242,255,0.28), rgba(0,242,255,0.18))',
            border: '1px solid rgba(0,242,255,0.6)',
            color: '#ddfcff',
            fontFamily: 'Inter, sans-serif',
            fontSize: isStory ? 22 : 18,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          {config.ctaText}
        </div>
        {config.showQrCode && qrCodeDataUrl && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img
              src={qrCodeDataUrl}
              alt=""
              width={isStory ? 220 : 148}
              height={isStory ? 220 : 148}
              style={{ width: isStory ? 220 : 148, height: isStory ? 220 : 148, background: '#f4fffe', padding: 8, borderRadius: 12 }}
            />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(209,197,180,0.75)' }}>
              Escaneie o QR
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

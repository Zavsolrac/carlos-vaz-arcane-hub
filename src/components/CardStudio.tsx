import html2canvas from 'html2canvas';
import {
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  Image as ImageIcon,
  Link2,
  RefreshCw,
  Sparkles,
  Upload,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import type { CardConfig } from '../data/profile';
import { PROFILE } from '../data/profile';
import { buildClickableHtml, buildClickableMarkdown } from '../lib/embed';
import {
  assertExportSize,
  cardFilename,
  EXPORT_PRESETS,
  getPreviewScale,
  PREVIEW_WIDTH,
  type ExportFormat,
} from '../lib/exportPresets';
import { readPngSize } from '../lib/png';
import { generateQrDataUrl } from '../lib/qr';
import { sanitizeHttpUrl } from '../lib/urls';
import { soundFx } from '../utils/sound';
import { CardFace } from './CardFace';

interface CardStudioProps {
  initialConfig: CardConfig;
}

export function CardStudio({ initialConfig }: CardStudioProps) {
  const [config, setConfig] = useState<CardConfig>(initialConfig);
  const [htmlInput, setHtmlInput] = useState('');
  const [associatedImageUrl, setAssociatedImageUrl] = useState('');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [embedType, setEmbedType] = useState<'html' | 'markdown'>('html');
  const exportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const format = config.aspectRatio;
  const { width, height } = EXPORT_PRESETS[format];
  const scale = getPreviewScale(format);
  const filename = cardFilename(config.name, format);
  const safeTarget = sanitizeHttpUrl(config.targetUrl);

  useEffect(() => {
    let cancelled = false;
    if (!config.showQrCode || !safeTarget) {
      setQrDataUrl(null);
      return;
    }

    generateQrDataUrl(safeTarget)
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });

    return () => {
      cancelled = true;
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
    const img = doc.querySelector('img');
    const src = img?.getAttribute('src') ?? htmlInput.match(/src=["'](.*?)["']/)?.[1];
    if (!src) return;
    if (src.startsWith('data:image/')) {
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
      await new Promise((resolve) => window.setTimeout(resolve, 80));

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
      const dataUrl = canvas.toDataURL('image/png');
      const pngSize = readPngSize(dataUrl);
      assertExportSize(pngSize.width, pngSize.height, format);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
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

  const handleCopy = async (code: string | null, type: string) => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    soundFx.playArcaneChime(800, 0.15);
    setCopiedType(type);
    window.setTimeout(() => setCopiedType(null), 2500);
  };

  const update = (patch: Partial<CardConfig>) => setConfig((prev) => ({ ...prev, ...patch }));

  return (
    <section id="gerador" className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <p className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e9c176]/10 border border-[#e9c176]/30 text-[#e9c176] text-xs font-inter font-bold tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#00f2ff]" aria-hidden="true" /> Ateliê de cards
        </p>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold gold-gradient-text tracking-wider uppercase mb-2">
          Gerador PNG &amp; HTML
        </h2>
        <p className="font-lora text-sm sm:text-base text-[#d1c5b4]/80 max-w-2xl mx-auto">
          O PNG é uma imagem estática. O link vive no HTML ou Markdown que envolve essa imagem. O QR, quando ativo, aponta para a URL de destino e entra no PNG.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#13171f] rounded-xl p-5 border border-[#004d4d]/50 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <ImageIcon className="w-5 h-5 text-[#00f2ff]" aria-hidden="true" />
              <h3 className="font-cinzel text-base font-semibold">1. Imagem de fundo (opcional, local)</h3>
            </div>
            <p className="text-xs font-lora text-[#d1c5b4]/80">
              Upload PNG, JPEG ou WebP. O ficheiro não sai do browser.
            </p>
            <textarea
              rows={2}
              value={htmlInput}
              onChange={(event) => setHtmlInput(event.target.value)}
              placeholder='URL https://… ou <img src="https://…">'
              className="w-full bg-[#0a0a0a] border border-[#004d4d]/60 rounded-lg p-3 text-xs font-mono text-[#00f2ff] placeholder-[#d1c5b4]/40 focus:border-[#00f2ff] focus:outline-none"
            />
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleParseHtmlImage}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#00f2ff]/15 border border-[#00f2ff]/40 text-[#00f2ff] text-xs font-inter font-bold uppercase tracking-wider"
              >
                <Code2 className="w-4 h-4" aria-hidden="true" /> Associar URL
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1c232f] border border-[#e9c176]/40 text-[#e9c176] text-xs font-inter font-bold uppercase tracking-wider"
              >
                <Upload className="w-4 h-4" aria-hidden="true" /> Upload local
              </button>
            </div>
          </div>

          <div className="bg-[#13171f] rounded-xl p-5 border border-[#004d4d]/50 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Link2 className="w-5 h-5 text-[#e9c176]" aria-hidden="true" />
              <h3 className="font-cinzel text-base font-semibold">2. Destino e identidade</h3>
            </div>
            <label className="block text-xs font-inter">
              <span className="block text-[#d1c5b4] font-medium mb-1 tracking-wider uppercase">URL de destino (http/https)</span>
              <input
                type="url"
                value={config.targetUrl}
                onChange={(event) => update({ targetUrl: event.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#004d4d]/60 rounded-lg px-3 py-2.5 text-xs text-[#e5e2e1] focus:border-[#00f2ff] focus:outline-none"
              />
            </label>
            {!safeTarget && (
              <p className="text-xs text-rose-300">URL inválida. Apenas http ou https. HTML/Markdown e QR ficam desativados até corrigir.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label>
                <span className="block text-[#d1c5b4] mb-1">Nome</span>
                <input value={config.name} onChange={(event) => update({ name: event.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-[#e5e2e1]" />
              </label>
              <label>
                <span className="block text-[#d1c5b4] mb-1">Marca</span>
                <input value={config.title} onChange={(event) => update({ title: event.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-[#e5e2e1]" />
              </label>
            </div>
            <label className="block text-xs">
              <span className="block text-[#d1c5b4] mb-1">Função</span>
              <input value={config.tagline} onChange={(event) => update({ tagline: event.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-[#00f2ff]" />
            </label>
            <label className="block text-xs">
              <span className="block text-[#d1c5b4] mb-1">CTA</span>
              <input value={config.ctaText} onChange={(event) => update({ ctaText: event.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-[#e9c176]" />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#d1c5b4]">Formato</span>
                {(['story', 'square'] as ExportFormat[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => update({ aspectRatio: item })}
                    className={`px-3 py-1 rounded text-[11px] font-bold uppercase ${
                      format === item
                        ? 'bg-[#00f2ff]/20 border border-[#00f2ff] text-[#00f2ff]'
                        : 'bg-[#0a0a0a] border border-white/10 text-[#d1c5b4]'
                    }`}
                  >
                    {item === 'story' ? 'Story 1080×1920' : 'Quadrado 1080×1080'}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-[#d1c5b4]">
                <input
                  type="checkbox"
                  checked={config.showQrCode}
                  onChange={(event) => update({ showQrCode: event.target.checked })}
                  className="rounded border-white/20 bg-[#0a0a0a]"
                />
                QR real no PNG
              </label>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => update({ targetUrl: PROFILE.portfolioUrl })}
                className="px-2.5 py-1 rounded bg-[#0a0a0a] border border-white/10 text-[#d1c5b4] hover:text-[#00f2ff]"
              >
                Portfólio canónico
              </button>
              <button
                type="button"
                onClick={() => update({ targetUrl: PROFILE.githubUrl })}
                className="px-2.5 py-1 rounded bg-[#0a0a0a] border border-white/10 text-[#d1c5b4] hover:text-[#e9c176]"
              >
                GitHub
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <p className="font-cinzel text-xs text-[#e9c176] tracking-wider uppercase font-semibold">
              Preview {EXPORT_PRESETS[format].ratioLabel} · exportação {width}×{height}
            </p>
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#e9c176] hover:bg-[#ffdea5] text-[#131313] font-inter font-bold text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              Baixar PNG
            </button>
          </div>

          {exportError && <p className="w-full mb-3 text-xs text-rose-300">{exportError}</p>}

          <div
            className="relative rounded-2xl p-2 bg-gradient-to-b from-[#00f2ff]/20 via-transparent to-[#e9c176]/20"
            style={{ width: PREVIEW_WIDTH + 16 }}
          >
            <div
              className="overflow-hidden rounded-xl"
              style={{ width: PREVIEW_WIDTH, height: height * scale }}
            >
              <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                <CardFace config={config} format={format} qrDataUrl={qrDataUrl} />
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              left: -20000,
              top: 0,
              width,
              height,
              pointerEvents: 'none',
              opacity: 1,
            }}
          >
            <div ref={exportRef} style={{ width, height }}>
              <CardFace config={config} format={format} qrDataUrl={qrDataUrl} />
            </div>
          </div>

          <div className="w-full mt-8 bg-[#13171f] rounded-xl p-4 border border-[#004d4d]/50 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#00f2ff]" aria-hidden="true" />
                <span className="font-cinzel text-xs font-semibold uppercase tracking-wider">Wrapper clicável</span>
              </div>
              <div className="flex gap-1">
                {(['html', 'markdown'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEmbedType(type)}
                    className={`px-2.5 py-1 rounded text-[10px] font-inter font-bold uppercase ${
                      embedType === type
                        ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/50'
                        : 'text-[#d1c5b4]/70 hover:text-white'
                    }`}
                  >
                    {type === 'html' ? 'HTML + img' : 'Markdown'}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <pre className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg p-3 text-[11px] font-mono text-[#00f2ff] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-36">
                {(embedType === 'html' ? htmlCode : markdownCode) ?? 'URL de destino inválida.'}
              </pre>
              <button
                type="button"
                onClick={() => handleCopy(embedType === 'html' ? htmlCode : markdownCode, embedType)}
                disabled={!(embedType === 'html' ? htmlCode : markdownCode)}
                className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#1c232f] border border-[#e9c176]/40 text-[#e9c176] text-[10px] font-inter font-bold uppercase disabled:opacity-40"
              >
                {copiedType === embedType ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] font-lora text-[#d1c5b4]/70">
              {embedType === 'html'
                ? 'O PNG em si não contém hyperlink. Este HTML envolve a imagem com um link seguro.'
                : 'Markdown para README ou Notion: a imagem fica clicável porque o Markdown cria o link, não o PNG.'}
            </p>
            {safeTarget && (
              <a
                href={safeTarget}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-[#00f2ff]"
              >
                Testar destino <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

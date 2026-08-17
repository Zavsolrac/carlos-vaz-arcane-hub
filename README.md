# Carlos Vaz — Arcane Professional Hub

Hub profissional de [Carlos Vaz](https://github.com/Zavsolrac), *The Arcane Architect*.

Não substitui o portfólio principal. É a porta de entrada rápida: identidade, atalhos verificáveis e um gerador de peças sociais.

**Portfólio canónico:** [https://portifoleo-carlos-vaz.vercel.app/](https://portifoleo-carlos-vaz.vercel.app/)

Desenvolvedor Web · IA · Storytelling Digital.

*Transformo ideias em experiências digitais com identidade.*

## Relação com o portfólio

| Este hub | Portfólio canónico |
| --- | --- |
| Link-in-bio autoral | Narrativa completa, ofício e contratos |
| Gerador de cards 9:16 e 1:1 | Experiência imersiva do atelier |
| Atalhos para GitHub e portfólio | Fonte de verdade profissional |

Contacto e orçamento vivem no portfólio. Este repositório não publica telefone, e-mail nem redes não verificadas.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Motion
- html2canvas (exportação PNG no cliente)
- qrcode (QR real no cartão)

Aplicação estática. Sem backend, sem base de dados, sem autenticação, sem analytics, sem runtime Gemini.

## Funcionalidades

- Identidade: Carlos Vaz · The Arcane Architect
- Portais: portfólio canónico, GitHub (`Zavsolrac`), gerador
- Gerador PNG 1080×1920 (9:16) e 1080×1080 (1:1), com composição própria por formato
- QR Code real apontando para a URL de destino (predefinição: portfólio)
- HTML (`<a rel="noopener noreferrer">` + `<img>`) e Markdown clicável
- Upload local de PNG/JPEG/WebP, processado só no browser
- Som desligado por omissão; exige clique explícito

O PNG é uma imagem estática. Não contém hyperlink. O clique existe no HTML ou Markdown que envolve a imagem.

## Tipografia

A assinatura **CARLOS VAZ** usa a cadeia:

`Ringbearer → Cinzel → serif`

`RINGBEARER_ASSET_REQUIRED=True`

O ficheiro da fonte Ringbearer **não** está neste repositório. Sem licença clara de redistribuição, não é feito download nem commit do binário. Se a fonte estiver instalada no sistema, o CSS usa `local('Ringbearer')`. Cinzel é o fallback público — não é apresentado como Ringbearer.

## Setup

Requisitos: Node.js 20+.

```bash
npm install
npm run dev
```

Outros scripts:

```bash
npm run lint
npm test
npm run build
npm run preview
```

Não há variáveis de ambiente. Não existe `GEMINI_API_KEY`.

## Arquitetura

```
src/
  data/profile.ts          Identidade e ligações verificáveis
  lib/urls.ts              Sanitização http(s)
  lib/embed.ts             HTML e Markdown seguros
  lib/exportPresets.ts     1080×1920 e 1080×1080
  lib/qr.ts                QR real
  components/CardFace.tsx  Composição do cartão
  components/CardStudio.tsx Preview + exportação
```

A preview pode ser menor. A exportação renderiza a composição nas dimensões finais, em vez de ampliar um cartão 360×580.

## Geração de cards

1. Escolher Story (9:16) ou Quadrado (1:1)
2. Confirmar a URL de destino (`http`/`https` apenas)
3. Opcional: QR, fundo por upload local ou URL de imagem
4. Baixar PNG
5. Copiar HTML ou Markdown para tornar a imagem clicável noutro sítio

Formatos:

- Status / Story: **1080 × 1920 px**
- Quadrado: **1080 × 1080 px**

## Privacidade

- `AUTH=False`
- `DATABASE=False`
- `ANALYTICS=False`
- `TRACKING=False`
- `COOKIES_REQUIRED=False`
- `NO_IMAGE_UPLOAD_TO_BACKEND=True`
- `GEMINI_RUNTIME_REQUIRED=False`
- `SERVER_RUNTIME_REQUIRED=False`

## Configuração dos links

Editar `src/data/profile.ts`. Só entram URLs verificáveis. LinkedIn, WhatsApp e e-mail ficam de fora até existirem fontes públicas confirmadas.

## Deploy

Build estático (`npm run build` → `dist/`). Serve em qualquer host de sites estáticos (Vercel, Netlify, GitHub Pages, Cloudflare Pages). Não há servidor Node em produção.

## Origin

O conceito nasceu como experimentação visual no Google Stitch / AI Studio (pedido inicial: banner profissional 9:16). A exportação foi auditada, sanitizada e reescrita como produto independente: dados fictícios removidos, dependências de Gemini/Express não usadas retiradas, e o gerador corrigido para PNG estático + wrapper HTML/Markdown + QR real.

A metadata original do AI Studio está em `docs/origin/` apenas como rasto de proveniência. Não descreve o runtime actual.

## Licença

Código: uso pessoal e profissional de Carlos Vaz. Não redistribuir fontes de terceiros sem a respectiva licença.

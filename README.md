# Carlos Vaz — Arcane Professional Hub

Hub profissional de Carlos Vaz, *The Arcane Architect*. Complementa — não substitui — o portfólio canónico:

https://portifoleo-carlos-vaz.vercel.app/

## Live Demo

https://zavsolrac.github.io/carlos-vaz-arcane-hub/

## Propósito

Porta de entrada rápida, link-in-bio autoral e ateliê de peças sociais (PNG estático + HTML/Markdown clicável + QR real).

## Setup

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

Não há variáveis de ambiente. Não existe runtime Gemini.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · Motion · html2canvas · qrcode

Aplicação estática. Sem backend, base de dados, autenticação ou analytics.

## Exportação social

1. Escolher 9:16 (1080×1920) ou 1:1 (1080×1080)
2. Confirmar URL http/https (predefinição: portfólio canónico)
3. Opcional: QR e fundo por upload local
4. Baixar PNG
5. Copiar HTML ou Markdown para tornar a imagem clicável noutro sítio

O PNG é só imagem. O clique vive no HTML/Markdown.

Image Map foi desactivado na V1: as coordenadas não acompanhavam as dimensões reais de exportação.

## Tipografia

Assinatura CARLOS VAZ: `Ringbearer → Cinzel → serif`

O binário Ringbearer **não** está neste repositório. Sem licença de redistribuição comprovada, o CSS usa apenas `local('Ringbearer')`. Cinzel é o fallback público.

## Privacidade

Sem auth, base de dados, cookies obrigatórios, tracking ou upload para servidor. Imagens de fundo ficam no browser.

## Configuração de ligações

Editar `src/data/defaultData.ts`. Só entram URLs verificáveis. LinkedIn, WhatsApp e e-mail omitidos até existirem fontes públicas confirmadas. GitHub verificado: https://github.com/Zavsolrac

## Origin

O conceito nasceu como experimentação visual no Google Stitch / AI Studio e foi auditado como produto independente. Metadata de origem em `docs/origin/`.

## Deploy

`npm run build` gera `dist/`. GitHub Pages publica automaticamente a partir de `.github/workflows/deploy-pages.yml` em cada push para `main`.

Live Demo: https://zavsolrac.github.io/carlos-vaz-arcane-hub/

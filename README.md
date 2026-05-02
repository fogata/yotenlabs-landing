# Yoten Labs Landing

Landing page bilíngue da Yoten Labs construída com Next.js App Router, TypeScript e Tailwind CSS.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vitest + Testing Library

Vitest foi escolhido por ser mais leve e rápido para o MVP, com setup simples para testes de componentes React e boa integração com Vite tooling.

## Como rodar localmente

No WSL2:

```bash
npm install
npm run dev
```

Abra:

- `http://localhost:3000/en`
- `http://localhost:3000/pt-br`
- `http://localhost:3000/en/pitch-deck`
- `http://localhost:3000/pt-br/pitch-deck`

A rota `/` redireciona para `/en`.

## Testes e lint

```bash
npm run test
npm run lint
```

## Scripts

- `npm run dev`: ambiente local.
- `npm run build`: build de produção.
- `npm run start`: inicia a build.
- `npm run lint`: ESLint.
- `npm run test`: Vitest em modo run.
- `npm run test:watch`: Vitest em modo watch.

## Contact form email

To enable the contact form delivery, configure these environment variables:

```text
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
REDIS_URL=
REDIS_PREFIX=
```

`CONTACT_FROM_EMAIL` is optional. If omitted, the app falls back to `CONTACT_TO_EMAIL`.
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` enable Cloudflare Turnstile protection on the contact form.
`REDIS_URL` is optional. If omitted, the contact rate limit falls back to in-memory storage.
On the VPS, this project can share the existing `health-platform` Docker network and use `redis://health-redis:6379`.

Example for Zoho Mail:

```text
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_USER=hello@yotenlabs.ai
SMTP_PASS=your_zoho_app_password
CONTACT_TO_EMAIL=hello@yotenlabs.ai
CONTACT_FROM_EMAIL=hello@yotenlabs.ai
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
REDIS_URL=redis://health-redis:6379
REDIS_PREFIX=yotenlabs-contact
```

## Personalização rápida

- Email de contato: altere `mailto:hello@yotenlabs.ai` em `src/components/landing-page.tsx`.
- Copy, metadata e labels: altere `src/i18n/messages/en.json` e `src/i18n/messages/pt-br.json`.
- Navegação e âncoras: ajuste `src/components/landing-page.tsx`.
- Identidade visual: tokens globais em `src/app/globals.css`, componentes em `src/components/landing-page.tsx` e `src/components/contact-form.tsx`, fundo 3D em `src/components/dynamic-background.tsx`.

## Pitch deck

A página pública de pitch deck fica em:

- `/en/pitch-deck`
- `/pt-br/pitch-deck`

Ela foi criada para conversas iniciais com investidores e parceiros, em formato de deck web responsivo. A primeira versão evita números sensíveis como valuation, receita, cap table, CAC, LTV, projeções financeiras ou valor de captação.

Estrutura atual:

- Hero reposicionado para comunicar a Yoten Labs como AI Product Studio que constrói produtos próprios de IA, começando pelo Sanu.
- Problema, solução e abordagem técnica, com ênfase em workflows reais, LLMs, RAG, agentes, pipelines, avaliação, guardrails e stack de produção.
- Seção protagonista do Sanu, com link para `https://www.trysanu.com` e descrição pública baseada em evidências dos repositórios `Platform Health.ai`: SaaS multi-tenant para operação clínica, teleconsulta LiveKit, agenda, documentos com gates LGPD, RBAC/Casbin, billing/entitlements, guest flow, RAG clínico, serviço de IA separado, observabilidade e deploy Docker.
- Modelo, diferencial, roadmap e time fundador, posicionando serviços como acelerador de produtos próprios e destacando a complementaridade entre engenharia de IA/arquitetura e comunicação/mercado.
- CTA final para investidores e parceiros via formulário da landing.

Arquivos principais:

- `src/app/[locale]/pitch-deck/page.tsx`: rota localizada e metadata da página.
- `src/components/pitch-deck-page.tsx`: layout e composição visual do deck.
- `src/i18n/messages/en.json` e `src/i18n/messages/pt-br.json`: conteúdo bilíngue na chave `pitchDeck`.
- `src/components/pitch-deck-page.test.tsx`: cobertura de renderização das seções e projetos.

Ao adicionar dados sensíveis no futuro, prefira uma versão privada ou protegida por acesso. A página atual é pública e indexável via sitemap. Mantenha afirmações públicas sobre tração, produção, clientes, receita ou capacidades do Sanu baseadas em produto/código verificável; não adicione clientes, números financeiros, valuation, cap table, projeções ou valor de captação nesta rota pública.

## Identidade visual

A identidade atual segue o projeto Stitch `YotenLabs Landingpage 2.0`.

Direção visual:

- Estética dark Deep Tech / Professional Futurism.
- Headlines em Space Grotesk, corpo em Inter e dados curtos em IBM Plex Mono.
- Paleta com base quase preta (`#0A1016`, `#0D141B`, `#151C24`), acento ciano (`#6BF3FF`) e sinalização roxa (`#7C3CFF`).
- Navegação compacta em barra escura, superfícies tonais, bordas fantasma e componentes com raio mínimo.
- Hero com painel técnico à direita, seção de competências em mosaico, bloco “Quem somos” com arte técnica e painel “Initialize Protocol” dividido.

Ao alterar a identidade, mantenha os tokens CSS centralizados em `src/app/globals.css` e evite reintroduzir o visual SaaS azul/glass genérico ou os acentos âmbar sazonais anteriores.

## Adicionar um novo idioma

1. Crie um novo arquivo em `src/i18n/messages/`, por exemplo `es.json`.
2. Adicione o locale em `src/i18n/config.ts`.
3. Registre o dicionário em `src/i18n/get-messages.ts`.
4. Adicione metadata, navegação e labels do switcher no novo arquivo JSON.
5. Confirme `generateStaticParams` e o comportamento de rota em `src/app/[locale]/layout.tsx`.

## Animated background

O fundo dinâmico usa Three.js para renderizar uma malha abstrata discreta de nós ciano/roxo, com grid CSS e noise overlay leve.

Se o usuário tiver `prefers-reduced-motion: reduce`, o movimento é reduzido e o visual permanece funcional.

## Estrutura principal

```text
public/
  favicon.ico
  og.png
src/
  app/
    [locale]/
      pitch-deck/
        page.tsx
      layout.tsx
      page.tsx
    globals.css
    layout.tsx
    not-found.tsx
    page.tsx
  components/
    dynamic-background.tsx
    html-lang.tsx
    landing-page.test.tsx
    landing-page.tsx
    language-switcher.tsx
    pitch-deck-page.test.tsx
    pitch-deck-page.tsx
  i18n/
    messages/
      en.json
      pt-br.json
    config.ts
    get-messages.ts
```

## GitHub

### Criar via UI

1. Acesse `https://github.com/new`.
2. Crie o repositório `yotenlabs-landing`.
3. Não adicione README, `.gitignore` ou LICENSE pela interface.

### Criar via GitHub CLI

```bash
gh repo create yotenlabs-landing --public
git remote add origin https://github.com/SEU_USUARIO/yotenlabs-landing.git
git push -u origin main
```

## Deploy automatico na VPS com GitHub Actions

O repositório inclui o workflow [deploy-vps.yml](/c:/Projetos%20-%20Enterprise/yotenlabs-landing/.github/workflows/deploy-vps.yml).

Ele faz:

- `npm ci`
- `npm test`
- `npm run build`
- conexão SSH na VPS
- `git pull` no diretório da aplicação
- `docker compose build --pull`
- `docker compose up -d --force-recreate`

### Secrets necessários

Configure em `Settings > Secrets and variables > Actions`:

- `VPS_HOST`: IP ou domínio da VPS
- `VPS_USER`: usuário SSH
- `VPS_SSH_KEY`: chave privada SSH usada pelo GitHub Actions
- `VPS_PORT`: porta SSH, normalmente `22`

### Variable necessária

Configure em `Settings > Secrets and variables > Actions > Variables`:

- `VPS_APP_DIR`: caminho absoluto do repositório na VPS

Exemplo:

```text
/opt/yotenlabs-landing
```

### Pré-requisitos na VPS

- Git instalado
- Docker e Docker Compose instalados
- repositório já clonado em `VPS_APP_DIR`
- o usuário SSH precisa conseguir rodar `docker compose`

### Fluxo de uso

Cada `push` para `main` dispara o deploy automaticamente.

Se quiser disparar manualmente, use `Actions > Deploy to VPS > Run workflow`.

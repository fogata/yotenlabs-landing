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

## Personalização rápida

- Email de contato: altere `mailto:hello@yotenlabs.ai` em `src/components/landing-page.tsx`.
- Copy, metadata e labels: altere `src/i18n/messages/en.json` e `src/i18n/messages/pt-br.json`.
- Navegação e âncoras: ajuste `src/components/landing-page.tsx`.

## Adicionar um novo idioma

1. Crie um novo arquivo em `src/i18n/messages/`, por exemplo `es.json`.
2. Adicione o locale em `src/i18n/config.ts`.
3. Registre o dicionário em `src/i18n/get-messages.ts`.
4. Adicione metadata, navegação e labels do switcher no novo arquivo JSON.
5. Confirme `generateStaticParams` e o comportamento de rota em `src/app/[locale]/layout.tsx`.

## Animated background

O fundo dinâmico é CSS-only, com blobs difusos e um noise overlay leve.

Se o usuário tiver `prefers-reduced-motion: reduce`, as animações são desativadas e o visual permanece estático.

## Estrutura principal

```text
public/
  favicon.ico
  og.png
src/
  app/
    [locale]/
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

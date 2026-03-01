# Yoten Labs Landing

Landing page bilíngue da Yoten Labs em Next.js App Router, TypeScript e Tailwind CSS.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vitest + Testing Library

Vitest foi escolhido por ser mais leve e rápido para o escopo do MVP, com configuração simples para testes de componentes React.

## Como rodar

```bash
npm i
npm run dev
```

Acesse:

- `http://localhost:3000/en`
- `http://localhost:3000/pt-br`

A rota `/` redireciona para `/en`.

## Testes e lint

```bash
npm run test
npm run lint
```

## Personalização rápida

- Email de contato: altere `mailto:hello@yotenlabs.ai` em `src/components/landing-page.tsx`.
- Metadata e copy: altere os arquivos em `src/i18n/messages/en.json` e `src/i18n/messages/pt-br.json`.
- Links e âncoras do header: ajuste em `src/components/landing-page.tsx`.

## Adicionar um terceiro idioma

1. Crie um novo arquivo em `src/i18n/messages/`.
2. Adicione o locale em `src/i18n/config.ts`.
3. Registre o dicionário em `src/i18n/get-messages.ts`.
4. Garanta metadata e labels para o novo locale.

## Scripts

- `npm run dev`: sobe o ambiente local.
- `npm run build`: gera build de produção.
- `npm run start`: inicia a build.
- `npm run lint`: executa ESLint.
- `npm run test`: executa Vitest em modo run.
- `npm run test:watch`: executa Vitest em modo watch.

## GitHub

### Criar via GitHub UI

1. Acesse `https://github.com/new`.
2. Crie o repositório `yotenlabs-landing`.
3. Não adicione README, `.gitignore` ou license pela UI.

### Criar via GitHub CLI

```bash
gh repo create yotenlabs-landing --public --source=. --remote=origin --push
```

Se preferir criar sem push automático:

```bash
gh repo create yotenlabs-landing --public
git remote add origin https://github.com/SEU_USUARIO/yotenlabs-landing.git
git push -u origin main
```

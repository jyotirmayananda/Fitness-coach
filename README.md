# Fitness — AI-assisted Next.js app

This repository is a Next.js + TypeScript project with Tailwind CSS and AI integrations (GenKit / Google GenAI). It provides tools to generate personalized fitness plans and exercise images using AI flows located under `src/ai`.

## Key features

- Next.js 15 app (app router) with Tailwind CSS for styling.
- AI automation flows using GenKit and @genkit-ai/google-genai.
- Components and UI primitives using Radix and a small design system in `src/components/ui`.
- Client and server code co-located under `src/app` and `src/lib`.

## Quick start (development)

Requirements

- Node.js (v18+ recommended)
- npm or pnpm

Install dependencies:

```powershell
npm install
```

Run the Next.js dev server (uses Turbopack on port 9002):

```powershell
npm run dev
```

Run the GenKit AI development flow (if you want to run flows locally):

```powershell
npm run genkit:dev
```

Watch GenKit flows while editing:

```powershell
npm run genkit:watch
```

Build for production:

```powershell
npm run build

npm run start
```

## Environment variables

This project uses `dotenv` and likely requires API credentials for GenKit / Google GenAI. Create a `.env.local` file at the project root and add the variables your environment needs. Common variables to set (example names — confirm in your AI config files):

- GOOGLE_API_KEY or GOOGLE_GENAI_API_KEY
- GENKIT_API_KEY (if your setup requires it)

In PowerShell you can set an environment variable for a single command like this:

```powershell
#$env:GOOGLE_API_KEY = 'your_key_here'; npm run genkit:dev
```

Or add them to `.env.local` (recommended for local development — don't commit secrets).

## Project layout (high level)

- `src/app/` — Next.js app entry, routes and pages.
  - `page.tsx` — home
  - `plan/page.tsx` — plan view
- `src/ai/` — GenKit/AI flows and helpers
  - `dev.ts` — local flow runner
  - `flows/` — flows such as `generate-exercise-images.ts`, `generate-personalized-fitness-plans.ts`, `provide-ai-generated-tips.ts`
- `src/components/` — UI components and design system
- `src/lib/` — helpers, schemas, utils
- `src/hooks/` — React hooks

## Scripts

Scripts available in `package.json`:

- `npm run dev` — start Next.js dev server (port 9002)
- `npm run genkit:dev` — run GenKit flows once (via `src/ai/dev.ts`)
- `npm run genkit:watch` — run GenKit flows and watch for changes
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run Next.js lint
- `npm run typecheck` — run TypeScript type check

## Development notes & tips

- The AI flows use `genkit` and `@genkit-ai/google-genai` — check `src/ai` for the exact prompts and flow wiring.
- Tailwind config is in `tailwind.config.ts` and `src/tailwind.config.ts` (project-level vs app-level overrides).
- If you modify dependencies, run `npm install` and optionally `npm run build` to ensure there are no type issues.

## Contributing

1. Fork the repo and create a feature branch.
2. Keep changes small and focused.
3. Add or update tests for any new behavior (this repo currently focuses on UI and AI flows).
4. Open a pull request describing the change and motivation.

## TODO / Next steps

- Add explicit documentation for required env variables and their exact names.
- Add a CONTRIBUTING.md with PR checklist and developer setup.
- Add minimal tests and a CI workflow (typecheck + lint + build).

## License

Add your license here (e.g. MIT). If you don't have a license yet, add a `LICENSE` file in the repo root.

---

If you want, I can:

- add a short `CONTRIBUTING.md` and `.env.example` showing the variables to define, or
- open a branch and add a minimal CI workflow that runs `npm run typecheck` and `npm run build` on push.

Tell me which follow-up you'd like and I'll implement it.

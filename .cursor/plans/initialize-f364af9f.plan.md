<!-- f364af9f-f8a9-4f0c-b3b4-b296251631a0 a738a313-62ef-497e-9b27-55b495626fcc -->
# Initialize Next.js 14 in current folder

## What I will do
- Create a Next.js 14 project directly in the current folder using create-next-app (App Router, TypeScript, Tailwind, src/ layout, import alias).
- Install `@supabase/supabase-js`.
- Create directory structure and placeholder files:
  - `src/app/` with an example `api/health/route.ts` and placeholder layout/page files
  - `src/components/` with minimal UI placeholders
  - `src/lib/` for config and clients (with a placeholder Supabase client file, credentials later)
  - `src/types/` for TypeScript interfaces
  - `src/utils/` for helpers
- Generate a root `.cursorrules` from `.cursor/rules`, and append content from `DEVELOPMENT_LOG.md` as a development guide note.

## Commands (PowerShell)
- Initialize Next.js 14 (in current folder):
```bash
npx create-next-app@14 . --ts --tailwind --app --src-dir --import-alias "@/*" --use-npm --no-eslint --no-experimental-app
```
Notes:
- Using `@14` ensures latest 14.x template (your choice was 1a).
- `.` ensures the current directory is the project root (no new folder created).
- I’ll omit prompts by passing non-interactive flags and use npm.

- Install Supabase client:
```bash
npm install @supabase/supabase-js
```

## Files and structure to add
- `src/app/layout.tsx` (ensure exists; if scaffolded, leave as-is)
- `src/app/page.tsx` (ensure exists; home placeholder)
- `src/app/api/health/route.ts` (simple JSON ok)
- `src/components/ui/Placeholder.tsx`
- `src/components/layout/SiteHeader.tsx`
- `src/components/features/crypto/PlaceholderAssetCard.tsx`
- `src/lib/supabase/client.ts` (placeholder, env vars later)
- `src/lib/constants.ts`
- `src/types/crypto.ts`
- `src/utils/format.ts`

## Placeholder contents (concise)
- `src/app/api/health/route.ts` returns `{ status: 'ok' }`.
- `src/lib/supabase/client.ts` exports a factory that throws if env vars missing (to be filled later).
- `src/types/crypto.ts` defines minimal interfaces like `Asset`, `MarketData` as placeholders.
- `src/utils/format.ts` exports `formatCurrency` and `formatPercent` placeholders.
- Components export simple functional components returning minimal markup.

## Cursor rules
- Read `.cursor/rules` and write a combined root `.cursorrules` that includes its content.
- Append a short section that links/embeds the development guide info from `DEVELOPMENT_LOG.md`.

## Verification
- Run `npm run dev` to ensure the app boots.
- Hit `http://localhost:3000/api/health` to confirm the API route works.


### To-dos

- [ ] Initialize Next.js 14 in current folder with TypeScript and Tailwind
- [ ] Install @supabase/supabase-js dependency
- [ ] Create src folders and placeholder files per spec
- [ ] Generate .cursorrules from .cursor/rules plus development guide
- [ ] Run dev server and verify /api/health endpoint
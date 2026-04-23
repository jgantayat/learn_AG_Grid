# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:4200
npm run build      # Production build to dist/
npm run watch      # Dev build in watch mode
npm test           # Run unit tests with Vitest
```

To run a single test file:
```bash
npx vitest run src/app/app.spec.ts
```

## Architecture

**Angular 21.2 standalone project** — no NgModule. Every component is standalone and imported directly.

- `src/main.ts` — bootstraps the `App` component with `appConfig`
- `src/app/app.config.ts` — global providers (router, error listeners)
- `src/app/app.routes.ts` — route definitions (currently empty, ready to extend)
- `src/app/app.ts` — root component using Angular signals for reactive state

**AG Grid** (`ag-grid-angular` v35.2.1) is installed but not yet wired up. When adding grid components, import `AgGridAngular` directly into the standalone component's `imports` array — no module registration needed.

**Testing** uses Vitest (not Karma/Jasmine). Test files follow the `*.spec.ts` convention.

**Formatting** is handled by Prettier (100-char print width, single quotes, Angular HTML parser). Run `npx prettier --write .` to format.

## Key Conventions

- Use Angular signals (`signal()`, `computed()`, `effect()`) for reactive state rather than RxJS where possible.
- Component selector prefix is `app-` (enforced by `angular.json`).
- Production budget limits: 500 kB warning / 1 MB error for initial bundle; keep AG Grid column definitions and data out of the root bundle if the app grows.

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

### Bootstrap flow

`src/main.ts` bootstraps `LayoutComponent` (not `App`) with `appConfig`. `LayoutComponent` is the persistent shell — it renders the fixed sidebar and a `<router-outlet>`. Routed page components are loaded lazily into the outlet.

### Layout shell

- `src/app/layout/layout.component.ts` — root shell; `position: fixed` sidebar on the left, scrollable content area offset by `margin-left: 220px`
- `src/app/layout/sidebar/sidebar.component.ts` — fixed-position sidebar using `RouterLink` / `RouterLinkActive`
- `src/app/layout/sidebar/nav-items.ts` — `NAV_ITEMS` array; **add new routes here** to surface them in the sidebar

### Routing

`src/app/app.routes.ts` uses lazy `loadComponent`. `''` redirects to `home`. `App` (the AG Grid demo component) is the `/home` route.

To add a new page: create a standalone component, add a `loadComponent` entry in `app.routes.ts`, and add a matching `NavItem` in `nav-items.ts`.

### AG Grid

`ag-grid-angular` v35.2.1. `ModuleRegistry.registerModules([AllCommunityModule])` is called once at the top of `src/app/app.ts`. Import `AgGridAngular` directly into any standalone component's `imports` array — no module registration needed per component.

### Data models

`src/app/model/` holds TypeScript interfaces (`IOlympicData`, `SalesRecord`) for grid row shapes.

### Key conventions

- Use Angular signals (`signal()`, `computed()`, `effect()`) for reactive state rather than RxJS where possible.
- Component selector prefix is `app-` (enforced by `angular.json`).
- **Testing** uses Vitest (not Karma/Jasmine). Test files follow `*.spec.ts`.
- **Formatting**: Prettier (100-char print width, single quotes, Angular HTML parser). Run `npx prettier --write src/` after changes.
- Production bundle budget: 500 kB warning / 1 MB error. Keep AG Grid column definitions and row data out of eagerly loaded modules.

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

`src/main.ts` bootstraps `App` (`app-root`) with `appConfig`. `App` is the persistent root shell — it renders `<app-navbar>` and a `<router-outlet>`. All routed page components are loaded lazily into the outlet.

### Root shell

- `src/app/app.ts` — root shell component; imports `NavbarComponent` + `RouterOutlet` eagerly
- `src/app/app.html` — shell template: `<app-navbar />` + `<main class="content"><router-outlet /></main>`
- `src/app/app.css` — layout styles: `margin-left: 220px` content offset, `min-height: 100vh`

### Navbar

- `src/app/components/navbar/navbar.ts` — fixed-position dark sidebar using `RouterLink` / `RouterLinkActive`; selector `app-navbar`
- `src/app/components/navbar/nav-items.ts` — `NAV_ITEMS` array; **add new routes here** to surface them in the navbar

### Routing

`src/app/app.routes.ts` uses lazy `loadComponent`. `''` redirects to `home`.

To add a new page: create a standalone component under `src/app/components/`, add a `loadComponent` entry in `app.routes.ts`, and add a matching `NavItem` in `nav-items.ts`.

### AG Grid

`ag-grid-angular` v35.2.1. Each concept component that uses AG Grid calls `ModuleRegistry.registerModules([AllCommunityModule])` once at the top of its `.ts` file (module-level, not inside a lifecycle hook). Import `AgGridAngular` directly into the component's `imports` array.

### Data models

`src/app/model/` holds TypeScript interfaces (`IOlympicData`, `SalesRecord`) for grid row shapes.

### Key conventions

- Angular 17+ standalone default — omit `standalone: true` in new components (existing older components retain it).
- Use `signal()` for `rowData` and `colDefs` — no RxJS, no plain class properties.
- Always use `templateUrl` + `styleUrl` (external files) — never inline `template` or `styles`.
- File naming: no `.component.` infix for new components (e.g. `navbar.ts`, `home.ts`). `basic-grid.component.ts` is legacy.
- Component selector prefix is `app-` (enforced by `angular.json`).
- **Testing** uses Vitest (not Karma/Jasmine). Test files follow `*.spec.ts`.
- **Formatting**: Prettier (100-char print width, single quotes, Angular HTML parser). Run `npx prettier --write src/` after changes.
- Production bundle budget: 500 kB warning / 1 MB error. Keep AG Grid column definitions and row data out of eagerly loaded modules.

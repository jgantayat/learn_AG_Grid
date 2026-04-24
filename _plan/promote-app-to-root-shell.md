# Plan: Promote App to Root Shell + Extract HomeComponent

## Context

The current architecture has an inversion of Angular conventions: `LayoutComponent` (selector `app-layout`) is bootstrapped as the root and owns the sidebar + `<router-outlet>`, while the conventional `App` component (selector `app-root`) is used as a routed landing page at `/home`. The goal is to restore the conventional structure — `App` becomes the root shell, a new `HomeComponent` gets the landing page content, and `LayoutComponent` is deleted.

Angular best practices applied:
- `AppComponent` (`app-root`) is the root shell, as convention dictates
- Every route has its own dedicated component; the shell itself is never a routed page
- All feature components (including `HomeComponent`) remain lazily loaded
- CLI scaffolding (`ng g c`) is used for all new components

---

## Files to Create (via CLI)

| Path | Purpose |
|---|---|
| `src/app/components/home/home.ts` | Landing page logic (receives current app.ts content) |
| `src/app/components/home/home.html` | Landing page template (receives current app.html) |
| `src/app/components/home/home.css` | Landing page styles (receives current app.css) |

## Files to Modify

| Path | Change |
|---|---|
| `src/app/app.ts` | Transform from landing page → root shell (imports: SidebarComponent + RouterOutlet) |
| `src/app/app.html` | Replace with shell template (sidebar + router-outlet) |
| `src/app/app.css` | Replace with layout styles (margin-left: 220px, etc.) |
| `src/app/app.routes.ts` | Update `home` route to load `HomeComponent` |
| `src/app/app.spec.ts` | Update tests to match shell (sidebar + router-outlet checks) |
| `src/main.ts` | Bootstrap `App` instead of `LayoutComponent` |
| `src/index.html` | Change `<app-layout>` → `<app-root>` |

## Files to Delete

| Path | Reason |
|---|---|
| `src/app/layout/layout.component.ts` | Responsibility fully moves into `App` |

`src/app/layout/sidebar/` stays untouched — `SidebarComponent` is still used.

---

## Step 1 — Scaffold HomeComponent via CLI

```bash
ng g c components/home --type=""
```

Produces 4 files (`.ts`, `.html`, `.css`, `.spec.ts`). The `--type=""` flag suppresses the `.component.` infix, matching the project convention (`column-state.ts`, `test.ts`).

---

## Step 2 — Populate `home.ts`

```typescript
// src/app/components/home/home.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {}
```

---

## Step 3 — Move landing page content into HomeComponent

- Copy full content of `src/app/app.html` → `src/app/components/home/home.html` (verbatim — all `routerLink` paths are absolute, no changes needed)
- Copy full content of `src/app/app.css` → `src/app/components/home/home.css` (verbatim — all styles are hero/card scoped, no conflicts with shell styles)

---

## Step 4 — Transform `app.ts` into root shell

```typescript
// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
```

`SidebarComponent` is imported eagerly — it is structural chrome present on every route; lazy loading it would cause a visible flash on first render.

---

## Step 5 — Replace `app.html` with shell template

```html
<div class="layout">
  <app-sidebar />
  <main class="content">
    <router-outlet />
  </main>
</div>
```

---

## Step 6 — Replace `app.css` with layout styles

```css
.layout {
  display: block;
}

.content {
  margin-left: 220px;
  padding: 32px 40px;
  min-height: 100vh;
  background: #f5f5f5;
}
```

---

## Step 7 — Update `app.routes.ts`

Change only the `home` route — all other routes are untouched:

```typescript
{
  path: 'home',
  loadComponent: () => import('./components/home/home').then((m) => m.HomeComponent),
},
```

---

## Step 8 — Update `main.ts`

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

---

## Step 9 — Update `index.html`

Change `<app-layout></app-layout>` → `<app-root></app-root>`. One line change; everything else stays the same.

---

## Step 10 — Delete `layout.component.ts`

```bash
rm src/app/layout/layout.component.ts
```

Verify no remaining references before deleting:
```bash
grep -r "LayoutComponent\|layout.component\|app-layout" src/
```
Should return zero results after main.ts and index.html are updated.

---

## Step 11 — Update `app.spec.ts`

Current tests check for `'Hello, learn_AG_Grid'` in an `h1` — that content no longer lives in `App`. Replace with shell-appropriate tests:

```typescript
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the sidebar', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-sidebar')).toBeTruthy();
  });

  it('should render a router-outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
```

`provideRouter(routes)` is required because `App` now imports `RouterOutlet`.

---

## Step 12 — Format

```bash
npx prettier --write src/main.ts src/index.html src/app/app.ts src/app/app.html src/app/app.css \
  src/app/app.routes.ts src/app/app.spec.ts src/app/components/home/
```

---

## Verification

1. `npm start` — zero compile errors, zero warnings
2. `/` → redirects to `/home` → hero, Quick Start, Best Practices cards all render correctly
3. Sidebar is visible and fixed on all routes, no flash or layout shift
4. All 7 concept routes load correctly
5. `grep -r "LayoutComponent\|app-layout" src/` → zero results
6. `npx vitest run src/app/app.spec.ts` → 3 passing tests

# Plan: Refactor SidebarComponent → NavbarComponent

## Context

`SidebarComponent` lives under `src/app/layout/sidebar/` — a location that made sense when there was a `LayoutComponent` wrapper. That wrapper has since been deleted. The sidebar is now the only resident of `layout/`, so the folder has no organisational purpose. This plan moves the sidebar into `src/app/components/navbar/` using the project's `/create-component` convention, renames it to `NavbarComponent`, converts inline template/styles to external files, and deletes the orphaned `layout/` directory.

Angular best practices applied:
- External `templateUrl` + `styleUrl` (not inline strings)
- `standalone: true` omitted — Angular 17+ implicit default, matching `home.ts`
- `nav-items.ts` co-located next to the component that owns it
- `ng g c` scaffolding for consistent file generation
- `rmdir` (not `rm -rf`) for safe directory cleanup

---

## Files to Create (via CLI + populate)

| Path | Purpose |
|---|---|
| `src/app/components/navbar/navbar.ts` | NavbarComponent class |
| `src/app/components/navbar/navbar.html` | Extracted from inline template |
| `src/app/components/navbar/navbar.css` | Extracted from inline styles |
| `src/app/components/navbar/navbar.spec.ts` | CLI-generated (leave as-is) |
| `src/app/components/navbar/nav-items.ts` | Moved from `layout/sidebar/nav-items.ts` |

## Files to Modify

| Path | Change |
|---|---|
| `src/app/app.ts` | Import `NavbarComponent` from new path |
| `src/app/app.html` | `<app-sidebar />` → `<app-navbar />` |
| `src/app/app.spec.ts` | `querySelector('app-sidebar')` → `querySelector('app-navbar')` |

## Files to Delete

| Path | Reason |
|---|---|
| `src/app/layout/sidebar/sidebar.component.ts` | Replaced by `navbar.ts` |
| `src/app/layout/sidebar/nav-items.ts` | Moved to `components/navbar/nav-items.ts` |
| `src/app/layout/sidebar/` (dir) | Empty after above deletions |
| `src/app/layout/` (dir) | Empty after `sidebar/` is removed |

---

## Step 1 — Scaffold via CLI

```bash
ng g c components/navbar --type=""
```

Produces 4 files with no `.component.` infix, matching the project convention.

---

## Step 2 — Populate `navbar.ts`

```typescript
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_ITEMS, NavItem } from './nav-items';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  navItems: NavItem[] = NAV_ITEMS;
}
```

---

## Step 3 — Populate `navbar.html`

Exact template extracted from the old inline `template` string:

```html
<aside class="sidebar">
  <div class="sidebar-heading">LEARN_AG_GRID</div>
  <nav>
    @for (item of navItems; track item.path) {
      <a [routerLink]="item.path" routerLinkActive="active">{{ item.label }}</a>
    }
  </nav>
</aside>
```

---

## Step 4 — Populate `navbar.css`

Exact CSS extracted from the old inline `styles` array:

```css
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 100vh;
  background: #111111;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  padding: 28px 0;
  box-sizing: border-box;
  border-right: 1px solid #2a2a2a;
  z-index: 100;
}

.sidebar-heading {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #ffffff;
  padding: 0 20px 22px;
  margin-bottom: 16px;
  line-height: 1.3;
  border-bottom: 1px solid #2a2a2a;
  text-shadow: 0 0 18px rgba(255, 255, 255, 0.25);
  position: relative;
}

.sidebar-heading::after {
  content: '';
  display: block;
  width: 32px;
  height: 3px;
  background: #ffffff;
  border-radius: 2px;
  margin-top: 10px;
  opacity: 0.6;
}

nav {
  display: flex;
  flex-direction: column;
}

nav a {
  display: block;
  padding: 10px 20px;
  color: #9a9a9a;
  text-decoration: none;
  font-size: 13px;
  border-left: 3px solid transparent;
  transition:
    background 0.15s,
    color 0.15s;
}

nav a:hover {
  background: #1e1e1e;
  color: #ffffff;
}

nav a.active {
  background: #1e1e1e;
  color: #ffffff;
  border-left-color: #ffffff;
}
```

---

## Step 5 — Create `nav-items.ts` (co-located)

Create at `src/app/components/navbar/nav-items.ts` — verbatim copy from the old location:

```typescript
export interface NavItem {
  path: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: 'home', label: 'Home' },
  { path: 'basic-grid', label: 'Basic Grid' },
  { path: 'intro-to-aggrid', label: 'Intro to AG Grid' },
  { path: 'column-definitions', label: 'Column Definitions' },
  { path: 'column-types', label: 'Column Types ' },
  { path: 'test', label: 'Test' },
  { path: 'column-state', label: 'Column State' },
];
```

---

## Step 6 — Update `app.ts`

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
```

---

## Step 7 — Update `app.html`

Change one tag:

```html
<div class="layout">
  <app-navbar />
  <main class="content">
    <router-outlet />
  </main>
</div>
```

---

## Step 8 — Update `app.spec.ts`

```typescript
it('should render the navbar', () => {
  const fixture = TestBed.createComponent(App);
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('app-navbar')).toBeTruthy();
});
```

---

## Step 9 — Delete old files and directories

Verify no remaining references first:
```bash
grep -r "layout/sidebar\|SidebarComponent\|app-sidebar" src/
```
Must return zero results, then:

```bash
rm src/app/layout/sidebar/sidebar.component.ts
rm src/app/layout/sidebar/nav-items.ts
rmdir src/app/layout/sidebar
rmdir src/app/layout
```

`rmdir` (not `rm -rf`) refuses to delete non-empty directories — acts as a safety net.

---

## Step 10 — Format

```bash
npx prettier --write src/app/components/navbar/ src/app/app.ts src/app/app.html src/app/app.spec.ts
```

---

## Verification

1. `npm start` — zero compile errors
2. `/` → home page renders, navbar visible and fixed on the left
3. Click each nav link — active highlight (white left border) applies on each route
4. `grep -r "layout/sidebar\|SidebarComponent\|app-sidebar" src/` → zero results
5. `npx vitest run src/app/app.spec.ts` → 3 passing tests

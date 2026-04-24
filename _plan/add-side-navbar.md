# Plan: Add Side Navbar

## Context

The current `AppComponent` holds all AG Grid logic and is the bootstrap root. The goal is to introduce a persistent sidebar layout shell without creating a new HomeComponent — `AppComponent` itself becomes the `/home` route. A new `LayoutComponent` replaces `App` as the bootstrap root.

---

## Files to Create

| Path | Purpose |
|---|---|
| `src/app/layout/layout.component.ts` | New root shell: sidebar + `<router-outlet>` |
| `src/app/layout/sidebar/sidebar.component.ts` | Standalone sidebar with nav links |
| `src/app/layout/sidebar/nav-items.ts` | `NAV_ITEMS` config array |
| `_plan/add-side-navbar.md` | This plan file |

## Files to Modify

| Path | Change |
|---|---|
| `src/main.ts` | Bootstrap `LayoutComponent` instead of `App` |
| `src/app/app.ts` | Remove unused `RouterOutlet` import |
| `src/app/app.routes.ts` | Add redirect + lazy-loaded `App` as home route |
| `src/app/app.config.ts` | No change needed — `provideRouter(routes)` already present |

---

## Implementation Steps

### Step 1 — Create `nav-items.ts`

```typescript
// src/app/layout/sidebar/nav-items.ts
export interface NavItem {
  path: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: 'home', label: 'Home' }
];
```

### Step 2 — Create `SidebarComponent`

Standalone component using `RouterLink` and `RouterLinkActive`. Scoped dark/neutral styles with active link highlight.

### Step 3 — Create `LayoutComponent` (new root shell)

Two-column CSS grid: sidebar fixed 220px, content fills remaining width, full viewport height.

```html
<div class="layout">
  <app-sidebar />
  <main class="content">
    <router-outlet />
  </main>
</div>
```

### Step 4 — Update `main.ts`

Bootstrap `LayoutComponent` instead of `App`.

### Step 5 — Update `app.routes.ts`

```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./app').then(m => m.App)
  }
];
```

### Step 6 — Update `app.ts`

Remove the unused `RouterOutlet` import.

### Step 7 — Run Prettier

```bash
npx prettier --write src/
```

---

## Verification

1. `npm start` — dev server starts without errors
2. `http://localhost:4200` → redirects to `/home`
3. AG Grid renders with existing row/column data inside the content area
4. Sidebar shows **LEARN_AG_GRID** heading and "Home" nav link highlighted
5. Sidebar stays fixed at 220px on resize; content area scrolls independently

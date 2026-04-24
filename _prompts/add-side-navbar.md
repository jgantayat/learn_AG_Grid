# Add Side Navbar — Claude Code Prompt

Read the current project state from these files before making any changes:

- `src/app/app.ts`
- `src/app/app.config.ts`
- `src/app/app.routes.ts`
- `src/app/app.html` (or `app.component.html`)
- `src/app/app.css` (or `app.component.css`)

Then implement the following:

---

## Goal

Add a persistent side navbar and a layout shell to the app. The current app component content should move under a `home` route.

---

## 1. Layout Shell — update `src/app/app.ts`

Transform AppComponent into a minimal shell:

- Template: sidebar on the left, `<router-outlet>` on the right
- No grid logic in the root component anymore
- Use a two-column CSS grid layout (sidebar fixed ~220px, content takes remaining width, full viewport height)

## 2. Sidebar Component — create `src/app/layout/sidebar/sidebar.component.ts`

- Standalone component, selector `app-sidebar`
- Display the project heading **LEARN_AG_GRID** at the top (styled prominently)
- Render nav links from a `NAV_ITEMS` array imported from `nav-items.ts` in the same folder
- Use Angular's `RouterLink` and `RouterLinkActive` directives for navigation
- Active route link should have a distinct highlighted style
- Keep styles scoped to this component

## 3. Nav Items Config — create `src/app/layout/sidebar/nav-items.ts`

```typescript
export interface NavItem {
  path: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: 'home', label: 'Home' }
];
```

## 4. Home Component — create `src/app/components/home/home.component.ts`

- Move whatever is currently in `AppComponent`'s template and logic here
- Standalone component, selector `app-home`
- Preserve all existing signals, imports, and AG Grid setup as-is

## 5. Routes — update `src/app/app.routes.ts`

```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent)
  }
];
```

## 6. App Config — update `src/app/app.config.ts`

Ensure `provideRouter(routes)` is present with the routes imported from `app.routes.ts`. No other changes needed.

---

## Constraints

- Angular 21.2 standalone architecture — no NgModule
- Use Angular signals for any reactive state
- Use only CSS (no external UI libraries) — clean, minimal dark or neutral sidebar style
- Keep the `app-` selector prefix
- Run `npx prettier --write src/` after all files are created or modified
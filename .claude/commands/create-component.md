---
description: Scaffold a new AG Grid concept component using Angular CLI, register its lazy route, and add it to the sidebar nav.
allowed-tools: Bash(ng g c:*), Bash(cat:*), Bash(ls:*), Bash(npx prettier:*)
---

## Usage

```
/create-component <ComponentName> [short-nav-label]
```

**Arguments**

| Argument | Required | Description |
|---|---|---|
| `ComponentName` | ✅ | PascalCase name, e.g. `CellRenderers`, `RowGrouping`, `Pagination` |
| `short-nav-label` | Optional | Label shown in the sidebar. Defaults to a humanised version of `ComponentName` |

**Examples**

```
/create-component CellRenderers "Cell Renderers"
/create-component RowGrouping
/create-component SortingFiltering "Sort & Filter"
```

---

## Before writing any file — read the project state

Run these commands first so you have full context:

```bash
cat src/app/app.routes.ts
cat src/app/components/navbar/nav-items.ts
ls src/app/components/
```

Use this to:
- Confirm the exact import paths already in use
- Avoid duplicate route paths or nav labels
- Match naming conventions of existing components (e.g. `aggrid-column`)

---

## Step 1 — Derive naming variants

From `<ComponentName>`, derive:

| Variant | Example |
|---|---|
| `kebab-case-name` | `cell-renderers` |
| `ComponentName` (PascalCase) | `CellRenderers` |
| `short-nav-label` | `"Cell Renderers"` (from arg, or humanise PascalCase if omitted) |
| CLI target path | `components/<kebab-case-name>` |

---

## Step 2 — Scaffold with Angular CLI

Run the Angular CLI generator. This is the **only** way to create component files — do not create `.ts`, `.html`, or `.css` files manually.

```bash
ng g c components/<kebab-case-name>
```

This will generate exactly four files:

```
CREATE src/app/components/<kebab-case-name>.css      (0 bytes)
CREATE src/app/components/<kebab-case-name>.spec.ts  (531 bytes)
CREATE src/app/components/<kebab-case-name>.ts       (186 bytes)
CREATE src/app/components/<kebab-case-name>.html     (21 bytes)
```

Confirm all four files were created before proceeding. If the CLI errors, stop and report the error.

---

## Step 3 — Wire up AG Grid in the component

Open the generated `<kebab-case-name>.ts` and replace its contents with the AG Grid scaffold below.

Follow these conventions exactly — they match the existing `aggrid-column` component pattern in this project:

```typescript
import { Component, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-<kebab-case-name>',
  imports: [AgGridAngular],
  templateUrl: './<kebab-case-name>.html',
  styleUrl: './<kebab-case-name>.css',
})
export class <ComponentName>Component {
  rowData = signal([
    /* 5 rows of mock data relevant to this AG Grid concept */
  ]);

  colDefs = signal<ColDef[]>([
    /* 3–5 column definitions relevant to this AG Grid concept */
  ]);
}
```

**Mock data and column definitions must be meaningful for the concept being explored**, for example:
- `CellRenderers` → columns with value formatters or renderer hints
- `RowGrouping` → data with a clear groupable category column
- `Pagination` → 15–20 rows to make pagination visible
- `SortingFiltering` → mixed types (string, number, date) to demonstrate sort/filter behaviour

---

## Step 4 — Update the component template

Open the generated `<kebab-case-name>.html` and replace it with:

```html
<div class="concept-container">
  <h2><ComponentName></h2>
  <ag-grid-angular
    style="width: 100%; height: 400px;"
    [rowData]="rowData()"
    [columnDefs]="colDefs()"
  />
</div>
```

---

## Step 5 — Update the component styles

Open the generated `<kebab-case-name>.css` and add:

```css
.concept-container {
  padding: 24px;
}

h2 {
  margin-bottom: 16px;
}
```

---

## Step 6 — Register the lazy route

Open `src/app/app.routes.ts` and add this entry to the `routes` array:

```typescript
{
  path: '<kebab-case-name>',
  loadComponent: () =>
    import('./components/<kebab-case-name>')
      .then(m => m.<ComponentName>Component),
},
```

**Rules:**
- Preserve every existing route — never remove or reorder them
- Add the new route at the end of the array
- Never touch the `{ path: '', redirectTo: 'home', pathMatch: 'full' }` redirect
- Never touch the `home` route pointing to `HomeComponent`

---

## Step 7 — Add to navbar nav

Open `src/app/components/navbar/nav-items.ts` and append to the `NAV_ITEMS` array:

```typescript
{ path: '<kebab-case-name>', label: '<short-nav-label>' },
```

**Rules:**
- Preserve all existing entries — never remove or reorder them
- The `Home` entry always stays first
- Append the new entry at the end of the array

---

## Step 8 — Format changed files

```bash
npx prettier --write src/app/components/<kebab-case-name>/
npx prettier --write src/app/app.routes.ts
npx prettier --write src/app/components/navbar/nav-items.ts
```

---

## Step 9 — Confirm

Report back with a summary in this exact format:

```
✅ Scaffolded (ng g c):  src/app/components/<kebab-case-name>/   (4 files)
✅ AG Grid wired up:     <kebab-case-name>.ts + .html + .css updated
✅ Route registered:     path: '<kebab-case-name>'  →  <ComponentName>Component (lazy)
✅ Nav entry added:      label: '<short-nav-label>'
```

If any step was skipped (e.g. route already exists, nav label already present), call it out explicitly — never silently proceed.

---

## Project conventions — never violate these

| Convention | Rule |
|---|---|
| Component scaffolding | Always use `ng g c` — never create `.ts`, `.html`, `.css`, or `.spec.ts` files by hand |
| Architecture | Angular 21.2 standalone — no NgModule anywhere |
| File naming | Angular CLI default: `<kebab-case-name>.ts`, `.html`, `.css`, `.spec.ts` — no `.component.` infix (matches existing `aggrid-column.ts` pattern) |
| AG Grid | Import `AgGridAngular` from `ag-grid-angular`; register `AllCommunityModule` once at the top of the `.ts` file |
| Reactive state | Use `signal()` for `rowData` and `colDefs` — no RxJS, no plain class properties |
| Template / styles | Use `templateUrl` and `styleUrl` (external files) — not inline `template` or `styles` |
| Selector prefix | Always `app-<kebab-case-name>` |
| Lazy loading | All concept components lazy-loaded via `loadComponent` — never eagerly imported |
| Formatting | Prettier — 100-char print width, single quotes, Angular HTML parser |
| Tests | The `.spec.ts` is generated by CLI and left as-is — do not delete it, do not populate it unless explicitly asked |
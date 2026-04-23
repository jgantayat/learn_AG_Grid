# Issue: AG Grid Renders Completely Unstyled

**Project:** learn_AG_Grid  
**AG Grid version:** ag-grid-angular / ag-grid-community v35.2.1  
**Angular version:** 21.2  
**Date:** 2026-04-23

---

## Symptom

The `<ag-grid-angular>` component rendered on screen but with no visual styling — no borders, no header background, no row highlighting, no fonts. The grid appeared as raw, unstyled HTML.

---

## Root Cause Analysis

There were two compounding problems:

### Problem 1 — Missing CSS class on the grid element (immediate bug)

The legacy AG Grid theming mechanism works by scoping all CSS rules under a theme class selector (e.g. `.ag-theme-alpine`). When the stylesheet is imported, none of its rules have any effect until that class is present on the grid element.

**`app.html` (broken):**
```html
<ag-grid-angular
    [rowData]="rowData"
    [columnDefs]="colDefs" />
```

Without `class="ag-theme-alpine"` on the element, every CSS rule in `ag-theme-alpine.css` was imported into the page but matched zero elements — so the grid remained visually raw.

Additionally, AG Grid requires an **explicit height** on the container to render. Without it, the grid collapses to zero height.

---

### Problem 2 — Using the deprecated legacy CSS API (design issue)

The original code used the legacy theming approach:

**`app.ts` (broken):**
```ts
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
```

This pattern — importing CSS files as side effects and relying on a CSS class name — was deprecated starting in **AG Grid v33**. In v35, the recommended replacement is the **JavaScript Theming API**, which passes a typed theme object directly via the `[theme]` input on the grid component.

The legacy CSS files still ship in v35.2.1 for backward compatibility, which is why the imports resolved without errors and gave no warning at build time — making this bug silent and hard to spot.

---

## Fix

### `src/app/app.ts`

**Removed** the two side-effect CSS imports and added `themeAlpine` to the existing `ag-grid-community` import:

```diff
- import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
- import 'ag-grid-community/styles/ag-grid.css';
- import 'ag-grid-community/styles/ag-theme-alpine.css';
+ import { AllCommunityModule, ModuleRegistry, themeAlpine } from 'ag-grid-community';
```

**Added** a `theme` property to the component class:

```diff
  export class App {
    protected readonly title = signal('learn_AG_Grid');
+   theme = themeAlpine;
    ...
  }
```

### `src/app/app.html`

**Added** the `[theme]` input binding and an explicit height:

```diff
  <ag-grid-angular
+     style="height: 500px;"
+     [theme]="theme"
      [rowData]="rowData"
      [columnDefs]="colDefs" />
```

---

## Final State

**`src/app/app.ts` (after fix):**
```ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry, themeAlpine } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AgGridAngular],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('learn_AG_Grid');
  theme = themeAlpine;

  rowData = [
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

  colDefs: ColDef[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" }
  ];
}
```

**`src/app/app.html` (after fix):**
```html
<ag-grid-angular
    style="height: 500px;"
    [theme]="theme"
    [rowData]="rowData"
    [columnDefs]="colDefs" />
```

---

## Key Takeaways

| | Legacy API (pre-v33) | New Theming API (v33+, recommended in v35) |
|---|---|---|
| How theme is set | CSS import + CSS class on element | `themeAlpine` object via `[theme]` input |
| Build-time error if wrong | No — files still ship | N/A |
| Risk | Silent failure if class is missing | Compile error if import is wrong |
| Customization | Override CSS variables | Chain `.withParams({...})` on the theme object |

When working with AG Grid v33+, always prefer the JavaScript Theming API. Available built-in themes: `themeAlpine`, `themeBalham`, `themeMaterial`, `themeQuartz`.

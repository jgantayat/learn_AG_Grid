# Plan: Refactor Home Route + Create IntroToAggrid Component

## Context

The `/home` route currently renders `AppComponent`, which contains a raw AG Grid car demo and the
`AggridColumn` component. The goal is to:
1. Move all that existing grid content into a new `IntroToAggridComponent` (registered at `/intro-to-aggrid`)
2. Transform `AppComponent` into a polished landing page with code snippets and a best-practices section

---

## Files Created

| Path | Purpose |
|---|---|
| `src/app/components/intro-to-aggrid/intro-to-aggrid.component.ts` | Receives all current App content (car grid + AggridColumn) |

## Files Modified

| Path | Change |
|---|---|
| `src/app/app.ts` | Replaced grid logic with landing page component class |
| `src/app/app.html` | Replaced with landing page template (hero, code snippets, best practices) |
| `src/app/app.css` | Added landing page styles |
| `src/app/app.routes.ts` | Appended `intro-to-aggrid` lazy route |
| `src/app/layout/sidebar/nav-items.ts` | Appended `Intro to AG Grid` nav entry |

---

## Landing Page Sections

1. **Hero** — dark background, "Learn AG Grid" heading, subtitle, two CTA buttons
2. **Quick Start** — install command + minimal component code block
3. **Best Practices** — 6 cards covering signals, lazy loading, module registration, row IDs, theming, fixed height

## Verification

1. `npm start` — no compile errors
2. `/home` → landing page with hero, code block, best practices
3. "Get Started →" → `/intro-to-aggrid` → car grid + column demos
4. "Basic Grid →" → `/basic-grid` → employee grid
5. Sidebar: Home · Basic Grid · Intro to AG Grid

---
description: Sync with remote main, create a feature branch, analyze changes, and raise a pull request with a reviewed commit message and PR description.
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git fetch:*), Bash(git pull:*), Bash(git checkout:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(gh pr create:*), Bash(gh pr view:*)
---

## Run these commands first:

```
git status
git fetch origin
git diff HEAD origin/main --stat
```

---

## Your task:

You are about to execute a full Git workflow for the **learn_AG_Grid** Angular project — from syncing the local repo with remote `main` all the way to opening a Pull Request. Follow every step **in order** and **never skip the approval gates**.

---

## Step 1 — Sync local `main` with remote

```
git checkout main
git pull origin main
```

Confirm local `main` is up to date before proceeding.

---

## Step 2 — Create a feature branch

Derive a short kebab-case branch name from the changes observed. Use one of these prefixes based on what changed:

| Prefix | When to use |
|--------|-------------|
| `feat/` | New AG Grid concept component, new navbar route, new layout |
| `fix/` | Bug fix in a component, route, or grid config |
| `refactor/` | Restructuring existing components or layout without behaviour change |
| `style/` | CSS / Prettier formatting changes only |
| `docs/` | Updates to `CLAUDE.md`, `README.md`, or `.claude/commands/` |
| `test/` | Adding or fixing `.spec.ts` test files |
| `chore/` | Config updates — `angular.json`, `tsconfig`, `package.json` |

```
git checkout -b <branch-name>
```

State the branch name chosen and the reasoning behind it.

---

## Step 3 — Analyze the changes

```
git status
git diff
git diff --staged
```

Produce a structured summary:

| Category | Details |
|----------|---------|
| **New files** | List new files — note if it is a new AG Grid concept component, layout file, or command |
| **Modified files** | List changed files and briefly what changed |
| **Deleted files** | List any removed files |
| **AG Grid context** | If a grid component was added or changed, name the AG Grid concept it covers (e.g. sorting, cell renderers, row grouping) |
| **Key context** | Explain the *why* — what feature, fix, or refactor do these changes represent? |

---

## Step 4 — Stage all changes

```
git add .
```

---

## Step 5 — Propose the commit message (APPROVAL GATE 1)

Using the diff analysis from Step 3, compose a commit message using the format and emoji guide below.

### Commit types with emojis:

| Emoji | Type | Use for |
|-------|------|---------|
| ✨ | `feat:` | New AG Grid concept component, new sidebar entry, new layout |
| 🐛 | `fix:` | Bug fix in component, route, or grid setup |
| 🔨 | `refactor:` | Restructuring components or layout without behaviour change |
| 📝 | `docs:` | `CLAUDE.md`, `README.md`, `.claude/commands/` updates |
| 🎨 | `style:` | CSS or Prettier formatting only |
| ✅ | `test:` | Vitest spec files |
| ⚡ | `perf:` | Bundle size, lazy loading, or grid performance |

### Format:

```
<emoji> <type>: <concise description>

<optional body — present tense, explain WHY not just WHAT>
```

### Examples tailored to this project:

```
✨ feat: add CellRenderers concept component with sidebar route

Explores custom cell rendering in AG Grid using standalone Angular component.
Lazy-loaded via app.routes.ts and registered in NAV_ITEMS.
```

```
✨ feat: scaffold navbar layout with home route

Moves existing AppComponent content to HomeComponent under the /home route.
Adds NavbarComponent with NAV_ITEMS config and RouterLinkActive highlighting.
```

```
📝 docs: add /create-component Claude Code custom command

Automates new AG Grid concept component creation, route registration,
and sidebar nav entry in a single command invocation.
```

> ⛔ **STOP — Do NOT commit yet.**
> Present the proposed commit message and ask:
> *"Does this commit message look good? Reply **yes** to commit, or suggest changes."*

Only proceed to Step 6 after explicit approval.

---

## Step 6 — Commit and push

```
git commit -m "<approved commit message>"
git push origin <branch-name>
```

---

## Step 7 — Propose the Pull Request (APPROVAL GATE 2)

Compose a PR using the structure below, based on the diff analysis and approved commit message.

### PR format:

```
Title: <emoji> <type>: <same concise description as commit>

## Summary
<1–3 sentences: what this PR does and why, in the context of the AG Grid learning project>

## Changes
- <file or folder — what changed and why>
- <...>

## AG Grid Concepts Covered
<If applicable, list the AG Grid concept(s) this PR introduces or modifies.
Leave as "N/A" for layout, tooling, or docs changes.>

## Type of Change
- [ ] ✨ New AG Grid concept component
- [ ] ✨ New feature (layout, routing, navbar)
- [ ] 🐛 Bug fix
- [ ] 🔨 Refactor
- [ ] 📝 Docs / Claude command
- [ ] 🎨 Style / formatting
- [ ] ✅ Tests
- [ ] ⚡ Performance

## Testing
<Describe how to verify: e.g. "Run `npm start`, navigate to /cell-renderers, confirm grid renders with custom renderer.">

## Notes for Reviewer
<Caveats, areas to pay attention to, or follow-up TODOs>
```

> ⛔ **STOP — Do NOT create the PR yet.**
> Present the full PR title and description and ask:
> *"Does this Pull Request description look good? Reply **yes** to create the PR, or suggest changes."*

Only proceed to Step 8 after explicit approval.

---

## Step 8 — Create the Pull Request

```
gh pr create \
  --base main \
  --head <branch-name> \
  --title "<approved PR title>" \
  --body "<approved PR body>"

gh pr view
```

Display the PR URL to the user.

---

## Final recap

| Step | Status |
|------|--------|
| Synced local `main` with remote | ✅ |
| Created feature branch | ✅ `<branch-name>` |
| Analyzed and staged changes | ✅ |
| Commit message approved & committed | ✅ |
| Pushed branch to remote | ✅ |
| PR description approved & PR created | ✅ |
| PR URL | `<url>` |

---

## Rules

- **Never auto-commit** — always wait for user approval at Gate 1.
- **Never auto-create a PR** — always wait for user approval at Gate 2.
- Use **present tense** in all commit and PR messages.
- Explain **why** the change was made, not just what changed.
- If `gh` CLI is not authenticated, alert the user: *"Run `gh auth login` first, then re-run this command."*
- When a new AG Grid concept component is committed, always mention the concept name explicitly in the commit body.
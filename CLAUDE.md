# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

No build step or dependencies required. Serve locally with:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Alternatively, open `index.html` directly in a browser.

There is no test framework, linter, or CI pipeline.

## Architecture

Pure client-side app: `index.html` + `script.js` + `styles.css`. No framework, no bundler, no npm.

**State flow:**
1. `tasks` array (in-memory) is the single source of truth
2. Every mutation calls `saveAndRender()` → `saveTasks()` (localStorage) + `renderTasks()` (DOM)
3. On page load: `loadTasks()` reads from `localStorage["todo.tasks"]` → `sanitizeTasks()` normalizes data → `renderTasks()`

**Task object shape:**
```js
{ id: string, text: string, completed: boolean, createdAt: string /* ISO 8601 */ }
```

**Filtering** is stateless: `currentFilter` key maps to a predicate in the `FILTERS` object; `getFilteredTasks()` applies it on every render without mutating `tasks`.

UI language is Spanish (es-ES locale for date formatting, all user-facing strings in Spanish).

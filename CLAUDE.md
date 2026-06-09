# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Angular 22, TypeScript 6, SCSS, Vitest, Prettier. Angular Material is required by the task spec but not yet installed.

## Commands

```bash
npm start          # dev server at localhost:4200
npm run build      # production build (output: dist/)
npm test           # run Vitest unit tests

ng generate component features/photos/components/photo-grid  # scaffold component
npx tsc --noEmit   # type-check without building
```

To run a single test file:
```bash
npx vitest run src/app/features/photos/photo.service.spec.ts
```

## Architecture


**Standalone components only** - no NgModules. All components use `imports: [...]` directly.

**Signals** - use Angular signals (`signal()`, `computed()`, `effect()`) for local state, not RxJS Subject/BehaviorSubject.

**Infinite scroll** - custom implementation required; no third-party scroll libraries.

**Images** - `https://picsum.photos/{width}/{height}?random={seed}` with simulated 200-300ms delay.

## Key conventions

- SCSS for all styles, never plain CSS
- Feature-based folder structure: `src/app/features/{photos,favorites}/`
- Shared types in `src/app/shared/models/`
- Commit messages follow Conventional Commits (enforced by git hook)

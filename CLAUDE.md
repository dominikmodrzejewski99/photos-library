# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Angular 22, TypeScript 6, SCSS, Vitest, Prettier. Angular Material is installed and used (buttons, snackbar, progress spinner).

## Commands

```bash
npm start          # dev server at localhost:4200
npm run build      # production build (output: dist/)
npm test           # run Vitest unit tests

ng generate component features/photos/components/photo-list  # scaffold component
npx tsc --noEmit   # type-check without building
```

To run a single test file:
```bash
npx vitest run src/app/shared/services/photo.service.spec.ts
```

```bash
npm run e2e        # run Playwright e2e tests (starts dev server on port 4201 automatically)
npm run e2e -- --ui  # interactive mode with browser preview
```

## Architecture


**Standalone components only** - no NgModules. All components use `imports: [...]` directly.

**Signals** - use Angular signals (`signal()`, `computed()`, `effect()`) for local state, not RxJS Subject/BehaviorSubject.

**Infinite scroll** - custom implementation with `IntersectionObserver` on a sentinel element (set up in `afterNextRender`, cleaned up via `DestroyRef`); no third-party scroll libraries.

**Images** - real HTTP via `HttpClient`. The grid pages through `https://picsum.photos/v2/list?page={n}&limit={n}`; each image URL is `https://picsum.photos/id/{id}/{size}`. A simulated 200-300ms delay is applied in `PhotoService`.

## Key conventions

- SCSS for all styles, never plain CSS
- Feature-based folders under `src/app/features/{photos,favorites,photo-detail}/`; components reused across features live in `src/app/shared/components/` (photo-grid, photo-card); services in `src/app/shared/services/`
- Shared types in `src/app/shared/models/`
- Commit messages follow Conventional Commits (enforced by git hook)

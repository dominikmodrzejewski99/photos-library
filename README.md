# Photos Library

A small photo library built with Angular 22: an infinite random photostream with the ability to save photos to a persistent "Favorites" collection.

Images are served by [picsum.photos](https://picsum.photos).

**Live demo:** https://photos-library-ten.vercel.app

## Features

- **Photos** (`/`) - infinite scrollable grid of photos. Clicking a photo adds it to Favorites (with a snackbar confirmation). New photos load on scroll with a loading spinner.
- **Favorites** (`/favorites`) - the full list of saved photos. Clicking a photo opens its detail page. The list persists across page refreshes (localStorage).
- **Single photo** (`/photos/:id`) - a single large photo with a "Remove from favorites" button.
- A persistent header lets you switch between Photos and Favorites, highlighting the active view.

## Tech stack

- Angular 22 (standalone components, signals, native control flow `@if`/`@for`)
- TypeScript, SCSS (BEM), Angular Material
- Vitest for unit tests

## Getting started

Requires Node.js 20+ and npm.

```bash
npm install        # install dependencies
npm start          # dev server at http://localhost:4200
```

## Scripts

```bash
npm start          # run the dev server
npm run build      # production build (output: dist/)
npm test           # run unit tests (Vitest)
npx tsc --noEmit   # type-check without building
```

## Architecture

- **Smart / dumb components.** Page-level smart components (`PhotoList`, `FavoritesComponent`, `PhotoDetailComponent`) own state and dependencies; presentational dumb components (`PhotoGrid`, `PhotoCard`, `PhotoDetailView`) expose only `input()` / `output()`.
- **State via signals.** `PhotoService` and `FavoritesService` hold state in signals (no RxJS Subjects). Favorites are mirrored to `localStorage`.
- **Custom infinite scroll.** Implemented with `IntersectionObserver` on a sentinel element (no third-party scroll library).
- **Image optimization.** Grid and detail images use `NgOptimizedImage` (`ngSrc`) for lazy loading and priority hints.
- **Routing.** Lazy-loaded routes with route params bound to signal inputs via `withComponentInputBinding()`.

### Project structure

```
src/app/
  core/
    components/    # header (global layout, used once)
  features/
    photos/        # photo stream (smart list component)
    favorites/     # favorites screen
    photo-detail/  # single photo page (smart container + dumb view)
  shared/
    components/    # photo-grid, photo-card (reused across features)
    services/      # photo.service, favorites.service
    models/        # Photo, PhotoResponse
```

## Testing

```bash
npm test
```

Unit tests cover the services (loading, error handling, favorites persistence) and the components (rendering, click outputs, favorite toggling).

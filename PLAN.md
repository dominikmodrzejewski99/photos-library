# Plan: Photo library with infinite scroll and favorites

> This document describes the target architecture and reflects the state implemented in the repo.

## Goal

An Angular 22 app with three views (`/`, `/favorites`, `/photos/:id`), infinite scroll on the photo list, saving favorites to localStorage, and an enlarged preview of a single photo.

## Assumptions

- Angular 22: standalone components, signals, `@if`/`@for`, new control flow
- Dumb components use `input()` / `output()` (signal-based), not `@Input()`/`@Output()`
- Smart/dumb split: pages (smart) -> presentational components (dumb)
- State in services with signals - no RxJS Subject/BehaviorSubject, no NgRx
- Photo data: real HTTP via `HttpClient` to `https://picsum.photos/v2/list?page={n}&limit={n}`; simulated 200-300ms delay with the `delay()` operator inside `PhotoService.loadMore()`
- Single image URL: `https://picsum.photos/id/{id}/{size}`
- Single photo page: `id` from the route via `input.required({ transform: numberAttribute })` (route param binding through `withComponentInputBinding()`); image URL derived in a `computed()`
- Favorites persistence: plain signals + explicit localStorage (`getItem` at init, `setItem` on add/remove)
- Infinite scroll: `IntersectionObserver` on a sentinel div, set up in `afterNextRender()`, cleaned up via `DestroyRef.onDestroy()`
- Angular Material: installed; used for buttons, snackbar, and spinner
- No NgRx, no IndexedDB

## Architecture (as implemented)

1. Model in `src/app/shared/models/photo.model.ts`: `Photo { id, url }` and `PhotoResponse` (shape of the picsum response)
2. `FavoritesService` in `src/app/shared/services/favorites.service.ts`:
   - `_favorites = signal<Photo[]>(...)` initialized from localStorage, exposed as `favorites` via `asReadonly()`
   - `favoriteIds` as `computed(new Set(...))` for fast `isFavorite`
   - `addFavorite` (with deduplication), `removeFavorite`, `isFavorite` - each mutation persists to localStorage
3. `PhotoService` in `src/app/shared/services/photo.service.ts`:
   - `photos`, `isLoading`, `error` as signals
   - `loadMore()`: guard on `isLoading`, HTTP request with `page`/`limit`, `delay()` 200-300ms, mapping `PhotoResponse -> Photo`, incrementing `page`; the error path sets a friendly message and releases `isLoading`
4. Dumb `PhotoCard` in `src/app/shared/components/photo-card/`: `photo = input.required<Photo>()`, optional `priority` (LCP), `photoClick = output<Photo>()`
5. Dumb `PhotoGrid` in `src/app/shared/components/photo-grid/`: `photos`/`isLoading`/`error` as inputs, `photoClick` and `retry` as outputs; `@for` over the photos, spinner while loading, error state with a "Retry" button; reused on Photos and Favorites
6. Dumb `PhotoDetailView` in `src/app/features/photo-detail/components/photo-detail-view/`: `photo = input.required<Photo>()`, `removeClick = output<void>()`; image + `MatButton` "Remove from favorites"
7. `Header` in `src/app/core/components/header/`: two `MatButton`s with `routerLink` and `routerLinkActive`
8. Routes in `src/app/app.routes.ts`: `/` (eager) -> `PhotoList`, `/favorites` and `/photos/:id` (lazy), wildcard; `withComponentInputBinding()`
9. Smart `PhotoList` in `src/app/features/photos/components/photo-list/`:
   - sentinel `<div #sentinel>`, `IntersectionObserver` in `afterNextRender()`, cleanup via `DestroyRef`
   - the first page loads implicitly: the sentinel starts in the viewport, so `observe()` fires the callback immediately
   - `(photoClick)` -> `favoritesService.addFavorite()` + snackbar ("Added" / "Already in favorites")
   - `(retry)` -> re-runs `loadMore()`
10. Smart `FavoritesComponent` in `src/app/features/favorites/`: `PhotoGrid` with `favoritesService.favorites()`, a click navigates to `/photos/:id`
11. Smart `PhotoDetailComponent` in `src/app/features/photo-detail/`: `id` from the route, `photo` as a `computed()`, `(removeClick)` -> `favoritesService.removeFavorite()` + navigation to `/favorites`

## Tests (Vitest)

- `favorites.service.spec.ts`: add/remove/dedup/isFavorite, localStorage persistence across instances
- `photo.service.spec.ts`: accumulation, `page` increment, mapping, error paths, request dedup (fake timers + `HttpTestingController`)
- component specs: rendering, click outputs, favorite toggling, retry, remove + navigation flow

## Acceptance criteria

- [x] `/` shows a 3-column grid, scroll loads the next batches with a visible spinner
- [x] Clicking a photo on `/` adds it to favorites
- [x] `/favorites` shows the saved photos, the list persists after a page refresh
- [x] Clicking a favorite photo opens `/photos/:id`
- [x] `/photos/:id` shows one large photo and a "Remove from favorites" button
- [x] Header always visible, the active view highlighted
- [x] `npm test` passes, `npx tsc --noEmit` has no errors

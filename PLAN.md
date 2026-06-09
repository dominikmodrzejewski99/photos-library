# Plan: Biblioteka zdjęć z infinite scrollem i ulubionymi

## Cel

Aplikacja Angular 22 z trzema widokami (`/`, `/favorites`, `/photos/:id`), infinite scrollem na liście zdjęć, zapisywaniem ulubionych w localStorage i full-screen podglądem pojedynczego zdjęcia.

## Założenia

- Angular 22: standalone components, signals, `resource()`, `@if`/`@for`, nowy control flow
- Dumb components używają `input()` i `output()` (signal-based), nie `@Input()`/`@Output()`
- Podział smart/dumb: strony (smart) -> komponenty prezentacyjne (dumb)
- Stan w serwisach z signals - bez RxJS Subject/BehaviorSubject, bez NgRx
- Infinite scroll: `async loadMore()` + `signal.update(prev => [...prev, ...batch])` - prosta akumulacja
- Opóźnienie API: `setTimeout` 200-300ms wewnątrz `loadMore()`, brak prawdziwego HTTP (picsum.photos to img src, nie endpoint)
- Single photo page: `resource()` z `injectRouteParam('id')` jako params
- Persystencja ulubionych: plain signals + jawny localStorage (`getItem` przy init, `setItem` w add/remove)
- Infinite scroll detekcja: `IntersectionObserver` na sentinel div, setup w `afterNextRender()`, cleanup przez `DestroyRef.onDestroy()`
- Angular Material wymagany przez TASK.md, jeszcze nie zainstalowany
- Brak NgRx, brak IndexedDB

## Kroki

1. Zainstaluj Angular Material: `ng add @angular/material` (wybierz dowolny motyw)
2. Utwórz model w `src/app/shared/models/photo.model.ts`: `{ id: number, url: string }`
3. Utwórz `FavoritesService` w `src/app/shared/services/favorites.service.ts`:
   - `favorites = signal<Photo[]>([])` - inicjalizowany z localStorage przy konstrukcji
   - metody `add(photo)`, `remove(id)`, `isFavorite(id)` - każda kończy się `localStorage.setItem`
4. Utwórz `PhotoService` w `src/app/features/photos/photo.service.ts`:
   - `photos = signal<Photo[]>([])`, `loading = signal(false)`
   - `async loadMore()`: ustaw loading, czekaj `setTimeout` 200-300ms, dokładaj batch przez `signal.update()`
   - batch generuje URL-e `https://picsum.photos/200/300?random={seed}` z inkrementującym seedem
5. Zbuduj dumb `PhotoCardComponent` w `src/app/shared/components/photo-card/`:
   - `photo = input.required<Photo>()`, `photoClick = output<Photo>()`
   - wyświetla jedno zdjęcie, emituje klik
6. Zbuduj dumb `PhotoGridComponent` w `src/app/shared/components/photo-grid/`:
   - `photos = input.required<Photo[]>()`, `photoClick = output<Photo>()`
   - `@for` po `photos()`, renderuje `PhotoCardComponent`, przekazuje klik w górę
   - reużywalny na Photos i Favorites (rodzic decyduje co robi klik)
7. Zbuduj dumb `PhotoDetailViewComponent` w `src/app/shared/components/photo-detail-view/`:
   - `photo = input.required<Photo>()`, `removeClick = output<void>()`
   - full-screen foto + `MatButton` "Remove from favorites"
8. Zbuduj `HeaderComponent` w `src/app/shared/components/header/`:
   - dwa przyciski `MatButton` z `routerLink` i `routerLinkActive` (podświetla aktywny widok)
9. Skonfiguruj trasy w `src/app/app.routes.ts`:
   - `/` -> `PhotosComponent`, `/favorites` -> `FavoritesComponent`, `/photos/:id` -> `PhotoDetailComponent`
10. Zintegruj `HeaderComponent` i `<router-outlet>` w `src/app/app.component.ts` / `app.component.html`; usuń domyślny placeholder Angular
11. Zbuduj smart `PhotosComponent` w `src/app/features/photos/photos.component.ts`:
    - sentinel `<div #sentinel>` na dole, `IntersectionObserver` w `afterNextRender()`, cleanup przez `DestroyRef.onDestroy()`
    - przy `isIntersecting` woła `photoService.loadMore()`; pierwsze `loadMore()` w konstruktorze
    - używa `PhotoGridComponent`, na `(photoClick)` woła `favoritesService.add(photo)`
    - `MatProgressSpinner` gdy `photoService.loading()`
12. Zbuduj smart `FavoritesComponent` w `src/app/features/favorites/favorites.component.ts`:
    - używa `PhotoGridComponent` z `[photos]="favoritesService.favorites()"`
    - na `(photoClick)` nawiguje do `/photos/:id`
13. Zbuduj smart `PhotoDetailComponent` w `src/app/features/photo-detail/photo-detail.component.ts`:
    - `resource()` z `params: () => ({ id: injectRouteParam('id')() })`
    - używa `PhotoDetailViewComponent`, na `(removeClick)` woła `favoritesService.remove(id)` + nawiguje do `/favorites`
14. Dodaj testy Vitest:
    - `src/app/shared/services/favorites.service.spec.ts`: add/remove/isFavorite, persystencja w localStorage
    - `src/app/features/photos/photo.service.spec.ts`: `loadMore()` akumuluje zdjęcia, loading state toggle

## Kryteria akceptacji

- [ ] `/` wyświetla grid 3-kolumnowy, scroll ładuje kolejne porcje z widocznym spinnerem
- [ ] Kliknięcie zdjęcia na `/` dodaje je do ulubionych
- [ ] `/favorites` wyświetla zapisane zdjęcia, lista persystuje po odświeżeniu strony
- [ ] Klik na ulubione zdjęcie otwiera `/photos/:id`
- [ ] `/photos/:id` pokazuje jedno duże zdjęcie i przycisk "Remove from favorites"
- [ ] Header zawsze widoczny, aktywny widok wyróżniony
- [ ] `npm test` przechodzi, `npx tsc --noEmit` bez błędów

## Ryzyka

- **Angular Material nie zainstalowany**: krok 1 jest blokerem dla UI - zrób go jako pierwszy
- **`injectRouteParam` API**: sprawdź czy dostępne w Angular 22; fallback to `inject(ActivatedRoute).snapshot.paramMap.get('id')`
- **picsum.photos seed a ID**: `?random={n}` daje inne zdjęcie per seed, ale to samo zdjęcie dla tego samego n - ID zdjęcia = seed, co upraszcza single photo page
- **IntersectionObserver przy pierwszym renderze**: `loadMore()` musi być wywołane raz przy init żeby lista nie była pusta; wołaj je w konstruktorze lub `ngOnInit`

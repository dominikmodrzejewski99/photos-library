import { Routes } from '@angular/router';
import { PhotoList } from "./features/photos/components/photo-list/photo-list";

export const routes: Routes = [
  { path: '', component: PhotoList },
  {
    path: 'photos/:id',
    loadComponent: () =>
      import('./features/photo-detail/components/photo-detail/photo-detail').then((m) => m.PhotoDetail),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites.component').then((m) => m.FavoritesComponent),
  },
  { path: '**', redirectTo: '' },
];

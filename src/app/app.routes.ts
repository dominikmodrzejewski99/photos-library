import { Routes } from '@angular/router';
import { PhotoList } from "./features/photos/components/photo-list/photo-list";

export const routes: Routes = [
  { path: '', component: PhotoList, data: { activeSection: 'photos' } },
  {
    path: 'photos/:id',
    loadComponent: () =>
      import('./features/photo-detail/photo-detail.component').then((m) => m.PhotoDetailComponent),
    data: { activeSection: 'favorites' },
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites.component').then((m) => m.FavoritesComponent),
    data: { activeSection: 'favorites' },
  },
  { path: '**', redirectTo: '' },
];

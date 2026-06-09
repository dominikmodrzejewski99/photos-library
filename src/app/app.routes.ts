import { Routes } from '@angular/router';
import { PhotoList } from './features/photos/components/photo-list/photo-list';

export const routes: Routes = [
  { path: '', component: PhotoList },
  { path: '**', redirectTo: '' },
];

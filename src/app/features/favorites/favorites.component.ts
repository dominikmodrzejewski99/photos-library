import { Component, inject } from '@angular/core';
import { PhotoGrid } from '../photos/components/photo-grid/photo-grid';
import { FavoritesService } from '../../shared/services/favorites.service';

@Component({
  selector: 'app-favorites',
  imports: [PhotoGrid],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);

  readonly photos = this.favoritesService.favorites;
}

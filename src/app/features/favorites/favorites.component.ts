import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoGrid } from '../photos/components/photo-grid/photo-grid';
import { FavoritesService } from '../../shared/services/favorites.service';
import { Photo } from '../../shared/models/photo.model';

@Component({
  selector: 'app-favorites',
  imports: [PhotoGrid],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);
  private router = inject(Router);

  readonly photos = this.favoritesService.favorites;

  onPhotoClick(photo: Photo): void {
    this.router.navigate(['/photos', photo.id]);
  }
}

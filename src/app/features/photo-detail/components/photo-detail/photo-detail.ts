import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoDetailView } from '../../../../shared/components/photo-detail-view/photo-detail-view';
import { FavoritesService } from '../../../../shared/services/favorites.service';
import { Photo } from '../../../../shared/models/photo.model';

const PHOTO_WIDTH = 800;
const PHOTO_HEIGHT = 800;

@Component({
  selector: 'app-photo-detail',
  imports: [PhotoDetailView],
  templateUrl: './photo-detail.html',
  styleUrl: './photo-detail.scss',
})
export class PhotoDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private favoritesService = inject(FavoritesService);

  readonly photo = computed<Photo>(() => {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    return { id, url: `https://picsum.photos/id/${id}/${PHOTO_WIDTH}/${PHOTO_HEIGHT}` };
  });

  readonly isFavorite = computed(() => this.favoritesService.isFavorite(this.photo().id));

  onFavoriteClick(): void {
    if (this.isFavorite()) {
      this.favoritesService.removeFavorite(this.photo().id);
    } else {
      this.favoritesService.addFavorite(this.photo());
    }
  }
}

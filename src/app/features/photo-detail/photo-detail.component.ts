import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PhotoDetailView } from '../../shared/components/photo-detail-view/photo-detail-view';
import { FavoritesService } from '../../shared/services/favorites.service';
import { Photo } from '../../shared/models/photo.model';

const PHOTO_WIDTH = 800;
const PHOTO_HEIGHT = 800;

@Component({
  selector: 'app-photo-detail',
  imports: [PhotoDetailView],
  templateUrl: './photo-detail.component.html',
  styleUrl: './photo-detail.component.scss',
})
export class PhotoDetailComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly apiUrl = environment.apiUrl;

  readonly id = input.required({ transform: numberAttribute });

  readonly photo = computed<Photo>(() => ({
    id: this.id(),
    url: `${this.apiUrl}/id/${this.id()}/${PHOTO_WIDTH}/${PHOTO_HEIGHT}`,
  }));

  readonly isFavorite = computed(() => this.favoritesService.isFavorite(this.id()));

  onToggleFavorite(): void {
    if (this.isFavorite()) {
      this.favoritesService.removeFavorite(this.id());
    } else {
      this.favoritesService.addFavorite(this.photo());
    }
  }
}

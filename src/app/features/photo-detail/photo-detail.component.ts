import { Component, computed, effect, inject, input, numberAttribute } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PhotoDetailView } from './components/photo-detail-view/photo-detail-view';
import { FavoritesService } from '../../shared/services/favorites.service';
import { Photo } from '../../shared/models/photo.model';

const PHOTO_SIZE = 600;

@Component({
  selector: 'app-photo-detail',
  imports: [PhotoDetailView],
  templateUrl: './photo-detail.component.html',
  styleUrl: './photo-detail.component.scss',
})
export class PhotoDetailComponent {
  private readonly router = inject(Router);
  private readonly favoritesService = inject(FavoritesService);
  private readonly apiUrl = environment.apiUrl;

  readonly id = input.required({ transform: numberAttribute });

  readonly photo = computed<Photo>(() => {
    const saved = this.favoritesService.favorites().find((p) => p.id === this.id());
    return {
      id: this.id(),
      url: `${this.apiUrl}/id/${this.id()}/${PHOTO_SIZE}`,
      author: saved?.author ?? '',
    };
  });

  constructor() {
    const title = inject(Title);
    effect(() => {
      const author = this.photo().author;
      title.setTitle(author ? `Photo by ${author}` : 'Photo detail');
    });
  }

  onRemoveClick(): void {
    this.favoritesService.removeFavorite(this.id());
    this.router.navigate(['/favorites']);
  }
}

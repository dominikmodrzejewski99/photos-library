import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { PhotoGrid } from '../photo-grid/photo-grid';
import { PhotoService } from '../../../../shared/services/photo-service';
import { FavoritesService } from '../../../../shared/services/favorites';
import { Photo } from '../../../../shared/models/photo.model';

@Component({
  selector: 'app-photo-list',
  imports: [PhotoGrid],
  templateUrl: './photo-list.html',
  styleUrl: './photo-list.scss',
})
export class PhotoList {
  private photoService = inject(PhotoService);
  private favoritesService = inject(FavoritesService);
  private destroyRef = inject(DestroyRef);
  private sentinel = viewChild.required<ElementRef>('sentinel');

  readonly photos = this.photoService.photos;
  readonly isLoading = this.photoService.isLoading;
  readonly error = this.photoService.error;

  constructor() {
    this.photoService.loadMore();

    afterNextRender(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          this.photoService.loadMore();
        }
      });
      observer.observe(this.sentinel().nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  onPhotoClick(photo: Photo): void {
    this.favoritesService.addFavorite(photo);
  }
}

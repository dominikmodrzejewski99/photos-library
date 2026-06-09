import {inject, Service, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, delay, EMPTY, map} from 'rxjs';
import {Photo, PhotoResponse} from '../models/photo.model';

const DELAY_MIN_MS = 200;
const DELAY_MAX_MS = 300;
const PHOTO_WIDTH = 400;
const PHOTO_HEIGHT = 600;

@Service()
export class PhotoService {
  private http = inject(HttpClient);

  private pageSize = 1;
  private limit = 10;

  readonly photos = signal<Photo[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  loadMore(): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.error.set(null);

    const params = new HttpParams()
      .set('page', this.pageSize)
      .set('limit', this.limit);

    this.http
      .get<PhotoResponse[]>('https://picsum.photos/v2/list', {params})
      .pipe(
        delay(DELAY_MIN_MS + Math.random() * (DELAY_MAX_MS - DELAY_MIN_MS)),
        map((photos) => photos.map((photo: PhotoResponse) => ({
          id: Number(photo.id),
          url: `https://picsum.photos/id/${photo.id}/${PHOTO_WIDTH}/${PHOTO_HEIGHT}`,
        }))),
        catchError((err) => {
          this.error.set(err.message ?? 'Failed to load photos');
          this.isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe({
        next: (photos: Photo[]) => {
          this.photos.update((prev) => [...prev, ...photos]);
          this.pageSize++;
          this.isLoading.set(false);
        },
      });
  }
}

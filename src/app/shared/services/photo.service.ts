import {inject, Service, signal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, delay, EMPTY, map} from 'rxjs';
import {Photo, PhotoResponse} from '../models/photo.model';
import {environment} from '../../../environments/environment';

const DELAY_MIN_MS = 200;
const DELAY_MAX_MS = 300;
// Picsum returns a square image when only one dimension is given.
const PHOTO_SIZE = 400;

@Service()
export class PhotoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private page = Math.floor(Math.random() * 100) + 1;
  private limit = 9;

  readonly photos = signal<Photo[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  loadMore(): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.error.set(null);

    const params = new HttpParams()
      .set('page', this.page)
      .set('limit', this.limit);

    this.http
      .get<PhotoResponse[]>(`${this.apiUrl}/v2/list`, {params})
      .pipe(
        delay(DELAY_MIN_MS + Math.random() * (DELAY_MAX_MS - DELAY_MIN_MS)),
        map((photos) => photos.map((photo: PhotoResponse) => ({
          id: Number(photo.id),
          url: `${this.apiUrl}/id/${photo.id}/${PHOTO_SIZE}`,
        }))),
        catchError(() => {
          this.error.set('Could not load photos. Please try again.');
          this.isLoading.set(false);
          return EMPTY;
        }),
      )
      .subscribe({
        next: (photos: Photo[]) => {
          if (photos.length === 0) {
            this.page = 1;
          } else {
            this.photos.update((prev) => [...prev, ...photos]);
            this.page++;
          }
          this.isLoading.set(false);
        },
      });
  }
}

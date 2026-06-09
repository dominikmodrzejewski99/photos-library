import { computed, Service, signal } from '@angular/core';
import { Photo } from '../models/photo.model';

const STORAGE_KEY = 'favorites';

@Service()
export class FavoritesService {
  private readonly _favorites = signal<Photo[]>(this.loadFromStorage());

  readonly favorites = this._favorites.asReadonly();

  private readonly favoriteIds = computed(
    () => new Set(this._favorites().map((p) => p.id)),
  );

  isFavorite(id: number): boolean {
    return this.favoriteIds().has(id);
  }

  addFavorite(photo: Photo): void {
    if (this.isFavorite(photo.id)) return;
    this._favorites.update((prev) => [...prev, photo]);
    this.persist();
  }

  removeFavorite(id: number): void {
    this._favorites.update((prev) => prev.filter((p) => p.id !== id));
    this.persist();
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._favorites()));
  }

  private loadFromStorage(): Photo[] {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

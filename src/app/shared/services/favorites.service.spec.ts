import { TestBed } from '@angular/core/testing';

import { FavoritesService } from './favorites.service';
import { Photo } from '../models/photo.model';

const photoA: Photo = { id: 1, url: 'https://picsum.photos/id/1/400' };
const photoB: Photo = { id: 2, url: 'https://picsum.photos/id/2/400' };

function createService(): FavoritesService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({});
  return TestBed.inject(FavoritesService);
}

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    localStorage.clear();
    service = createService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts with an empty favorites list', () => {
    expect(service.favorites()).toEqual([]);
  });

  it('adds a photo to favorites', () => {
    service.addFavorite(photoA);
    expect(service.favorites()).toEqual([photoA]);
    expect(service.isFavorite(photoA.id)).toBe(true);
  });

  it('does not add the same photo twice', () => {
    service.addFavorite(photoA);
    service.addFavorite(photoA);
    expect(service.favorites()).toEqual([photoA]);
  });

  it('removes a photo from favorites', () => {
    service.addFavorite(photoA);
    service.addFavorite(photoB);
    service.removeFavorite(photoA.id);
    expect(service.favorites()).toEqual([photoB]);
    expect(service.isFavorite(photoA.id)).toBe(false);
  });

  it('reports isFavorite false for unknown ids', () => {
    expect(service.isFavorite(999)).toBe(false);
  });

  it('persists favorites to localStorage', () => {
    service.addFavorite(photoA);
    expect(JSON.parse(localStorage.getItem('favorites') ?? '[]')).toEqual([
      photoA,
    ]);
  });

  it('restores favorites from localStorage in a new instance', () => {
    service.addFavorite(photoA);
    service.addFavorite(photoB);

    const restored = createService();
    expect(restored.favorites()).toEqual([photoA, photoB]);
    expect(restored.isFavorite(photoA.id)).toBe(true);
  });

  it('falls back to an empty list when stored data is corrupt', () => {
    localStorage.setItem('favorites', 'not json');
    const fresh = createService();
    expect(fresh.favorites()).toEqual([]);
  });
});

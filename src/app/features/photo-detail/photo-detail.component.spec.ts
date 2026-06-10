import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';

import { PhotoDetailComponent } from './photo-detail.component';
import { FavoritesService } from '../../shared/services/favorites.service';

describe('PhotoDetailComponent', () => {
  let component: PhotoDetailComponent;
  let fixture: ComponentFixture<PhotoDetailComponent>;
  let favorites: FavoritesService;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PhotoDetailComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailComponent);
    fixture.componentRef.setInput('id', 7);
    component = fixture.componentInstance;
    favorites = TestBed.inject(FavoritesService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('builds the photo from the route id', () => {
    expect(component.photo().id).toBe(7);
    expect(component.photo().url).toContain('/id/7/');
  });

  it('removes the photo from favorites on remove', () => {
    const removeSpy = vi.spyOn(favorites, 'removeFavorite');
    component.onRemoveClick();
    expect(removeSpy).toHaveBeenCalledWith(7);
  });

  it('navigates back to favorites on remove', () => {
    component.onRemoveClick();
    expect(router.navigate).toHaveBeenCalledWith(['/favorites']);
  });
});

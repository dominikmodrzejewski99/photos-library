import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FavoritesComponent } from './favorites.component';
import { FavoritesService } from '../../shared/services/favorites.service';

const mockPhotos = [
  { id: 1, url: 'https://picsum.photos/id/1/400/600' },
  { id: 2, url: 'https://picsum.photos/id/2/400/600' },
];

describe('FavoritesComponent', () => {
  describe('with no favorites', () => {
    let component: FavoritesComponent;
    let fixture: ComponentFixture<FavoritesComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FavoritesComponent],
        providers: [
          provideRouter([]),
          { provide: FavoritesService, useValue: { favorites: signal([]) } },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FavoritesComponent);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display empty state message', () => {
      const msg: HTMLElement = fixture.nativeElement.querySelector('.favorites__empty');
      expect(msg).toBeTruthy();
      expect(msg.textContent).toContain('No favorites yet');
    });

    it('should not show photo grid', () => {
      const grid = fixture.nativeElement.querySelector('app-photo-grid');
      expect(grid).toBeNull();
    });
  });

  describe('with favorites', () => {
    let component: FavoritesComponent;
    let fixture: ComponentFixture<FavoritesComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FavoritesComponent],
        providers: [
          provideRouter([]),
          { provide: FavoritesService, useValue: { favorites: signal(mockPhotos) } },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FavoritesComponent);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('should render photo grid', () => {
      const grid = fixture.nativeElement.querySelector('app-photo-grid');
      expect(grid).toBeTruthy();
    });

    it('should not show empty message', () => {
      const msg = fixture.nativeElement.querySelector('.favorites__empty');
      expect(msg).toBeNull();
    });

    it('should pass photos to photo grid', () => {
      const cards = fixture.nativeElement.querySelectorAll('img');
      expect(cards.length).toBe(mockPhotos.length);
    });
  });
});

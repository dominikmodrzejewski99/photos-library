import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { vi } from 'vitest';
import { PhotoList } from './photo-list';
import { FavoritesService } from '../../../../shared/services/favorites.service';

const mockPhoto = { id: 5, url: 'https://picsum.photos/id/5/400/600' };

describe('PhotoList', () => {
  let component: PhotoList;
  let fixture: ComponentFixture<PhotoList>;
  let favorites: FavoritesService;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PhotoList],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoList);
    component = fixture.componentInstance;
    favorites = TestBed.inject(FavoritesService);
    snackBar = TestBed.inject(MatSnackBar);
    vi.spyOn(snackBar, 'open').mockReturnValue({} as never);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add the photo to favorites on click', () => {
    const addSpy = vi.spyOn(favorites, 'addFavorite');
    component.onPhotoClick(mockPhoto);
    expect(addSpy).toHaveBeenCalledWith(mockPhoto);
  });

  it('should show "Added to favorites" snackbar for a new photo', () => {
    component.onPhotoClick(mockPhoto);
    expect(snackBar.open).toHaveBeenCalledWith('Added to favorites', 'Dismiss', {
      duration: 2000,
    });
  });

  it('should show "Already in favorites" snackbar for an existing favorite', () => {
    favorites.addFavorite(mockPhoto);
    component.onPhotoClick(mockPhoto);
    expect(snackBar.open).toHaveBeenCalledWith('Already in favorites', 'Dismiss', {
      duration: 2000,
    });
  });
});

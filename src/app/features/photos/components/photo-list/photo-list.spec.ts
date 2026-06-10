import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { vi } from 'vitest';
import { PhotoList } from './photo-list';
import { FavoritesService } from '../../../../shared/services/favorites.service';
import { PhotoService } from '../../../../shared/services/photo.service';

const mockPhoto = { id: 5, url: 'https://picsum.photos/id/5/400/600' };

// Capture the IntersectionObserver callback so tests can drive intersections
// without a real layout/viewport.
let observerCallback: IntersectionObserverCallback;
const observeSpy = vi.fn();
const disconnectSpy = vi.fn();

class MockIntersectionObserver {
  constructor(cb: IntersectionObserverCallback) {
    observerCallback = cb;
  }
  observe = observeSpy;
  unobserve = vi.fn();
  disconnect = disconnectSpy;
  takeRecords = vi.fn(() => []);
}

function intersect(isIntersecting: boolean): void {
  observerCallback(
    [{ isIntersecting } as IntersectionObserverEntry],
    {} as IntersectionObserver,
  );
}

describe('PhotoList', () => {
  let component: PhotoList;
  let fixture: ComponentFixture<PhotoList>;
  let favorites: FavoritesService;
  let photoService: PhotoService;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    localStorage.clear();
    observeSpy.mockClear();
    disconnectSpy.mockClear();
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    await TestBed.configureTestingModule({
      imports: [PhotoList],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoList);
    component = fixture.componentInstance;
    favorites = TestBed.inject(FavoritesService);
    photoService = TestBed.inject(PhotoService);
    snackBar = TestBed.inject(MatSnackBar);
    // Keep loadMore from firing real HTTP; we only assert it is invoked.
    vi.spyOn(photoService, 'loadMore').mockImplementation(() => {});
    vi.spyOn(snackBar, 'open').mockReturnValue({} as never);
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('observes the sentinel element for infinite scroll', () => {
    expect(observeSpy).toHaveBeenCalledOnce();
  });

  it('calls loadMore when the sentinel enters the viewport', () => {
    (photoService.loadMore as ReturnType<typeof vi.fn>).mockClear();
    intersect(true);
    expect(photoService.loadMore).toHaveBeenCalledOnce();
  });

  it('does not call loadMore when the sentinel is not intersecting', () => {
    (photoService.loadMore as ReturnType<typeof vi.fn>).mockClear();
    intersect(false);
    expect(photoService.loadMore).not.toHaveBeenCalled();
  });

  it('disconnects the observer on destroy', () => {
    fixture.destroy();
    expect(disconnectSpy).toHaveBeenCalledOnce();
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

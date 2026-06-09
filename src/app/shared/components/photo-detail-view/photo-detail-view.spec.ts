import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { PhotoDetailView } from './photo-detail-view';

const mockPhoto = { id: 1, url: 'https://picsum.photos/id/1/800/800' };

describe('PhotoDetailView', () => {
  let component: PhotoDetailView;
  let fixture: ComponentFixture<PhotoDetailView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoDetailView],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailView);
    fixture.componentRef.setInput('photo', mockPhoto);
    fixture.componentRef.setInput('isFavorite', false);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the photo image', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.src).toContain(mockPhoto.url);
  });

  it('should show "Add to favorites" when not a favorite', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.textContent?.trim()).toBe('Add to favorites');
  });

  it('should show "Remove from favorites" when is a favorite', async () => {
    fixture.componentRef.setInput('isFavorite', true);
    await fixture.whenStable();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.textContent?.trim()).toBe('Remove from favorites');
  });

  it('should emit toggleFavorite when button is clicked', () => {
    const spy = vi.spyOn(component.toggleFavorite, 'emit');
    fixture.debugElement.query(By.css('button')).triggerEventHandler('click');
    expect(spy).toHaveBeenCalledOnce();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { PhotoGrid } from './photo-grid';
import { Photo } from '../../models/photo.model';

const mockPhotos: Photo[] = [
  { id: 1, url: 'https://picsum.photos/id/1/400/600' },
  { id: 2, url: 'https://picsum.photos/id/2/400/600' },
];

describe('PhotoGrid', () => {
  let component: PhotoGrid;
  let fixture: ComponentFixture<PhotoGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGrid],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoGrid);
    fixture.componentRef.setInput('photos', mockPhotos);
    fixture.componentRef.setInput('isLoading', false);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a photo-card for each photo', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-photo-card');
    expect(cards.length).toBe(mockPhotos.length);
  });

  it('should show spinner when isLoading is true', async () => {
    fixture.componentRef.setInput('isLoading', true);
    await fixture.whenStable();
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should show error message when error is set', async () => {
    fixture.componentRef.setInput('error', 'Failed to load');
    await fixture.whenStable();
    const error = fixture.nativeElement.querySelector('.photo-grid__error');
    expect(error?.textContent).toContain('Failed to load');
  });

  it('should emit retry when the Retry button is clicked', async () => {
    fixture.componentRef.setInput('error', 'Failed to load');
    await fixture.whenStable();
    const spy = vi.spyOn(component.retry, 'emit');
    fixture.debugElement
      .query(By.css('.photo-grid__error button'))
      .triggerEventHandler('click');
    expect(spy).toHaveBeenCalledOnce();
  });
});

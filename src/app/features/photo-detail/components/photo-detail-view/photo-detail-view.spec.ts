import { PRECONNECT_CHECK_BLOCKLIST } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { PhotoDetailView } from './photo-detail-view';

const mockPhoto = { id: 1, url: 'https://picsum.photos/id/1/800/800', author: 'Author A' };

describe('PhotoDetailView', () => {
  let component: PhotoDetailView;
  let fixture: ComponentFixture<PhotoDetailView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoDetailView],
      providers: [{ provide: PRECONNECT_CHECK_BLOCKLIST, useValue: ['https://picsum.photos'] }],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailView);
    fixture.componentRef.setInput('photo', mockPhoto);
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

  it('should show the "Remove from favorites" button', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.textContent?.trim()).toBe('Remove from favorites');
  });

  it('should emit removeClick when button is clicked', () => {
    const spy = vi.spyOn(component.removeClick, 'emit');
    fixture.debugElement.query(By.css('button')).triggerEventHandler('click');
    expect(spy).toHaveBeenCalledOnce();
  });
});

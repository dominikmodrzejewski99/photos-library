import { PRECONNECT_CHECK_BLOCKLIST } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { PhotoCard } from './photo-card';

const mockPhoto = { id: 1, url: 'https://picsum.photos/id/1/400/600' };

describe('PhotoCard', () => {
  let component: PhotoCard;
  let fixture: ComponentFixture<PhotoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCard],
      providers: [{ provide: PRECONNECT_CHECK_BLOCKLIST, useValue: ['https://picsum.photos'] }],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCard);
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

  it('should emit photoClick with the photo when clicked', () => {
    const spy = vi.spyOn(component.photoClick, 'emit');
    fixture.debugElement.query(By.css('button')).triggerEventHandler('click');
    expect(spy).toHaveBeenCalledWith(mockPhoto);
  });
});

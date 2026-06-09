import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoCard } from './photo-card';

const mockPhoto = { id: 1, url: 'https://picsum.photos/id/1/200/300' };

describe('PhotoCard', () => {
  let component: PhotoCard;
  let fixture: ComponentFixture<PhotoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCard],
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
    const emitted: unknown[] = [];
    component.photoClick.subscribe((p) => emitted.push(p));

    fixture.nativeElement.querySelector('img').click();

    expect(emitted).toEqual([mockPhoto]);
  });
});

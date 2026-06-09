import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PhotoDetail } from './photo-detail';
import { routes } from '../../../../app.routes';

describe('PhotoDetail', () => {
  let component: PhotoDetail;
  let fixture: ComponentFixture<PhotoDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoDetail],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

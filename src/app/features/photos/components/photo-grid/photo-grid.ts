import { Component, input, output } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PhotoCard } from '../photo-card/photo-card';
import { Photo } from '../../../../shared/models/photo.model';

@Component({
  selector: 'app-photo-grid',
  imports: [MatProgressSpinnerModule, PhotoCard],
  templateUrl: './photo-grid.html',
  styleUrl: './photo-grid.scss',
})
export class PhotoGrid {
  readonly photos = input.required<Photo[]>();
  readonly isLoading = input.required<boolean>();
  readonly error = input<string | null>(null);

  readonly photoClick = output<Photo>();
}

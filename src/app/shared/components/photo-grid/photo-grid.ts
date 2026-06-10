import { Component, input, output } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { PhotoCard } from '../photo-card/photo-card';
import { Photo } from '../../models/photo.model';

const PRIORITY_COUNT = 9;

@Component({
  selector: 'app-photo-grid',
  imports: [MatProgressSpinnerModule, MatButtonModule, PhotoCard],
  templateUrl: './photo-grid.html',
  styleUrl: './photo-grid.scss',
})
export class PhotoGrid {
  readonly photos = input.required<Photo[]>();
  readonly isLoading = input.required<boolean>();
  readonly error = input<string | null>(null);

  readonly photoClick = output<Photo>();
  readonly retry = output<void>();

  protected readonly priorityCount = PRIORITY_COUNT;
}

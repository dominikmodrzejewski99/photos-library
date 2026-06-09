import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Photo } from '../../models/photo.model';

@Component({
  selector: 'app-photo-detail-view',
  imports: [MatButtonModule],
  templateUrl: './photo-detail-view.html',
  styleUrl: './photo-detail-view.scss',
})
export class PhotoDetailView {
  readonly photo = input.required<Photo>();
  readonly removeClick = output<void>();
}

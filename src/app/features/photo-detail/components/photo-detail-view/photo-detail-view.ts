import { Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Photo } from '../../../../shared/models/photo.model';

@Component({
  selector: 'app-photo-detail-view',
  imports: [MatButtonModule, NgOptimizedImage],
  templateUrl: './photo-detail-view.html',
  styleUrl: './photo-detail-view.scss',
})
export class PhotoDetailView {
  readonly photo = input.required<Photo>();
  readonly removeClick = output<void>();
}

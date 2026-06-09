import { Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Photo } from '../../models/photo.model';

@Component({
  selector: 'app-photo-card',
  imports: [NgOptimizedImage],
  templateUrl: './photo-card.html',
  styleUrl: './photo-card.scss',
})
export class PhotoCard {
  readonly photo = input.required<Photo>();
  readonly priority = input(false);
  readonly photoClick = output<Photo>();
}

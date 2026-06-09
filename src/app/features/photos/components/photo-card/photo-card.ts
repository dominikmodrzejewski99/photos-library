import { Component, input, output } from '@angular/core';
import { Photo } from '../../../../shared/models/photo.model';

@Component({
  selector: 'app-photo-card',
  templateUrl: './photo-card.html',
  styleUrl: './photo-card.scss',
})
export class PhotoCard {
  readonly photo = input.required<Photo>();
  readonly photoClick = output<Photo>();
}

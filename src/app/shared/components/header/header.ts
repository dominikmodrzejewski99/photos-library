import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}

import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterStateSnapshot } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly router = inject(Router);

  private getActiveSection(state: RouterStateSnapshot): string {
    let route = state.root;
    while (route.firstChild) route = route.firstChild;
    return route.data['activeSection'] ?? 'photos';
  }

  private readonly activeSection = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.getActiveSection(this.router.routerState.snapshot)),
    ),
    { initialValue: this.getActiveSection(this.router.routerState.snapshot) },
  );

  protected readonly isFavoritesActive = computed(() => this.activeSection() === 'favorites');
}

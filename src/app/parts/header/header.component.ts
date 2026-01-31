import { Component, computed } from '@angular/core';
import { Route, Router, RouterLink, RouterLinkActive } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';

import { CommonModule } from '@angular/common';
type NavLink = { path: string; label: string; order: number };

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule,RouterLink,RouterLinkActive,CommonModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router) {}

    links = computed<NavLink[]>(() =>
    this.router.config
      .flatMap(r => this.routeToNavLink(r))
      .sort((a, b) => a.order - b.order)
  );

    private routeToNavLink(route: Route): NavLink[] {
    const nav = route.data?.['nav'] as { label: string; order?: number } | undefined;

    if (!nav) return [];
    
    if (!route.path || route.path === '**') return [];

    return [{
      path: '/' + route.path,
      label: nav.label,
      order: nav.order ?? 999,
    }];
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  menuOpen = signal(false);
  scrolled = signal(false);

  navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/about', label: 'About', exact: false },
    { path: '/services', label: 'Services', exact: false },
    { path: '/gallery', label: 'Gallery', exact: false },
    { path: '/blog', label: 'Blog', exact: false },
    { path: '/contact', label: 'Contact', exact: false },
  ];

  constructor(public theme: ThemeService) {}

  ngOnInit(): void {
    this.updateScrolled();
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        // Wait a tick for the new page hero to mount
        requestAnimationFrame(() => this.updateScrolled());
      });
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onScroll(): void {
    this.updateScrolled();
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  private updateScrolled(): void {
    const hero = document.querySelector('.hero') as HTMLElement | null;
    if (hero) {
      const heroBottom = hero.getBoundingClientRect().bottom;
      const nav = document.querySelector('.navbar') as HTMLElement | null;
      const threshold = nav ? nav.getBoundingClientRect().bottom : 80;
      this.scrolled.set(heroBottom <= threshold);
      return;
    }

    this.scrolled.set(window.scrollY > 20);
  }
}

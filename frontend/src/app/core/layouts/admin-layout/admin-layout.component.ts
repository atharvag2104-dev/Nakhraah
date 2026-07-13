import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MatIconModule, MatButtonModule],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <img src="assets/images/logo.png" alt="Logo" />
          <span>Admin</span>
        </div>
        <nav>
          @for (link of links; track link.path) {
            <a [routerLink]="link.path" routerLinkActive="active">
              <mat-icon>{{ link.icon }}</mat-icon>
              {{ link.label }}
            </a>
          }
        </nav>
        <button mat-button class="logout-btn" (click)="auth.logout()">
          <mat-icon>logout</mat-icon> Logout
        </button>
      </aside>
      <main class="admin-main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;

    .admin-layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 260px;
      background: $text;
      color: white;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;

      @media (max-width: 768px) { width: 70px; padding: 1rem 0.5rem; }
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 1.5rem;

      img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; object-position: center; }
      span { font-family: 'Poppins', sans-serif; font-weight: 600;
        @media (max-width: 768px) { display: none; }
      }
    }

    nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      a {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        color: rgba(255,255,255,0.7);
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.3s;
        font-size: 0.9rem;

        &:hover, &.active {
          background: rgba(226, 249, 209, 0.18);
          color: $primary;
        }

        @media (max-width: 768px) {
          justify-content: center;
          span-label { display: none; }
        }
      }
    }

    .logout-btn {
      color: rgba(255,255,255,0.7) !important;
      justify-content: flex-start;
    }

    .admin-main {
      flex: 1;
      padding: 2rem;
      background: $background;
      overflow-y: auto;
    }
  `],
})
export class AdminLayoutComponent {
  links = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/services', label: 'Services', icon: 'spa' },
    { path: '/admin/gallery', label: 'Gallery', icon: 'photo_library' },
    { path: '/admin/appointments', label: 'Appointments', icon: 'event' },
    { path: '/admin/testimonials', label: 'Testimonials', icon: 'rate_review' },
  ];

  constructor(public auth: AuthService) {}
}

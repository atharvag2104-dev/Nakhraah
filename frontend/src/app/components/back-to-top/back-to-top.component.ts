import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [MatIconModule],
  template: `
    @if (visible()) {
      <button class="back-to-top" (click)="scrollTop()" aria-label="Back to top">
        <mat-icon>keyboard_arrow_up</mat-icon></button>
      
    }
  `,
  styles: [`
    @use '../../../styles/variables' as *;

    .back-to-top {
      position: fixed;
      bottom: 6rem;
      right: 1.5rem;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, $secondary, $accent);
      color: $text;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(240, 138, 155, 0.35);
      z-index: 999;
      animation: fadeIn 0.3s ease;
      transition: transform 0.3s ease;

      &:hover { transform: translateY(-4px); }
    }

    :host-context(.dark-mode) .back-to-top {
      color: #eef1f6;
      box-shadow: 0 4px 24px rgba(240, 138, 155, 0.35);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTopComponent {
  visible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.visible.set(window.scrollY > 400);
  }

  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

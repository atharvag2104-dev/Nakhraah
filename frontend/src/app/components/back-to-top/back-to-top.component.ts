import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LuxuryMotionService } from '../../services/luxury-motion.service';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [MatIconModule],
  template: `
    @if (visible()) {
      <button class="back-to-top" (click)="scrollTop()" aria-label="Back to top">
        <mat-icon>keyboard_arrow_up</mat-icon>
      </button>
    }
  `,
  styles: [`
    @use '../../../styles/variables' as *;

    .back-to-top {
      position: fixed;
      bottom: 6rem;
      right: 1.5rem;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      border: 1px solid rgba($champagne, 0.35);
      background: rgba(251, 249, 244, 0.85);
      backdrop-filter: blur(12px);
      color: $ink;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: $shadow-soft;
      z-index: 999;
      animation: fadeIn 0.7s $ease-luxury;
      transition: transform 0.7s $ease-luxury, box-shadow 0.7s $ease-luxury, background 0.7s $ease-luxury;

      &:hover {
        transform: translateY(-3px);
        background: $ink;
        color: $ivory;
        box-shadow: $shadow-glow;
      }
    }

    :host-context(.dark-mode) .back-to-top {
      background: $dark-surface-2;
      color: $dark-text;
      border-color: $dark-border;
      box-shadow: $dark-shadow;
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
  private readonly motion = inject(LuxuryMotionService);

  @HostListener('window:scroll')
  onScroll(): void {
    this.visible.set(window.scrollY > 400);
  }

  scrollTop(): void {
    this.motion.scrollTo(0);
  }
}

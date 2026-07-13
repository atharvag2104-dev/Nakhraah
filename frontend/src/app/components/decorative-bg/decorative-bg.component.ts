import { Component } from '@angular/core';

@Component({
  selector: 'app-decorative-bg',
  standalone: true,
  template: `
    <div class="deco-bg" aria-hidden="true">
      <div class="wash wash-top"></div>
      <div class="wash wash-bottom"></div>
      <div class="sparkle sparkle-1">✦</div>
      <div class="sparkle sparkle-2">✦</div>
      <div class="sparkle sparkle-3">✦</div>
    </div>
  `,
  styles: [`
    .deco-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: -1;
      overflow: hidden;
    }

    .wash {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
    }

    .wash-top {
      width: 560px;
      height: 560px;
      top: -220px;
      right: -120px;
      background: rgba(250, 212, 222, 0.22);
    }

    .wash-bottom {
      width: 480px;
      height: 480px;
      bottom: -180px;
      left: -100px;
      background: rgba(240, 138, 155, 0.1);
    }

    .sparkle {
      position: absolute;
      color: #F08A9B;
      opacity: 0.18;
      font-size: 1rem;
      animation: twinkle 5s ease-in-out infinite;
    }

    .sparkle-1 { top: 22%; left: 6%; }
    .sparkle-2 { top: 58%; right: 8%; animation-delay: 1.8s; }
    .sparkle-3 { bottom: 18%; left: 38%; animation-delay: 3.2s; font-size: 0.75rem; }

    @keyframes twinkle {
      0%, 100% { opacity: 0.1; transform: scale(1); }
      50% { opacity: 0.35; transform: scale(1.15); }
    }

    :host-context(.dark-mode) .wash-top { background: rgba(240, 138, 155, 0.08); }
    :host-context(.dark-mode) .wash-bottom { background: rgba(240, 138, 155, 0.05); }
    :host-context(.dark-mode) .sparkle { opacity: 0.22; color: #f5a8b5; }
  `],
})
export class DecorativeBgComponent {}

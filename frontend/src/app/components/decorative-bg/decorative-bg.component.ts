import { Component } from '@angular/core';

@Component({
  selector: 'app-decorative-bg',
  standalone: true,
  template: `
    <div class="deco-bg" aria-hidden="true">
      <div class="wash wash-a"></div>
      <div class="wash wash-b"></div>
      <div class="wash wash-c"></div>
      <div class="ray ray-1"></div>
      <div class="ray ray-2"></div>
      @for (p of particles; track p) {
        <span class="dust" [style.--i]="p"></span>
      }
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
      filter: blur(110px);
      animation: drift 22s cubic-bezier(0.22, 1, 0.36, 1) infinite alternate;
    }

    .wash-a {
      width: 580px;
      height: 580px;
      top: -240px;
      right: -140px;
      background: rgba(220, 232, 215, 0.55);
    }

    .wash-b {
      width: 460px;
      height: 460px;
      bottom: -180px;
      left: -120px;
      background: rgba(196, 165, 116, 0.28);
      animation-delay: -6s;
    }

    .wash-c {
      width: 320px;
      height: 320px;
      top: 42%;
      left: 48%;
      background: rgba(220, 232, 215, 0.28);
      animation-delay: -12s;
    }

    .ray {
      position: absolute;
      width: 1px;
      height: 42vh;
      background: linear-gradient(180deg, transparent, rgba(196, 165, 116, 0.22), transparent);
      filter: blur(0.5px);
      opacity: 0.45;
      animation: softPulse 8s ease-in-out infinite;
    }

    .ray-1 { top: 8%; left: 18%; transform: rotate(18deg); }
    .ray-2 { top: 20%; right: 22%; transform: rotate(-14deg); animation-delay: 2.5s; }

    .dust {
      position: absolute;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: rgba(196, 165, 116, 0.55);
      left: calc(8% + (var(--i) * 7%));
      bottom: calc(4% + (var(--i) * 3%));
      animation: goldDust 14s cubic-bezier(0.22, 1, 0.36, 1) infinite;
      animation-delay: calc(var(--i) * -1.1s);
    }

    @keyframes drift {
      from { transform: translate(0, 0) scale(1); }
      to { transform: translate(-24px, 18px) scale(1.06); }
    }

    @keyframes softPulse {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 0.55; }
    }

    @keyframes goldDust {
      0% { transform: translateY(0) translateX(0); opacity: 0; }
      20% { opacity: 0.5; }
      100% { transform: translateY(-140px) translateX(20px); opacity: 0; }
    }

    :host-context(.dark-mode) .wash-a { background: rgba(220, 232, 215, 0.08); }
    :host-context(.dark-mode) .wash-b { background: rgba(196, 165, 116, 0.1); }
    :host-context(.dark-mode) .wash-c { background: rgba(220, 232, 215, 0.05); }
    :host-context(.dark-mode) .dust { background: rgba(232, 213, 181, 0.45); }

    @media (prefers-reduced-motion: reduce) {
      .wash, .ray, .dust { animation: none; }
    }
  `],
})
export class DecorativeBgComponent {
  particles = Array.from({ length: 12 }, (_, i) => i + 1);
}

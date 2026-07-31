import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { BackToTopComponent } from '../../../components/back-to-top/back-to-top.component';
import { WhatsappFloatComponent } from '../../../components/whatsapp-float/whatsapp-float.component';
import { DecorativeBgComponent } from '../../../components/decorative-bg/decorative-bg.component';
import { LuxuryMotionService } from '../../../services/luxury-motion.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    BackToTopComponent,
    WhatsappFloatComponent,
    DecorativeBgComponent,
  ],
  template: `
    <app-decorative-bg />
    <app-navbar />
    <main class="main-content">
      <router-outlet />
    </main>
    <app-footer />
    <app-back-to-top />
    <app-whatsapp-float />
    <div class="scroll-progress" aria-hidden="true"><span></span></div>
  `,
  styles: [`
    .main-content {
      padding-top: 0;
      min-height: 100vh;
    }

    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      z-index: 2000;
      pointer-events: none;
      background: transparent;
    }

    .scroll-progress span {
      display: block;
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #C4A574, #DCE8D7);
      transform-origin: left center;
    }
  `],
})
export class MainLayoutComponent implements AfterViewInit, OnDestroy {
  private readonly motion = inject(LuxuryMotionService);
  private onScroll?: () => void;

  ngAfterViewInit(): void {
    this.motion.start();

    const bar = document.querySelector('.scroll-progress span') as HTMLElement | null;
    if (!bar || this.motion.isReduced) return;

    this.onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, p))}%`;
    };

    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
  }

  ngOnDestroy(): void {
    if (this.onScroll) window.removeEventListener('scroll', this.onScroll);
  }
}

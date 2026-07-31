import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

@Injectable({ providedIn: 'root' })
export class LuxuryMotionService implements OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly router = inject(Router);

  private lenis?: Lenis;
  private tickerFn?: (time: number) => void;
  private routerSub?: Subscription;
  private reduced = false;
  private started = false;

  start(): void {
    if (this.started || typeof window === 'undefined') return;
    this.started = true;

    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reduced) {
      document.documentElement.classList.add('motion-reduced');
      return;
    }

    this.zone.runOutsideAngular(() => {
      document.documentElement.classList.add('has-smooth-scroll');

      this.lenis = new Lenis({
        duration: 1.35,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.15,
      });

      this.lenis.on('scroll', ScrollTrigger.update);

      this.tickerFn = (time: number) => {
        this.lenis?.raf(time * 1000);
      };
      gsap.ticker.add(this.tickerFn);
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.defaults({
        toggleActions: 'play none none none',
      });
    });

    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.lenis?.scrollTo(0, { immediate: true });
        this.refresh();
      });
  }

  refresh(): void {
    if (this.reduced) return;
    requestAnimationFrame(() => {
      this.lenis?.resize();
      ScrollTrigger.refresh();
    });
  }

  scrollTo(target: string | number | HTMLElement, options?: { offset?: number }): void {
    if (this.reduced || !this.lenis) {
      if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
      return;
    }
    this.lenis.scrollTo(target, { offset: options?.offset ?? 0 });
  }

  get isReduced(): boolean {
    return this.reduced;
  }

  /** Pause smooth scroll while nested UI (pickers, modals) handle the wheel */
  stopScroll(): void {
    this.lenis?.stop();
  }

  startScroll(): void {
    this.lenis?.start();
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    if (this.tickerFn) gsap.ticker.remove(this.tickerFn);
    this.lenis?.destroy();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }
}

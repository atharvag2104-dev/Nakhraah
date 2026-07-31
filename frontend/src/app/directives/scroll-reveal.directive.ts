import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  inject,
} from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LuxuryMotionService } from '../services/luxury-motion.service';

gsap.registerPlugin(ScrollTrigger);

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  @Input() appScrollReveal = 'fade-up';
  @Input() delay = 0;
  /** Optional scrub (0–true) for scroll-linked motion like Beauty In Stem */
  @Input() scrub: boolean | number = false;
  @Input() staggerChildren = '';
  /** Replay the reveal each time the trigger enters the viewport */
  @Input() replay: boolean | string = false;
  /** Veil exit direction for veil-lift: up | down | left | right */
  @Input() veilDir: 'up' | 'down' | 'left' | 'right' = 'up';

  private trigger?: ScrollTrigger;
  private tween?: gsap.core.Tween | gsap.core.Timeline;
  private readonly motion = inject(LuxuryMotionService);

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const el = this.el.nativeElement;

    if (this.motion.isReduced) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
      const veil = el.querySelector('.frame-veil') as HTMLElement | null;
      if (veil) veil.style.display = 'none';
      return;
    }

    const delaySec = (Number(this.delay) || 0) / 1000;
    const shouldReplay = this.replay === true || this.replay === 'true';
    const scrollTriggerBase: ScrollTrigger.Vars = {
      trigger: el,
      start: 'top 88%',
      end: this.scrub ? 'top 35%' : undefined,
      scrub: this.scrub || false,
      ...(shouldReplay
        ? { toggleActions: 'restart none restart none' }
        : { once: !this.scrub }),
    };

    if (this.appScrollReveal === 'veil-lift') {
      this.playVeilLift(el, delaySec, scrollTriggerBase);
      return;
    }

    const from = this.fromVars(this.appScrollReveal);

    if (this.staggerChildren) {
      const kids = el.querySelectorAll(this.staggerChildren);
      gsap.set(kids, from);
      this.tween = gsap.to(kids, {
        ...this.toVars(),
        delay: delaySec,
        stagger: 0.14,
        duration: 1.35,
        ease: 'power3.out',
        scrollTrigger: {
          ...scrollTriggerBase,
          onEnter: () => this.motion.refresh(),
        },
      });
      return;
    }

    gsap.set(el, from);
    this.tween = gsap.to(el, {
      ...this.toVars(),
      delay: delaySec,
      duration: this.scrub ? 1 : 1.35,
      ease: 'power3.out',
      scrollTrigger: scrollTriggerBase,
    });
  }

  ngOnDestroy(): void {
    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
    this.trigger?.kill();
  }

  private playVeilLift(
    el: HTMLElement,
    delaySec: number,
    scrollTriggerBase: ScrollTrigger.Vars
  ): void {
    const veil = el.querySelector('.frame-veil') as HTMLElement | null;
    const media = el.querySelector('.frame-zoom img, img, video') as HTMLElement | null;

    if (!veil) {
      gsap.set(el, { opacity: 0, y: 24 });
      this.tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        delay: delaySec,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: scrollTriggerBase,
      });
      return;
    }

    const exit = this.veilExitVars(this.veilDir);
    gsap.set(veil, { xPercent: 0, yPercent: 0, opacity: 1 });
    if (media) gsap.set(media, { scale: 1.1 });

    const tl = gsap.timeline({
      delay: delaySec,
      scrollTrigger: scrollTriggerBase,
    });

    tl.to(
      veil,
      {
        ...exit,
        duration: 1.25,
        ease: 'power3.inOut',
      },
      0
    );

    if (media) {
      tl.to(
        media,
        {
          scale: 1,
          duration: 1.45,
          ease: 'power2.out',
        },
        0.05
      );
    }

    this.tween = tl;
  }

  private veilExitVars(dir: string): gsap.TweenVars {
    switch (dir) {
      case 'down':
        return { yPercent: 105 };
      case 'left':
        return { xPercent: -105 };
      case 'right':
        return { xPercent: 105 };
      case 'up':
      default:
        return { yPercent: -105 };
    }
  }

  private fromVars(kind: string): gsap.TweenVars {
    switch (kind) {
      case 'fade-down':
        return { opacity: 0, y: -40 };
      case 'fade-left':
        return { opacity: 0, x: -48 };
      case 'fade-right':
        return { opacity: 0, x: 48 };
      case 'scale':
        return { opacity: 0, scale: 0.92 };
      case 'soft-zoom':
        return { opacity: 0, scale: 1.14, y: 18 };
      case 'veil':
        return { opacity: 0, y: 40, scale: 1.06, rotateX: 8, transformPerspective: 1400 };
      case '3d':
        return { opacity: 0, y: 40, rotateX: 6, transformPerspective: 1200 };
      case '3d-left':
        return { opacity: 0, x: -36, rotateY: 5, transformPerspective: 1200 };
      case '3d-right':
        return { opacity: 0, x: 36, rotateY: -5, transformPerspective: 1200 };
      case 'clip':
        return { opacity: 0, clipPath: 'inset(12% 12% 12% 12%)', scale: 1.06 };
      case 'fade-up':
      default:
        return { opacity: 0, y: 56 };
    }
  }

  private toVars(): gsap.TweenVars {
    return {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      clipPath: 'inset(0% 0% 0% 0%)',
      clearProps: this.scrub ? '' : 'clipPath',
    };
  }
}

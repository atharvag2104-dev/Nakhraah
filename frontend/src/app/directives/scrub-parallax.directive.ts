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

/** Scroll-scrubbed vertical parallax (Beauty In Stem pacing). */
@Directive({
  selector: '[appScrubParallax]',
  standalone: true,
})
export class ScrubParallaxDirective implements AfterViewInit, OnDestroy {
  @Input() appScrubParallax: number | string = 80;
  @Input() scrubStart = 'top bottom';
  @Input() scrubEnd = 'bottom top';

  private tween?: gsap.core.Tween;
  private readonly motion = inject(LuxuryMotionService);

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    if (this.motion.isReduced) return;
    const y = Number(this.appScrubParallax) || 80;

    this.tween = gsap.fromTo(
      this.el.nativeElement,
      { y: -y * 0.35 },
      {
        y,
        ease: 'none',
        scrollTrigger: {
          trigger: this.el.nativeElement,
          start: this.scrubStart,
          end: this.scrubEnd,
          scrub: true,
        },
      }
    );
  }

  ngOnDestroy(): void {
    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
  }
}

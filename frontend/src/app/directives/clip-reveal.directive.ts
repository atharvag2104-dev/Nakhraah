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
  selector: '[appClipReveal]',
  standalone: true,
})
export class ClipRevealDirective implements AfterViewInit, OnDestroy {
  @Input() appClipReveal: 'up' | 'down' | 'left' | 'right' | 'inset' = 'up';
  @Input() scrub: number | boolean | string = 0.65;
  /** When false, only clip-path reveals — leaves CSS hover zoom free */
  @Input() scaleMedia: boolean | string = true;
  /** ScrollTrigger start, e.g. 'top 88%' */
  @Input() revealStart = 'top 92%';
  /** ScrollTrigger end (scrubbed reveals). Ignored when scrub is false. */
  @Input() revealEnd = 'top 42%';

  private timeline?: gsap.core.Timeline;
  private readonly motion = inject(LuxuryMotionService);

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const el = this.el.nativeElement;
    if (this.motion.isReduced) return;

    const clipFrom = this.clipFrom(this.appClipReveal);
    const shouldScale = this.scaleMedia !== false && this.scaleMedia !== 'false';
    const media = shouldScale
      ? (el.querySelector('[data-reveal-scale], img, video') as HTMLElement | null)
      : null;
    const useScrub = this.scrub !== false && this.scrub !== 'false';
    const scrubVal = useScrub ? Number(this.scrub) || 0.65 : false;

    gsap.set(el, { clipPath: clipFrom, opacity: 0.88 });
    if (media) gsap.set(media, { scale: 1.12 });

    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: this.revealStart,
        end: this.revealEnd,
        scrub: scrubVal,
        ...(useScrub
          ? {}
          : {
              toggleActions: 'restart none restart none',
            }),
      },
    });

    this.timeline.to(
      el,
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        ease: useScrub ? 'none' : 'power2.out',
        duration: useScrub ? 1 : 1.15,
      },
      0
    );

    if (media) {
      this.timeline.to(
        media,
        {
          scale: 1,
          ease: useScrub ? 'none' : 'power2.out',
          duration: useScrub ? 1 : 1.15,
        },
        0
      );
    }
  }

  ngOnDestroy(): void {
    this.timeline?.scrollTrigger?.kill();
    this.timeline?.kill();
  }

  private clipFrom(dir: string): string {
    switch (dir) {
      case 'down':
        return 'inset(0% 0% 100% 0%)';
      case 'left':
        return 'inset(0% 0% 0% 100%)';
      case 'right':
        return 'inset(0% 100% 0% 0%)';
      case 'inset':
        return 'inset(18% 18% 18% 18%)';
      case 'up':
      default:
        return 'inset(100% 0% 0% 0%)';
    }
  }
}

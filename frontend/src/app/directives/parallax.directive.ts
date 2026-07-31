import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements OnInit, OnDestroy {
  /** Max translate in px */
  @Input() appParallax: number | string = 18;
  @Input() parallaxAxis: 'both' | 'x' | 'y' = 'both';

  private reduced = false;
  private frame = 0;
  private boundMove = this.onPointer.bind(this);

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || window.matchMedia('(pointer: coarse)').matches;
    if (this.reduced) return;
    window.addEventListener('mousemove', this.boundMove, { passive: true });
    this.el.nativeElement.style.transition = 'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)';
    this.el.nativeElement.style.willChange = 'transform';
  }

  ngOnDestroy(): void {
    window.removeEventListener('mousemove', this.boundMove);
    if (this.frame) cancelAnimationFrame(this.frame);
  }

  private onPointer(event: MouseEvent): void {
    const max = Number(this.appParallax) || 18;
    const nx = (event.clientX / window.innerWidth - 0.5) * 2;
    const ny = (event.clientY / window.innerHeight - 0.5) * 2;
    const x = this.parallaxAxis === 'y' ? 0 : nx * max;
    const y = this.parallaxAxis === 'x' ? 0 : ny * max;

    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      this.el.nativeElement.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    });
  }

  @HostListener('window:blur')
  reset(): void {
    if (this.reduced) return;
    this.el.nativeElement.style.transform = 'translate3d(0, 0, 0)';
  }
}

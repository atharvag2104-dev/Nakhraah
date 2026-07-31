import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective implements OnInit, OnDestroy {
  @Input() appMagnetic: number | string = 18;

  private reduced = false;
  private frame = 0;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || window.matchMedia('(pointer: coarse)').matches;
    if (this.reduced) return;
    this.el.nativeElement.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
  }

  ngOnDestroy(): void {
    if (this.frame) cancelAnimationFrame(this.frame);
  }

  @HostListener('mousemove', ['$event'])
  onMove(event: MouseEvent): void {
    if (this.reduced) return;
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const strength = Number(this.appMagnetic) || 18;
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength;

    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      node.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
  }

  @HostListener('mouseleave')
  onLeave(): void {
    if (this.reduced) return;
    this.el.nativeElement.style.transform = 'translate(0, 0)';
  }
}

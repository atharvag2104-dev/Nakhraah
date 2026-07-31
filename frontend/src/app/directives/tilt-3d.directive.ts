import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appTilt3d]',
  standalone: true,
})
export class Tilt3dDirective implements OnInit, OnDestroy {
  @Input() appTilt3d: number | string = 6;
  @Input() tiltScale: number | string = 1.01;

  private reduced = false;
  private frame = 0;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || window.matchMedia('(pointer: coarse)').matches;
    if (this.reduced) return;
    const node = this.el.nativeElement;
    node.classList.add('tilt-depth');
    node.style.transition = 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)';
  }

  ngOnDestroy(): void {
    if (this.frame) cancelAnimationFrame(this.frame);
  }

  @HostListener('mousemove', ['$event'])
  onMove(event: MouseEvent): void {
    if (this.reduced) return;
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const max = Math.min(Math.abs(Number(this.appTilt3d)) || 6, 8);
    const scale = Number(this.tiltScale) || 1.01;

    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      node.style.transform =
        `perspective(1100px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) scale(${scale})`;
    });
  }

  @HostListener('mouseleave')
  onLeave(): void {
    if (this.reduced) return;
    this.el.nativeElement.style.transform = 'perspective(1100px) rotateX(0) rotateY(0) scale(1)';
  }
}

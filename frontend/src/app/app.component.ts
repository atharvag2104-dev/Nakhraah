import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';

const PAINT_COLORS = ['#C4A574', '#E8D5B5', '#B8CDB0', '#DCE8D7', '#c98a9a', '#A68B5B'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: [`:host { display: block; }`],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private brush: HTMLDivElement | null = null;
  private frame = 0;
  private dropId = 0;

  private onMove = (e: MouseEvent) => {
    const el = this.brush;
    if (!el) return;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -92%) rotate(-18deg)`;
    });
  };

  private onDown = (e: MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement | null)?.closest?.('.nail-brush, .nail-paint-drop')) return;

    this.brush?.classList.add('painting');
    window.setTimeout(() => this.brush?.classList.remove('painting'), 220);

    const color = PAINT_COLORS[++this.dropId % PAINT_COLORS.length];
    const drop = this.doc.createElement('span');
    drop.className = 'nail-paint-drop';
    drop.setAttribute('aria-hidden', 'true');
    drop.style.left = `${e.clientX}px`;
    drop.style.top = `${e.clientY}px`;
    drop.style.setProperty('--c', color);
    this.doc.body.appendChild(drop);
    window.setTimeout(() => drop.remove(), 700);
  };

  ngAfterViewInit(): void {
    const win = this.doc.defaultView;
    if (!win) return;

    this.doc.documentElement.classList.add('has-luxury-cursor');
    this.doc.body.classList.add('has-luxury-cursor');

    this.brush = this.doc.createElement('div');
    this.brush.className = 'nail-brush is-on';
    this.brush.setAttribute('aria-hidden', 'true');
    this.brush.innerHTML = `
      <span class="nail-brush__cap"></span>
      <span class="nail-brush__handle"></span>
      <span class="nail-brush__ferrule"></span>
      <span class="nail-brush__tip"></span>
    `;
    this.doc.body.appendChild(this.brush);

    win.addEventListener('mousemove', this.onMove, { passive: true });
    this.doc.addEventListener('mousedown', this.onDown, { passive: true });
  }

  ngOnDestroy(): void {
    const win = this.doc.defaultView;
    win?.removeEventListener('mousemove', this.onMove);
    this.doc.removeEventListener('mousedown', this.onDown);
    if (this.frame) cancelAnimationFrame(this.frame);
    this.doc.documentElement.classList.remove('has-luxury-cursor');
    this.doc.body.classList.remove('has-luxury-cursor');
    this.brush?.remove();
    this.brush = null;
  }
}

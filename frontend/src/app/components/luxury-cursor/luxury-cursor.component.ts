import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';

interface PaintCoat {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  radius: string;
  color: string;
  ox: number;
  oy: number;
}

@Component({
  selector: 'app-luxury-cursor',
  standalone: true,
  template: `
    @for (coat of coats; track coat.id) {
      <div
        class="nail-paint-coat"
        [style.left.px]="coat.x"
        [style.top.px]="coat.y"
        [style.width.px]="coat.w"
        [style.height.px]="coat.h"
        [style.borderRadius]="coat.radius"
        [style.--c]="coat.color"
        [style.--ox]="coat.ox + '%'"
        [style.--oy]="coat.oy + '%'"
        aria-hidden="true"
      >
        <span class="nail-paint-coat__pass"></span>
        <span class="nail-paint-coat__tip"></span>
      </div>
    }
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        z-index: 10000;
        pointer-events: none;
      }
    `,
  ],
})
export class LuxuryCursorComponent implements AfterViewInit, OnDestroy {
  coats: PaintCoat[] = [];

  private readonly zone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);

  private brushEl: HTMLDivElement | null = null;
  private frame = 0;
  private coatId = 0;
  private colors = ['#C4A574', '#E8D5B5', '#B8CDB0', '#DCE8D7', '#c98a9a', '#A68B5B'];
  private onMove = (e: PointerEvent) => this.handleMove(e);
  private onDown = (e: PointerEvent) => this.handleDown(e);

  ngAfterViewInit(): void {
    // Always enable on desktop browsers — previous media-query gates kept it off on Windows
    this.brushEl = document.createElement('div');
    this.brushEl.className = 'nail-brush is-on';
    this.brushEl.setAttribute('aria-hidden', 'true');
    this.brushEl.innerHTML = `
      <span class="nail-brush__cap"></span>
      <span class="nail-brush__handle"></span>
      <span class="nail-brush__ferrule"></span>
      <span class="nail-brush__tip"></span>
    `;
    document.body.appendChild(this.brushEl);

    document.documentElement.classList.add('has-luxury-cursor');
    document.body.classList.add('has-luxury-cursor');

    this.zone.runOutsideAngular(() => {
      window.addEventListener('pointermove', this.onMove, { passive: true });
      window.addEventListener('mousemove', this.onMove as EventListener, { passive: true });
      document.addEventListener('pointerdown', this.onDown, { passive: true });
    });
  }

  ngOnDestroy(): void {
    document.documentElement.classList.remove('has-luxury-cursor');
    document.body.classList.remove('has-luxury-cursor');
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('mousemove', this.onMove as EventListener);
    document.removeEventListener('pointerdown', this.onDown);
    if (this.frame) cancelAnimationFrame(this.frame);
    this.brushEl?.remove();
    this.brushEl = null;
  }

  private handleMove(e: PointerEvent | MouseEvent): void {
    if ('pointerType' in e && e.pointerType === 'touch') return;
    const el = this.brushEl;
    if (!el) return;

    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -92%) rotate(-18deg)`;
    });
  }

  private handleDown(e: PointerEvent): void {
    if (e.pointerType === 'touch' || e.button !== 0) return;

    const target = this.resolvePaintTarget(e.target as HTMLElement | null);
    if (!target) return;

    this.brushEl?.classList.add('painting');
    window.setTimeout(() => this.brushEl?.classList.remove('painting'), 280);

    const rect = target.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return;

    const styles = window.getComputedStyle(target);
    const id = ++this.coatId;
    const color = this.colors[id % this.colors.length];
    const ox = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const oy = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));

    this.zone.run(() => {
      this.coats = [
        ...this.coats.slice(-3),
        {
          id,
          x: rect.left,
          y: rect.top,
          w: rect.width,
          h: rect.height,
          radius: styles.borderRadius || '8px',
          color,
          ox,
          oy,
        },
      ];
      this.cdr.detectChanges();
    });

    window.setTimeout(() => {
      this.zone.run(() => {
        this.coats = this.coats.filter((c) => c.id !== id);
        this.cdr.detectChanges();
      });
    }, 1100);
  }

  private resolvePaintTarget(start: HTMLElement | null): HTMLElement | null {
    if (!start || start === document.body || start === document.documentElement) {
      return null;
    }
    if (start.closest('.nail-brush, .nail-paint-coat')) return null;

    return start.closest(
      [
        'a',
        'button:not([disabled])',
        '[role="button"]',
        '.book-btn',
        '.btn-primary',
        '.btn-outline',
        '.slide-nav:not([disabled])',
        '.dot',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        'label[for]',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ')
    ) as HTMLElement | null;
  }
}

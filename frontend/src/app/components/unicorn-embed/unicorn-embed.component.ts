import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized?: boolean;
      init?: () => Promise<void> | void;
      addScene?: (opts: Record<string, unknown>) => Promise<{ destroy?: () => void } | void> | void;
      destroy?: () => void;
    };
  }
}

let unicornUid = 0;

@Component({
  selector: 'app-unicorn-embed',
  standalone: true,
  template: `
    <div
      #host
      class="unicorn-host"
      [attr.data-us-project]="projectId"
      [style.opacity]="opacity"
      aria-hidden="true"
    ></div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }
      .unicorn-host {
        width: 100%;
        height: 100%;
        mix-blend-mode: soft-light;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnicornEmbedComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;

  @Input() projectId = 'oD2QBKj4GohsZCiJ4IWx';
  @Input() scale = 1;
  @Input() dpi = 1.25;
  @Input() fps = 30;
  @Input() lazyLoad = false;
  @Input() opacity = 0.7;
  @Input() variables: Record<string, string | number> = {};

  private scene?: { destroy?: () => void };
  private observer?: IntersectionObserver;
  private destroyed = false;
  private readonly elementId = `unicorn-scene-${++unicornUid}`;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.host.nativeElement.id = this.elementId;

    if (this.lazyLoad) {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            void this.mount();
            this.observer?.disconnect();
          }
        },
        { rootMargin: '140px' }
      );
      this.observer.observe(this.host.nativeElement);
    } else {
      void this.mount();
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.observer?.disconnect();
    try {
      this.scene?.destroy?.();
    } catch {
      /* ignore */
    }
  }

  private async mount(): Promise<void> {
    try {
      await this.ensureSdk();
      if (this.destroyed || !window.UnicornStudio?.addScene) return;

      const result = await window.UnicornStudio.addScene({
        elementId: this.elementId,
        projectId: this.projectId,
        scale: this.scale,
        dpi: this.dpi,
        fps: this.fps,
        lazyLoad: false,
        production: true,
        interactivity: { mouse: { disableMobile: true, disableDesktop: false } },
        ...(Object.keys(this.variables).length ? { variables: this.variables } : {}),
      });

      if (result && typeof result === 'object') {
        this.scene = result as { destroy?: () => void };
      }
    } catch {
      // CSS ambience remains if Unicorn fails to load
    }
  }

  private ensureSdk(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.UnicornStudio?.addScene) {
        resolve();
        return;
      }

      const existing = document.querySelector<HTMLScriptElement>('script[data-unicorn-sdk]');
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Unicorn SDK failed')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
      script.async = true;
      script.dataset['unicornSdk'] = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Unicorn SDK failed'));
      document.head.appendChild(script);
    });
  }
}

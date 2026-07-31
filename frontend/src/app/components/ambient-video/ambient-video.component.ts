import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-ambient-video',
  standalone: true,
  template: `
    <div
      class="ambient"
      [class.rounded]="rounded"
      [class.portrait]="portrait"
      [style.--video-fit]="fit"
      [style.--video-position]="objectPosition"
    >
      <video
        #video
        [src]="src"
        [attr.poster]="poster || null"
        muted
        loop
        playsinline
        [attr.playsinline]="true"
        [attr.webkit-playsinline]="true"
        [attr.preload]="preload"
        aria-hidden="true"
      ></video>
      @if (caption) {
        <span class="caption">{{ caption }}</span>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .ambient {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #1a1a1a;
      }

      .ambient.rounded {
        border-radius: 28px;
      }

      video {
        width: 100%;
        height: 100%;
        object-fit: var(--video-fit, cover);
        object-position: var(--video-position, center);
        display: block;
      }

      .caption {
        position: absolute;
        left: 1.25rem;
        bottom: 1.25rem;
        z-index: 1;
        font-size: 0.68rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: rgba(251, 249, 244, 0.88);
        text-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
      }

      @media (prefers-reduced-motion: reduce) {
        video {
          display: none;
        }

        .ambient {
          background: center / cover no-repeat var(--ambient-poster, #dce8d7);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmbientVideoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;

  @Input({ required: true }) src!: string;
  @Input() poster = '';
  @Input() caption = '';
  @Input() rounded = true;
  @Input() portrait = false;
  @Input() fit: 'cover' | 'contain' = 'cover';
  @Input() objectPosition = 'center';
  @Input() preload: 'none' | 'metadata' | 'auto' = 'metadata';

  private observer?: IntersectionObserver;
  private reduced = false;

  ngAfterViewInit(): void {
    const video = this.videoRef.nativeElement;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.poster) {
      (video.parentElement as HTMLElement)?.style.setProperty(
        '--ambient-poster',
        `url('${this.poster}')`
      );
    }

    if (this.reduced) {
      video.removeAttribute('autoplay');
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25, rootMargin: '80px' }
    );

    this.observer.observe(video);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.videoRef?.nativeElement?.pause();
  }
}

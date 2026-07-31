import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SectionTitleComponent } from '../../components/section-title/section-title.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { TestimonialCardComponent } from '../../components/testimonial-card/testimonial-card.component';
import { BlogCardComponent } from '../../components/blog-card/blog-card.component';
import { UnicornEmbedComponent } from '../../components/unicorn-embed/unicorn-embed.component';
import { AmbientVideoComponent } from '../../components/ambient-video/ambient-video.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { ClipRevealDirective } from '../../directives/clip-reveal.directive';
import { ScrubParallaxDirective } from '../../directives/scrub-parallax.directive';
import { Tilt3dDirective } from '../../directives/tilt-3d.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { ParallaxDirective } from '../../directives/parallax.directive';
import { LuxuryMotionService } from '../../services/luxury-motion.service';
import { SeoService } from '../../services/seo.service';
import { Service, GalleryItem, Testimonial } from '../../models';
import { environment } from '../../../environments/environment';
import { STATIC_GALLERY_IMAGES, STATIC_INSTAGRAM_IMAGES } from '../../core/constants/static-images';
import { STATIC_BLOG_POSTS } from '../../core/constants/static-blog-posts';
import { getFeaturedServices } from '../../core/constants/static-services';
import { STATIC_TESTIMONIALS } from '../../core/constants/static-testimonials';
import { resolveImageUrl } from '../../core/utils/image-url';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    SectionTitleComponent,
    ServiceCardComponent,
    TestimonialCardComponent,
    BlogCardComponent,
    UnicornEmbedComponent,
    AmbientVideoComponent,
    ScrollRevealDirective,
    ClipRevealDirective,
    ScrubParallaxDirective,
    Tilt3dDirective,
    MagneticDirective,
    ParallaxDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;

  featuredServices = signal<Service[]>(getFeaturedServices());
  servicesPage = signal(0);
  blogPage = signal(0);
  /** Track index in loop strip: [last-clone, ...items, first-clone] — starts at 1 */
  testimonialTrack = signal(1);
  testimonialNoTransition = signal(false);
  galleryPreview = signal<GalleryItem[]>(STATIC_GALLERY_IMAGES.slice(0, 6));
  testimonials = signal<Testimonial[]>(STATIC_TESTIMONIALS);
  heroReady = signal(false);
  offerVisible = signal(true);
  env = environment;
  blogPreview = STATIC_BLOG_POSTS.slice(0, 6);
  readonly resolveImageUrl = resolveImageUrl;

  unicornHeroVars = {
    sage: '#DCE8D7',
    ivory: '#FBF9F4',
    gold: '#C4A574',
  };

  ritualSteps = [
    {
      num: '01',
      label: 'Welcome',
      title: 'Settle in',
      text: 'Soft light, quiet conversation, and a moment to leave the rush outside. We begin with a short consultation — shape, length, lifestyle, and the finish you want to live in.',
    },
    {
      num: '02',
      label: 'Shape',
      title: 'Precision form',
      text: 'Each nail is shaped with editorial restraint — clean lines, balanced length, and architecture that flatters your hands before colour ever touches the tip.',
    },
    {
      num: '03',
      label: 'Colour',
      title: 'Champagne finish',
      text: 'Pigment, chrome, or soft nude — layered slowly for a couture glow. We build depth in thin coats so the set stays light, luminous, and lasting.',
    },
    {
      num: '04',
      label: 'Seal',
      title: 'Lasting polish',
      text: 'Cured, refined, and finished so the set feels as expensive as it looks. Cuticle oil, aftercare notes, and a final check in the light before you leave.',
    },
  ];

  instagramPosts = STATIC_INSTAGRAM_IMAGES.slice(0, 6);

  servicePages = computed(() => {
    const items = this.featuredServices();
    const pages: Service[][] = [];
    for (let i = 0; i < items.length; i += 3) {
      pages.push(items.slice(i, i + 3));
    }
    return pages;
  });

  maxServicesPage = computed(() => Math.max(0, this.servicePages().length - 1));

  blogPages = computed(() => {
    const items = this.blogPreview;
    const pages: (typeof items)[] = [];
    for (let i = 0; i < items.length; i += 3) {
      pages.push(items.slice(i, i + 3));
    }
    return pages;
  });

  maxBlogPage = computed(() => Math.max(0, this.blogPages().length - 1));

  testimonialPages = computed(() => {
    const items = this.testimonials();
    const n = items.length;
    if (n === 0) return [] as Testimonial[][];
    if (n === 1) return [[items[0], items[0]]];

    // Always show a pair; advance by 2 with wrap: 1-2 → 3-4 → 5-1 → 2-3 → …
    const pages: Testimonial[][] = [];
    let i = 0;
    do {
      pages.push([items[i], items[(i + 1) % n]]);
      i = (i + 2) % n;
    } while (i !== 0);

    return pages;
  });

  testimonialLoop = computed(() => {
    const pages = this.testimonialPages();
    if (pages.length < 2) {
      return pages.map((items, i) => ({
        key: `page-${i}`,
        items,
      }));
    }
    const last = pages[pages.length - 1];
    const first = pages[0];
    return [
      {
        key: `clone-last-${last.map((t) => t.id).join('-')}`,
        items: last,
      },
      ...pages.map((items, i) => ({
        key: `page-${i}-${items.map((t) => t.id).join('-')}`,
        items,
      })),
      {
        key: `clone-first-${first.map((t) => t.id).join('-')}`,
        items: first,
      },
    ];
  });

  testimonialDot = computed(() => {
    const n = this.testimonialPages().length;
    if (n < 2) return 0;
    const track = this.testimonialTrack();
    if (track === 0) return n - 1;
    if (track === n + 1) return 0;
    return track - 1;
  });

  private timers: number[] = [];
  private testimonialTimer?: number;
  private testimonialsPaused = false;
  private testimonialAnimating = false;
  private readonly motion = inject(LuxuryMotionService);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    document.documentElement.classList.add('has-top-offer');
    document.body.classList.add('has-top-offer');

    this.seo.update({
      title: 'Home',
      description:
        'नखRaah — luxury nail art atelier in Pune. Gel, bridal, and bespoke nail artistry. Book a private appointment.',
    });

    queueMicrotask(() => this.motion.refresh());
    this.startTestimonialsAutoplay();
  }

  ngAfterViewInit(): void {
    this.playHeroVideo();
    this.syncOfferBanner();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      this.heroReady.set(true);
      return;
    }

    this.timers.push(window.setTimeout(() => this.heroReady.set(true), 180));
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onWindowScroll(): void {
    this.syncOfferBanner();
  }

  ngOnDestroy(): void {
    this.setOfferOffset(false);
    this.timers.forEach((id) => clearTimeout(id));
    this.stopTestimonialsAutoplay();
  }

  private syncOfferBanner(): void {
    const hero = document.querySelector('.hero') as HTMLElement | null;
    if (!hero) {
      this.offerVisible.set(false);
      this.setOfferOffset(false);
      return;
    }

    const visible = hero.getBoundingClientRect().bottom > 120;
    if (this.offerVisible() === visible) {
      this.setOfferOffset(visible);
      return;
    }
    this.offerVisible.set(visible);
    this.setOfferOffset(visible);
  }

  private setOfferOffset(active: boolean): void {
    document.documentElement.classList.toggle('has-top-offer', active);
    document.body.classList.toggle('has-top-offer', active);
  }

  private playHeroVideo(): void {
    const video = this.heroVideo?.nativeElement;
    if (!video) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          this.timers.push(window.setTimeout(() => void video.play().catch(() => undefined), 400));
        });
      }
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('canplay', tryPlay, { once: true });
      video.load();
    }
  }

  prevServicesPage(): void {
    this.servicesPage.update((p) => Math.max(0, p - 1));
  }

  nextServicesPage(): void {
    this.servicesPage.update((p) => Math.min(this.maxServicesPage(), p + 1));
  }

  goToServicesPage(index: number): void {
    this.servicesPage.set(index);
  }

  prevBlogPage(): void {
    this.blogPage.update((p) => Math.max(0, p - 1));
  }

  nextBlogPage(): void {
    this.blogPage.update((p) => Math.min(this.maxBlogPage(), p + 1));
  }

  goToBlogPage(index: number): void {
    this.blogPage.set(index);
  }

  prevTestimonial(): void {
    const n = this.testimonialPages().length;
    if (n < 2 || this.testimonialAnimating) return;
    this.testimonialNoTransition.set(false);
    this.testimonialAnimating = true;
    this.testimonialTrack.update((i) => i - 1);
    this.restartTestimonialsAutoplay();
  }

  nextTestimonial(): void {
    const n = this.testimonialPages().length;
    if (n < 2 || this.testimonialAnimating) return;
    this.testimonialNoTransition.set(false);
    this.testimonialAnimating = true;
    this.testimonialTrack.update((i) => i + 1);
    this.restartTestimonialsAutoplay();
  }

  goToTestimonial(index: number): void {
    const n = this.testimonialPages().length;
    if (n < 2 || this.testimonialAnimating) return;
    this.testimonialNoTransition.set(false);
    this.testimonialAnimating = true;
    this.testimonialTrack.set(index + 1);
    this.restartTestimonialsAutoplay();
  }

  onTestimonialTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName !== 'transform') return;
    const n = this.testimonialPages().length;
    if (n < 2) return;

    const track = this.testimonialTrack();
    if (track === n + 1) {
      // Landed on first-clone after last → snap to real first
      this.testimonialNoTransition.set(true);
      this.testimonialTrack.set(1);
      this.cdr.detectChanges();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.testimonialNoTransition.set(false);
          this.testimonialAnimating = false;
          this.cdr.markForCheck();
        });
      });
      return;
    }

    if (track === 0) {
      // Landed on last-clone before first → snap to real last
      this.testimonialNoTransition.set(true);
      this.testimonialTrack.set(n);
      this.cdr.detectChanges();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.testimonialNoTransition.set(false);
          this.testimonialAnimating = false;
          this.cdr.markForCheck();
        });
      });
      return;
    }

    this.testimonialAnimating = false;
  }

  pauseTestimonials(): void {
    this.testimonialsPaused = true;
    this.stopTestimonialsAutoplay();
  }

  resumeTestimonials(): void {
    this.testimonialsPaused = false;
    this.startTestimonialsAutoplay();
  }

  private startTestimonialsAutoplay(): void {
    this.stopTestimonialsAutoplay();
    if (this.testimonialsPaused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (this.testimonialPages().length < 2) return;

    this.testimonialTimer = window.setInterval(() => {
      this.nextTestimonial();
      this.cdr.markForCheck();
    }, 5000);
  }

  private stopTestimonialsAutoplay(): void {
    if (this.testimonialTimer) {
      clearInterval(this.testimonialTimer);
      this.testimonialTimer = undefined;
    }
  }

  private restartTestimonialsAutoplay(): void {
    if (this.testimonialsPaused) return;
    this.startTestimonialsAutoplay();
  }

  formatGalleryIndex(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  galleryVeilDir(index: number): 'up' | 'down' | 'left' | 'right' {
    const dirs: Array<'up' | 'down' | 'left' | 'right'> = [
      'up',
      'left',
      'right',
      'down',
      'left',
      'right',
    ];
    return dirs[index] ?? 'up';
  }
}

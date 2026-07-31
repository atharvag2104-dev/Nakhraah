import {
  ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GalleryLightboxComponent } from '../../components/gallery-lightbox/gallery-lightbox.component';
import { SectionTitleComponent } from '../../components/section-title/section-title.component';
import { AmbientVideoComponent } from '../../components/ambient-video/ambient-video.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { SeoService } from '../../services/seo.service';
import { GalleryItem, GALLERY_CATEGORIES, GalleryCategory } from '../../models';
import { STATIC_GALLERY_IMAGES } from '../../core/constants/static-images';
import { resolveImageUrl } from '../../core/utils/image-url';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    MatIconModule,
    GalleryLightboxComponent,
    SectionTitleComponent,
    AmbientVideoComponent,
    ScrollRevealDirective,
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryPageComponent implements OnInit, OnDestroy {
  items = signal<GalleryItem[]>(STATIC_GALLERY_IMAGES as GalleryItem[]);
  filteredItems = signal<GalleryItem[]>(STATIC_GALLERY_IMAGES as GalleryItem[]);
  activeCategory = signal<GalleryCategory>('all');
  currentIndex = signal(0);
  selectedItem = signal<GalleryItem | null>(null);
  paused = signal(false);
  categories = GALLERY_CATEGORIES;
  readonly resolveImageUrl = resolveImageUrl;

  currentSlide = computed(() => {
    const list = this.filteredItems();
    return list[this.currentIndex()] ?? null;
  });

  private autoplayTimer?: ReturnType<typeof setInterval>;

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Gallery',
      description: 'Browse our nail art portfolio — Bridal, Minimal, Luxury, French, Chrome, Glitter & Festive designs.',
    });
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  filterCategory(category: GalleryCategory): void {
    this.activeCategory.set(category);
    if (category === 'all') {
      this.filteredItems.set(this.items());
    } else {
      this.filteredItems.set(this.items().filter((i) => i.category === category));
    }
    this.currentIndex.set(0);
  }

  prevSlide(): void {
    const total = this.filteredItems().length;
    if (!total) return;
    this.currentIndex.update((i) => (i - 1 + total) % total);
  }

  nextSlide(): void {
    const total = this.filteredItems().length;
    if (!total) return;
    this.currentIndex.update((i) => (i + 1) % total);
  }

  goToSlide(index: number): void {
    this.currentIndex.set(index);
  }

  pauseAutoplay(): void {
    this.paused.set(true);
    this.stopAutoplay();
  }

  resumeAutoplay(): void {
    this.paused.set(false);
    this.startAutoplay();
  }

  openLightbox(item: GalleryItem): void {
    this.selectedItem.set(item);
    document.body.style.overflow = 'hidden';
    this.pauseAutoplay();
  }

  closeLightbox(): void {
    this.selectedItem.set(null);
    document.body.style.overflow = '';
    this.resumeAutoplay();
  }

  formatIndex(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    if (this.paused()) return;
    this.autoplayTimer = setInterval(() => this.nextSlide(), 5000);
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = undefined;
    }
  }
}

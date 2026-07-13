import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SectionTitleComponent } from '../../components/section-title/section-title.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { TestimonialCardComponent } from '../../components/testimonial-card/testimonial-card.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { ServiceService } from '../../services/service.service';
import { TestimonialService } from '../../services/testimonial.service';
import { SeoService } from '../../services/seo.service';
import { ApiService } from '../../services/api.service';
import { Service, GalleryItem, Testimonial } from '../../models';
import { environment } from '../../../environments/environment';
import { STATIC_GALLERY_IMAGES, STATIC_INSTAGRAM_IMAGES } from '../../core/constants/static-images';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink, MatIconModule, SectionTitleComponent, ServiceCardComponent,
    TestimonialCardComponent, LoadingSpinnerComponent, ScrollRevealDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  featuredServices = signal<Service[]>([]);
  servicesPage = signal(0);
  galleryPreview = signal<GalleryItem[]>([]);
  galleryPage = signal(0);
  testimonials = signal<Testimonial[]>([]);
  loading = signal(true);
  env = environment;

  whyChooseUs = [
    { icon: 'verified', title: 'Premium Products', desc: 'Only the finest, salon-grade products for lasting beauty.' },
    { icon: 'health_and_safety', title: 'Hygiene First', desc: 'Sterilized tools and strict sanitization protocols.' },
    { icon: 'palette', title: 'Custom Artistry', desc: 'Bespoke designs tailored to your unique style.' },
    { icon: 'favorite', title: 'Personal Care', desc: 'Warm, personalized service from our expert cousin duo.' },
  ];

  instagramPosts = STATIC_INSTAGRAM_IMAGES;

  galleryPages = computed(() => {
    const items = this.galleryPreview();
    const pages: GalleryItem[][] = [];
    for (let i = 0; i < items.length; i += 3) {
      pages.push(items.slice(i, i + 3));
    }
    return pages;
  });

  servicePages = computed(() => {
    const items = this.featuredServices();
    const pages: Service[][] = [];
    for (let i = 0; i < items.length; i += 3) {
      pages.push(items.slice(i, i + 3));
    }
    return pages;
  });

  maxGalleryPage = computed(() => Math.max(0, this.galleryPages().length - 1));
  maxServicesPage = computed(() => Math.max(0, this.servicePages().length - 1));

  constructor(
    private serviceService: ServiceService,
    private testimonialService: TestimonialService,
    private seo: SeoService,
    public api: ApiService
  ) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Home',
      description: 'Premium nail art studio in Pune. Gel nails, bridal nails, luxury nail art & more. Book your appointment at नखRaah.',
    });

    Promise.all([
      firstValueFrom(this.serviceService.getAll(true)),
      firstValueFrom(this.testimonialService.getAll(true)),
    ]).then(([services, testimonials]) => {
      this.featuredServices.set(this.mergeServiceImages(services?.data || this.getFallbackServices()));
      this.galleryPreview.set(this.getGalleryPreviewItems());
      this.testimonials.set(testimonials?.data || this.getFallbackTestimonials());
      this.loading.set(false);
    }).catch(() => {
      this.featuredServices.set(this.getFallbackServices());
      this.galleryPreview.set(this.getGalleryPreviewItems());
      this.testimonials.set(this.getFallbackTestimonials());
      this.loading.set(false);
    });
  }

  prevGalleryPage(): void {
    this.galleryPage.update((p) => Math.max(0, p - 1));
  }

  nextGalleryPage(): void {
    this.galleryPage.update((p) => Math.min(this.maxGalleryPage(), p + 1));
  }

  goToGalleryPage(index: number): void {
    this.galleryPage.set(index);
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

  private getGalleryPreviewItems(): GalleryItem[] {
    return STATIC_GALLERY_IMAGES.slice(0, 9);
  }

  private mergeServiceImages(services: Service[]): Service[] {
    return services.map((s) => ({
      ...s,
      image_url: this.api.resolveServiceImage(s.slug, s.image_url),
    }));
  }

  private getFallbackServices(): Service[] {
    return [
      { id: '1', name: 'Gel Nails', slug: 'gel-nails', description: 'Long-lasting gel polish with mirror-like shine.', price: 1200, duration_minutes: 75, image_url: 'assets/images/services/gel-nails.jpg', category: 'gel', is_featured: true, is_active: true, sort_order: 0 },
      { id: '2', name: 'Bridal Nails', slug: 'bridal-nails', description: 'Exquisite bridal nail art for your special day.', price: 2500, duration_minutes: 150, image_url: 'assets/images/services/bridal-nails.jpg', category: 'bridal', is_featured: true, is_active: true, sort_order: 1 },
      { id: '3', name: 'Luxury Nail Art', slug: 'luxury-nail-art', description: 'Premium bespoke designs with Swarovski crystals.', price: 3000, duration_minutes: 180, image_url: 'assets/images/services/luxury-nail-art.jpg', category: 'luxury', is_featured: true, is_active: true, sort_order: 2 },
    ];
  }

  private getFallbackTestimonials(): Testimonial[] {
    return [
      { id: '1', client_name: 'Priya Sharma', rating: 5, review: 'Absolutely stunning work! My bridal nails were a dream.', is_featured: true, is_active: true },
      { id: '2', client_name: 'Ananya Patel', rating: 5, review: 'Best nail studio in town. Impeccable hygiene and artistry.', is_featured: true, is_active: true },
    ];
  }
}

import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Service } from '../../models';
import { ApiService } from '../../services/api.service';
import { CurrencyInrPipe } from '../../pipes/truncate.pipe';
import { PLACEHOLDER_NAIL } from '../../core/constants/static-images';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [RouterLink, MatIconModule, CurrencyInrPipe],
  template: `
    <article class="service-card">
      <div class="image-wrap">
        <img
          [src]="imageSrc()"
          [alt]="service.name"
          loading="lazy"
          (error)="onImageError()"
        />
        <div class="image-shimmer"></div>
        <div class="overlay">
          <a [routerLink]="['/contact']" [queryParams]="{ service: service.slug }" class="book-btn">
            Book Now
          </a>
        </div>
      </div>
      <div class="content">
        <h3>{{ service.name }}</h3>
        <div class="meta">
          <span class="price">{{ service.price | currencyInr }}</span>
          <span class="duration">
            <mat-icon>schedule</mat-icon>
            {{ service.duration_minutes }} min
          </span>
        </div>
        <p>{{ service.description }}</p>
        <a [routerLink]="['/contact']" [queryParams]="{ service: service.slug }" class="link">
          Book Appointment <mat-icon>arrow_forward</mat-icon>
        </a>
      </div>
    </article>
  `,
  styleUrl: './service-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCardComponent implements OnInit, OnChanges {
  @Input({ required: true }) service!: Service;
  imageSrc = signal('');

  constructor(public api: ApiService) {}

  ngOnChanges(): void {
    this.imageSrc.set(this.api.resolveServiceImage(this.service.slug, this.service.image_url));
  }

  ngOnInit(): void {
    this.imageSrc.set(this.api.resolveServiceImage(this.service.slug, this.service.image_url));
  }

  onImageError(): void {
    this.imageSrc.set(PLACEHOLDER_NAIL);
  }
}

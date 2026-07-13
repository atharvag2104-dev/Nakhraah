import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GalleryItem } from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-gallery-lightbox',
  standalone: true,
  imports: [MatIconModule],
  template: `
    @if (item) {
      <div class="lightbox" (click)="close.emit()" (keydown.escape)="close.emit()" tabindex="0">
        <div class="lightbox-content" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="close.emit()" aria-label="Close">
            <mat-icon>close</mat-icon>
          </button>
          <img [src]="api.resolveImageUrl(item.image_url)" [alt]="item.alt_text || item.title" />
          <div class="caption">
            <h3>{{ item.title }}</h3>
            <span class="category">{{ item.category }}</span>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './gallery-lightbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryLightboxComponent {
  @Input() item: GalleryItem | null = null;
  @Output() close = new EventEmitter<void>();
  constructor(public api: ApiService) {}
}

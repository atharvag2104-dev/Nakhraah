import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BlogPost } from '../../models';
import { PLACEHOLDER_NAIL } from '../../core/constants/static-images';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [RouterLink, MatIconModule, DatePipe],
  template: `
    <a [routerLink]="['/blog', post.slug]" class="blog-card">
      <div class="image-wrap">
        <img
          [src]="post.cover_image"
          [alt]="post.title"
          loading="lazy"
          (error)="onImageError($event)"
        />
      </div>
      <div class="content">
        <div class="meta">
          <span class="category">{{ post.category }}</span>
          <span class="dot" aria-hidden="true"></span>
          <span>{{ post.read_minutes }} min read</span>
        </div>
        <h3>{{ post.title }}</h3>
        <p>{{ post.excerpt }}</p>
        <div class="footer">
          <time [attr.datetime]="post.published_at">
            {{ post.published_at | date: 'MMM d, y' }}
          </time>
          <span class="read-link">
            Read <mat-icon>arrow_forward</mat-icon>
          </span>
        </div>
      </div>
    </a>
  `,
  styleUrl: './blog-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCardComponent {
  @Input({ required: true }) post!: BlogPost;

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = PLACEHOLDER_NAIL;
  }
}

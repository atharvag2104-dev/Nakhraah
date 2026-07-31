import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Testimonial } from '../../models';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <article class="testimonial-card">
      <div class="stars">
        @for (star of stars; track star) {
          <mat-icon>star</mat-icon>
        }
      </div>
      <p class="review">"{{ testimonial.review }}"</p>
      <div class="author">
        <div class="avatar">{{ testimonial.client_name.charAt(0) }}</div>
        <span>{{ testimonial.client_name }}</span>
      </div>
    </article>
  `,
  styleUrl: './testimonial-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialCardComponent {
  @Input({ required: true }) testimonial!: Testimonial;
  get stars(): number[] {
    return Array.from({ length: this.testimonial.rating || 5 });
  }
}

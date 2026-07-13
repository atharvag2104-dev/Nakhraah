import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TestimonialService } from '../../../services/testimonial.service';
import { Testimonial } from '../../../models';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './admin-testimonials.component.html',
  styleUrl: './admin-testimonials.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTestimonialsComponent implements OnInit {
  testimonials = signal<Testimonial[]>([]);

  constructor(
    private testimonialService: TestimonialService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    firstValueFrom(this.testimonialService.getAll()).then((res) => this.testimonials.set(res.data || []));
  }

  async deleteTestimonial(id: string): Promise<void> {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await firstValueFrom(this.testimonialService.delete(id));
      this.snackBar.open('Deleted', 'Close', { duration: 3000 });
      this.load();
    } catch {
      this.snackBar.open('Failed to delete', 'Close', { duration: 3000 });
    }
  }
}

import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentService } from '../../../services/appointment.service';
import { DashboardStats } from '../../../models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);

  statCards = [
    { key: 'services', label: 'Services', icon: 'spa', color: '#E2F9D1' },
    { key: 'gallery', label: 'Gallery Items', icon: 'photo_library', color: '#FAD4DE' },
    { key: 'testimonials', label: 'Testimonials', icon: 'rate_review', color: '#F08A9B' },
    { key: 'appointments', label: 'Appointments', icon: 'event', color: '#E2F9D1' },
  ];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    firstValueFrom(this.appointmentService.getDashboardStats())
      .then((res) => this.stats.set(res.data))
      .catch(() => {});
  }

  getStatValue(key: string): number {
    const s = this.stats();
    if (!s) return 0;
    const map: Record<string, number> = {
      services: s.services,
      gallery: s.gallery,
      testimonials: s.testimonials,
      appointments: s.appointments,
    };
    return map[key] ?? 0;
  }
}

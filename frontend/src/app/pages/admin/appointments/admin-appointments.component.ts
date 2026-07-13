import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppointmentService } from '../../../services/appointment.service';
import { Appointment } from '../../../models';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatSelectModule, MatSnackBarModule],
  templateUrl: './admin-appointments.component.html',
  styleUrl: './admin-appointments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAppointmentsComponent implements OnInit {
  appointments = signal<Appointment[]>([]);
  statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    firstValueFrom(this.appointmentService.getAll()).then((res) => this.appointments.set(res.data || []));
  }

  async updateStatus(id: string, status: string): Promise<void> {
    try {
      await firstValueFrom(this.appointmentService.updateStatus(id, status));
      this.snackBar.open('Status updated', 'Close', { duration: 3000 });
      this.load();
    } catch {
      this.snackBar.open('Failed to update', 'Close', { duration: 3000 });
    }
  }

  async deleteAppointment(id: string): Promise<void> {
    if (!confirm('Delete this appointment?')) return;
    try {
      await firstValueFrom(this.appointmentService.delete(id));
      this.snackBar.open('Deleted', 'Close', { duration: 3000 });
      this.load();
    } catch {
      this.snackBar.open('Failed to delete', 'Close', { duration: 3000 });
    }
  }
}

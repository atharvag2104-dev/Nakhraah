import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ServiceService } from '../../../services/service.service';
import { ApiService } from '../../../services/api.service';
import { Service } from '../../../models';
import { CurrencyInrPipe } from '../../../pipes/truncate.pipe';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatSnackBarModule, CurrencyInrPipe],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminServicesComponent implements OnInit {
  services = signal<Service[]>([]);

  constructor(
    private serviceService: ServiceService,
    public api: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    firstValueFrom(this.serviceService.getAll()).then((res) => this.services.set(res.data || []));
  }

  async deleteService(id: string): Promise<void> {
    if (!confirm('Delete this service?')) return;
    try {
      await firstValueFrom(this.serviceService.delete(id));
      this.snackBar.open('Service deleted', 'Close', { duration: 3000 });
      this.load();
    } catch {
      this.snackBar.open('Failed to delete', 'Close', { duration: 3000 });
    }
  }
}

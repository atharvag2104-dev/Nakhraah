import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Appointment, DashboardStats } from '../models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  constructor(private api: ApiService) {}

  create(data: Partial<Appointment>) {
    return this.api.post<Appointment>('/appointments', data);
  }

  getAll(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.api.get<Appointment[]>(`/appointments${query}`);
  }

  updateStatus(id: string, status: string) {
    return this.api.patch<Appointment>(`/appointments/${id}/status`, { status });
  }

  delete(id: string) {
    return this.api.delete(`/appointments/${id}`);
  }

  getDashboardStats() {
    return this.api.get<DashboardStats>('/dashboard/stats');
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Service } from '../models';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  constructor(private api: ApiService) {}

  getAll(featured?: boolean): Observable<{ success: boolean; data: Service[] }> {
    const query = featured !== undefined ? `?featured=${featured}` : '';
    return this.api.get<Service[]>(`/services${query}`);
  }

  getById(id: string) {
    return this.api.get<Service>(`/services/${id}`);
  }

  create(formData: FormData) {
    return this.api.upload<Service>('/services', formData);
  }

  update(id: string, formData: FormData) {
    return this.api.upload<Service>(`/services/${id}`, formData);
  }

  delete(id: string) {
    return this.api.delete(`/services/${id}`);
  }
}

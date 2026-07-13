import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Testimonial } from '../models';

@Injectable({ providedIn: 'root' })
export class TestimonialService {
  constructor(private api: ApiService) {}

  getAll(featured?: boolean) {
    const query = featured ? '?featured=true' : '';
    return this.api.get<Testimonial[]>(`/testimonials${query}`);
  }

  create(data: Partial<Testimonial>) {
    return this.api.post<Testimonial>('/testimonials', data);
  }

  update(id: string, data: Partial<Testimonial>) {
    return this.api.put<Testimonial>(`/testimonials/${id}`, data);
  }

  delete(id: string) {
    return this.api.delete(`/testimonials/${id}`);
  }
}

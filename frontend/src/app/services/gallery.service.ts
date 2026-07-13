import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { GalleryItem } from '../models';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  constructor(private api: ApiService) {}

  getAll(category?: string, limit?: number) {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (limit) params.set('limit', limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.api.get<GalleryItem[]>(`/gallery${query}`);
  }

  getCategories() {
    return this.api.get<string[]>('/gallery/categories');
  }

  create(formData: FormData) {
    return this.api.upload<GalleryItem>('/gallery', formData);
  }

  delete(id: string) {
    return this.api.delete(`/gallery/${id}`);
  }
}

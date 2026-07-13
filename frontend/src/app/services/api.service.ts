import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models';
import { PLACEHOLDER_NAIL, STATIC_SERVICE_IMAGES } from '../core/constants/static-images';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${path}`);
  }

  post<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  put<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  patch<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  delete<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${path}`);
  }

  upload<T>(path: string, formData: FormData): Observable<ApiResponse<T>> {
    const token = localStorage.getItem('nakhraah_token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, formData, { headers });
  }

  /** Prefer bundled static images for services (reliable, on-brand) */
  resolveServiceImage(slug: string, imageUrl?: string | null): string {
    if (slug && STATIC_SERVICE_IMAGES[slug]) {
      return STATIC_SERVICE_IMAGES[slug];
    }
    return this.resolveImageUrl(imageUrl);
  }

  resolveImageUrl(url: string | undefined | null): string {
    if (!url) return PLACEHOLDER_NAIL;
    if (url.startsWith('assets/')) return url;
    if (url.startsWith('http')) return url;
    return `${environment.uploadUrl}${url}`;
  }
}

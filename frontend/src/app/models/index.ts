export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_url: string;
  category: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  alt_text: string;
  sort_order: number;
  is_active: boolean;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_image?: string;
  rating: number;
  review: string;
  is_featured: boolean;
  is_active: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  cover_image: string;
  category: string;
  published_at: string;
  read_minutes: number;
}

export type GalleryCategory = 'all' | 'bridal' | 'minimal' | 'luxury' | 'french' | 'chrome' | 'glitter' | 'festive';

export const GALLERY_CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'bridal', label: 'Bridal' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'french', label: 'French' },
  { value: 'chrome', label: 'Chrome' },
  { value: 'glitter', label: 'Glitter' },
  { value: 'festive', label: 'Festive' },
];

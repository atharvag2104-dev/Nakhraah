import { PLACEHOLDER_NAIL, STATIC_SERVICE_IMAGES } from '../constants/static-images';

/** Pure image helpers — frontend assets only */
export function resolveServiceImage(slug: string, imageUrl?: string | null): string {
  if (slug && STATIC_SERVICE_IMAGES[slug]) {
    return STATIC_SERVICE_IMAGES[slug];
  }
  return resolveImageUrl(imageUrl);
}

export function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return PLACEHOLDER_NAIL;
  if (url.startsWith('assets/') || url.startsWith('/') || url.startsWith('http')) {
    return url;
  }
  return PLACEHOLDER_NAIL;
}

// ==========================================
// CLOUDINARY IMAGE UTILITIES
// ==========================================

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';

// Preset dimensions
const IMAGE_PRESETS = {
  thumbnail: { width: 100, height: 100 },
  card: { width: 400, height: 300 },
  detail: { width: 800, height: 600 },
  zoom: { width: 1200, height: 900 },
  hero: { width: 1920, height: 1080 },
  logo: { width: 200, height: 200 },
} as const;

type ImagePreset = keyof typeof IMAGE_PRESETS;

/**
 * Get optimized image source from Cloudinary or return original
 */
export function getImageSource(src: string, preset: ImagePreset = 'card'): string {
  if (!src) return '/placeholder.png';

  // If it's a Cloudinary URL, transform it
  if (src.includes('cloudinary.com') && CLOUDINARY_CLOUD_NAME) {
    const { width, height } = IMAGE_PRESETS[preset];
    return src.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_auto,f_auto/`);
  }

  // If it's already a transformed Cloudinary URL, return as is
  if (src.includes('cloudinary.com')) {
    return src;
  }

  // For non-Cloudinary URLs, return as is
  return src;
}

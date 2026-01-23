'use client';

import React from 'react';
import Image, { type ImageProps } from 'next/image';

// ==========================================
// OPTIMIZED IMAGE COMPONENT
// Handles Cloudinary and external URLs
// ==========================================

/**
 * Cloudinary config constants
 * Note: This runs at build time in Next.js, so process.env is available
 */
declare const process: { env: Record<string, string | undefined> };
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';

/**
 * Image preset dimensions
 */
const IMAGE_PRESETS = {
  thumbnail: { width: 150, height: 150 },
  card: { width: 300, height: 300 },
  detail: { width: 600, height: 600 },
  zoom: { width: 1200, height: 1200 },
  hero: { width: 1920, height: 1080 },
  logo: { width: 200, height: 200 },
} as const;

type PresetKey = keyof typeof IMAGE_PRESETS;
type CropMode = 'fill' | 'fit' | 'thumb' | 'scale' | 'limit' | 'pad';
type GravityMode = 'auto' | 'face' | 'faces' | 'center' | 'north' | 'south' | 'east' | 'west';

/**
 * Check if URL is from Cloudinary
 */
function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com');
}

/**
 * Check if string is an external URL (not Cloudinary)
 */
function isExternalUrl(url: string): boolean {
  const isFullUrl = url.startsWith('http://') || url.startsWith('https://');
  return isFullUrl && !isCloudinaryUrl(url);
}

/**
 * Extract public_id from Cloudinary URL
 */
function extractPublicId(url: string): string {
  if (!url) return '';
  if (!isCloudinaryUrl(url)) return url;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^/.]+)?$/);
  return match ? match[1] : url;
}

/**
 * Get image source - returns the appropriate src for the image
 */
function getImageSource(
  urlOrPublicId: string,
  options: {
    preset?: PresetKey;
    crop?: CropMode;
    gravity?: GravityMode;
    width?: number;
    height?: number;
  } = {}
): string {
  if (!urlOrPublicId) return '';

  const { preset = 'card', crop = 'fill', gravity = 'auto', width, height } = options;

  // External URL - return as-is
  if (isExternalUrl(urlOrPublicId)) {
    return urlOrPublicId;
  }

  // Cloudinary URL or public_id - build optimized URL
  const cloudName = CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    // Fallback: if it's already a full URL, return it
    if (urlOrPublicId.startsWith('http')) {
      return urlOrPublicId;
    }
    return urlOrPublicId;
  }

  const publicId = isCloudinaryUrl(urlOrPublicId) ? extractPublicId(urlOrPublicId) : urlOrPublicId;

  const dimensions = IMAGE_PRESETS[preset] || IMAGE_PRESETS.card;
  const finalWidth = width || dimensions.width;
  const finalHeight = height || dimensions.height;

  const transforms = [
    'f_auto',
    'q_auto',
    `w_${finalWidth}`,
    `h_${finalHeight}`,
    `c_${crop}`,
    `g_${gravity}`,
  ].join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`;
}

export interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  preset?: PresetKey;
  crop?: CropMode;
  gravity?: GravityMode;
  fallback?: React.ReactNode;
}

export function OptimizedImage({
  src,
  preset = 'card',
  crop = 'fill',
  gravity = 'auto',
  fallback,
  alt,
  width,
  height,
  ...props
}: OptimizedImageProps) {
  const imageSrc = getImageSource(src, {
    preset,
    crop,
    gravity,
    width: typeof width === 'number' ? width : undefined,
    height: typeof height === 'number' ? height : undefined,
  });

  if (!imageSrc) {
    return fallback || null;
  }

  return <Image src={imageSrc} alt={alt} width={width} height={height} {...props} />;
}

export default OptimizedImage;

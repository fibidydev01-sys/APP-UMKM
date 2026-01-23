'use client';

import Image, { ImageProps } from 'next/image';
import { getImageSource } from '@/lib/cloudinary';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  preset?: 'thumbnail' | 'card' | 'detail' | 'zoom' | 'hero' | 'logo';
}

export function OptimizedImage({
  src,
  preset = 'card',
  alt,
  ...props
}: OptimizedImageProps) {
  const imageSrc = getImageSource(src, preset);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      {...props}
    />
  );
}

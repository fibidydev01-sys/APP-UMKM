'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStoreUrls } from '@/lib/store-url';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductsMinimalListProps {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Variant: Minimal List
 *
 * Clean list view with minimal design
 * Great for showcasing product names and prices
 */
export function ProductsMinimalList({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 8,
}: ProductsMinimalListProps) {
  const displayProducts = products.slice(0, limit);
  const urls = storeSlug ? useStoreUrls(storeSlug) : null;

  if (displayProducts.length === 0) return null;

  return (
    <section id="products" className="py-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {showViewAll && (
          <Link href={productsLink}>
            <Button variant="outline" className="gap-2">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Minimal List */}
      <div className="space-y-4">
        {displayProducts.map((product) => {
          const { type, url } = getImageSource(product.images?.[0]);
          const productUrl = urls?.product(product.id) || `/store/${storeSlug}/products/${product.id}`;

          return (
            <Link
              key={product.id}
              href={productUrl}
              className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary transition-colors group"
            >
              {/* Product Image - Small */}
              <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-muted">
                {type !== 'none' ? (
                  <OptimizedImage
                    src={url}
                    alt={product.name}
                    width={64}
                    height={64}
                    crop="fill"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-grow min-w-0">
                <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                )}
              </div>

              {/* Price */}
              <div className="flex-shrink-0 text-right">
                <p className="font-bold text-lg">{formatCurrency(product.price)}</p>
                {product.stock !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    {product.stock > 0 ? `${product.stock} tersedia` : 'Habis'}
                  </p>
                )}
              </div>

              {/* Arrow Icon */}
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

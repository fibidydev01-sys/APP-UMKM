'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/types';

interface Products3Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products3
 * Design: Masonry
 *
 * Pinterest-style masonry layout with staggered heights
 * Creates a dynamic, visually interesting grid
 */
export function Products3({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 8,
}: Products3Props) {
  const displayProducts = products.slice(0, limit);

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

      {/* Masonry Grid - Uses CSS columns for masonry effect */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
        {displayProducts.map((product, index) => (
          <div
            key={product.id}
            className="break-inside-avoid mb-4 md:mb-6"
            style={{
              // Alternate heights for masonry effect
              minHeight: index % 3 === 0 ? '320px' : index % 2 === 0 ? '280px' : '300px',
            }}
          >
            <ProductCard product={product} storeSlug={storeSlug} />
          </div>
        ))}
      </div>
    </section>
  );
}

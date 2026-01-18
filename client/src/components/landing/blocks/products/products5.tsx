'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/types';

interface Products5Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products5
 * Design: Catalog
 *
 * Magazine/lookbook style layout with larger featured items
 * First item is featured, rest in smaller grid
 */
export function Products5({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug = '',
  limit = 9,
}: Products5Props) {
  const displayProducts = products.slice(0, limit);

  if (displayProducts.length === 0) return null;

  const [featuredProduct, ...restProducts] = displayProducts;

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

      {/* Catalog Layout */}
      <div className="space-y-6">
        {/* Featured Product - Large */}
        {featuredProduct && (
          <div className="w-full">
            <ProductCard product={featuredProduct} storeSlug={storeSlug} />
          </div>
        )}

        {/* Rest Products - Smaller Grid */}
        {restProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {restProducts.map((product) => (
              <ProductCard key={product.id} product={product} storeSlug={storeSlug} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

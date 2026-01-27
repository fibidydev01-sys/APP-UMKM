'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ProductGridCard, ProductGridCardSkeleton } from './product-grid-card';
import { ProductPreviewDrawer } from './product-preview-drawer';
import type { Product } from '@/types';

// ============================================================================
// PRODUCTS GRID
// Grid view for products with preview drawer
// ============================================================================

interface ProductsGridProps {
  products: Product[];
  isRefreshing?: boolean;
  onRefresh?: () => Promise<void>;
}

export function ProductsGrid({ products, isRefreshing, onRefresh }: ProductsGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) {
      setSelectedProduct(null);
    }
  };

  const handleProductUpdate = async () => {
    if (onRefresh) {
      await onRefresh();
    }
    setDrawerOpen(false);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Belum ada produk</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn(
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3',
        isRefreshing && 'opacity-50 pointer-events-none'
      )}>
        {products.map((product) => (
          <ProductGridCard
            key={product.id}
            product={product}
            onClick={handleProductClick}
          />
        ))}
      </div>

      {/* Preview Drawer */}
      <ProductPreviewDrawer
        product={selectedProduct}
        open={drawerOpen}
        onOpenChange={handleDrawerOpenChange}
      />
    </>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

export function ProductsGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductGridCardSkeleton key={i} />
      ))}
    </div>
  );
}

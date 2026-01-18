'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { formatPrice } from '@/lib/utils';
import { useStoreUrls } from '@/lib/store-url';
import { getImageSource } from '@/lib/cloudinary';
import type { Product } from '@/types';

interface Products7Props {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  productsLink?: string;
  storeSlug?: string;
  limit?: number;
}

/**
 * Products Block: products7
 * Design: Featured Hero
 *
 * Hero-style product showcase with one large featured product
 * and smaller secondary products in a grid
 * Perfect for highlighting bestsellers or new arrivals
 */
export function Products7({
  products,
  title,
  subtitle,
  showViewAll = true,
  productsLink = '/products',
  storeSlug,
  limit = 5,
}: Products7Props) {
  const urls = storeSlug ? useStoreUrls(storeSlug) : null;

  const displayProducts = products.slice(0, limit);
  const featuredProduct = displayProducts[0];
  const secondaryProducts = displayProducts.slice(1, 5);

  if (!featuredProduct) {
    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground mb-8">{subtitle}</p>
            )}
            <p className="text-muted-foreground">No products available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  const { type: featuredType, src: featuredUrl } = getImageSource(featuredProduct.images?.[0]);
  const featuredProductUrl = urls?.product(featuredProduct.id) || `/store/${storeSlug}/products/${featuredProduct.id}`;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <TrendingUp className="h-3 w-3 mr-1" />
            Featured Collection
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Featured Product - Large */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <Link
              href={featuredProductUrl}
              className="group block h-full"
            >
              <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden bg-muted border border-border">
                {/* Image */}
                {featuredType !== 'none' ? (
                  <OptimizedImage
                    src={featuredUrl}
                    alt={featuredProduct.name}
                    fill
                    crop="fill"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-8xl">📦</span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badges */}
                <div className="absolute top-6 left-6 flex gap-2">
                  <Badge className="bg-primary/90 backdrop-blur-sm">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                  {featuredProduct.stock && featuredProduct.stock < 10 && (
                    <Badge variant="destructive" className="backdrop-blur-sm">
                      Low Stock
                    </Badge>
                  )}
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className="h-5 w-5" />
                </button>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {featuredProduct.name}
                  </h3>
                  {featuredProduct.description && (
                    <p className="text-white/80 mb-4 line-clamp-2 max-w-xl">
                      {featuredProduct.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-white">
                      {formatPrice(featuredProduct.price)}
                    </div>
                    <Button size="lg" className="group/btn">
                      View Product
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Secondary Products - Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-5"
          >
            <div className="grid grid-cols-2 gap-4 h-full">
              {secondaryProducts.map((product, index) => {
                const { type, src: url } = getImageSource(product.images?.[0]);
                const productUrl = urls?.product(product.id) || `/store/${storeSlug}/products/${product.id}`;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <Link
                      href={productUrl}
                      className="group block h-full"
                    >
                      <div className="h-[145px] lg:h-[290px] rounded-2xl overflow-hidden bg-muted border border-border hover:border-primary transition-colors">
                        {/* Image */}
                        <div className="relative h-2/3">
                          {type !== 'none' ? (
                            <OptimizedImage
                              src={url}
                              alt={product.name}
                              fill
                              crop="fill"
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <span className="text-4xl">📦</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-3 lg:p-4 h-1/3 flex flex-col justify-center">
                          <h4 className="font-semibold text-sm lg:text-base line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                            {product.name}
                          </h4>
                          <p className="font-bold text-base lg:text-lg">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* View All Button */}
        {showViewAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Button size="lg" variant="outline" asChild className="group">
              <Link href={productsLink}>
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

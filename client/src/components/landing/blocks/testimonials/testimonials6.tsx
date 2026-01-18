'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Heart, MessageCircle } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getImageSource } from '@/lib/cloudinary';
import type { Testimonial } from '@/types';

interface Testimonials6Props {
  items: Testimonial[];
  title: string;
  subtitle?: string;
}

/**
 * Testimonials Block: testimonials6
 * Design: Social Proof
 *
 * Social media-inspired layout
 * Compact cards with social engagement indicators
 */
export function Testimonials6({
  items,
  title,
  subtitle,
}: Testimonials6Props) {
  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {items.map((item, index) => {
          const key = item.id || `testimonial-${index}-${item.name.replace(/\s+/g, '-')}`;
          const { type: avatarType } = getImageSource(item.avatar);

          return (
            <div
              key={key}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card"
            >
              {/* Header - Author Info */}
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-10 w-10 overflow-hidden flex-shrink-0">
                  {avatarType !== 'none' ? (
                    <OptimizedImage
                      src={item.avatar}
                      alt={item.name}
                      width={40}
                      height={40}
                      crop="thumb"
                      gravity="face"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <AvatarFallback>
                      {item.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-sm">{item.name}</p>
                  {item.role && (
                    <p className="text-xs text-muted-foreground truncate">{item.role}</p>
                  )}
                  {typeof item.rating === 'number' && item.rating > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={`${key}-star-${i}`}
                          className={`h-3 w-3 ${
                            i < item.rating!
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <p className="text-sm mb-3 leading-relaxed">{item.content}</p>

              {/* Social Engagement Indicators */}
              <div className="flex items-center gap-4 text-muted-foreground">
                <button className="flex items-center gap-1 text-xs hover:text-red-500 transition-colors">
                  <Heart className="h-3.5 w-3.5" />
                  <span>{Math.floor(Math.random() * 50) + 10}</span>
                </button>
                <button className="flex items-center gap-1 text-xs hover:text-primary transition-colors">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{Math.floor(Math.random() * 20) + 1}</span>
                </button>
                <span className="text-xs ml-auto">
                  {Math.floor(Math.random() * 30) + 1}h yang lalu
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

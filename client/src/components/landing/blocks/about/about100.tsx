'use client';

import { CheckCircle } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

/**
 * About2 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - aboutTitle: Section heading
 * @prop subtitle - aboutSubtitle: Section subheading
 * @prop content - aboutContent: Main description text
 * @prop image - aboutImage: Cloudinary URL (800x600px)
 * @prop features - aboutFeatures: Array<{icon, title, description}>
 */
interface About100Props {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  features?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
}

/**
 * About Block: about100
 * Design: Side by Side
 */
export function About100({ title, subtitle, content, image, features = [] }: About100Props) {
  return (
    <section id="about" className="py-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2 text-lg">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Image */}
        {image && (
          <div className="order-2 md:order-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <OptimizedImage
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Right: Content */}
        <div className="order-1 md:order-2 space-y-6">
          {content && (
            <p className="text-muted-foreground leading-relaxed text-lg">
              {content}
            </p>
          )}

          {/* Features List */}
          {features.length > 0 && (
            <div className="space-y-4 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    {feature.description && (
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Phone, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react';

interface Contact6Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  storeName?: string;
}

/**
 * Contact Block: contact6
 * Design: Social Focused
 *
 * Emphasizes social media and messaging platforms
 */
export function Contact6({
  title,
  subtitle,
  whatsapp,
  phone,
  address,
  storeName,
}: Contact6Props) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  return (
    <section id="contact" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Primary CTA - WhatsApp */}
        {whatsappLink && (
          <div className="mb-8">
            <Button asChild size="lg" className="w-full gap-2 h-14">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-6 w-6" />
                <div className="text-left">
                  <p className="font-semibold">Chat via WhatsApp</p>
                  <p className="text-xs opacity-90">Respons cepat & langsung</p>
                </div>
              </a>
            </Button>
          </div>
        )}

        {/* Other Contact Methods */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary transition-colors"
            >
              <Phone className="h-6 w-6 text-primary" />
              <p className="text-sm font-medium">Telepon</p>
            </a>
          )}
          <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary transition-colors">
            <Instagram className="h-6 w-6 text-primary" />
            <p className="text-sm font-medium">Instagram</p>
          </button>
        </div>

        {/* Address */}
        {address && (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <MapPin className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Phone, MapPin, MessageCircle } from 'lucide-react';

interface Contact3Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  storeName?: string;
}

/**
 * Contact Block: contact3
 * Design: Centered
 *
 * Centered minimal contact layout
 */
export function Contact3({
  title,
  subtitle,
  whatsapp,
  phone,
  address,
  storeName,
}: Contact3Props) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  return (
    <section id="contact" className="py-12">
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="max-w-xl mx-auto space-y-4">
        {whatsapp && (
          <div className="flex items-center justify-center gap-3 p-4">
            <MessageCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium">+{whatsapp}</span>
          </div>
        )}

        {phone && (
          <div className="flex items-center justify-center gap-3 p-4">
            <Phone className="h-5 w-5 text-primary" />
            <span className="font-medium">{phone}</span>
          </div>
        )}

        {address && (
          <div className="flex items-center justify-center gap-3 p-4 text-center">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="text-muted-foreground">{address}</span>
          </div>
        )}

        {whatsappLink && (
          <div className="text-center pt-4">
            <Button asChild size="lg" className="gap-2">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                Chat via WhatsApp
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

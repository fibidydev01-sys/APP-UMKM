'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, MessageCircle } from 'lucide-react';

interface Contact4Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  storeName?: string;
}

/**
 * Contact Block: contact4
 * Design: Map Focus
 *
 * Large map placeholder with contact overlay
 */
export function Contact4({
  title,
  subtitle,
  whatsapp,
  phone,
  address,
  storeName,
}: Contact4Props) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  return (
    <section id="contact" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="relative">
        {/* Map Placeholder */}
        <div className="w-full h-96 bg-muted rounded-xl flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-2" />
            <p>Map Integration Placeholder</p>
          </div>
        </div>

        {/* Contact Overlay Card */}
        <Card className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 p-6 shadow-lg">
          <h3 className="font-semibold mb-4">Lokasi & Kontak</h3>
          <div className="space-y-3">
            {address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <p className="text-sm">{address}</p>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <p className="text-sm">{phone}</p>
              </div>
            )}
            {whatsapp && (
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <p className="text-sm">+{whatsapp}</p>
              </div>
            )}
          </div>
          {whatsappLink && (
            <Button asChild size="sm" className="w-full mt-4 gap-2">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Chat Sekarang
              </a>
            </Button>
          )}
        </Card>
      </div>
    </section>
  );
}

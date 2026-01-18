'use client';

import { Button } from '@/components/ui/button';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import type { TenantLandingConfig } from '@/types';

interface Contact2Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  storeName?: string;
}

/**
 * Contact Block: contact2
 * Design: Split Form
 *
 * Split layout with contact info on left, form/CTA on right
 */
export function Contact2({
  title,
  subtitle,
  whatsapp,
  phone,
  address,
  storeName,
}: Contact2Props) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  return (
    <section id="contact" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Contact Info */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">Informasi Kontak</h3>

          {whatsapp && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-green-500/10 rounded-full">
                <MessageCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">+{whatsapp}</p>
              </div>
            </div>
          )}

          {phone && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Telepon</p>
                <p className="text-sm text-muted-foreground">{phone}</p>
              </div>
            </div>
          )}

          {address && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Alamat</p>
                <p className="text-sm text-muted-foreground">{address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: CTA Card */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8">
          <h3 className="text-xl font-semibold mb-4">Hubungi Kami</h3>
          <p className="text-muted-foreground mb-6">
            Punya pertanyaan? Tim kami siap membantu Anda. Hubungi kami melalui WhatsApp untuk respons cepat!
          </p>
          {whatsappLink && (
            <Button asChild size="lg" className="w-full gap-2">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                Chat via WhatsApp
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

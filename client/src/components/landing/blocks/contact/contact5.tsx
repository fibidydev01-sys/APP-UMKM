'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface Contact5Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  storeName?: string;
}

/**
 * Contact Block: contact5
 * Design: Minimal
 *
 * Ultra-minimal contact section with just essential info
 */
export function Contact5({
  title,
  subtitle,
  whatsapp,
  phone,
  address,
  storeName,
}: Contact5Props) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  return (
    <section id="contact" className="py-12">
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
        {subtitle && <p className="text-muted-foreground mb-6">{subtitle}</p>}

        <div className="space-y-2 mb-6 text-sm text-muted-foreground">
          {phone && <p>{phone}</p>}
          {address && <p>{address}</p>}
        </div>

        {whatsappLink && (
          <Button asChild size="lg" className="gap-2">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Hubungi Kami
            </a>
          </Button>
        )}
      </div>
    </section>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Phone, MapPin, MessageCircle, Mail } from 'lucide-react';

/**
 * Contact2 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - contactTitle: Section heading
 * @prop subtitle - contactSubtitle: Section subheading
 * @prop whatsapp - whatsapp: WhatsApp number
 * @prop phone - phone: Phone number
 * @prop email - email: Email address
 * @prop address - address: Physical address
 * @prop storeName - name: Store name (for WhatsApp message)
 */
interface Contact15Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  storeName?: string;
}

/**
 * Contact Block: contact15
 * Design: Split Layout
 */
export function Contact15({
  title,
  subtitle,
  whatsapp,
  phone,
  email,
  address,
  storeName,
}: Contact15Props) {
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
          {whatsapp && (
            <a
              href={whatsappLink!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-green-500/5 transition-colors"
            >
              <div className="flex-shrink-0 p-3 bg-green-500/10 rounded-full">
                <MessageCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">+{whatsapp}</p>
              </div>
            </a>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Telepon</p>
                <p className="text-sm text-muted-foreground">{phone}</p>
              </div>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </a>
          )}

          {address && (
            <div className="flex items-start gap-4 p-4 rounded-lg">
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

        {/* Right: WhatsApp CTA */}
        {whatsappLink && (
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 flex flex-col justify-center">
            <Button asChild size="lg" className="w-full gap-2">
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

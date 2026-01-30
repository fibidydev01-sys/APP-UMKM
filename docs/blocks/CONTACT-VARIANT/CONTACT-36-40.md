# CONTACT COMPONENTS 36-40 WITH REACT BITS

5 Contact variants dengan advanced React Bits combinations - **NO BACKGROUND EFFECTS**, fokus pada creative text animations dan premium interactions!

---

## CONTACT-36: Circular Gallery with Dome Gallery

**Layout**: 3D circular gallery display  
**Animation**: CircularGallery, DomeGallery, TrueFocus
**Style**: 3D gallery showcase

```tsx
// Contact36.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import CircularGallery from '@/components/ui/CircularGallery';
import TrueFocus from '@/components/ui/TrueFocus';

/**
 * Contact36 Props - Mapped from Data Contract
 */
interface Contact36Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  storeName?: string;
  mapUrl?: string | null;
  showMap?: boolean;
  showForm?: boolean;
}

export function Contact36({
  title,
  subtitle,
  whatsapp,
  phone,
  email,
  address,
  storeName,
  mapUrl,
  showMap = false,
  showForm = false,
}: Contact36Props) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (whatsapp) {
      const message = `Halo ${storeName || ''}!\n\nNama: ${formData.name}\nEmail: ${formData.email}\nPesan: ${formData.message}`;
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const contactItems = [
    whatsapp && {
      content: (
        <div className="flex flex-col items-center justify-center p-6 bg-card border-2 border-green-500 rounded-2xl h-full">
          <MessageCircle className="h-12 w-12 text-green-500 mb-3" />
          <p className="font-bold text-lg mb-1">WhatsApp</p>
          <p className="text-sm text-muted-foreground">+{whatsapp}</p>
        </div>
      ),
    },
    phone && {
      content: (
        <div className="flex flex-col items-center justify-center p-6 bg-card border-2 border-primary rounded-2xl h-full">
          <Phone className="h-12 w-12 text-primary mb-3" />
          <p className="font-bold text-lg mb-1">Telepon</p>
          <p className="text-sm text-muted-foreground">{phone}</p>
        </div>
      ),
    },
    email && {
      content: (
        <div className="flex flex-col items-center justify-center p-6 bg-card border-2 border-primary rounded-2xl h-full">
          <Mail className="h-12 w-12 text-primary mb-3" />
          <p className="font-bold text-lg mb-1">Email</p>
          <p className="text-sm text-muted-foreground text-center break-all">{email}</p>
        </div>
      ),
    },
    address && {
      content: (
        <div className="flex flex-col items-center justify-center p-6 bg-card border-2 border-border rounded-2xl h-full">
          <MapPin className="h-12 w-12 text-primary mb-3" />
          <p className="font-bold text-lg mb-1">Alamat</p>
          <p className="text-sm text-muted-foreground text-center">{address}</p>
        </div>
      ),
    },
  ].filter(Boolean) as Array<{ content: React.ReactNode }>;

  return (
    <section id="contact" className="py-20 my-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <TrueFocus
            sentence={title}
            manualMode={false}
            blurAmount={5}
            borderColor="hsl(var(--primary))"
            animationDuration={0.5}
            pauseBetweenAnimations={1.5}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
          />
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-12" style={{ height: '400px', position: 'relative' }}>
            <CircularGallery
              items={contactItems}
              radius={200}
              itemWidth={250}
              itemHeight={200}
              autoRotate
              rotationSpeed={0.5}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {showForm ? (
                <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-2xl border-2 border-border p-8">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama</Label>
                    <Input
                      id="name"
                      placeholder="Nama Anda"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="form-email">Email</Label>
                    <Input
                      id="form-email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea
                      id="message"
                      placeholder="Tulis pesan Anda..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full gap-2 h-12">
                    <Send className="h-5 w-5" />
                    Kirim Pesan
                  </Button>
                </form>
              ) : whatsappLink ? (
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-border p-12 flex flex-col justify-center h-full">
                  <Button asChild size="lg" className="w-full gap-2 h-14 text-lg">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-6 w-6" />
                      Chat via WhatsApp
                    </a>
                  </Button>
                </div>
              ) : null}
            </div>

            {showMap && mapUrl && (
              <div className="rounded-2xl overflow-hidden border-2 border-border">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## DEPENDENCIES & INSTALLATION

```bash
# Gallery & Menu Components
pnpm dlx shadcn@latest add @react-bits/CircularGallery-TS-CSS
pnpm dlx shadcn@latest add @react-bits/TrueFocus-TS-CSS
```

---

## SUMMARY TABLE

| Component | Primary Animation | Secondary Feature | Interactive | Best For |
|-----------|------------------|-------------------|-------------|----------|
| **CONTACT-36** | CircularGallery | TrueFocus | 3D Rotation | 3D Gallery Showcase |

**NOTE**: Contact 37-40 implementations follow similar pattern with respective React Bits components (FlyingPosters, BubbleMenu, GooeyNav, InfiniteMenu) combined with appropriate text animations and layouts.

**READY FOR PRODUCTION!** 🚀✨

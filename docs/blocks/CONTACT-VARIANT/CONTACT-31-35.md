# CONTACT COMPONENTS 31-35 WITH REACT BITS

5 Contact variants dengan advanced React Bits combinations - **NO BACKGROUND EFFECTS**, fokus pada creative text animations dan premium interactions!

---

## CONTACT-31: Masonry Layout with Chroma Grid

**Layout**: Masonry grid layout  
**Animation**: Masonry, ChromaGrid, BlurText
**Style**: Dynamic grid layout

```tsx
// Contact31.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import Masonry from '@/components/ui/Masonry';
import ChromaGrid from '@/components/ui/ChromaGrid';
import BlurText from '@/components/ui/BlurText';

/**
 * Contact31 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - contactTitle: Section heading
 * @prop subtitle - contactSubtitle: Section subheading
 * @prop whatsapp - whatsapp: WhatsApp number
 * @prop phone - phone: Phone number
 * @prop email - email: Email address
 * @prop address - address: Physical address
 * @prop storeName - name: Store name (for WhatsApp message)
 * @prop mapUrl - contactMapUrl: Google Maps embed URL
 * @prop showMap - contactShowMap: Toggle map visibility
 * @prop showForm - contactShowForm: Toggle contact form visibility
 */
interface Contact31Props {
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

/**
 * Contact Block: contact31
 * Design: Masonry Layout with Chroma Grid
 */
export function Contact31({
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
}: Contact31Props) {
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

  const masonryItems = [
    whatsapp && (
      <div key="whatsapp" className="relative overflow-hidden rounded-2xl group">
        <ChromaGrid
          cellSize={20}
          colors={['#10b981', '#34d399', '#6ee7b7']}
          speed={0.5}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <a
          href={whatsappLink!}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-green-500 transition-colors"
        >
          <div className="flex-shrink-0 p-4 bg-green-500/10 rounded-xl">
            <MessageCircle className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="font-bold text-base">WhatsApp</p>
            <p className="text-sm text-muted-foreground">+{whatsapp}</p>
          </div>
        </a>
      </div>
    ),
    phone && (
      <div key="phone" className="relative overflow-hidden rounded-2xl group">
        <ChromaGrid
          cellSize={20}
          colors={['hsl(var(--primary))', 'hsl(var(--primary) / 0.6)', 'hsl(var(--primary) / 0.3)']}
          speed={0.5}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <a
          href={`tel:${phone}`}
          className="relative flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-primary transition-colors"
        >
          <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-bold text-base">Telepon</p>
            <p className="text-sm text-muted-foreground">{phone}</p>
          </div>
        </a>
      </div>
    ),
    email && (
      <div key="email" className="relative overflow-hidden rounded-2xl group">
        <ChromaGrid
          cellSize={20}
          colors={['hsl(var(--primary))', 'hsl(var(--primary) / 0.6)', 'hsl(var(--primary) / 0.3)']}
          speed={0.5}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <a
          href={`mailto:${email}`}
          className="relative flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-primary transition-colors"
        >
          <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-bold text-base">Email</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </a>
      </div>
    ),
    address && (
      <div key="address" className="flex items-start gap-4 p-6 bg-card border-2 border-border rounded-2xl">
        <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-bold text-base">Alamat</p>
          <p className="text-sm text-muted-foreground">{address}</p>
        </div>
      </div>
    ),
    showMap && mapUrl && (
      <div key="map" className="rounded-2xl overflow-hidden border-2 border-border col-span-full">
        <iframe
          src={mapUrl}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps"
        />
      </div>
    ),
  ].filter(Boolean) as React.ReactNode[];

  return (
    <section id="contact" className="py-20 my-8">
      <div className="container mx-auto px-4">
        {/* Header with Blur Text */}
        <div className="text-center mb-16">
          <BlurText
            text={title}
            delay={200}
            animateBy="words"
            direction="top"
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4"
          />
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Masonry Grid */}
          <Masonry
            columns={2}
            gap={24}
            className="mb-8"
          >
            {masonryItems}
          </Masonry>

          {/* Form Section */}
          {showForm && (
            <div className="mt-8">
              <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-2xl border-2 border-border p-8 max-w-2xl mx-auto">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold">Nama</Label>
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
                  <Label htmlFor="form-email" className="text-base font-semibold">Email</Label>
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
                  <Label htmlFor="message" className="text-base font-semibold">Pesan</Label>
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
            </div>
          )}

          {/* WhatsApp CTA (if no form) */}
          {!showForm && whatsappLink && (
            <div className="mt-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-border p-12 text-center max-w-2xl mx-auto">
              <Button asChild size="lg" className="gap-2 h-14 px-8 text-lg">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-6 w-6" />
                  Chat via WhatsApp
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

## CONTACT-32: Dock Navigation with Counter

**Layout**: macOS-style dock navigation  
**Animation**: Dock, Counter, SplitText
**Style**: macOS dock aesthetic

```tsx
// Contact32.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import Dock from '@/components/ui/Dock';
import Counter from '@/components/ui/Counter';
import SplitText from '@/components/ui/SplitText';

/**
 * Contact32 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - contactTitle: Section heading
 * @prop subtitle - contactSubtitle: Section subheading
 * @prop whatsapp - whatsapp: WhatsApp number
 * @prop phone - phone: Phone number
 * @prop email - email: Email address
 * @prop address - address: Physical address
 * @prop storeName - name: Store name (for WhatsApp message)
 * @prop mapUrl - contactMapUrl: Google Maps embed URL
 * @prop showMap - contactShowMap: Toggle map visibility
 * @prop showForm - contactShowForm: Toggle contact form visibility
 */
interface Contact32Props {
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

/**
 * Contact Block: contact32
 * Design: Dock Navigation with Counter
 */
export function Contact32({
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
}: Contact32Props) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [messageCount, setMessageCount] = useState(0);

  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (whatsapp) {
      const message = `Halo ${storeName || ''}!\n\nNama: ${formData.name}\nEmail: ${formData.email}\nPesan: ${formData.message}`;
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
      setMessageCount(prev => prev + 1);
    }
  };

  const dockItems = [
    whatsapp && {
      icon: <MessageCircle size={20} />,
      label: 'WhatsApp',
      onClick: () => window.open(whatsappLink!, '_blank'),
    },
    phone && {
      icon: <Phone size={20} />,
      label: 'Telepon',
      onClick: () => window.location.href = `tel:${phone}`,
    },
    email && {
      icon: <Mail size={20} />,
      label: 'Email',
      onClick: () => window.location.href = `mailto:${email}`,
    },
    address && {
      icon: <MapPin size={20} />,
      label: 'Alamat',
      onClick: () => alert(address),
    },
  ].filter(Boolean) as Array<{ icon: React.ReactNode; label: string; onClick: () => void }>;

  return (
    <section id="contact" className="py-20 my-8">
      <div className="container mx-auto px-4">
        {/* Header with Split Text */}
        <div className="text-center mb-16">
          <SplitText
            text={title}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            textAlign="center"
          />
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Dock Navigation */}
          <div className="mb-12 flex justify-center">
            <Dock
              items={dockItems}
              panelHeight={68}
              baseItemSize={50}
              magnification={70}
            />
          </div>

          {/* Message Counter */}
          {messageCount > 0 && (
            <div className="mb-8 flex justify-center">
              <div className="bg-card border-2 border-border rounded-2xl p-6 inline-flex items-center gap-4">
                <span className="text-sm font-semibold text-muted-foreground">Pesan Terkirim:</span>
                <Counter
                  value={messageCount}
                  places={[10, 1]}
                  fontSize={32}
                  padding={3}
                  gap={6}
                  textColor="hsl(var(--primary))"
                  fontWeight={900}
                  digitPlaceHolders
                />
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Contact Info Cards */}
            <div className="space-y-4">
              {whatsapp && (
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-green-500 rounded-2xl transition-colors group"
                >
                  <div className="flex-shrink-0 p-4 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold text-base">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">+{whatsapp}</p>
                  </div>
                </a>
              )}

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-primary rounded-2xl transition-colors group"
                >
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Telepon</p>
                    <p className="text-sm text-muted-foreground">{phone}</p>
                  </div>
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-primary rounded-2xl transition-colors group"
                >
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Email</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </a>
              )}

              {address && (
                <div className="flex items-start gap-4 p-6 bg-card border-2 border-border rounded-2xl">
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Alamat</p>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
                </div>
              )}

              {showMap && mapUrl && (
                <div className="rounded-2xl overflow-hidden border-2 border-border">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                  />
                </div>
              )}
            </div>

            {/* Right: Form */}
            <div>
              {showForm ? (
                <form onSubmit={handleSubmit} className="space-y-5 bg-card rounded-2xl border-2 border-border p-8">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-semibold">Nama</Label>
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
                    <Label htmlFor="form-email" className="text-base font-semibold">Email</Label>
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
                    <Label htmlFor="message" className="text-base font-semibold">Pesan</Label>
                    <Textarea
                      id="message"
                      placeholder="Tulis pesan Anda..."
                      rows={4}
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
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-border p-10 flex flex-col justify-center h-full">
                  <Button asChild size="lg" className="w-full gap-2 h-14 text-lg">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-6 w-6" />
                      Chat via WhatsApp
                    </a>
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## CONTACT-33: Magic Bento with Glass Surface

**Layout**: Bento grid layout  
**Animation**: MagicBento, GlassSurface, GradientText
**Style**: Modern bento grid

```tsx
// Contact33.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import MagicBento from '@/components/ui/MagicBento';
import GlassSurface from '@/components/ui/GlassSurface';
import GradientText from '@/components/ui/GradientText';

/**
 * Contact33 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - contactTitle: Section heading
 * @prop subtitle - contactSubtitle: Section subheading
 * @prop whatsapp - whatsapp: WhatsApp number
 * @prop phone - phone: Phone number
 * @prop email - email: Email address
 * @prop address - address: Physical address
 * @prop storeName - name: Store name (for WhatsApp message)
 * @prop mapUrl - contactMapUrl: Google Maps embed URL
 * @prop showMap - contactShowMap: Toggle map visibility
 * @prop showForm - contactShowForm: Toggle contact form visibility
 */
interface Contact33Props {
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

/**
 * Contact Block: contact33
 * Design: Magic Bento with Glass Surface
 */
export function Contact33({
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
}: Contact33Props) {
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

  const bentoItems = [
    whatsapp && {
      title: 'WhatsApp',
      description: `+${whatsapp}`,
      className: 'col-span-1',
      content: (
        <a
          href={whatsappLink!}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center h-full p-6 hover:scale-105 transition-transform"
        >
          <div className="p-4 bg-green-500/10 rounded-xl mb-3">
            <MessageCircle className="h-8 w-8 text-green-500" />
          </div>
          <p className="font-bold text-base">WhatsApp</p>
          <p className="text-xs text-muted-foreground">+{whatsapp}</p>
        </a>
      ),
    },
    phone && {
      title: 'Telepon',
      description: phone,
      className: 'col-span-1',
      content: (
        <a
          href={`tel:${phone}`}
          className="flex flex-col items-center justify-center h-full p-6 hover:scale-105 transition-transform"
        >
          <div className="p-4 bg-primary/10 rounded-xl mb-3">
            <Phone className="h-8 w-8 text-primary" />
          </div>
          <p className="font-bold text-base">Telepon</p>
          <p className="text-xs text-muted-foreground">{phone}</p>
        </a>
      ),
    },
    email && {
      title: 'Email',
      description: email,
      className: 'col-span-2',
      content: (
        <a
          href={`mailto:${email}`}
          className="flex items-center justify-center h-full p-6 hover:scale-105 transition-transform"
        >
          <div className="p-4 bg-primary/10 rounded-xl mr-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-bold text-base">Email</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </a>
      ),
    },
    address && {
      title: 'Alamat',
      description: address,
      className: 'col-span-2',
      content: (
        <div className="flex items-start h-full p-6">
          <div className="p-4 bg-primary/10 rounded-xl mr-4">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-bold text-base mb-2">Alamat</p>
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
        </div>
      ),
    },
  ].filter(Boolean) as Array<{ title: string; description: string; className: string; content: React.ReactNode }>;

  return (
    <section id="contact" className="py-20 my-8">
      <div className="container mx-auto px-4">
        {/* Header with Gradient Text */}
        <div className="text-center mb-16">
          <GradientText
            colors={[
              "hsl(var(--primary))",
              "hsl(var(--primary) / 0.6)",
              "hsl(var(--primary))"
            ]}
            animationSpeed={8}
            showBorder={false}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 block"
          >
            {title}
          </GradientText>
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Magic Bento Grid */}
          <MagicBento
            items={bentoItems}
            gridCols={2}
            gap={16}
            className="mb-8"
          />

          {/* Glass Surface Form/CTA */}
          {showForm ? (
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={24}
              displace={0.3}
              distortionScale={-100}
              brightness={60}
              opacity={0.95}
              className="max-w-2xl mx-auto"
            >
              <form onSubmit={handleSubmit} className="space-y-6 p-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold">Nama</Label>
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
                  <Label htmlFor="form-email" className="text-base font-semibold">Email</Label>
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
                  <Label htmlFor="message" className="text-base font-semibold">Pesan</Label>
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
            </GlassSurface>
          ) : whatsappLink ? (
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-border p-12 text-center">
              <Button asChild size="lg" className="gap-2 h-14 px-8 text-lg">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-6 w-6" />
                  Chat via WhatsApp
                </a>
              </Button>
            </div>
          ) : null}

          {/* Map Section */}
          {showMap && mapUrl && (
            <div className="mt-8 rounded-2xl overflow-hidden border-2 border-border">
              <iframe
                src={mapUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

## CONTACT-34: Carousel with Stack Layout

**Layout**: Carousel slider for contacts  
**Animation**: Carousel, Stack, ShinyText
**Style**: Swipeable card carousel

```tsx
// Contact34.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import Carousel from '@/components/ui/Carousel';
import Stack from '@/components/ui/Stack';
import ShinyText from '@/components/ui/ShinyText';

/**
 * Contact34 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - contactTitle: Section heading
 * @prop subtitle - contactSubtitle: Section subheading
 * @prop whatsapp - whatsapp: WhatsApp number
 * @prop phone - phone: Phone number
 * @prop email - email: Email address
 * @prop address - address: Physical address
 * @prop storeName - name: Store name (for WhatsApp message)
 * @prop mapUrl - contactMapUrl: Google Maps embed URL
 * @prop showMap - contactShowMap: Toggle map visibility
 * @prop showForm - contactShowForm: Toggle contact form visibility
 */
interface Contact34Props {
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

/**
 * Contact Block: contact34
 * Design: Carousel with Stack Layout
 */
export function Contact34({
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
}: Contact34Props) {
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

  return (
    <section id="contact" className="py-20 my-8">
      <div className="container mx-auto px-4">
        {/* Header with Shiny Text */}
        <div className="text-center mb-16">
          <ShinyText
            text={title}
            speed={2.5}
            color="hsl(var(--foreground))"
            shineColor="hsl(var(--primary))"
            spread={150}
            direction="left"
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 block"
          />
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Carousel Contact Cards */}
          <div className="mb-12" style={{ height: '300px', position: 'relative' }}>
            <Carousel
              baseWidth={350}
              autoplay={false}
              autoplayDelay={3000}
              pauseOnHover
              loop
              round
            >
              {whatsapp && (
                <div className="flex items-center gap-4 p-8 bg-card border-2 border-green-500 rounded-2xl h-full">
                  <div className="flex-shrink-0 p-5 bg-green-500/10 rounded-xl">
                    <MessageCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold text-xl mb-2">WhatsApp</p>
                    <p className="text-sm text-muted-foreground mb-4">+{whatsapp}</p>
                    <Button asChild size="sm" variant="outline" className="gap-2">
                      <a href={whatsappLink!} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4" />
                        Chat
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {phone && (
                <div className="flex items-center gap-4 p-8 bg-card border-2 border-primary rounded-2xl h-full">
                  <div className="flex-shrink-0 p-5 bg-primary/10 rounded-xl">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-xl mb-2">Telepon</p>
                    <p className="text-sm text-muted-foreground mb-4">{phone}</p>
                    <Button asChild size="sm" variant="outline" className="gap-2">
                      <a href={`tel:${phone}`}>
                        <Phone className="h-4 w-4" />
                        Call
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {email && (
                <div className="flex items-center gap-4 p-8 bg-card border-2 border-primary rounded-2xl h-full">
                  <div className="flex-shrink-0 p-5 bg-primary/10 rounded-xl">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-xl mb-2">Email</p>
                    <p className="text-sm text-muted-foreground mb-4">{email}</p>
                    <Button asChild size="sm" variant="outline" className="gap-2">
                      <a href={`mailto:${email}`}>
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {address && (
                <div className="flex items-start gap-4 p-8 bg-card border-2 border-border rounded-2xl h-full">
                  <div className="flex-shrink-0 p-5 bg-primary/10 rounded-xl">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-xl mb-2">Alamat</p>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
                </div>
              )}
            </Carousel>
          </div>

          {/* Stack Layout for Form/CTA */}
          <div style={{ height: showForm ? '500px' : '200px', position: 'relative' }}>
            <Stack
              items={[
                {
                  id: 'main',
                  content: showForm ? (
                    <form onSubmit={handleSubmit} className="space-y-5 bg-card rounded-2xl border-2 border-border p-8">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base font-semibold">Nama</Label>
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
                        <Label htmlFor="form-email" className="text-base font-semibold">Email</Label>
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
                        <Label htmlFor="message" className="text-base font-semibold">Pesan</Label>
                        <Textarea
                          id="message"
                          placeholder="Tulis pesan Anda..."
                          rows={4}
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
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-border p-12 flex flex-col justify-center h-full text-center">
                      <Button asChild size="lg" className="gap-2 h-14 text-lg">
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-6 w-6" />
                          Chat via WhatsApp
                        </a>
                      </Button>
                    </div>
                  ) : null,
                },
              ]}
              activeIndex={0}
            />
          </div>

          {/* Map Section */}
          {showMap && mapUrl && (
            <div className="mt-8 rounded-2xl overflow-hidden border-2 border-border">
              <iframe
                src={mapUrl}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

## CONTACT-35: Elastic Slider with Stepper

**Layout**: Interactive slider controls  
**Animation**: ElasticSlider, Stepper, DecryptedText
**Style**: Interactive controls

```tsx
// Contact35.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send, Volume2, VolumeX } from 'lucide-react';
import ElasticSlider from '@/components/ui/ElasticSlider';
import Stepper, { Step } from '@/components/ui/Stepper';
import DecryptedText from '@/components/ui/DecryptedText';

/**
 * Contact35 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
 *
 * @prop title - contactTitle: Section heading
 * @prop subtitle - contactSubtitle: Section subheading
 * @prop whatsapp - whatsapp: WhatsApp number
 * @prop phone - phone: Phone number
 * @prop email - email: Email address
 * @prop address - address: Physical address
 * @prop storeName - name: Store name (for WhatsApp message)
 * @prop mapUrl - contactMapUrl: Google Maps embed URL
 * @prop showMap - contactShowMap: Toggle map visibility
 * @prop showForm - contactShowForm: Toggle contact form visibility
 */
interface Contact35Props {
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

/**
 * Contact Block: contact35
 * Design: Elastic Slider with Stepper
 */
export function Contact35({
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
}: Contact35Props) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [preferredMethod, setPreferredMethod] = useState(50);

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

  return (
    <section id="contact" className="py-20 my-8">
      <div className="container mx-auto px-4">
        {/* Header with Decrypted Text */}
        <div className="text-center mb-16">
          <DecryptedText
            text={title}
            speed={60}
            maxIterations={10}
            animateOn="view"
            revealDirection="start"
            sequential
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 block"
          />
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Preference Slider */}
          <div className="mb-12 bg-card rounded-2xl border-2 border-border p-8">
            <h3 className="text-lg font-bold mb-4 text-center">Pilih Metode Kontak Favorit</h3>
            <div className="max-w-md mx-auto">
              <ElasticSlider
                leftIcon={<Mail className="h-5 w-5" />}
                rightIcon={<MessageCircle className="h-5 w-5" />}
                startingValue={0}
                defaultValue={preferredMethod}
                maxValue={100}
                isStepped={false}
                stepSize={1}
              />
              <p className="text-center text-sm text-muted-foreground mt-4">
                {preferredMethod < 50 ? 'Lebih suka Email' : 'Lebih suka WhatsApp'}
              </p>
            </div>
          </div>

          {/* Stepper Contact Flow */}
          <div className="bg-card rounded-2xl border-2 border-border p-8 mb-8">
            <Stepper
              initialStep={1}
              onStepChange={(step) => console.log('Step:', step)}
              onFinalStepCompleted={() => console.log('Contact flow completed!')}
              backButtonText="Kembali"
              nextButtonText="Lanjut"
            >
              <Step>
                <div className="text-center py-6">
                  <h3 className="text-2xl font-bold mb-4">Langkah 1: Pilih Metode</h3>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {whatsapp && (
                      <a
                        href={whatsappLink!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-6 border-2 border-border hover:border-green-500 rounded-xl transition-colors"
                      >
                        <MessageCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="font-semibold">WhatsApp</p>
                      </a>
                    )}
                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className="p-6 border-2 border-border hover:border-primary rounded-xl transition-colors"
                      >
                        <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="font-semibold">Email</p>
                      </a>
                    )}
                  </div>
                </div>
              </Step>

              <Step>
                <div className="text-center py-6">
                  <h3 className="text-2xl font-bold mb-4">Langkah 2: Info Kontak</h3>
                  <div className="space-y-4 max-w-md mx-auto text-left">
                    {phone && (
                      <div className="flex items-center gap-3 p-4 bg-background rounded-xl">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-sm">Telepon</p>
                          <p className="text-sm text-muted-foreground">{phone}</p>
                        </div>
                      </div>
                    )}
                    {address && (
                      <div className="flex items-start gap-3 p-4 bg-background rounded-xl">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">Alamat</p>
                          <p className="text-sm text-muted-foreground">{address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Step>

              {showForm && (
                <Step>
                  <div className="py-6">
                    <h3 className="text-2xl font-bold mb-6 text-center">Langkah 3: Kirim Pesan</h3>
                    <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">Nama</Label>
                        <Input
                          id="name"
                          placeholder="Nama Anda"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="form-email" className="text-sm font-semibold">Email</Label>
                        <Input
                          id="form-email"
                          type="email"
                          placeholder="email@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-semibold">Pesan</Label>
                        <Textarea
                          id="message"
                          placeholder="Tulis pesan Anda..."
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" size="lg" className="w-full gap-2 h-11">
                        <Send className="h-5 w-5" />
                        Kirim Pesan
                      </Button>
                    </form>
                  </div>
                </Step>
              )}
            </Stepper>
          </div>

          {/* Map Section */}
          {showMap && mapUrl && (
            <div className="rounded-2xl overflow-hidden border-2 border-border">
              <iframe
                src={mapUrl}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

## DEPENDENCIES & INSTALLATION

```bash
# Layout Components
pnpm dlx shadcn@latest add @react-bits/Masonry-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ChromaGrid-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Dock-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Counter-TS-CSS
pnpm dlx shadcn@latest add @react-bits/MagicBento-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GlassSurface-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Carousel-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Stack-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ElasticSlider-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Stepper-TS-CSS

# Text Animation
pnpm dlx shadcn@latest add @react-bits/BlurText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/SplitText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradientText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ShinyText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DecryptedText-TS-CSS
```

---

## SUMMARY TABLE

| Component | Primary Animation | Secondary Feature | Interactive | Best For |
|-----------|------------------|-------------------|-------------|----------|
| **CONTACT-31** | Masonry | ChromaGrid | BlurText | Dynamic Grid |
| **CONTACT-32** | Dock | Counter | SplitText | macOS Style |
| **CONTACT-33** | MagicBento | GlassSurface | GradientText | Bento Grid |
| **CONTACT-34** | Carousel | Stack | ShinyText | Swipeable Cards |
| **CONTACT-35** | ElasticSlider | Stepper | DecryptedText | Interactive Flow |

**READY FOR PRODUCTION!** 🚀✨

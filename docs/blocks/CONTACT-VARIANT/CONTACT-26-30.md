# CONTACT COMPONENTS 26-30 WITH REACT BITS

5 Contact variants dengan advanced React Bits combinations - **NO BACKGROUND EFFECTS**, fokus pada creative text animations dan premium interactions!

---

## CONTACT-26: Reflective Card with Text Cursor

**Layout**: Grid dengan reflective glass cards  
**Animation**: ReflectiveCard, TextCursor, ShinyText
**Style**: Premium reflective glass

```tsx
// Contact26.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import ReflectiveCard from '@/components/ui/ReflectiveCard';
import TextCursor from '@/components/ui/TextCursor';
import ShinyText from '@/components/ui/ShinyText';

/**
 * Contact26 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact26Props {
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
 * Contact Block: contact26
 * Design: Reflective Card with Text Cursor
 */
export function Contact26({
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
}: Contact26Props) {
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
    <section id="contact" className="relative py-20 my-8">
      {/* Text Cursor Effect */}
      <TextCursor
        text="✨"
        spacing={80}
        followMouseDirection
        randomFloat
        exitDuration={0.3}
        removalInterval={20}
        maxPoints={10}
      />

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

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Reflective Contact Cards */}
          <div className="space-y-6">
            {whatsapp && (
              <ReflectiveCard
                intensity={0.15}
                shimmer
                className="rounded-2xl overflow-hidden"
              >
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 bg-card/80 backdrop-blur-sm border-2 border-border hover:border-green-500 transition-colors"
                >
                  <div className="flex-shrink-0 p-4 bg-green-500/10 rounded-xl">
                    <MessageCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold text-base">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">+{whatsapp}</p>
                  </div>
                </a>
              </ReflectiveCard>
            )}

            {phone && (
              <ReflectiveCard
                intensity={0.15}
                shimmer
                className="rounded-2xl overflow-hidden"
              >
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-4 p-6 bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary transition-colors"
                >
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Telepon</p>
                    <p className="text-sm text-muted-foreground">{phone}</p>
                  </div>
                </a>
              </ReflectiveCard>
            )}

            {email && (
              <ReflectiveCard
                intensity={0.15}
                shimmer
                className="rounded-2xl overflow-hidden"
              >
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 p-6 bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary transition-colors"
                >
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Email</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </a>
              </ReflectiveCard>
            )}

            {address && (
              <ReflectiveCard
                intensity={0.15}
                shimmer
                className="rounded-2xl overflow-hidden"
              >
                <div className="flex items-start gap-4 p-6 bg-card/80 backdrop-blur-sm border-2 border-border">
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Alamat</p>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
                </div>
              </ReflectiveCard>
            )}

            {showMap && mapUrl && (
              <div className="rounded-2xl overflow-hidden border-2 border-border">
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
            )}
          </div>

          {/* Right: Form */}
          <div>
            {showForm ? (
              <ReflectiveCard
                intensity={0.2}
                shimmer
                className="rounded-2xl overflow-hidden h-full"
              >
                <form onSubmit={handleSubmit} className="space-y-6 bg-card/80 backdrop-blur-sm border-2 border-border p-8 h-full">
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
              </ReflectiveCard>
            ) : whatsappLink ? (
              <ReflectiveCard
                intensity={0.2}
                shimmer
                className="rounded-2xl overflow-hidden h-full"
              >
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border-2 border-border p-12 flex flex-col justify-center h-full">
                  <Button asChild size="lg" className="w-full gap-2 h-14 text-lg">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-6 w-6" />
                      Chat via WhatsApp
                    </a>
                  </Button>
                </div>
              </ReflectiveCard>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## CONTACT-27: Tilted Card with Spotlight

**Layout**: 3D tilted cards with spotlight  
**Animation**: TiltedCard, SpotlightCard, GradientText
**Style**: 3D perspective cards

```tsx
// Contact27.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import TiltedCard from '@/components/ui/TiltedCard';
import SpotlightCard from '@/components/ui/SpotlightCard';
import GradientText from '@/components/ui/GradientText';

/**
 * Contact27 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact27Props {
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
 * Contact Block: contact27
 * Design: Tilted Card with Spotlight
 */
export function Contact27({
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
}: Contact27Props) {
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

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Tilted Contact Cards */}
          <div className="space-y-6">
            {whatsapp && (
              <TiltedCard
                maxTilt={8}
                perspective={1200}
                scale={1.02}
                className="rounded-2xl overflow-hidden"
              >
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-green-500 transition-colors"
                >
                  <div className="flex-shrink-0 p-4 bg-green-500/10 rounded-xl">
                    <MessageCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold text-base">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">+{whatsapp}</p>
                  </div>
                </a>
              </TiltedCard>
            )}

            {phone && (
              <TiltedCard
                maxTilt={8}
                perspective={1200}
                scale={1.02}
                className="rounded-2xl overflow-hidden"
              >
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-primary transition-colors"
                >
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Telepon</p>
                    <p className="text-sm text-muted-foreground">{phone}</p>
                  </div>
                </a>
              </TiltedCard>
            )}

            {email && (
              <TiltedCard
                maxTilt={8}
                perspective={1200}
                scale={1.02}
                className="rounded-2xl overflow-hidden"
              >
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-primary transition-colors"
                >
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Email</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </a>
              </TiltedCard>
            )}

            {address && (
              <TiltedCard
                maxTilt={8}
                perspective={1200}
                scale={1.02}
                className="rounded-2xl overflow-hidden"
              >
                <div className="flex items-start gap-4 p-6 bg-card border-2 border-border">
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Alamat</p>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
                </div>
              </TiltedCard>
            )}

            {showMap && mapUrl && (
              <div className="rounded-2xl overflow-hidden border-2 border-border">
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
            )}
          </div>

          {/* Right: Spotlight Form */}
          <div>
            {showForm ? (
              <SpotlightCard
                spotlightColor="hsl(var(--primary))"
                spotlightSize={200}
                className="rounded-2xl overflow-hidden h-full"
              >
                <form onSubmit={handleSubmit} className="space-y-6 bg-card border-2 border-border p-8 h-full">
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
              </SpotlightCard>
            ) : whatsappLink ? (
              <SpotlightCard
                spotlightColor="hsl(var(--primary))"
                spotlightSize={200}
                className="rounded-2xl overflow-hidden h-full"
              >
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-border p-12 flex flex-col justify-center h-full">
                  <Button asChild size="lg" className="w-full gap-2 h-14 text-lg">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-6 w-6" />
                      Chat via WhatsApp
                    </a>
                  </Button>
                </div>
              </SpotlightCard>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## CONTACT-28: Pixel Card with Decay Effect

**Layout**: Pixelated cards with decay animation  
**Animation**: PixelCard, DecayCard, DecryptedText
**Style**: Digital decay aesthetic

```tsx
// Contact28.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import PixelCard from '@/components/ui/PixelCard';
import DecayCard from '@/components/ui/DecayCard';
import DecryptedText from '@/components/ui/DecryptedText';

/**
 * Contact28 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact28Props {
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
 * Contact Block: contact28
 * Design: Pixel Card with Decay Effect
 */
export function Contact28({
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
}: Contact28Props) {
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

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Pixel Contact Cards */}
          <div className="space-y-6">
            {whatsapp && (
              <PixelCard
                pixelSize={4}
                hoverEffect="pixelate"
                className="rounded-2xl overflow-hidden"
              >
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-green-500 transition-colors"
                >
                  <div className="flex-shrink-0 p-4 bg-green-500/10 rounded-xl">
                    <MessageCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold text-base">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">+{whatsapp}</p>
                  </div>
                </a>
              </PixelCard>
            )}

            {phone && (
              <PixelCard
                pixelSize={4}
                hoverEffect="pixelate"
                className="rounded-2xl overflow-hidden"
              >
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-primary transition-colors"
                >
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Telepon</p>
                    <p className="text-sm text-muted-foreground">{phone}</p>
                  </div>
                </a>
              </PixelCard>
            )}

            {email && (
              <PixelCard
                pixelSize={4}
                hoverEffect="pixelate"
                className="rounded-2xl overflow-hidden"
              >
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-primary transition-colors"
                >
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Email</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </a>
              </PixelCard>
            )}

            {address && (
              <PixelCard
                pixelSize={4}
                hoverEffect="pixelate"
                className="rounded-2xl overflow-hidden"
              >
                <div className="flex items-start gap-4 p-6 bg-card border-2 border-border">
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Alamat</p>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
                </div>
              </PixelCard>
            )}

            {showMap && mapUrl && (
              <div className="rounded-2xl overflow-hidden border-2 border-border">
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
            )}
          </div>

          {/* Right: Decay Form */}
          <div>
            {showForm ? (
              <DecayCard
                particleCount={30}
                decaySpeed={0.5}
                className="rounded-2xl overflow-hidden h-full"
              >
                <form onSubmit={handleSubmit} className="space-y-6 bg-card border-2 border-border p-8 h-full">
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
              </DecayCard>
            ) : whatsappLink ? (
              <DecayCard
                particleCount={30}
                decaySpeed={0.5}
                className="rounded-2xl overflow-hidden h-full"
              >
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-border p-12 flex flex-col justify-center h-full">
                  <Button asChild size="lg" className="w-full gap-2 h-14 text-lg">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-6 w-6" />
                      Chat via WhatsApp
                    </a>
                  </Button>
                </div>
              </DecayCard>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## CONTACT-29: Profile Card with Card Swap

**Layout**: Profile card style with swap animation  
**Animation**: ProfileCard, CardSwap, SplitText
**Style**: Team/personal card style

```tsx
// Contact29.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import ProfileCard from '@/components/ui/ProfileCard';
import CardSwap from '@/components/ui/CardSwap';
import SplitText from '@/components/ui/SplitText';

/**
 * Contact29 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact29Props {
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
 * Contact Block: contact29
 * Design: Profile Card with Card Swap
 */
export function Contact29({
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
}: Contact29Props) {
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

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Profile-Style Contact Cards */}
          <div className="space-y-6">
            {whatsapp && (
              <ProfileCard
                name="WhatsApp"
                role={`+${whatsapp}`}
                bio="Chat dengan kami via WhatsApp untuk respons cepat"
                imageUrl="" 
                className="rounded-2xl"
              >
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-semibold">Chat Sekarang</span>
                </a>
              </ProfileCard>
            )}

            {(phone || email) && (
              <CardSwap
                frontContent={
                  phone ? (
                    <div className="flex items-center gap-4 p-6 bg-card border-2 border-border rounded-2xl">
                      <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-base">Telepon</p>
                        <p className="text-sm text-muted-foreground">{phone}</p>
                      </div>
                    </div>
                  ) : null
                }
                backContent={
                  email ? (
                    <div className="flex items-center gap-4 p-6 bg-card border-2 border-border rounded-2xl">
                      <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-base">Email</p>
                        <p className="text-sm text-muted-foreground">{email}</p>
                      </div>
                    </div>
                  ) : null
                }
                flipTrigger="click"
                className="rounded-2xl"
              />
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
                  height="300"
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
              <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-2xl border-2 border-border p-8">
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
                    rows={6}
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
        </div>
      </div>
    </section>
  );
}
```

---

## CONTACT-30: Bounce Cards with Gradual Blur

**Layout**: Bouncy interactive cards  
**Animation**: BounceCards, GradualBlur, ShinyText
**Style**: Playful bounce effect

```tsx
// Contact30.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import BounceCards from '@/components/ui/BounceCards';
import GradualBlur from '@/components/ui/GradualBlur';
import ShinyText from '@/components/ui/ShinyText';

/**
 * Contact30 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact30Props {
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
 * Contact Block: contact30
 * Design: Bounce Cards with Gradual Blur
 */
export function Contact30({
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
}: Contact30Props) {
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

  const contactCards = [
    whatsapp && {
      id: 'whatsapp',
      content: (
        <a
          href={whatsappLink!}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-green-500 rounded-2xl transition-colors h-full"
        >
          <div className="flex-shrink-0 p-4 bg-green-500/10 rounded-xl">
            <MessageCircle className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="font-bold text-base">WhatsApp</p>
            <p className="text-sm text-muted-foreground">+{whatsapp}</p>
          </div>
        </a>
      ),
    },
    phone && {
      id: 'phone',
      content: (
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-primary rounded-2xl transition-colors h-full"
        >
          <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-bold text-base">Telepon</p>
            <p className="text-sm text-muted-foreground">{phone}</p>
          </div>
        </a>
      ),
    },
    email && {
      id: 'email',
      content: (
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-primary rounded-2xl transition-colors h-full"
        >
          <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-bold text-base">Email</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </a>
      ),
    },
  ].filter(Boolean) as Array<{ id: string; content: React.ReactNode }>;

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
            <div className="relative">
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
              <GradualBlur
                target="sibling"
                position="bottom"
                height="2rem"
                strength={1.5}
                divCount={3}
                curve="linear"
                exponential={false}
                opacity={0.8}
              />
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Bounce Contact Cards */}
          <div className="space-y-6">
            <BounceCards
              cards={contactCards}
              bounceIntensity={0.15}
              stagger={0.1}
              className="space-y-4"
            />

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
                  height="300"
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
              <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-2xl border-2 border-border p-8">
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
        </div>
      </div>
    </section>
  );
}
```

---

## DEPENDENCIES & INSTALLATION

```bash
# Card Components
pnpm dlx shadcn@latest add @react-bits/ReflectiveCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/TiltedCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/SpotlightCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/PixelCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DecayCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ProfileCard-TS-CSS
pnpm dlx shadcn@latest add @react-bits/CardSwap-TS-CSS
pnpm dlx shadcn@latest add @react-bits/BounceCards-TS-CSS

# Text Animation
pnpm dlx shadcn@latest add @react-bits/ShinyText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradientText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DecryptedText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/SplitText-TS-CSS

# Visual Effects
pnpm dlx shadcn@latest add @react-bits/TextCursor-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradualBlur-TS-CSS
```

---

## SUMMARY TABLE

| Component | Primary Animation | Secondary Feature | Interactive | Best For |
|-----------|------------------|-------------------|-------------|----------|
| **CONTACT-26** | ReflectiveCard | TextCursor | ShinyText | Reflective Glass |
| **CONTACT-27** | TiltedCard | SpotlightCard | GradientText | 3D Perspective |
| **CONTACT-28** | PixelCard | DecayCard | DecryptedText | Digital Decay |
| **CONTACT-29** | ProfileCard | CardSwap | SplitText | Team/Personal |
| **CONTACT-30** | BounceCards | GradualBlur | ShinyText | Playful Bounce |

**READY FOR PRODUCTION!** 🚀✨

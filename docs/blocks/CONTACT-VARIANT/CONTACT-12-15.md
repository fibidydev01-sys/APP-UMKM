# CONTACT COMPONENTS 12-15 WITH REACT BITS

4 Contact variants dengan advanced React Bits combinations - **NO BACKGROUND EFFECTS**, fokus pada creative text animations dan premium interactions!

---

## CONTACT-12: Base Version (Reference)

**Layout**: Split Layout with Map & Form support  
**Animation**: Standard transitions
**Style**: Clean & professional

```tsx
// Contact12.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';

/**
 * Contact12 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact12Props {
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
 * Contact Block: contact12
 * Design: Split Layout with Map & Form support
 */
export function Contact12({
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
}: Contact12Props) {
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
    <section id="contact" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Contact Info */}
        <div className="space-y-4">
          {whatsapp && (
            <a
              href={whatsappLink!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-green-500/5 transition-colors"
            >
              <div className="flex-shrink-0 p-3 bg-green-500/10 rounded-full">
                <MessageCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-sm">WhatsApp</p>
                <p className="text-sm text-muted-foreground">+{whatsapp}</p>
              </div>
            </a>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Telepon</p>
                <p className="text-sm text-muted-foreground">{phone}</p>
              </div>
            </a>
          )}

          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Email</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </a>
          )}

          {address && (
            <div className="flex items-center gap-4 p-4 rounded-lg">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Alamat</p>
                <p className="text-sm text-muted-foreground">{address}</p>
              </div>
            </div>
          )}

          {showMap && mapUrl && (
            <div className="mt-6 rounded-xl overflow-hidden border">
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

        {/* Right: Form or WhatsApp CTA */}
        <div>
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-4 bg-muted/30 rounded-xl p-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  placeholder="Nama Anda"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Pesan</Label>
                <Textarea
                  id="message"
                  placeholder="Tulis pesan Anda..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Send className="h-4 w-4" />
                Kirim Pesan
              </Button>
            </form>
          ) : whatsappLink ? (
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 flex flex-col justify-center h-full">
              <Button asChild size="lg" className="w-full gap-2">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Chat via WhatsApp
                </a>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
```

---

## CONTACT-13: Text Type with Circular Text Decoration

**Layout**: Center dengan typing animation  
**Animation**: TextType, CircularText, Magnet
**Style**: Dynamic typing effect

```tsx
// Contact13.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import TextType from '@/components/ui/TextType';
import CircularText from '@/components/ui/CircularText';
import Magnet from '@/components/ui/Magnet';

/**
 * Contact13 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact13Props {
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
 * Contact Block: contact13
 * Design: Text Type with Circular Text
 */
export function Contact13({
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
}: Contact13Props) {
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
      {/* Circular Text Background Decoration */}
      <div className="absolute top-10 left-10 w-64 h-64 opacity-5 pointer-events-none hidden lg:block">
        <CircularText
          text="✦ HUBUNGI KAMI ✦ CONTACT US ✦ "
          onHover="speedUp"
          spinDuration={25}
        />
      </div>
      <div className="absolute bottom-10 right-10 w-64 h-64 opacity-5 pointer-events-none hidden lg:block">
        <CircularText
          text="✦ GET IN TOUCH ✦ REACH OUT ✦ "
          onHover="speedUp"
          spinDuration={20}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Text Type Animation */}
        <div className="text-center mb-16">
          <div className="h-20 flex items-center justify-center mb-4">
            <TextType
              texts={[title, "Mari Terhubung!", "Contact Us Today!"]}
              typingSpeed={75}
              deletingSpeed={50}
              pauseDuration={2000}
              showCursor
              cursorCharacter="|"
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold"
            />
          </div>
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Contact Info */}
          <div className="space-y-4">
            {whatsapp && (
              <Magnet padding={30} magnetStrength={40}>
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-green-500 bg-card transition-all group"
                >
                  <div className="flex-shrink-0 p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">+{whatsapp}</p>
                  </div>
                </a>
              </Magnet>
            )}

            {phone && (
              <Magnet padding={30} magnetStrength={40}>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-primary bg-card transition-all group"
                >
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Telepon</p>
                    <p className="text-sm text-muted-foreground">{phone}</p>
                  </div>
                </a>
              </Magnet>
            )}

            {email && (
              <Magnet padding={30} magnetStrength={40}>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-primary bg-card transition-all group"
                >
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Email</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </a>
              </Magnet>
            )}

            {address && (
              <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">Alamat</p>
                  <p className="text-sm text-muted-foreground">{address}</p>
                </div>
              </div>
            )}

            {showMap && mapUrl && (
              <div className="mt-6 rounded-xl overflow-hidden border">
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
              <form onSubmit={handleSubmit} className="space-y-5 bg-card rounded-xl border border-border p-6">
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
                    rows={5}
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
            ) : whatsappLink ? (
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-border p-10 flex flex-col justify-center h-full">
                <Magnet padding={50} magnetStrength={50}>
                  <Button asChild size="lg" className="w-full gap-2 h-12 text-base">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5" />
                      Chat via WhatsApp
                    </a>
                  </Button>
                </Magnet>
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

## CONTACT-14: Shiny Text with Click Spark

**Layout**: Grid dengan shiny text labels  
**Animation**: ShinyText, ClickSpark, ScrollReveal
**Style**: Premium shiny aesthetic

```tsx
// Contact14.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import ShinyText from '@/components/ui/ShinyText';
import ClickSpark from '@/components/ui/ClickSpark';
import ScrollReveal from '@/components/ui/ScrollReveal';

/**
 * Contact14 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact14Props {
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
 * Contact Block: contact14
 * Design: Shiny Text with Click Spark
 */
export function Contact14({
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
}: Contact14Props) {
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
            <ScrollReveal
              baseOpacity={0.3}
              enableBlur
              baseRotation={2}
              blurStrength={3}
            >
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            </ScrollReveal>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Contact Info with Shiny Labels */}
          <div className="space-y-6">
            {whatsapp && (
              <div className="p-6 rounded-2xl border-2 border-border bg-card hover:border-green-500 transition-all group">
                <ShinyText
                  text="WhatsApp"
                  speed={2}
                  color="hsl(var(--foreground))"
                  shineColor="#10b981"
                  spread={100}
                  className="text-sm font-bold mb-3 block"
                />
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <MessageCircle className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="text-muted-foreground group-hover:text-green-500 transition-colors">
                    +{whatsapp}
                  </span>
                </a>
              </div>
            )}

            {phone && (
              <div className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all group">
                <ShinyText
                  text="Telepon"
                  speed={2}
                  color="hsl(var(--foreground))"
                  shineColor="hsl(var(--primary))"
                  spread={100}
                  className="text-sm font-bold mb-3 block"
                />
                <a href={`tel:${phone}`} className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    {phone}
                  </span>
                </a>
              </div>
            )}

            {email && (
              <div className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary transition-all group">
                <ShinyText
                  text="Email"
                  speed={2}
                  color="hsl(var(--foreground))"
                  shineColor="hsl(var(--primary))"
                  spread={100}
                  className="text-sm font-bold mb-3 block"
                />
                <a href={`mailto:${email}`} className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    {email}
                  </span>
                </a>
              </div>
            )}

            {address && (
              <div className="p-6 rounded-2xl border-2 border-border bg-card">
                <ShinyText
                  text="Alamat"
                  speed={2}
                  color="hsl(var(--foreground))"
                  shineColor="hsl(var(--primary))"
                  spread={100}
                  className="text-sm font-bold mb-3 block"
                />
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <span className="text-muted-foreground">{address}</span>
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

          {/* Right: Form with Click Spark */}
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
                <ClickSpark
                  sparkColor="hsl(var(--primary))"
                  sparkSize={14}
                  sparkRadius={22}
                  sparkCount={12}
                  duration={500}
                >
                  <Button type="submit" size="lg" className="w-full gap-2 h-12">
                    <Send className="h-5 w-5" />
                    Kirim Pesan
                  </Button>
                </ClickSpark>
              </form>
            ) : whatsappLink ? (
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-border p-12 flex flex-col justify-center h-full">
                <ClickSpark
                  sparkColor="hsl(var(--primary))"
                  sparkSize={14}
                  sparkRadius={22}
                  sparkCount={12}
                  duration={500}
                >
                  <Button asChild size="lg" className="w-full gap-2 h-14 text-lg">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-6 w-6" />
                      Chat via WhatsApp
                    </a>
                  </Button>
                </ClickSpark>
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

## CONTACT-15: True Focus with Scroll Float

**Layout**: Center dengan focus blur animation  
**Animation**: TrueFocus, ScrollFloat, GradientText
**Style**: Premium focus effect

```tsx
// Contact15.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import TrueFocus from '@/components/ui/TrueFocus';
import ScrollFloat from '@/components/ui/ScrollFloat';
import GradientText from '@/components/ui/GradientText';

/**
 * Contact15 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact15Props {
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
 * Contact Block: contact15
 * Design: True Focus with Scroll Float
 */
export function Contact15({
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
}: Contact15Props) {
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
        {/* Header with True Focus */}
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
            <ScrollFloat
              animationDuration={1.2}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.04}
            >
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            </ScrollFloat>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Contact Info */}
          <div className="space-y-5">
            {whatsapp && (
              <div className="p-6 rounded-2xl border-2 border-border bg-card hover:border-green-500 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-green-500/10 rounded-xl">
                    <MessageCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <GradientText
                      colors={["#10b981", "#34d399", "#10b981"]}
                      animationSpeed={8}
                      showBorder={false}
                      className="text-base font-bold mb-1 block"
                    >
                      WhatsApp
                    </GradientText>
                    <a
                      href={whatsappLink!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-green-500 transition-colors"
                    >
                      +{whatsapp}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {phone && (
              <div className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <GradientText
                      colors={[
                        "hsl(var(--primary))",
                        "hsl(var(--primary) / 0.6)",
                        "hsl(var(--primary))"
                      ]}
                      animationSpeed={8}
                      showBorder={false}
                      className="text-base font-bold mb-1 block"
                    >
                      Telepon
                    </GradientText>
                    <a
                      href={`tel:${phone}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {email && (
              <div className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <GradientText
                      colors={[
                        "hsl(var(--primary))",
                        "hsl(var(--primary) / 0.6)",
                        "hsl(var(--primary))"
                      ]}
                      animationSpeed={8}
                      showBorder={false}
                      className="text-base font-bold mb-1 block"
                    >
                      Email
                    </GradientText>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {address && (
              <div className="p-6 rounded-2xl border-2 border-border bg-card">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <GradientText
                      colors={[
                        "hsl(var(--primary))",
                        "hsl(var(--primary) / 0.6)",
                        "hsl(var(--primary))"
                      ]}
                      animationSpeed={8}
                      showBorder={false}
                      className="text-base font-bold mb-1 block"
                    >
                      Alamat
                    </GradientText>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
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
              <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-2xl border-2 border-border p-8 shadow-lg">
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
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-border p-12 flex flex-col justify-center h-full shadow-lg">
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
# Text Animation Components
pnpm dlx shadcn@latest add @react-bits/TextType-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ShinyText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/TrueFocus-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ScrollFloat-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ScrollReveal-TS-CSS
pnpm dlx shadcn@latest add @react-bits/CircularText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradientText-TS-CSS

# Interactive Components
pnpm dlx shadcn@latest add @react-bits/Magnet-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ClickSpark-TS-CSS
```

---

## SUMMARY TABLE

| Component | Primary Animation | Secondary Feature | Interactive | Best For |
|-----------|------------------|-------------------|-------------|----------|
| **CONTACT-12** | Standard | Clean Layout | Basic Hover | Base/Reference |
| **CONTACT-13** | TextType | CircularText | Magnet | Dynamic Typing |
| **CONTACT-14** | ShinyText | ClickSpark | ScrollReveal | Premium Shine |
| **CONTACT-15** | TrueFocus | ScrollFloat | GradientText | Focus Effect |

**READY FOR PRODUCTION!** 🚀✨

# CONTACT COMPONENTS 21-25 WITH REACT BITS

5 Contact variants dengan advanced React Bits combinations - **NO BACKGROUND EFFECTS**, fokus pada creative text animations dan premium interactions!

---

## CONTACT-21: Falling Text with Pixel Transition

**Layout**: Grid dengan physics-based text  
**Animation**: FallingText, PixelTransition, Magnet
**Style**: Physics-based interactive

```tsx
// Contact21.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import FallingText from '@/components/ui/FallingText';
import PixelTransition from '@/components/ui/PixelTransition';
import Magnet from '@/components/ui/Magnet';

/**
 * Contact21 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact21Props {
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
 * Contact Block: contact21
 * Design: Falling Text with Pixel Transition
 */
export function Contact21({
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
}: Contact21Props) {
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
        {/* Header with Falling Text */}
        <div className="text-center mb-16">
          <div className="mb-6" style={{ minHeight: '120px' }}>
            <FallingText
              text={title}
              highlightWords={title.split(' ')}
              highlightClass="text-primary"
              trigger="view"
              backgroundColor="transparent"
              wireframes={false}
              gravity={0.5}
              fontSize="3.5rem"
              mouseConstraintStiffness={0.9}
            />
          </div>
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Contact Info with Pixel Transition */}
          <div className="space-y-4">
            {whatsapp && (
              <PixelTransition
                pixelSize={8}
                duration={0.6}
                ease="power2.inOut"
                trigger="hover"
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
              </PixelTransition>
            )}

            {phone && (
              <PixelTransition
                pixelSize={8}
                duration={0.6}
                ease="power2.inOut"
                trigger="hover"
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
              </PixelTransition>
            )}

            {email && (
              <PixelTransition
                pixelSize={8}
                duration={0.6}
                ease="power2.inOut"
                trigger="hover"
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
              </PixelTransition>
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

          {/* Right: Form with Magnet */}
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
                <Magnet padding={50} magnetStrength={60}>
                  <Button type="submit" size="lg" className="w-full gap-2 h-12">
                    <Send className="h-5 w-5" />
                    Kirim Pesan
                  </Button>
                </Magnet>
              </form>
            ) : whatsappLink ? (
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-border p-12 flex flex-col justify-center h-full">
                <Magnet padding={60} magnetStrength={70}>
                  <Button asChild size="lg" className="w-full gap-2 h-14 text-lg">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-6 w-6" />
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

## CONTACT-22: ASCII Text with Laser Flow

**Layout**: Retro ASCII art style  
**Animation**: ASCIIText, LaserFlow, CircularText
**Style**: Retro tech aesthetic

```tsx
// Contact22.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import ASCIIText from '@/components/ui/ASCIIText';
import LaserFlow from '@/components/ui/LaserFlow';
import CircularText from '@/components/ui/CircularText';

/**
 * Contact22 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact22Props {
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
 * Contact Block: contact22
 * Design: ASCII Text with Laser Flow
 */
export function Contact22({
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
}: Contact22Props) {
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
    <section id="contact" className="relative py-20 my-8 overflow-hidden">
      {/* Circular Text Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-3 pointer-events-none hidden xl:block">
        <CircularText
          text="✦ CONTACT ✦ HUBUNGI ✦ REACH OUT ✦ "
          onHover="speedUp"
          spinDuration={30}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with ASCII Text */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <ASCIIText
              text={title}
              font="Standard"
              colored
              gradient={["hsl(var(--primary))", "hsl(var(--primary) / 0.6)"]}
              animateOn="view"
              speed={30}
            />
          </div>
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Contact Cards with Laser Flow */}
          <div className="space-y-4">
            {whatsapp && (
              <div className="relative group">
                <LaserFlow
                  colors={['#10b981', '#34d399']}
                  speed={1.5}
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                />
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-green-500 rounded-2xl transition-colors"
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
            )}

            {phone && (
              <div className="relative group">
                <LaserFlow
                  colors={['hsl(var(--primary))', 'hsl(var(--primary) / 0.6)']}
                  speed={1.5}
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                />
                <a
                  href={`tel:${phone}`}
                  className="relative flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-primary rounded-2xl transition-colors"
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
            )}

            {email && (
              <div className="relative group">
                <LaserFlow
                  colors={['hsl(var(--primary))', 'hsl(var(--primary) / 0.6)']}
                  speed={1.5}
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                />
                <a
                  href={`mailto:${email}`}
                  className="relative flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-primary rounded-2xl transition-colors"
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

## CONTACT-23: Curved Loop with Magnet Lines

**Layout**: Flowing curved text  
**Animation**: CurvedLoop, MagnetLines, SplitText
**Style**: Flowing dynamic lines

```tsx
// Contact23.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import CurvedLoop from '@/components/ui/CurvedLoop';
import MagnetLines from '@/components/ui/MagnetLines';
import SplitText from '@/components/ui/SplitText';

/**
 * Contact23 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact23Props {
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
 * Contact Block: contact23
 * Design: Curved Loop with Magnet Lines
 */
export function Contact23({
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
}: Contact23Props) {
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
    <section id="contact" className="relative py-20 my-8 overflow-hidden">
      {/* Curved Loop Background */}
      <div className="absolute inset-0 opacity-8 pointer-events-none">
        <CurvedLoop
          marqueeText="✦ GET IN TOUCH ✦ CONTACT US ✦ "
          speed={1.5}
          curveAmount={350}
          direction="right"
          interactive={false}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
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
          {/* Left: Contact Cards with Magnet Lines */}
          <div className="space-y-4">
            {whatsapp && (
              <div className="relative overflow-hidden rounded-2xl">
                <MagnetLines
                  lineColor="hsl(var(--primary))"
                  particleCount={20}
                  className="absolute inset-0"
                />
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex items-center gap-4 p-6 bg-card/80 backdrop-blur-sm border-2 border-border hover:border-green-500 transition-all"
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
            )}

            {phone && (
              <div className="relative overflow-hidden rounded-2xl">
                <MagnetLines
                  lineColor="hsl(var(--primary))"
                  particleCount={20}
                  className="absolute inset-0"
                />
                <a
                  href={`tel:${phone}`}
                  className="relative flex items-center gap-4 p-6 bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary transition-all"
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
            )}

            {email && (
              <div className="relative overflow-hidden rounded-2xl">
                <MagnetLines
                  lineColor="hsl(var(--primary))"
                  particleCount={20}
                  className="absolute inset-0"
                />
                <a
                  href={`mailto:${email}`}
                  className="relative flex items-center gap-4 p-6 bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary transition-all"
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

## CONTACT-24: Target Cursor with Animated Content

**Layout**: Interactive cursor tracking  
**Animation**: TargetCursor, AnimatedContent, BlurText
**Style**: Interactive cursor follow

```tsx
// Contact24.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import TargetCursor from '@/components/ui/TargetCursor';
import AnimatedContent from '@/components/ui/AnimatedContent';
import BlurText from '@/components/ui/BlurText';

/**
 * Contact24 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact24Props {
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
 * Contact Block: contact24
 * Design: Target Cursor with Animated Content
 */
export function Contact24({
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
}: Contact24Props) {
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
      {/* Target Cursor Effect */}
      <TargetCursor
        color="hsl(var(--primary))"
        size={40}
        thickness={2}
        opacity={0.8}
      />

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

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Contact Info with Animated Content */}
          <div className="space-y-4">
            {whatsapp && (
              <AnimatedContent
                animation="slideInFromLeft"
                duration={0.6}
                delay={0.1}
              >
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-green-500 rounded-2xl transition-all group"
                >
                  <div className="flex-shrink-0 p-4 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold text-base">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">+{whatsapp}</p>
                  </div>
                </a>
              </AnimatedContent>
            )}

            {phone && (
              <AnimatedContent
                animation="slideInFromLeft"
                duration={0.6}
                delay={0.2}
              >
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-primary rounded-2xl transition-all group"
                >
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Telepon</p>
                    <p className="text-sm text-muted-foreground">{phone}</p>
                  </div>
                </a>
              </AnimatedContent>
            )}

            {email && (
              <AnimatedContent
                animation="slideInFromLeft"
                duration={0.6}
                delay={0.3}
              >
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 p-6 bg-card border-2 border-border hover:border-primary rounded-2xl transition-all group"
                >
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Email</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </a>
              </AnimatedContent>
            )}

            {address && (
              <AnimatedContent
                animation="slideInFromLeft"
                duration={0.6}
                delay={0.4}
              >
                <div className="flex items-start gap-4 p-6 bg-card border-2 border-border rounded-2xl">
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Alamat</p>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
                </div>
              </AnimatedContent>
            )}

            {showMap && mapUrl && (
              <AnimatedContent
                animation="fadeIn"
                duration={0.8}
                delay={0.5}
              >
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
              </AnimatedContent>
            )}
          </div>

          {/* Right: Form */}
          <div>
            {showForm ? (
              <AnimatedContent
                animation="slideInFromRight"
                duration={0.6}
                delay={0.2}
              >
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
              </AnimatedContent>
            ) : whatsappLink ? (
              <AnimatedContent
                animation="slideInFromRight"
                duration={0.6}
                delay={0.2}
              >
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-border p-12 flex flex-col justify-center h-full">
                  <Button asChild size="lg" className="w-full gap-2 h-14 text-lg">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-6 w-6" />
                      Chat via WhatsApp
                    </a>
                  </Button>
                </div>
              </AnimatedContent>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## CONTACT-25: Scroll Stack with Fade Content

**Layout**: Stacking scroll effect  
**Animation**: ScrollStack, FadeContent, GradientText
**Style**: Layered scroll reveal

```tsx
// Contact25.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import ScrollStack, { ScrollStackItem } from '@/components/ui/ScrollStack';
import FadeContent from '@/components/ui/FadeContent';
import GradientText from '@/components/ui/GradientText';

/**
 * Contact25 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact25Props {
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
 * Contact Block: contact25
 * Design: Scroll Stack with Fade Content
 */
export function Contact25({
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
}: Contact25Props) {
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
            <FadeContent duration={1} delay={0.3}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            </FadeContent>
          )}
        </div>

        {/* Scroll Stack Layout */}
        <ScrollStack>
          {/* Contact Info Stack Item */}
          <ScrollStackItem>
            <div className="bg-card rounded-3xl border-2 border-border p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-8 text-center">Informasi Kontak</h3>
              <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {whatsapp && (
                  <a
                    href={whatsappLink!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 bg-background rounded-xl hover:bg-green-500/5 border border-border hover:border-green-500 transition-all"
                  >
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">WhatsApp</p>
                      <p className="text-xs text-muted-foreground">+{whatsapp}</p>
                    </div>
                  </a>
                )}

                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-4 p-5 bg-background rounded-xl hover:bg-primary/5 border border-border hover:border-primary transition-all"
                  >
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Telepon</p>
                      <p className="text-xs text-muted-foreground">{phone}</p>
                    </div>
                  </a>
                )}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-4 p-5 bg-background rounded-xl hover:bg-primary/5 border border-border hover:border-primary transition-all"
                  >
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Email</p>
                      <p className="text-xs text-muted-foreground">{email}</p>
                    </div>
                  </a>
                )}

                {address && (
                  <div className="flex items-start gap-4 p-5 bg-background rounded-xl border border-border sm:col-span-2">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Alamat</p>
                      <p className="text-xs text-muted-foreground">{address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollStackItem>

          {/* Form Stack Item */}
          {showForm && (
            <ScrollStackItem>
              <div className="bg-card rounded-3xl border-2 border-border p-8 md:p-12">
                <h3 className="text-2xl font-bold mb-8 text-center">Kirim Pesan</h3>
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
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
            </ScrollStackItem>
          )}

          {/* Map Stack Item */}
          {showMap && mapUrl && (
            <ScrollStackItem>
              <div className="bg-card rounded-3xl border-2 border-border overflow-hidden">
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
            </ScrollStackItem>
          )}

          {/* WhatsApp CTA (if no form) */}
          {!showForm && whatsappLink && (
            <ScrollStackItem>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl border-2 border-border p-12 text-center">
                <h3 className="text-2xl font-bold mb-6">Hubungi Kami Sekarang</h3>
                <Button asChild size="lg" className="gap-2 h-14 px-8 text-lg">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-6 w-6" />
                    Chat via WhatsApp
                  </a>
                </Button>
              </div>
            </ScrollStackItem>
          )}
        </ScrollStack>
      </div>
    </section>
  );
}
```

---

## DEPENDENCIES & INSTALLATION

```bash
# Text Animation Components
pnpm dlx shadcn@latest add @react-bits/FallingText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ASCIIText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/CurvedLoop-TS-CSS
pnpm dlx shadcn@latest add @react-bits/SplitText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/BlurText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradientText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/CircularText-TS-CSS

# Visual Effects
pnpm dlx shadcn@latest add @react-bits/PixelTransition-TS-CSS
pnpm dlx shadcn@latest add @react-bits/LaserFlow-TS-CSS
pnpm dlx shadcn@latest add @react-bits/MagnetLines-TS-CSS
pnpm dlx shadcn@latest add @react-bits/TargetCursor-TS-CSS

# Content & Layout
pnpm dlx shadcn@latest add @react-bits/AnimatedContent-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FadeContent-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ScrollStack-TS-CSS

# Interactive
pnpm dlx shadcn@latest add @react-bits/Magnet-TS-CSS
```

---

## SUMMARY TABLE

| Component | Primary Animation | Secondary Feature | Interactive | Best For |
|-----------|------------------|-------------------|-------------|----------|
| **CONTACT-21** | FallingText | PixelTransition | Magnet | Physics-based |
| **CONTACT-22** | ASCIIText | LaserFlow | CircularText | Retro Tech |
| **CONTACT-23** | CurvedLoop | MagnetLines | SplitText | Flowing Lines |
| **CONTACT-24** | TargetCursor | AnimatedContent | BlurText | Cursor Tracking |
| **CONTACT-25** | ScrollStack | FadeContent | GradientText | Layered Scroll |

**READY FOR PRODUCTION!** 🚀✨

# CONTACT COMPONENTS 16-20 WITH REACT BITS

5 Contact variants dengan advanced React Bits combinations - **NO BACKGROUND EFFECTS**, fokus pada creative text animations dan premium interactions!

---

## CONTACT-16: Split Text with Magnet Info Cards

**Layout**: Grid dengan animated contact cards  
**Animation**: SplitText, Magnet, ClickSpark
**Style**: Interactive magnetic cards

```tsx
// Contact16.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import SplitText from '@/components/ui/SplitText';
import Magnet from '@/components/ui/Magnet';
import ClickSpark from '@/components/ui/ClickSpark';

/**
 * Contact16 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact16Props {
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
 * Contact Block: contact16
 * Design: Split Text with Magnet Cards
 */
export function Contact16({
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
}: Contact16Props) {
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
        {/* Header with Split Text Animation */}
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
          {/* Left: Magnet Contact Cards */}
          <div className="space-y-4">
            {whatsapp && (
              <Magnet padding={40} magnetStrength={50}>
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 rounded-2xl border-2 border-border hover:border-green-500 bg-card transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 p-4 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold text-base">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">+{whatsapp}</p>
                  </div>
                </a>
              </Magnet>
            )}

            {phone && (
              <Magnet padding={40} magnetStrength={50}>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-4 p-6 rounded-2xl border-2 border-border hover:border-primary bg-card transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Telepon</p>
                    <p className="text-sm text-muted-foreground">{phone}</p>
                  </div>
                </a>
              </Magnet>
            )}

            {email && (
              <Magnet padding={40} magnetStrength={50}>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 p-6 rounded-2xl border-2 border-border hover:border-primary bg-card transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Email</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </a>
              </Magnet>
            )}

            {address && (
              <div className="flex items-center gap-4 p-6 rounded-2xl border-2 border-border bg-card">
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
              <div className="mt-6 rounded-2xl overflow-hidden border-2 border-border">
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
                  sparkSize={12}
                  sparkRadius={20}
                  sparkCount={10}
                  duration={400}
                >
                  <Button type="submit" size="lg" className="w-full gap-2 h-12">
                    <Send className="h-5 w-5" />
                    Kirim Pesan
                  </Button>
                </ClickSpark>
              </form>
            ) : whatsappLink ? (
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-border p-12 flex flex-col justify-center h-full">
                <Magnet padding={50} magnetStrength={60}>
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

## CONTACT-17: Blur Text with Electric Border Form

**Layout**: Center dengan blur text animation  
**Animation**: BlurText, ElectricBorder, ShinyText
**Style**: Premium electric aesthetic

```tsx
// Contact17.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import BlurText from '@/components/ui/BlurText';
import ElectricBorder from '@/components/ui/ElectricBorder';
import ShinyText from '@/components/ui/ShinyText';

/**
 * Contact17 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact17Props {
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
 * Contact Block: contact17
 * Design: Blur Text with Electric Border
 */
export function Contact17({
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
}: Contact17Props) {
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

        <div className="max-w-5xl mx-auto">
          <ElectricBorder
            borderColor="hsl(var(--primary))"
            borderWidth={2}
            glowIntensity={0.5}
            animationSpeed={2}
            className="rounded-3xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 bg-card">
              {/* Left: Contact Info with Shiny Text Labels */}
              <div className="space-y-6">
                {whatsapp && (
                  <div>
                    <ShinyText
                      text="WhatsApp"
                      speed={2}
                      color="hsl(var(--foreground))"
                      shineColor="hsl(var(--primary))"
                      spread={120}
                      className="text-sm font-bold mb-2 block"
                    />
                    <a
                      href={whatsappLink!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-green-500/5 transition-colors group"
                    >
                      <MessageCircle className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform" />
                      <span className="text-muted-foreground group-hover:text-green-500 transition-colors">
                        +{whatsapp}
                      </span>
                    </a>
                  </div>
                )}

                {phone && (
                  <div>
                    <ShinyText
                      text="Telepon"
                      speed={2}
                      color="hsl(var(--foreground))"
                      shineColor="hsl(var(--primary))"
                      spread={120}
                      className="text-sm font-bold mb-2 block"
                    />
                    <a
                      href={`tel:${phone}`}
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary/5 transition-colors group"
                    >
                      <Phone className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-muted-foreground group-hover:text-primary transition-colors">
                        {phone}
                      </span>
                    </a>
                  </div>
                )}

                {email && (
                  <div>
                    <ShinyText
                      text="Email"
                      speed={2}
                      color="hsl(var(--foreground))"
                      shineColor="hsl(var(--primary))"
                      spread={120}
                      className="text-sm font-bold mb-2 block"
                    />
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-primary/5 transition-colors group"
                    >
                      <Mail className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-muted-foreground group-hover:text-primary transition-colors">
                        {email}
                      </span>
                    </a>
                  </div>
                )}

                {address && (
                  <div>
                    <ShinyText
                      text="Alamat"
                      speed={2}
                      color="hsl(var(--foreground))"
                      shineColor="hsl(var(--primary))"
                      spread={120}
                      className="text-sm font-bold mb-2 block"
                    />
                    <div className="flex items-start gap-3 p-4 rounded-xl">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{address}</span>
                    </div>
                  </div>
                )}

                {showMap && mapUrl && (
                  <div className="rounded-xl overflow-hidden border-2 border-border">
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
                  <form onSubmit={handleSubmit} className="space-y-5">
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
                  <div className="flex flex-col justify-center h-full">
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
          </ElectricBorder>
        </div>
      </div>
    </section>
  );
}
```

---

## CONTACT-18: Decrypted Text with Star Border Cards

**Layout**: Grid dengan encrypted reveal animation  
**Animation**: DecryptedText, StarBorder, GradientText
**Style**: Cyberpunk aesthetic

```tsx
// Contact18.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import DecryptedText from '@/components/ui/DecryptedText';
import StarBorder from '@/components/ui/StarBorder';
import GradientText from '@/components/ui/GradientText';

/**
 * Contact18 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact18Props {
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
 * Contact Block: contact18
 * Design: Decrypted Text with Star Border
 */
export function Contact18({
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
}: Contact18Props) {
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
            <GradientText
              colors={[
                "hsl(var(--muted-foreground))",
                "hsl(var(--foreground))",
                "hsl(var(--muted-foreground))"
              ]}
              animationSpeed={8}
              showBorder={false}
              className="text-lg md:text-xl max-w-2xl mx-auto block"
            >
              {subtitle}
            </GradientText>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Contact Cards with Star Border */}
          <div className="space-y-6">
            {whatsapp && (
              <StarBorder
                as="a"
                href={whatsappLink!}
                target="_blank"
                rel="noopener noreferrer"
                color="green"
                speed="5s"
                className="block p-6 bg-card hover:bg-card/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-green-500/10 rounded-xl">
                    <MessageCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold text-base">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">+{whatsapp}</p>
                  </div>
                </div>
              </StarBorder>
            )}

            {phone && (
              <StarBorder
                as="a"
                href={`tel:${phone}`}
                color="primary"
                speed="5s"
                className="block p-6 bg-card hover:bg-card/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Telepon</p>
                    <p className="text-sm text-muted-foreground">{phone}</p>
                  </div>
                </div>
              </StarBorder>
            )}

            {email && (
              <StarBorder
                as="a"
                href={`mailto:${email}`}
                color="primary"
                speed="5s"
                className="block p-6 bg-card hover:bg-card/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Email</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </div>
              </StarBorder>
            )}

            {address && (
              <StarBorder
                as="div"
                color="primary"
                speed="5s"
                className="p-6 bg-card"
              >
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base">Alamat</p>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
                </div>
              </StarBorder>
            )}

            {showMap && mapUrl && (
              <div className="rounded-xl overflow-hidden border-2 border-border">
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

          {/* Form */}
          <div>
            {showForm ? (
              <StarBorder
                as="div"
                color="primary"
                speed="5s"
                className="p-8 bg-card"
              >
                <form onSubmit={handleSubmit} className="space-y-5">
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
              </StarBorder>
            ) : whatsappLink ? (
              <StarBorder
                as="div"
                color="primary"
                speed="5s"
                className="p-12 bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col justify-center h-full"
              >
                <Button asChild size="lg" className="w-full gap-2 h-14 text-lg">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-6 w-6" />
                    Chat via WhatsApp
                  </a>
                </Button>
              </StarBorder>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## CONTACT-19: Shuffle Text with Animated List

**Layout**: Split dengan animated contact list  
**Animation**: Shuffle, AnimatedList, CircularText
**Style**: Dynamic list presentation

```tsx
// Contact19.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import Shuffle from '@/components/ui/Shuffle';
import AnimatedList from '@/components/ui/AnimatedList';
import CircularText from '@/components/ui/CircularText';

/**
 * Contact19 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact19Props {
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
 * Contact Block: contact19
 * Design: Shuffle Text with Animated List
 */
export function Contact19({
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
}: Contact19Props) {
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

  // Contact methods for animated list
  const contactMethods = [
    whatsapp && `WhatsApp: +${whatsapp}`,
    phone && `Telepon: ${phone}`,
    email && `Email: ${email}`,
    address && `Alamat: ${address}`,
  ].filter(Boolean) as string[];

  return (
    <section id="contact" className="relative py-20 my-8">
      {/* Circular Text Decoration */}
      <div className="absolute top-10 right-10 w-64 h-64 opacity-5 pointer-events-none hidden md:block">
        <CircularText
          text="✦ CONTACT US ✦ GET IN TOUCH ✦ "
          onHover="speedUp"
          spinDuration={20}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Shuffle Text */}
        <div className="text-center mb-16">
          <Shuffle
            text={title}
            shuffleDirection="right"
            duration={0.35}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4"
          />
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Animated List of Contacts */}
          <div className="space-y-6">
            <div className="h-[400px] rounded-2xl border-2 border-border overflow-hidden bg-card">
              <AnimatedList
                items={contactMethods}
                onItemSelect={(item, index) => {
                  console.log('Selected:', item, index);
                  // You can add custom click handlers here
                }}
                showGradients
                enableArrowNavigation
                displayScrollbar={false}
              />
            </div>

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

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-2 gap-4">
              {whatsapp && (
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-border hover:border-green-500 bg-card hover:bg-green-500/5 transition-all group"
                >
                  <MessageCircle className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">WhatsApp</span>
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-border hover:border-primary bg-card hover:bg-primary/5 transition-all group"
                >
                  <Phone className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">Call</span>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-border hover:border-primary bg-card hover:bg-primary/5 transition-all group col-span-2"
                >
                  <Mail className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">Email</span>
                </a>
              )}
            </div>
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

## CONTACT-20: Gradient Text with Glare Hover Cards

**Layout**: Grid dengan glare effect cards  
**Animation**: GradientText, GlareHover, FuzzyText
**Style**: Premium glare aesthetic

```tsx
// Contact20.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, MapPin, MessageCircle, Mail, Send } from 'lucide-react';
import GradientText from '@/components/ui/GradientText';
import GlareHover from '@/components/ui/GlareHover';
import FuzzyText from '@/components/ui/FuzzyText';

/**
 * Contact20 Props - Mapped from Data Contract (LANDING-DATA-CONTRACT.md)
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
interface Contact20Props {
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
 * Contact Block: contact20
 * Design: Gradient Text with Glare Hover
 */
export function Contact20({
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
}: Contact20Props) {
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
        {/* Header with Gradient & Fuzzy Text */}
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

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Left: Glare Hover Contact Cards */}
          <div className="space-y-4">
            {whatsapp && (
              <GlareHover
                strength={0.15}
                className="rounded-xl overflow-hidden"
              >
                <a
                  href={whatsappLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-card border-2 border-border hover:border-green-500 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-green-500/10 rounded-xl">
                      <MessageCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <FuzzyText
                        baseIntensity={0.1}
                        hoverIntensity={0.3}
                        enableHover
                      >
                        <p className="font-bold text-base">WhatsApp</p>
                      </FuzzyText>
                      <p className="text-sm text-muted-foreground">+{whatsapp}</p>
                    </div>
                  </div>
                </a>
              </GlareHover>
            )}

            {phone && (
              <GlareHover
                strength={0.15}
                className="rounded-xl overflow-hidden"
              >
                <a
                  href={`tel:${phone}`}
                  className="block p-6 bg-card border-2 border-border hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-xl">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <FuzzyText
                        baseIntensity={0.1}
                        hoverIntensity={0.3}
                        enableHover
                      >
                        <p className="font-bold text-base">Telepon</p>
                      </FuzzyText>
                      <p className="text-sm text-muted-foreground">{phone}</p>
                    </div>
                  </div>
                </a>
              </GlareHover>
            )}

            {email && (
              <GlareHover
                strength={0.15}
                className="rounded-xl overflow-hidden"
              >
                <a
                  href={`mailto:${email}`}
                  className="block p-6 bg-card border-2 border-border hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-xl">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <FuzzyText
                        baseIntensity={0.1}
                        hoverIntensity={0.3}
                        enableHover
                      >
                        <p className="font-bold text-base">Email</p>
                      </FuzzyText>
                      <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                  </div>
                </a>
              </GlareHover>
            )}

            {address && (
              <GlareHover
                strength={0.15}
                className="rounded-xl overflow-hidden"
              >
                <div className="p-6 bg-card border-2 border-border">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-primary/10 rounded-xl">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <FuzzyText
                        baseIntensity={0.1}
                        hoverIntensity={0.3}
                        enableHover
                      >
                        <p className="font-bold text-base">Alamat</p>
                      </FuzzyText>
                      <p className="text-sm text-muted-foreground">{address}</p>
                    </div>
                  </div>
                </div>
              </GlareHover>
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

          {/* Right: Form with Glare Effect */}
          <div>
            {showForm ? (
              <GlareHover
                strength={0.2}
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
              </GlareHover>
            ) : whatsappLink ? (
              <GlareHover
                strength={0.2}
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
              </GlareHover>
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
pnpm dlx shadcn@latest add @react-bits/SplitText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/BlurText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DecryptedText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Shuffle-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ShinyText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradientText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FuzzyText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/CircularText-TS-CSS

# UI & Layout Components
pnpm dlx shadcn@latest add @react-bits/AnimatedList-TS-CSS

# Interactive & Visual Effects
pnpm dlx shadcn@latest add @react-bits/Magnet-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ClickSpark-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ElectricBorder-TS-CSS
pnpm dlx shadcn@latest add @react-bits/StarBorder-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GlareHover-TS-CSS
```

---

## SUMMARY TABLE

| Component | Primary Animation | Secondary Feature | Interactive | Best For |
|-----------|------------------|-------------------|-------------|----------|
| **CONTACT-16** | SplitText | Magnet Cards | ClickSpark | Interactive Cards |
| **CONTACT-17** | BlurText | ElectricBorder | ShinyText Labels | Premium Electric |
| **CONTACT-18** | DecryptedText | StarBorder | GradientText | Cyberpunk |
| **CONTACT-19** | Shuffle | AnimatedList | CircularText Decor | Dynamic List |
| **CONTACT-20** | GradientText | GlareHover | FuzzyText | Premium Glare |

**READY FOR PRODUCTION!** 🚀✨

'use client';

import { motion } from 'framer-motion';
import {
  Phone,
  MapPin,
  MessageCircle,
  Mail,
  Clock,
  Navigation,
  Facebook,
  Instagram,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Contact7Props {
  title: string;
  subtitle?: string;
  whatsapp?: string | null;
  phone?: string | null;
  address?: string | null;
  storeName?: string;
  email?: string | null;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
  };
}

/**
 * Contact Block: contact7
 * Design: Card Grid
 *
 * Modern card-based contact grid with multiple contact methods
 * Each card is interactive and visually distinct
 * Perfect for showcasing all contact channels
 */
export function Contact7({
  title,
  subtitle,
  whatsapp,
  phone,
  address,
  storeName,
  email,
  socialMedia,
}: Contact7Props) {
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${storeName || ''}, saya tertarik dengan produk Anda.`)}`
    : null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      
    },
  };

  const contactCards = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Chat with us instantly',
      value: whatsapp ? `+${whatsapp}` : null,
      action: whatsappLink ? () => window.open(whatsappLink, '_blank') : null,
      gradient: 'from-green-500/10 to-emerald-500/10',
      iconColor: 'text-green-600',
      show: !!whatsapp,
    },
    {
      icon: Phone,
      title: 'Phone',
      description: 'Call us directly',
      value: phone,
      action: phone ? () => window.open(`tel:${phone}`, '_blank') : null,
      gradient: 'from-blue-500/10 to-cyan-500/10',
      iconColor: 'text-blue-600',
      show: !!phone,
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us a message',
      value: email,
      action: email ? () => window.open(`mailto:${email}`, '_blank') : null,
      gradient: 'from-purple-500/10 to-pink-500/10',
      iconColor: 'text-purple-600',
      show: !!email,
    },
    {
      icon: MapPin,
      title: 'Address',
      description: 'Visit our location',
      value: address,
      action: address
        ? () =>
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
              '_blank'
            )
        : null,
      gradient: 'from-orange-500/10 to-red-500/10',
      iconColor: 'text-orange-600',
      show: !!address,
    },
  ];

  const visibleCards = contactCards.filter((card) => card.show);

  return (
    <section id="contact" className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <MessageCircle className="h-3 w-3 mr-1" />
            Get In Touch
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Contact Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {visibleCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div
                  className={`h-full bg-gradient-to-br ${card.gradient} border border-border rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer group`}
                  onClick={card.action || undefined}
                >
                  {/* Icon */}
                  <div className={`h-12 w-12 rounded-xl bg-background/50 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${card.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {card.description}
                  </p>
                  {card.value && (
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {card.value}
                    </p>
                  )}

                  {/* Action Arrow */}
                  {card.action && (
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium group-hover:text-primary transition-colors">
                      <span>Connect</span>
                      <Navigation className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Social Media Section */}
        {(socialMedia?.facebook || socialMedia?.instagram) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <p className="text-muted-foreground mb-4">Follow us on social media</p>
            <div className="flex justify-center gap-4">
              {socialMedia.facebook && (
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={() => window.open(socialMedia.facebook, '_blank')}
                >
                  <Facebook className="h-5 w-5" />
                  Facebook
                </Button>
              )}
              {socialMedia.instagram && (
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={() => window.open(socialMedia.instagram, '_blank')}
                >
                  <Instagram className="h-5 w-5" />
                  Instagram
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* Business Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-6 py-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Available Monday - Saturday, 9:00 AM - 6:00 PM
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

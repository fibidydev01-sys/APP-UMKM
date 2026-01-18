'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Cta7Props {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant?: 'default' | 'secondary' | 'outline';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * CTA Block: cta7
 * Design: Countdown
 *
 * High-urgency CTA with countdown timer
 * Creates FOMO (Fear of Missing Out) with limited time offers
 * Includes animated countdown and pulsing effects
 */
export function Cta7({
  title,
  subtitle,
  buttonText,
  buttonLink,
  buttonVariant = 'default',
}: Cta7Props) {
  // Set target date to 7 days from now (or customize as needed)
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    date.setHours(23, 59, 59, 999);
    return date;
  });

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  if (!isClient) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-blue-500/10">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-blue-500/10 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-6"
          >
            <Badge className="px-4 py-2 text-base gap-2 bg-primary/90">
              <Zap className="h-4 w-4 fill-current" />
              Limited Time Offer
              <Sparkles className="h-4 w-4 fill-current" />
            </Badge>
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {subtitle}
            </p>
          )}

          {/* Countdown Timer */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Offer Ends In
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
              {timeUnits.map((unit, index) => (
                <motion.div
                  key={unit.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative"
                >
                  <div className="bg-card/80 backdrop-blur-sm border-2 border-primary/20 rounded-2xl p-4 md:p-6 shadow-lg">
                    {/* Animated Number */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={unit.value}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-3xl md:text-5xl font-bold text-primary mb-2"
                      >
                        {String(unit.value).padStart(2, '0')}
                      </motion.div>
                    </AnimatePresence>

                    {/* Label */}
                    <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
                      {unit.label}
                    </p>
                  </div>

                  {/* Pulse Effect */}
                  {unit.label === 'Seconds' && (
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 bg-primary/20 rounded-2xl -z-10 blur-xl"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              size="lg"
              variant={buttonVariant}
              asChild
              className="text-lg px-8 py-6 group shadow-xl hover:shadow-2xl transition-all"
            >
              <Link href={buttonLink}>
                {buttonText}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Badge variant="secondary" className="gap-1">
                ✓ Free Shipping
              </Badge>
              <Badge variant="secondary" className="gap-1">
                ✓ Money-Back Guarantee
              </Badge>
              <Badge variant="secondary" className="gap-1">
                ✓ Secure Checkout
              </Badge>
            </div>
          </motion.div>

          {/* Urgency Text */}
          <motion.p
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-sm text-muted-foreground mt-8"
          >
            ⚡ Don&apos;t miss out! Limited stock available
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

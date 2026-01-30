# HERO COMPONENTS 12-16 WITH REACT BITS

5 Hero component variants dengan React Bits integration, dark mode, dan layout berbeda.

---

## HERO-12: Split Screen with Galaxy Background

**Layout**: Split 50-50, Content left, Image right  
**Background**: Galaxy effect  
**Animation**: AnimatedText, BlurText, MagneticButton

```tsx
// Hero12.tsx
import { motion } from 'framer-motion';
import AnimatedText from '@/components/ui/AnimatedText';
import BlurText from '@/components/ui/BlurText';
import Galaxy from '@/components/ui/Galaxy';

interface Hero12Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero12({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero12Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={1}
          glowIntensity={0.3}
          saturation={0}
          hueShift={140}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            {/* Logo & Store Name */}
            {(logo || storeName) && (
              <div className="flex items-center gap-3 mb-6">
                {logo && (
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="w-10 h-10 rounded-lg"
                  />
                )}
                {storeName && (
                  <span className="text-sm font-semibold text-white/80">
                    {storeName}
                  </span>
                )}
              </div>
            )}

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 w-fit mb-8">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium">Featured</span>
            </div>

            {/* Title */}
            <div className="mb-6">
              <AnimatedText
                text={title}
                className="text-5xl md:text-7xl font-bold leading-tight"
                delay={50}
                duration={1.25}
              />
            </div>

            {/* Subtitle */}
            {subtitle && (
              <div className="mb-8 max-w-xl">
                <BlurText
                  text={subtitle}
                  className="text-lg md:text-xl text-white/70"
                  delay={200}
                  animateBy="words"
                />
              </div>
            )}

            {/* CTA Button */}
            {showCta && ctaText && (
              <motion.a
                href={ctaLink}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-all hover:scale-105 w-fit group"
              >
                {ctaText}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            )}
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative order-1 lg:order-2"
          >
            {backgroundImage && (
              <div className="relative h-[500px] lg:h-[700px] rounded-3xl overflow-hidden group">
                <img
                  src={backgroundImage}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
```

---

## HERO-13: Centered with Grid Pattern Background

**Layout**: Centered content dengan grid pattern  
**Background**: GridPattern effect  
**Animation**: SplitText, ShinyText, Spotlight

```tsx
// Hero13.tsx
import { motion } from 'framer-motion';
import SplitText from '@/components/ui/SplitText';
import ShinyText from '@/components/ui/ShinyText';
import GridPattern from '@/components/ui/GridPattern';
import Spotlight from '@/components/ui/Spotlight';

interface Hero13Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero13({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero13Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <GridPattern
          width={40}
          height={40}
          strokeDasharray="4 4"
          className="opacity-30"
        />
        <Spotlight
          size={800}
          speed={0.4}
          particleColor="#ffffff"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-[1]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto"
        >
          
          {/* Logo & Store Name */}
          {(logo || storeName) && (
            <div className="flex items-center justify-center gap-3 mb-8">
              {logo && (
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-12 h-12 rounded-xl"
                />
              )}
              {storeName && (
                <span className="text-base font-semibold text-white/80">
                  {storeName}
                </span>
              )}
            </div>
          )}

          {/* Title with Split Animation */}
          <div className="mb-8">
            <SplitText
              text={title}
              className="text-6xl md:text-8xl font-black leading-tight"
              delay={50}
              duration={1.25}
              splitType="chars"
            />
          </div>

          {/* Subtitle with Shiny Effect */}
          {subtitle && (
            <div className="mb-12 max-w-3xl mx-auto">
              <ShinyText
                text={subtitle}
                speed={2}
                className="text-xl md:text-2xl text-white/70"
                shineColor="#ffffff"
              />
            </div>
          )}

          {/* Background Image Badge */}
          {backgroundImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-block mb-12"
            >
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 mx-auto">
                <img
                  src={backgroundImage}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </motion.div>
          )}

          {/* CTA Button */}
          {showCta && ctaText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href={ctaLink}
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-white to-white/80 text-black rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-white/20 transition-all hover:scale-105 group"
              >
                {ctaText}
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </motion.div>
          )}

        </motion.div>
      </div>
    </section>
  );
}
```

---

## HERO-14: Asymmetric Layout with Particles

**Layout**: Asymmetric 60-40, Image left, Content right  
**Background**: Particles effect  
**Animation**: DecryptedText, GradientText, Magnet

```tsx
// Hero14.tsx
import { motion } from 'framer-motion';
import DecryptedText from '@/components/ui/DecryptedText';
import GradientText from '@/components/ui/GradientText';
import Particles from '@/components/ui/Particles';
import Magnet from '@/components/ui/Magnet';

interface Hero14Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero14({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero14Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#cccccc", "#999999"]}
          particleCount={150}
          particleSpread={10}
          speed={0.15}
          particleBaseSize={80}
          moveParticlesOnHover
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-[55%_45%] gap-8 items-center min-h-screen">
          
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {backgroundImage ? (
              <div className="relative h-[600px] lg:h-[800px] rounded-[3rem] overflow-hidden">
                <img
                  src={backgroundImage}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
              </div>
            ) : (
              <div className="h-[600px] lg:h-[800px] rounded-[3rem] bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl" />
            )}
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col justify-center space-y-8"
          >
            
            {/* Logo & Store Name */}
            {(logo || storeName) && (
              <div className="flex items-center gap-3">
                {logo && (
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="w-11 h-11 rounded-xl ring-2 ring-white/20"
                  />
                )}
                {storeName && (
                  <span className="text-base font-bold text-white/90">
                    {storeName}
                  </span>
                )}
              </div>
            )}

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="text-sm font-semibold">New Collection</span>
            </div>

            {/* Title with Decrypted Effect */}
            <div className="space-y-4">
              <DecryptedText
                text={title}
                animateOn="view"
                revealDirection="start"
                sequential
                className="text-5xl md:text-7xl font-black leading-tight"
              />
            </div>

            {/* Subtitle with Gradient */}
            {subtitle && (
              <div className="max-w-lg">
                <GradientText
                  colors={["#ffffff", "#cccccc", "#ffffff"]}
                  animationSpeed={8}
                  className="text-lg md:text-xl"
                >
                  {subtitle}
                </GradientText>
              </div>
            )}

            {/* CTA Button with Magnet Effect */}
            {showCta && ctaText && (
              <Magnet padding={50} magnetStrength={40}>
                <a
                  href={ctaLink}
                  className="inline-flex items-center gap-3 px-9 py-4 bg-white text-black rounded-2xl font-bold hover:bg-white/95 transition-all shadow-lg shadow-white/10 hover:shadow-white/30 group w-fit"
                >
                  {ctaText}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </Magnet>
            )}

          </motion.div>

        </div>
      </div>
    </section>
  );
}
```

---

## HERO-15: Vertical Stack with Aurora Background

**Layout**: Vertical stacking, image top, content bottom  
**Background**: Aurora effect  
**Animation**: TextType, BlurText, ScrollProgress

```tsx
// Hero15.tsx
import { motion } from 'framer-motion';
import TextType from '@/components/ui/TextType';
import BlurText from '@/components/ui/BlurText';
import Aurora from '@/components/ui/Aurora';
import ScrollProgress from '@/components/ui/ScrollProgress';

interface Hero15Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero15({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero15Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#5227FF", "#B19EEF", "#7cff67"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>

      {/* Scroll Progress Indicator */}
      <ScrollProgress 
        color="#ffffff"
        height={4}
        position="top"
      />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between flex-wrap gap-6"
          >
            {/* Logo & Store Name */}
            <div className="flex items-center gap-4">
              {logo && (
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-14 h-14 rounded-2xl ring-2 ring-white/30"
                />
              )}
              {storeName && (
                <span className="text-xl font-bold text-white">
                  {storeName}
                </span>
              )}
            </div>

            {/* Badge */}
            <div className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
              <span className="text-sm font-semibold tracking-wide">✨ Limited Edition</span>
            </div>
          </motion.div>

          {/* Image Section */}
          {backgroundImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden"
            >
              <img
                src={backgroundImage}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </motion.div>
          )}

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto text-center space-y-8 py-8"
          >
            
            {/* Title with Typing Effect */}
            <div>
              <TextType
                text={[title]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor
                cursorCharacter="|"
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight"
              />
            </div>

            {/* Subtitle */}
            {subtitle && (
              <div className="max-w-2xl mx-auto">
                <BlurText
                  text={subtitle}
                  delay={300}
                  animateBy="words"
                  direction="top"
                  className="text-xl md:text-2xl text-white/80"
                />
              </div>
            )}

            {/* CTA Button */}
            {showCta && ctaText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="pt-4"
              >
                <a
                  href={ctaLink}
                  className="inline-flex items-center gap-3 px-12 py-6 bg-white text-black rounded-full font-bold text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-2xl shadow-white/20 group"
                >
                  {ctaText}
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>
            )}

          </motion.div>

        </div>
      </div>
    </section>
  );
}
```

---

## HERO-16: Diagonal Split with Plasma Background

**Layout**: Diagonal split, content left-bottom, image right-top  
**Background**: Plasma effect  
**Animation**: Shuffle, FuzzyText, ClickSpark

```tsx
// Hero16.tsx
import { motion } from 'framer-motion';
import Shuffle from '@/components/ui/Shuffle';
import FuzzyText from '@/components/ui/FuzzyText';
import Plasma from '@/components/ui/Plasma';
import ClickSpark from '@/components/ui/ClickSpark';

interface Hero16Props {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  backgroundImage?: string;
  logo?: string;
  storeName?: string;
}

export function Hero16({
  title,
  subtitle,
  ctaText,
  ctaLink = '/products',
  showCta = true,
  backgroundImage,
  logo,
  storeName,
}: Hero16Props) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <Plasma
          color="#B19EEF"
          speed={0.6}
          direction="forward"
          scale={1.1}
          opacity={0.4}
          mouseInteractive
        />
      </div>

      {/* Diagonal Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black/60 z-[1]" />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-end">
        <div className="container mx-auto px-4 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              
              {/* Logo & Store Name with Badge */}
              <div className="flex items-center gap-4 flex-wrap">
                {(logo || storeName) && (
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20">
                    {logo && (
                      <img 
                        src={logo} 
                        alt="Logo" 
                        className="w-8 h-8 rounded-lg"
                      />
                    )}
                    {storeName && (
                      <span className="text-sm font-bold">
                        {storeName}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                  <span className="text-xs font-bold tracking-wider">EXCLUSIVE</span>
                </div>
              </div>

              {/* Title with Shuffle Effect */}
              <div>
                <Shuffle
                  text={title}
                  shuffleDirection="right"
                  duration={0.35}
                  triggerOnHover
                  className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight"
                />
              </div>

              {/* Subtitle with Fuzzy Effect */}
              {subtitle && (
                <div className="max-w-xl">
                  <FuzzyText
                    baseIntensity={0.2}
                    hoverIntensity={0.5}
                    enableHover
                  >
                    <p className="text-xl md:text-2xl text-white/80 font-medium">
                      {subtitle}
                    </p>
                  </FuzzyText>
                </div>
              )}

              {/* CTA Button with Click Spark */}
              {showCta && ctaText && (
                <ClickSpark
                  sparkColor="#fff"
                  sparkSize={12}
                  sparkRadius={20}
                  sparkCount={12}
                  duration={500}
                >
                  <motion.a
                    href={ctaLink}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-white to-white/90 text-black rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-white/30 transition-all hover:scale-105 group"
                  >
                    {ctaText}
                    <svg className="w-6 h-6 group-hover:translate-x-1 group-hover:scale-110 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.a>
                </ClickSpark>
              )}

            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              {backgroundImage ? (
                <div className="relative h-[500px] lg:h-[700px] rounded-[3rem] overflow-hidden transform lg:translate-y-[-100px]">
                  <img
                    src={backgroundImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20 mix-blend-overlay" />
                  <div className="absolute inset-0 ring-1 ring-white/10 rounded-[3rem]" />
                </div>
              ) : (
                <div className="h-[500px] lg:h-[700px] rounded-[3rem] bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 transform lg:translate-y-[-100px]" />
              )}
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## DEPENDENCIES & INSTALLATION

### Required Packages

```bash
# Core dependencies
pnpm install framer-motion

# React Bits Components (install yang dipakai saja)
pnpm dlx shadcn@latest add @react-bits/AnimatedText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/BlurText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/SplitText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ShinyText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/DecryptedText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GradientText-TS-CSS
pnpm dlx shadcn@latest add @react-bits/TextType-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Shuffle-TS-CSS
pnpm dlx shadcn@latest add @react-bits/FuzzyText-TS-CSS

# Background Effects
pnpm dlx shadcn@latest add @react-bits/Galaxy-TS-CSS
pnpm dlx shadcn@latest add @react-bits/GridPattern-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Spotlight-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Particles-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Aurora-TS-CSS
pnpm dlx shadcn@latest add @react-bits/Plasma-TS-CSS

# Interactive Components
pnpm dlx shadcn@latest add @react-bits/Magnet-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ClickSpark-TS-CSS
pnpm dlx shadcn@latest add @react-bits/ScrollProgress-TS-CSS
```

---

## SUMMARY

| Hero | Layout | Background | Text Effects | Interactive |
|------|--------|------------|--------------|-------------|
| **HERO-12** | Split 50-50 | Galaxy | AnimatedText, BlurText | Standard Button |
| **HERO-13** | Centered | GridPattern + Spotlight | SplitText, ShinyText | Standard Button |
| **HERO-14** | Asymmetric 60-40 | Particles | DecryptedText, GradientText | Magnet Button |
| **HERO-15** | Vertical Stack | Aurora | TextType, BlurText | Standard Button + ScrollProgress |
| **HERO-16** | Diagonal Split | Plasma | Shuffle, FuzzyText | ClickSpark Button |

**Key Features:**
- ✅ All use dark mode (bg-black, text-white)
- ✅ Strict props interface (no hardcoded content)
- ✅ React Bits integration for visual effects
- ✅ Framer Motion animations
- ✅ Responsive design (mobile-first)
- ✅ Unique layout untuk setiap variant

**Performance Tips:**
- Jangan pakai lebih dari 2-3 background effects per page
- Disable heavy effects di mobile jika perlu
- Test di multiple devices sebelum production

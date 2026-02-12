# React Bits Components Library

Dokumentasi lengkap untuk 50 komponen React Bits yang dikelompokkan berdasarkan kategori.

---

## 📝 Text Animation Components

### 1. Split Text
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/SplitText-TS-CSS
```

**Usage:**
```jsx
import SplitText from "./SplitText";

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

<SplitText
  text="Hello, you!"
  className="text-2xl font-semibold text-center"
  delay={50}
  duration={1.25}
  ease="power3.out"
  splitType="chars"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"
  onLetterAnimationComplete={handleAnimationComplete}
  showCallback
/>
```

---

### 2. Blur Text
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/BlurText-TS-CSS
```

**Usage:**
```jsx
import BlurText from "./BlurText";

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

<BlurText
  text="Isn't this so cool?!"
  delay={200}
  animateBy="words"
  direction="top"
  onAnimationComplete={handleAnimationComplete}
  className="text-2xl mb-8"
/>
```

---

### 3. Circular Text
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/CircularText-TS-CSS
```

**Usage:**
```jsx
import CircularText from './CircularText';
  
<CircularText
  text="REACT*BITS*COMPONENTS*"
  onHover="speedUp"
  spinDuration={20}
  className="custom-class"
/>
```

---

### 4. Text Type
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/TextType-TS-CSS
```

**Usage:**
```jsx
import TextType from './TextType';

<TextType 
  text={["Text typing effect", "for your websites", "Happy coding!"]}
  typingSpeed={75}
  pauseDuration={1500}
  showCursor
  cursorCharacter="_"
  texts={["Welcome to React Bits! Good to see you!","Build some amazing experiences!"]}
  deletingSpeed={50}
  variableSpeedEnabled={false}
  variableSpeedMin={60}
  variableSpeedMax={120}
  cursorBlinkDuration={0.5}
/>
```

---

### 5. Shuffle
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Shuffle-TS-CSS
```

**Usage:**
```jsx
import Shuffle from './Shuffle';

<Shuffle
  text="Hello World"
  shuffleDirection="right"
  duration={0.35}
  animationMode="evenodd"
  shuffleTimes={1}
  ease="power3.out"
  stagger={0.03}
  threshold={0.1}
  triggerOnce={true}
  triggerOnHover
  respectReducedMotion={true}
  loop={false}
  loopDelay={0}
/>
```

---

### 6. Shiny Text
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ShinyText-TS-CSS
```

**Usage:**
```jsx
import ShinyText from './ShinyText';

<ShinyText
  text="✨ Shiny Text Effect"
  speed={2}
  delay={0}
  color="#b5b5b5"
  shineColor="#ffffff"
  spread={120}
  direction="left"
  yoyo={false}
  pauseOnHover={false}
  disabled={false}
/>
```

---

### 7. Text Pressure
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/TextPressure-TS-CSS
```

**Usage:**
```jsx
// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ
// Font used - https://compressa.preusstype.com/
  
import TextPressure from './TextPressure';

// Note:
// Make sure the font you're using supports all the variable properties. 
// React Bits does not take responsibility for the fonts used

<div style={{position: 'relative', height: '300px'}}>
  <TextPressure
    text="Hello!"
    flex
    alpha={false}
    stroke={false}
    width
    weight
    italic
    textColor="#ffffff"
    strokeColor="#5227FF"
    minFontSize={36}
  />
</div>
```

---

### 8. Curved Loop
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/CurvedLoop-TS-CSS
```

**Usage:**
```jsx
import CurvedLoop from './CurvedLoop';

// Basic usage
<CurvedLoop marqueeText="Welcome to React Bits ✦" />

// With custom props
<CurvedLoop 
  marqueeText="Be ✦ Creative ✦ With ✦ React ✦ Bits ✦"
  speed={2}
  curveAmount={400}
  direction="right"
  interactive
  className="custom-text-style"
/>

// Non-interactive with slower speed
<CurvedLoop 
  marqueeText="Be ✦ Creative ✦ With ✦ React ✦ Bits ✦"
  speed={2}
  curveAmount={400}
  interactive
/>
```

---

### 9. Fuzzy Text
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/FuzzyText-TS-CSS
```

**Usage:**
```jsx
import FuzzyText from './FuzzyText';
  
<FuzzyText 
  baseIntensity={0.2}
  hoverIntensity={0.5}
  enableHover
>
  404
</FuzzyText>
```

---

### 10. Gradient Text
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/GradientText-TS-CSS
```

**Usage:**
```jsx
import GradientText from './GradientText'

// For a smoother animation, the gradient should start and end with the same color
  
<GradientText
  colors={["#5227FF","#FF9FFC","#B19EEF"]}
  animationSpeed={8}
  showBorder={false}
  className="custom-class"
>
  Add a splash of color!
</GradientText>
```

---

### 11. Falling Text
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/FallingText-TS-CSS
```

**Usage:**
```jsx
import FallingText from './FallingText';
  
<FallingText
  text={`React Bits is a library of animated and interactive React components designed to streamline UI development and simplify your workflow.`}
  highlightWords={["React", "Bits", "animated", "components", "simplify"]}
  highlightClass="highlighted"
  trigger="hover"
  backgroundColor="transparent"
  wireframes={false}
  gravity={0.56}
  fontSize="2rem"
  mouseConstraintStiffness={0.9}
/>
```

---

### 12. Text Cursor
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/TextCursor-TS-CSS
```

**Usage:**
```jsx
import TextCursor from './TextCursor';

<TextCursor
  text="⚛️"
  spacing={80}
  followMouseDirection
  randomFloat
  exitDuration={0.3}
  removalInterval={20}
  maxPoints={10}
/>
```

---

### 13. Decrypted Text
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/DecryptedText-TS-CSS
```

**Usage:**
```jsx
import DecryptedText from './DecryptedText';

{/* Example 1: Defaults (hover to decrypt) */}
<DecryptedText text="Hover me!" />

{/* Example 2: Customized speed and characters */}
<DecryptedText
  text="Customize me"
  speed={60}
  maxIterations={10}
  characters="ABCD1234!?"
  className="revealed"
  parentClassName="all-letters"
  encryptedClassName="encrypted"
/>

{/* Example 3: Animate on view (runs once) */}
<div style={{ marginTop: '4rem' }}>
  <DecryptedText
    text="This text animates when in view"
    animateOn="view"
    revealDirection="start"
    sequential
    useOriginalCharsOnly={false}
  />
</div>
```

---

### 14. True Focus
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/TrueFocus-TS-CSS
```

**Usage:**
```jsx
import TrueFocus from './TrueFocus';

<TrueFocus 
  sentence="True Focus"
  manualMode={false}
  blurAmount={5}
  borderColor="#5227FF"
  animationDuration={0.5}
  pauseBetweenAnimations={1}
/>
```

---

### 15. Scroll Float
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ScrollFloat-TS-CSS
```

**Usage:**
```jsx
import ScrollFloat from './ScrollFloat';

<ScrollFloat
  animationDuration={1}
  ease='back.inOut(2)'
  scrollStart='center bottom+=50%'
  scrollEnd='bottom bottom-=40%'
  stagger={0.03}
>
  React Bits
</ScrollFloat>
```

---

### 16. Scroll Reveal
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ScrollReveal-TS-CSS
```

**Usage:**
```jsx
import ScrollReveal from './ScrollReveal';

<ScrollReveal
  baseOpacity={0.1}
  enableBlur
  baseRotation={3}
  blurStrength={4}
>
  When does a man die? When he is hit by a bullet? No! When he suffers a disease?
  No! When he ate a soup made out of a poisonous mushroom?
  No! A man dies when he is forgotten!
</ScrollReveal>
```

---

### 17. Ascii Text
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ASCIIText-TS-CSS
```

**Usage:**
```jsx
// Component ported and enhanced from https://codepen.io/JuanFuentes/pen/eYEeoyE
  
import ASCIIText from './ASCIIText';

<ASCIIText
  text='hello_world'
  enableWaves
  asciiFontSize={8}
  text="Hey!"
/>
```

---

### 18. Scrambled Text
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ScrambledText-TS-CSS
```

**Usage:**
```jsx
// Component inspired by Tom Miller from the GSAP community
// https://codepen.io/creativeocean/pen/NPWLwJM

import ScrambledText from './ScrambledText';
  
<ScrambledText
  className="scrambled-text-demo"
  radius={100}
  duration={1.2}
  speed={0.5}
  scrambleChars=".:"
>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. 
  Similique pariatur dignissimos porro eius quam doloremque 
  et enim velit nobis maxime.
</ScrambledText>
```

---

### 19. Rotating Text
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/RotatingText-TS-CSS
```

**Usage:**
```jsx
import RotatingText from './RotatingText'
  
<RotatingText
  texts={['React', 'Bits', 'Is', 'Cool!']}
  mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
  staggerFrom={"last"}
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "-120%" }}
  staggerDuration={0.025}
  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
  transition={{ type: "spring", damping: 30, stiffness: 400 }}
  rotationInterval={2000}
/>
```

---

### 20. Glitch Text
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/GlitchText-TS-CSS
```

**Usage:**
```jsx
import GlitchText from './GlitchText';
  
<GlitchText
  speed={1}
  enableShadows
  enableOnHover={false}
  className='custom-class'
>
  React Bits
</GlitchText>
```

---

### 21. Scroll Velocity
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ScrollVelocity-TS-CSS
```

**Usage:**
```jsx
import ScrollVelocity from './ScrollVelocity';
  
<ScrollVelocity
  texts={['React Bits', 'Scroll Down']} 
  velocity={100}
  className="custom-scroll-text"
/>
```

---

### 22. Variable Proximity
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/VariableProximity-TS-CSS
```

**Usage:**
```jsx
import { useRef } from 'react';
import VariableProximity from './VariableProximity';

const containerRef = useRef(null);

<div
  ref={containerRef}
  style={{position: 'relative'}}
>
  <VariableProximity
    label={'Hover me! And then star React Bits on GitHub, or else...'}
    className={'variable-proximity-demo'}
    fromFontVariationSettings="'wght' 400, 'opsz' 9"
    toFontVariationSettings="'wght' 1000, 'opsz' 40"
    containerRef={containerRef}
    radius={100}
    falloff='linear'
    falloff="linear"
  />
</div>
```

---

### 23. Count Up
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/CountUp-TS-CSS
```

**Usage:**
```jsx
import CountUp from './CountUp'

<CountUp
  from={0}
  to={100}
  separator=","
  direction="up"
  duration={1}
  className="count-up-text"
  startCounting={false}
/>
```

---

## 🎨 Content Animation Components

### 24. Animated Content
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/AnimatedContent-TS-CSS
```

**Usage:**
```jsx
import AnimatedContent from './AnimatedContent'

<AnimatedContent
  distance={100}
  direction="vertical"
  reverse={false}
  duration={0.8}
  ease="power3.out"
  initialOpacity={0}
  animateOpacity
  scale={1}
  threshold={0.1}
  delay={0}
>
  <div>Content to Animate</div>
</AnimatedContent>
```

---

### 25. Fade Content
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/FadeContent-TS-CSS
```

**Usage:**
```jsx
import FadeContent from './FadeContent'
  
<FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
  {/* Anything placed inside this container will be fade into view */}
</FadeContent>
```

---

## ✨ Visual Effect Components

### 26. Electric Border
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ElectricBorder-TS-CSS
```

**Usage:**
```jsx
// CREDIT
// Component inspired by @BalintFerenczy on X
// https://codepen.io/BalintFerenczy/pen/KwdoyEN
  
import ElectricBorder from './ElectricBorder'

<ElectricBorder
  color="#7df9ff"
  speed={1}
  chaos={0.12}
  thickness={2}
  style={{ borderRadius: 16 }}
>
  <div>
    <p style={{ margin: '6px 0 0', opacity: 0.8 }}>
      A glowing, animated border wrapper.
    </p>
  </div>
</ElectricBorder>
```

---

### 27. Pixel Transition
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/PixelTransition-TS-CSS
```

**Usage:**
```jsx
import PixelTransition from './PixelTransition';

<PixelTransition
  firstContent={
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg"
      alt="default pixel transition content, a cat!"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  }
  secondContent={
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#111"
      }}
    >
      <p style={{ fontWeight: 900, fontSize: "3rem", color: "#ffffff" }}>Meow!</p>
    </div>
  }
  gridSize={8}
  pixelColor='#ffffff'
  once={false}
  animationStepDuration={0.4}
  className="custom-pixel-card"
  pixelColor="#ffffff"
/>
```

---

### 28. Glare Hover
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/GlareHover-TS-CSS
```

**Usage:**
```jsx
import GlareHover from './GlareHover'

<div style={{ height: '600px', position: 'relative' }}>
  <GlareHover
    glareColor="#ffffff"
    glareOpacity={0.3}
    glareAngle={-30}
    glareSize={300}
    transitionDuration={800}
    playOnce={false}
  >
    <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#333', margin: 0 }}>
      Hover Me
    </h2>
  </GlareHover>
</div>
```

---

### 29. Antigravity
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Antigravity-TS-CSS
```

**Usage:**
```jsx
import Antigravity from './Antigravity';

<div style={{ width: '100%', height: '400px', position: 'relative' }}>
  <Antigravity
    count={300}
    magnetRadius={6}
    ringRadius={7}
    waveSpeed={0.4}
    waveAmplitude={1}
    particleSize={1.5}
    lerpSpeed={0.05}
    color="#5227FF"
    autoAnimate
    particleVariance={1}
    rotationSpeed={0}
    depthFactor={1}
    pulseSpeed={3}
    particleShape="capsule"
    fieldStrength={10}
  />
</div>
```

---

### 30. Logo Loop
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/LogoLoop-TS-CSS
```

**Usage:**
```jsx
import LogoLoop from './LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

// Alternative with image sources
const imageLogos = [
  { src: "/logos/company1.png", alt: "Company 1", href: "https://company1.com" },
  { src: "/logos/company2.png", alt: "Company 2", href: "https://company2.com" },
  { src: "/logos/company3.png", alt: "Company 3", href: "https://company3.com" },
];

function App() {
  return (
    <div style={{ height: '200px', position: 'relative', overflow: 'hidden'}}>
      {/* Basic horizontal loop */}
      <LogoLoop
        logos={techLogos}
        speed={100}
        direction="left"
        logoHeight={60}
        gap={60}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
      />
      
      {/* Vertical loop with deceleration on hover */}
      <LogoLoop
        logos={techLogos}
        speed={100}
        direction="left"
        logoHeight={60}
        gap={60}
        hoverSpeed={0}
        fadeOut
        useCustomRender={false}
      />
    </div>
  );
}
```

---

## 🖱️ Cursor & Interactive Components

### 31. Target Cursor
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/TargetCursor-TS-CSS
```

**Usage:**
```jsx
import TargetCursor from './TargetCursor';

export default function App() {
  return (
    <div>
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />
      
      <h1>Hover over the elements below</h1>
      <button className="cursor-target">Click me!</button>
      <div className="cursor-target">Hover target</div>
    </div>
  );
}
```

---

### 32. Laser Flow
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/LaserFlow-TS-CSS
```

**Usage:**
```jsx
import LaserFlow from './LaserFlow';
import { useRef } from 'react';

// NOTE: You can also adjust the variables in the shader for super detailed customization

// Basic Usage
<div style={{ height: '500px', position: 'relative', overflow: 'hidden' }}>
  <LaserFlow />
</div>

// Image Example Interactive Reveal Effect
function LaserFlowBoxExample() {
  const revealImgRef = useRef(null);

  return (
    <div 
      style={{ 
        height: '800px', 
        position: 'relative', 
        overflow: 'hidden',
        backgroundColor: '#060010'
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', `${x}px`);
          el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', '-9999px');
          el.style.setProperty('--my', '-9999px');
        }
      }}
    >
      <LaserFlow
        horizontalBeamOffset={0.1}
        verticalBeamOffset={0.0}
        color="#CF9EFF"
        horizontalSizing={0.5}
        verticalSizing={2}
        wispDensity={1}
        wispSpeed={15}
        wispIntensity={5}
        flowSpeed={0.35}
        flowStrength={0.25}
        fogIntensity={0.45}
        fogScale={0.3}
        fogFallSpeed={0.6}
        decay={1.1}
        falloffStart={1.2}
      />
      
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '86%',
        height: '60%',
        backgroundColor: '#060010',
        borderRadius: '20px',
        border: '2px solid #FF79C6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '2rem',
        zIndex: 6
      }}>
        {/* Your content here */}
      </div>

      <img
        ref={revealImgRef}
        src="/path/to/image.jpg"
        alt="Reveal effect"
        style={{
          position: 'absolute',
          width: '100%',
          top: '-50%',
          zIndex: 5,
          mixBlendMode: 'lighten',
          opacity: 0.3,
          pointerEvents: 'none',
          '--mx': '-9999px',
          '--my': '-9999px',
          WebkitMaskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          maskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat'
        }}
      />
    </div>
  );
}
```

---

### 33. Magnet Lines
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/MagnetLines-TS-CSS
```

**Usage:**
```jsx
import MagnetLines from './MagnetLines';

<MagnetLines
  rows={10}
  columns={12}
  containerSize="40vmin"
  lineColor="tomato"
  lineWidth="2px"
  lineHeight="30px"
  baseAngle={0}
  style={{ margin: "2rem auto" }}
/>
```

---

### 34. Ghost Cursor
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/GhostCursor-TS-CSS
```

**Usage:**
```jsx
import GhostCursor from './GhostCursor'

<div style={{ height: 600, position: 'relative' }}>
  <GhostCursor
    // Visuals
    color="#B19EEF"
    brightness={2}
    edgeIntensity={0}

    // Trail and motion
    trailLength={50}
    inertia={0.5}

    // Post-processing
    grainIntensity={0.05}
    bloomStrength={0.1}
    bloomRadius={1}
    bloomThreshold={0.025}

    // Fade-out behavior
    fadeDelayMs={1000}
    fadeDurationMs={1500}
  />
</div>
```

---

### 35. Gradual Blur
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/GradualBlur-TS-CSS
```

**Usage:**
```jsx
// Component added by Ansh - github.com/ansh-dhanani

import GradualBlur from './GradualBlur';

<section style={{position: 'relative',height: 500,overflow: 'hidden'}}>
  <div style={{ height: '100%',overflowY: 'auto',padding: '6rem 2rem' }}>
    {/* Content Here - such as an image or text */}
  </div>

  <GradualBlur
    target="parent"
    position="bottom"
    height="7rem"
    strength={2}
    divCount={5}
    curve="bezier"
    exponential
    opacity={1}
  />
</section>
```

---

### 36. Click Spark
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ClickSpark-TS-CSS
```

**Usage:**
```jsx
import ClickSpark from './ClickSpark';

<ClickSpark
  sparkColor='#fff'
  sparkSize={10}
  sparkRadius={15}
  sparkCount={8}
  duration={400}
>
  {/* Your content here */}
</ClickSpark>
```

---

### 37. Magnet
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Magnet-TS-CSS
```

**Usage:**
```jsx
import Magnet from './Magnet'

<Magnet padding={50} disabled={false} magnetStrength={50}>
  <p>Star React Bits on GitHub!</p>
</Magnet>
```

---

### 38. Sticker Peel
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/StickerPeel-TS-CSS
```

**Usage:**
```jsx
import StickerPeel from './StickerPeel'
import logo from './assets/sticker.png'
  
<StickerPeel
  imageSrc={logo}
  width={200}
  rotate={0}
  peelBackHoverPct={30}
  peelBackActivePct={40}
  shadowIntensity={0.5}
  lightingIntensity={0.1}
  initialPosition={{ x: -100, y: 100 }}
  peelDirection={0}
/>
```

---

### 39. Pixel Trail
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/PixelTrail-TS-CSS
```

**Usage:**
```jsx
import PixelTrail from './PixelTrail';

<div style={{ height: '500px', position: 'relative', overflow: 'hidden'}}>
  <PixelTrail
    gridSize={50}
    trailSize={0.1}
    maxAge={250}
    interpolate={5}
    color="#5227FF"
    gooeyFilter={{ id: "custom-goo-filter", strength: 2 }}
    gooeyEnabled
    gooStrength={2}
  />
</div>
```

---

### 40. Cubes
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Cubes-TS-CSS
```

**Usage:**
```jsx
// CREDIT
// Component inspired from Can Tastemel's original work for the lambda.ai landing page
// https://cantastemel.com
  
import Cubes from './Cubes'

<div style={{ height: '600px', position: 'relative' }}>
  <Cubes 
    gridSize={8}
    maxAngle={45}
    radius={3}
    borderStyle="2px dashed #B19EEF"
    faceColor="#1a1a2e"
    rippleColor="#ff6b6b"
    rippleSpeed={1.5}
    autoAnimate
    rippleOnClick
  />
</div>
```

---

## 🎭 Advanced Visual & Shader Components

### 41. Metallic Paint
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/MetallicPaint-TS-CSS
```

**Usage:**
```jsx
// Effect inspired by Paper's Liquid Metal effect
  
import MetallicPaint from "./MetallicPaint";

// Replace with your own SVG path
// NOTE: Your SVG should have padding around the shape to prevent cutoff
// It should have a black fill color to allow the metallic effect to show through
import logo from './logo.svg';

export default function Component() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <MetallicPaint
        imageSrc={logo}
        // Pattern
        seed={42}
        scale={4}
        patternSharpness={1}
        noiseScale={0.5}
        // Animation
        speed={0.3}
        liquid={0.75}
        mouseAnimation={false}
        // Visual
        brightness={2}
        contrast={0.5}
        refraction={0.01}
        blur={0.015}
        chromaticSpread={2}
        fresnel={1}
        angle={0}
        waveAmplitude={1}
        distortion={1}
        contour={0.2}
        // Colors
        lightColor="#ffffff"
        darkColor="#000000"
        tintColor="#feb3ff"
      />
    </div>
  );
}
```

---

### 42. Noise
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Noise-TS-CSS
```

**Usage:**
```jsx
import Noise from './Noise;'

<div style={{width: '600px', height: '400px', position: 'relative', overflow: 'hidden'}}>
  <Noise
    patternSize={250}
    patternScaleX={2}
    patternScaleY={2}
    patternRefreshInterval={2}
    patternAlpha={15}
  />
</div>
```

---

### 43. Shape Blur
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ShapeBlur-TS-CSS
```

**Usage:**
```jsx
import ShapeBlur from './ShapeBlur';

<div style={{position: 'relative', height: '500px', overflow: 'hidden'}}>
  <ShapeBlur
    variation={0}
    pixelRatioProp={window.devicePixelRatio || 1}
    shapeSize={1}
    roundness={0.5}
    borderSize={0.05}
    circleSize={0.25}
    circleEdge={1}
  />
</div>
```

---

### 44. Crosshair
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Crosshair-TS-CSS
```

**Usage:**
```jsx
import { useRef } from 'react';
import Crosshair from './Crosshair';

const Component = () => {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} style={{ height: '300px', overflow: 'hidden' }}>
      <Crosshair 
        containerRef={containerRef} 
        color='#ffffff'
        color="#ffffff"
        targeted
      /> 
      {/* containerRef defaults to "window" if not provided */}
    </div>
  )
};
```

---

### 45. Image Trail
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ImageTrail-TS-CSS
```

**Usage:**
```jsx
import ImageTrail from './ImageTrail;'

<div style={{ height: '500px', position: 'relative', overflow: 'hidden'}}>
  <ImageTrail
    key={key}
    items={[
      'https://picsum.photos/id/287/300/300',
      'https://picsum.photos/id/1001/300/300',
      'https://picsum.photos/id/1025/300/300',
      'https://picsum.photos/id/1026/300/300',
      'https://picsum.photos/id/1027/300/300',
      'https://picsum.photos/id/1028/300/300',
      'https://picsum.photos/id/1029/300/300',
      'https://picsum.photos/id/1030/300/300',
      // ...
    ]}
    variant="1"
  />
</div>
```

---

### 46. Ribbons
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Ribbons-TS-CSS
```

**Usage:**
```jsx
import Ribbons from './Ribbons';

<div style={{ height: '500px', position: 'relative', overflow: 'hidden'}}>
  <Ribbons
    baseThickness={30}
    colors={["#5227FF"]}
    speedMultiplier={0.5}
    maxAge={500}
    enableFade={false}
    enableShaderEffect={false}
  />
</div>
```

---

### 47. Splash Cursor
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/SplashCursor-TS-CSS
```

**Usage:**
```jsx
import SplashCursor from './SplashCursor'

<SplashCursor />
```

---

### 48. Meta Balls
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/MetaBalls-TS-CSS
```

**Usage:**
```jsx
import MetaBalls from './MetaBalls';

<MetaBalls
  color="#ffffff"
  cursorBallColor="#ffffff"
  cursorBallSize={2}
  ballCount={15}
  animationSize={30}
  enableMouseInteraction
  enableTransparency={true}
  hoverSmoothness={0.15}
  clumpFactor={1}
  speed={0.3}
/>
```

---

### 49. Blob Cursor
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/BlobCursor-TS-CSS
```

**Usage:**
```jsx
import BlobCursor from './BlobCursor';

<BlobCursor
  blobType="circle"
  fillColor="#5227FF"
  trailCount={3}
  sizes={[60,125,75]}
  innerSizes={[20,35,25]}
  innerColor="rgba(255,255,255,0.8)"
  opacities={[0.6,0.6,0.6]}
  shadowColor="rgba(0,0,0,0.75)"
  shadowBlur={5}
  shadowOffsetX={10}
  shadowOffsetY={10}
  filterStdDeviation={30}
  useFilter={true}
  fastDuration={0.1}
  slowDuration={0.5}
  zIndex={100}
/>
```

---

### 50. Star Border
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/StarBorder-TS-CSS
```

**Usage:**
```jsx
import StarBorder from './StarBorder'
  
<StarBorder
  as="button"
  className="custom-class"
  color="magenta"
  speed="5s"
>
  {/* content */}
</StarBorder>
```

---

## 📋 Summary

Total: **50 komponen React Bits** yang dikelompokkan dalam 4 kategori utama:

1. **Text Animation Components** (23 komponen) - Split Text, Blur Text, Circular Text, dll.
2. **Content Animation Components** (2 komponen) - Animated Content, Fade Content
3. **Visual Effect Components** (5 komponen) - Electric Border, Pixel Transition, Glare Hover, dll.
4. **Cursor & Interactive Components** (10 komponen) - Target Cursor, Laser Flow, Magnet Lines, dll.
5. **Advanced Visual & Shader Components** (10 komponen) - Metallic Paint, Noise, Shape Blur, dll.

Semua komponen menggunakan **pnpm** sebagai package manager dan dilengkapi dengan contoh penggunaan lengkap.

---

**Repository:** React Bits Components Library  
**License:** MIT  
**Documentation:** https://react-bits.dev


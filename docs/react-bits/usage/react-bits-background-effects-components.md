# React Bits Background & Effects Components

Dokumentasi lengkap untuk 43 komponen Background & Effects React Bits yang dikelompokkan berdasarkan kategori.

---

## 🌊 Liquid & Fluid Effects

### 1. Liquid Ether
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/LiquidEther-TS-CSS
```

**Usage:**
```jsx
import LiquidEther from './LiquidEther';

<div style={{ width: '100%', height: 600, position: 'relative' }}>
  <LiquidEther
    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
    mouseForce={20}
    cursorSize={100}
    isViscous
    viscous={30}
    iterationsViscous={32}
    iterationsPoisson={32}
    resolution={0.5}
    isBounce={false}
    autoDemo
    autoSpeed={0.5}
    autoIntensity={2.2}
    takeoverDuration={0.25}
    autoResumeDelay={3000}
    autoRampDuration={0.6}
    color0="#5227FF"
    color1="#FF9FFC"
    color2="#B19EEF"
  />
</div>
```

---

### 2. Liquid Chrome
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/LiquidChrome-TS-CSS
```

**Usage:**
```jsx
import LiquidChrome from './LiquidChrome';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <LiquidChrome
    baseColor={[0.1, 0.1, 0.1]}
    speed={1}
    amplitude={0.6}
    interactive={true}
  />
</div>
```

---

### 3. Silk
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Silk-TS-CSS
```

**Usage:**
```jsx
import Silk from './Silk';

<Silk
  speed={5}
  scale={1}
  color="#7B7481"
  noiseIntensity={1.5}
  rotation={0}
/>
```

---

## 🎨 Color & Gradient Effects

### 4. Aurora
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Aurora-TS-CSS
```

**Usage:**
```jsx
import Aurora from './Aurora';
  
<Aurora
  colorStops={["#7cff67","#B19EEF","#5227FF"]}
  blend={0.5}
  amplitude={1.0}
  speed={1}
/>
```

---

### 5. Iridescence
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Iridescence-TS-CSS
```

**Usage:**
```jsx
import Iridescence from './Iridescence';
  
<Iridescence
  color={[0.5,0.6,0.8]}
  mouseReact
  amplitude={0.1}
  speed={1}
/>
```

---

### 6. Color Bends
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ColorBends-TS-CSS
```

**Usage:**
```jsx
import ColorBends from './ColorBends';
  
<ColorBends
  colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
  rotation={0}
  speed={0.2}
  scale={1}
  frequency={1}
  warpStrength={1}
  mouseInfluence={1}
  parallax={0.5}
  noise={0.1}
  transparent
  autoRotate={0}
  color=""
/>
```

---

### 7. Gradient Blinds
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/GradientBlinds-TS-CSS
```

**Usage:**
```jsx
import GradientBlinds from './GradientBlinds';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <GradientBlinds
    gradientColors={['#FF9FFC', '#5227FF']}
    angle={0}
    noise={0.3}
    blindCount={12}
    blindMinWidth={50}
    spotlightRadius={0.5}
    spotlightSoftness={1}
    spotlightOpacity={1}
    mouseDampening={0.15}
    distortAmount={0}
    shineDirection="left"
    mixBlendMode="lighten"
  />
</div>
```

---

### 8. Plasma
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Plasma-TS-CSS
```

**Usage:**
```jsx
import Plasma from './Plasma';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Plasma 
    color="#ff6b35"
    speed={0.6}
    direction="forward"
    scale={1.1}
    opacity={0.8}
    mouseInteractive={true}
  />
</div>
```

---

### 9. Balatro
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Balatro-TS-CSS
```

**Usage:**
```jsx
import Balatro from './Balatro';
  
<Balatro
  isRotate={false}
  mouseInteraction
  pixelFilter={745}
  color1="#DE443B"
  color2="#006BB4"
  color3="#162325"
/>
```

---

## ✨ Light & Glow Effects

### 10. Light Pillar
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/LightPillar-TS-CSS
```

**Usage:**
```jsx
import LightPillar from './LightPillar';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <LightPillar
    topColor="#5227FF"
    bottomColor="#FF9FFC"
    intensity={1}
    rotationSpeed={0.3}
    glowAmount={0.002}
    pillarWidth={3}
    pillarHeight={0.4}
    noiseIntensity={0.5}
    pillarRotation={25}
    interactive={false}
    mixBlendMode="screen"
    quality="high"
  />
</div>
```

---

### 11. Light Rays
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/LightRays-TS-CSS
```

**Usage:**
```jsx
import LightRays from './LightRays';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <LightRays
    raysOrigin="top-center"
    raysColor="#ffffff"
    raysSpeed={1}
    lightSpread={0.5}
    rayLength={3}
    followMouse={true}
    mouseInfluence={0.1}
    noiseAmount={0}
    distortion={0}
    className="custom-rays"
    pulsating={false}
    fadeDistance={1}
    saturation={1}
  />
</div>
```

---

### 12. Beams
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Beams-TS-CSS
```

**Usage:**
```jsx
import Beams from './Beams';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Beams
    beamWidth={3}
    beamHeight={30}
    beamNumber={20}
    lightColor="#ffffff"
    speed={2}
    noiseIntensity={1.75}
    scale={0.2}
    rotation={30}
  />
</div>
```

---

### 13. Orb
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Orb-TS-CSS
```

**Usage:**
```jsx
import Orb from './Orb';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Orb
    hoverIntensity={2}
    rotateOnHover
    hue={0}
    forceHoverState={false}
    backgroundColor="#000000"
  />
</div>
```

---

## 🌌 Space & Cosmic Effects

### 14. Galaxy
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Galaxy-TS-CSS
```

**Usage:**
```jsx
import Galaxy from './Galaxy';

// Basic usage
<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Galaxy />
</div>

// With custom prop values
<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Galaxy 
    mouseRepulsion
    mouseInteraction
    density={1}
    glowIntensity={0.3}
    saturation={0}
    hueShift={140}
    twinkleIntensity={0.3}
    rotationSpeed={0.1}
    repulsionStrength={2}
    autoCenterRepulsion={0}
    starSpeed={0.5}
    speed={1}
  />
</div>
```

---

### 15. Hyperspeed
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Hyperspeed-TS-CSS
```

**Usage:**
```jsx
import Hyperspeed from './Hyperspeed';

// the component will fill the height/width of its parent container, edit the CSS to change this
// the options below are the default values

<Hyperspeed
  effectOptions={{
    "distortion":"turbulentDistortion",
    "length":400,
    "roadWidth":10,
    "islandWidth":2,
    "lanesPerRoad":3,
    "fov":90,
    "fovSpeedUp":150,
    "speedUp":2,
    "carLightsFade":0.4,
    "totalSideLightSticks":20,
    "lightPairsPerRoadWay":40,
    "shoulderLinesWidthPercentage":0.05,
    "brokenLinesWidthPercentage":0.1,
    "brokenLinesLengthPercentage":0.5,
    "lightStickWidth":[0.12,0.5],
    "lightStickHeight":[1.3,1.7],
    "movingAwaySpeed":[60,80],
    "movingCloserSpeed":[-120,-160],
    "carLightsLength":[12,80],
    "carLightsRadius":[0.05,0.14],
    "carWidthPercentage":[0.3,0.5],
    "carShiftX":[-0.8,0.8],
    "carFloorSeparation":[0,5],
    "colors":{
      "roadColor":526344,
      "islandColor":657930,
      "background":0,
      "shoulderLines":1250072,
      "brokenLines":1250072,
      "leftCars":[14177983,6770850,12732332],
      "rightCars":[242627,941733,3294549],
      "sticks":242627
    }
  }}
/>
```

---

## 🎭 Geometric & 3D Effects

### 16. Prism
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Prism-TS-CSS
```

**Usage:**
```jsx
import Prism from './Prism';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Prism
    animationType="rotate"
    timeScale={0.5}
    height={3.5}
    baseWidth={5.5}
    scale={3.6}
    hueShift={0}
    colorFrequency={1}
    noise={0}
    glow={1}
  />
</div>
```

---

### 17. Prismatic Burst
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/PrismaticBurst-TS-CSS
```

**Usage:**
```jsx
import PrismaticBurst from './PrismaticBurst';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <PrismaticBurst
    animationType="rotate3d"
    intensity={2}
    speed={0.5}
    distort={0}
    paused={false}
    offset={{ x: 0, y: 0 }}
    hoverDampness={0.25}
    rayCount={0}
    mixBlendMode="lighten"
    colors={['#ff007a', '#4d3dff', '#ffffff']}
    color0=""
    color1=""
    color2=""
  />
</div>
```

---

### 18. Squares
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Squares-TS-CSS
```

**Usage:**
```jsx
import Squares from './Squares';
  
<Squares 
  speed={0.5}
  squareSize={40}
  direction="diagonal" // up, down, left, right, diagonal
  borderColor="#271E37"
  hoverColor="#222222"
  size={40}
/>
```

---

### 19. Ballpit
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Ballpit-TS-CSS
```

**Usage:**
```jsx
// Component inspired by Kevin Levron:
// https://x.com/soju22/status/1858925191671271801
  
import Ballpit from './Ballpit';

<div style={{
  position: 'relative', 
  overflow: 'hidden', 
  minHeight: '500px', 
  maxHeight: '500px', 
  width: '100%'
}}>
  <Ballpit
    count={100}
    gravity={0.01}
    friction={0.9975}
    wallBounce={0.95}
    followCursor={false}
  />
</div>
```

---

## 📡 Grid & Line Effects

### 20. Grid Scan
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/GridScan-TS-CSS
```

**Usage:**
```jsx
import GridScan from './GridScan';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <GridScan
    sensitivity={0.55}
    lineThickness={1}
    linesColor="#392e4e"
    gridScale={0.1}
    scanColor="#FF9FFC"
    scanOpacity={0.4}
    enablePost
    bloomIntensity={0.6}
    chromaticAberration={0.002}
    noiseIntensity={0.01}
  />
</div>
```

---

### 21. Ripple Grid
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/RippleGrid-TS-CSS
```

**Usage:**
```jsx
import RippleGrid from './RippleGrid';

<div style={{position: 'relative', height: '500px', overflow: 'hidden'}}>
  <RippleGrid
    enableRainbow={false}
    gridColor="#ffffff"
    rippleIntensity={0.05}
    gridSize={10}
    gridThickness={15}
    mouseInteraction={true}
    mouseInteractionRadius={1.2}
    opacity={0.8}
  />
</div>
```

---

### 22. Dot Grid
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/DotGrid-TS-CSS
```

**Usage:**
```jsx
import DotGrid from './DotGrid';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <DotGrid
    dotSize={5}
    gap={15}
    baseColor="#271E37"
    activeColor="#5227FF"
    proximity={120}
    shockRadius={250}
    shockStrength={5}
    resistance={750}
    returnDuration={1.5}
  />
</div>
```

---

### 23. Floating Lines
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/FloatingLines-TS-CSS
```

**Usage:**
```jsx
import FloatingLines from './FloatingLines';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <FloatingLines 
    enabledWaves={["top","middle","bottom"]}
    // Array - specify line count per wave; Number - same count for all waves
    lineCount={5}
    // Array - specify line distance per wave; Number - same distance for all waves
    lineDistance={5}
    bendRadius={5}
    bendStrength={-0.5}
    interactive={true}
    parallax={true}
  />
</div>
```

---

### 24. Threads
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Threads-TS-CSS
```

**Usage:**
```jsx
import Threads from './Threads';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Threads
    amplitude={1}
    distance={0}
    enableMouseInteraction
  />
</div>
```

---

### 25. Grid Distortion
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/GridDistortion-TS-CSS
```

**Usage:**
```jsx
import GridDistortion from './GridDistortion';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <GridDistortion
    imageSrc="https://picsum.photos/1920/1080?grayscale"
    grid={10}
    mouse={0.1}
    strength={0.15}
    relaxation={0.9}
    className="custom-class"
  />
</div>
```

---

### 26. Grid Motion
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/GridMotion-TS-CSS
```

**Usage:**
```jsx
import GridMotion from './GridMotion';
  
// note: you'll need to make sure the parent container of this component is sized properly
const items = [
  'Item 1',
  <div key='jsx-item-1'>Custom JSX Content</div>,
  'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d',
  'Item 2',
  <div key='jsx-item-2'>Custom JSX Content</div>,
  'Item 4',
  // Add more items as needed
];

<GridMotion 
  items={items}
  gradientColor="black"
/>
```

---

## 💫 Particle Effects

### 27. Particles
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Particles-TS-CSS
```

**Usage:**
```jsx
import Particles from './Particles';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Particles
    particleColors={["#ffffff"]}
    particleCount={200}
    particleSpread={10}
    speed={0.1}
    particleBaseSize={100}
    moveParticlesOnHover
    alphaParticles={false}
    disableRotation={false}
    pixelRatio={1}
  />
</div>
```

---

### 28. Pixel Snow
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/PixelSnow-TS-CSS
```

**Usage:**
```jsx
import PixelSnow from './PixelSnow';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <PixelSnow 
    color="#ffffff"
    flakeSize={0.01}
    minFlakeSize={1.25}
    pixelResolution={200}
    speed={1.25}
    density={0.3}
    direction={125}
    brightness={1}
    depthFade={8}
    farPlane={20}
    gamma={0.4545}
    variant="square"
  />
</div>
```

---

## 🎪 Pixel & Retro Effects

### 29. Pixel Blast
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/PixelBlast-TS-CSS
```

**Usage:**
```jsx
// Component inspired by github.com/zavalit/bayer-dithering-webgl-demo
  
import PixelBlast from './PixelBlast';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <PixelBlast
    variant="square"
    pixelSize={4}
    color="#B19EEF"
    patternScale={2}
    patternDensity={1}
    pixelSizeJitter={0}
    enableRipples
    rippleSpeed={0.4}
    rippleThickness={0.12}
    rippleIntensityScale={1.5}
    liquid={false}
    liquidStrength={0.12}
    liquidRadius={1.2}
    liquidWobbleSpeed={5}
    speed={0.5}
    edgeFade={0.25}
    transparent
  />
</div>
```

---

### 30. Dither
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Dither-TS-CSS
```

**Usage:**
```jsx
import Dither from './Dither';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Dither
    waveColor={[0.5,0.5,0.5]}
    disableAnimation={false}
    enableMouseInteraction
    mouseRadius={0.3}
    colorNum={4}
    waveAmplitude={0.3}
    waveFrequency={3}
    waveSpeed={0.05}
  />
</div>
```

---

### 31. Faulty Terminal
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/FaultyTerminal-TS-CSS
```

**Usage:**
```jsx
import FaultyTerminal from './FaultyTerminal';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <FaultyTerminal
    scale={1.5}
    gridMul={[2, 1]}
    digitSize={1.2}
    timeScale={0.5}
    pause={false}
    scanlineIntensity={0.5}
    glitchAmount={1}
    flickerAmount={1}
    noiseAmp={1}
    chromaticAberration={0}
    dither={0}
    curvature={0.1}
    tint="#A7EF9E"
    mouseReact
    mouseStrength={0.5}
    pageLoadAnimation
    brightness={0.6}
  />
</div>
```

---

### 32. Letter Glitch
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/LetterGlitch-TS-CSS
```

**Usage:**
```jsx
import LetterGlitch from './LetterGlitch';
  
<LetterGlitch
  glitchSpeed={50}
  centerVignette={true}
  outerVignette={false}
  smooth={true}
/>
```

---

## ⚡ Energy & Electric Effects

### 33. Lightning
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Lightning-TS-CSS
```

**Usage:**
```jsx
import Lightning from './Lightning';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <Lightning
    hue={260}
    xOffset={0}
    speed={1}
    intensity={1}
    size={1}
  />
</div>
```

---

## 🌊 Wave Effects

### 34. Waves
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Waves-TS-CSS
```

**Usage:**
```jsx
import Waves from './Waves';

<Waves
  lineColor="#ffffff"
  backgroundColor="rgba(255, 255, 255, 0.2)"
  waveSpeedX={0.0125}
  waveSpeedY={0.01}
  waveAmpX={40}
  waveAmpY={20}
  friction={0.9}
  tension={0.01}
  maxCursorMove={120}
  xGap={12}
  yGap={36}
/>
```

---

## 🌑 Dark & Atmospheric Effects

### 35. Dark Veil
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/DarkVeil-TS-CSS
```

**Usage:**
```jsx
import DarkVeil from './DarkVeil';

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <DarkVeil
    hueShift={0}
    noiseIntensity={0}
    scanlineIntensity={0}
    speed={0.5}
    scanlineFrequency={0}
    warpAmount={0}
  />
</div>
```

---

## 📋 Summary

Total: **35 komponen Background & Effects React Bits** yang dikelompokkan dalam 11 kategori utama:

1. **Liquid & Fluid Effects** (3 komponen) - Liquid Ether, Liquid Chrome, Silk
2. **Color & Gradient Effects** (6 komponen) - Aurora, Iridescence, Color Bends, Gradient Blinds, Plasma, Balatro
3. **Light & Glow Effects** (4 komponen) - Light Pillar, Light Rays, Beams, Orb
4. **Space & Cosmic Effects** (2 komponen) - Galaxy, Hyperspeed
5. **Geometric & 3D Effects** (4 komponen) - Prism, Prismatic Burst, Squares, Ballpit
6. **Grid & Line Effects** (7 komponen) - Grid Scan, Ripple Grid, Dot Grid, Floating Lines, Threads, Grid Distortion, Grid Motion
7. **Particle Effects** (2 komponen) - Particles, Pixel Snow
8. **Pixel & Retro Effects** (4 komponen) - Pixel Blast, Dither, Faulty Terminal, Letter Glitch
9. **Energy & Electric Effects** (1 komponen) - Lightning
10. **Wave Effects** (1 komponen) - Waves
11. **Dark & Atmospheric Effects** (1 komponen) - Dark Veil

Semua komponen menggunakan **pnpm** sebagai package manager dan dilengkapi dengan contoh penggunaan lengkap.

---

**Repository:** React Bits Components Library  
**License:** MIT  
**Documentation:** https://react-bits.dev

# React Bits UI & Layout Components

Dokumentasi lengkap untuk 40 komponen UI & Layout React Bits yang dikelompokkan berdasarkan kategori.

---

## 📋 List & Menu Components

### 1. Animated List
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/AnimatedList-TS-CSS
```

**Usage:**
```jsx
import AnimatedList from './AnimatedList'

const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10']; 
  
<AnimatedList
  items={items}
  onItemSelect={(item, index) => console.log(item, index)}
  showGradients
  enableArrowNavigation
  displayScrollbar
/>
```

---

### 2. Bubble Menu
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/BubbleMenu-TS-CSS
```

**Usage:**
```jsx
import BubbleMenu from './BubbleMenu'

const items = [
  {
    label: 'home',
    href: '#',
    ariaLabel: 'Home',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'about',
    href: '#',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'projects',
    href: '#',
    ariaLabel: 'Projects',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'blog',
    href: '#',
    ariaLabel: 'Blog',
    rotation: 8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
  },
  {
    label: 'contact',
    href: '#',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  }
];

<BubbleMenu
  logo={<span style={{ fontWeight: 700 }}>RB</span>}
  items={items}
  menuAriaLabel="Toggle navigation"
  menuBg="#ffffff"
  menuContentColor="#111111"
  useFixedPosition={false}
  animationEase="back.out(1.5)"
  animationDuration={0.5}
  staggerDelay={0.12}
/>
```

---

### 3. Staggered Menu
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/StaggeredMenu-TS-CSS
```

**Usage:**
```jsx
import StaggeredMenu from './StaggeredMenu';

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Services', ariaLabel: 'View our services', link: '/services' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];

<div style={{ height: '100vh', background: '#1a1a1a' }}>
  <StaggeredMenu
    position="right"
    items={menuItems}
    socialItems={socialItems}
    displaySocials
    displayItemNumbering={true}
    menuButtonColor="#ffffff"
    openMenuButtonColor="#fff"
    changeMenuColorOnOpen={true}
    colors={['#B19EEF', '#5227FF']}
    logoUrl="/path-to-your-logo.svg"
    accentColor="#5227FF"
    onMenuOpen={() => console.log('Menu opened')}
    onMenuClose={() => console.log('Menu closed')}
  />
</div>
```

---

### 4. Gooey Nav
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/GooeyNav-TS-CSS
```

**Usage:**
```jsx
import GooeyNav from './GooeyNav'

// update with your own items
const items = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

<div style={{ height: '600px', position: 'relative' }}>
  <GooeyNav
    items={items}
    particleCount={15}
    particleDistances={[90, 10]}
    particleR={100}
    initialActiveIndex={0}
    animationTime={600}
    timeVariance={300}
    colors={[1, 2, 3, 1, 2, 3, 1, 4]}
  />
</div>
```

---

### 5. Flowing Menu
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/FlowingMenu-TS-CSS
```

**Usage:**
```jsx
import FlowingMenu from './FlowingMenu'

const demoItems = [
  { link: '#', text: 'Mojave', image: 'https://picsum.photos/600/400?random=1' },
  { link: '#', text: 'Sonoma', image: 'https://picsum.photos/600/400?random=2' },
  { link: '#', text: 'Monterey', image: 'https://picsum.photos/600/400?random=3' },
  { link: '#', text: 'Sequoia', image: 'https://picsum.photos/600/400?random=4' }
];

<div style={{ height: '600px', position: 'relative' }}>
  <FlowingMenu 
    items={demoItems}
    speed={15}
    textColor="#ffffff"
    bgColor="#060010"
    marqueeBgColor="#ffffff"
    marqueeTextColor="#060010"
    borderColor="#ffffff"
  />
</div>
```

---

### 6. Infinite Menu
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/InfiniteMenu-TS-CSS
```

**Usage:**
```jsx
import InfiniteMenu from './InfiniteMenu'

const items = [
  {
    image: 'https://picsum.photos/300/300?grayscale',
    link: 'https://google.com/',
    title: 'Item 1',
    description: 'This is pretty cool, right?'
  },
  {
    image: 'https://picsum.photos/400/400?grayscale',
    link: 'https://google.com/',
    title: 'Item 2',
    description: 'This is pretty cool, right?'
  },
  {
    image: 'https://picsum.photos/500/500?grayscale',
    link: 'https://google.com/',
    title: 'Item 3',
    description: 'This is pretty cool, right?'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale',
    link: 'https://google.com/',
    title: 'Item 4',
    description: 'This is pretty cool, right?'
  }
];

<div style={{ height: '600px', position: 'relative' }}>
  <InfiniteMenu 
    items={items}
    scale={1}
  />
</div>
```

---

## 🧭 Navigation Components

### 7. Card Nav
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/CardNav-TS-CSS
```

**Usage:**
```jsx
import CardNav from './CardNav'
import logo from './logo.svg';

const App = () => {
  const items = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Company", ariaLabel: "About Company" },
        { label: "Careers", ariaLabel: "About Careers" }
      ]
    },
    {
      label: "Projects", 
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Featured", ariaLabel: "Featured Projects" },
        { label: "Case Studies", ariaLabel: "Project Case Studies" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us" },
        { label: "Twitter", ariaLabel: "Twitter" },
        { label: "LinkedIn", ariaLabel: "LinkedIn" }
      ]
    }
  ];

  return (
    <CardNav
      logo={logo}
      logoAlt="Company Logo"
      items={items}
      baseColor="#fff"
      menuColor="#000"
      buttonBgColor="#111"
      buttonTextColor="#fff"
      ease="power3.out"
      theme="light"
    />
  );
};
```

---

### 8. Pill Nav
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/PillNav-TS-CSS
```

**Usage:**
```jsx
import PillNav from './PillNav';
import logo from '/path/to/logo.svg';

<PillNav
  logo={logo}
  logoAlt="Company Logo"
  items={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' }
  ]}
  activeHref="/"
  className="custom-nav"
  ease="power2.easeOut"
  baseColor="#000000"
  pillColor="#ffffff"
  hoveredPillTextColor="#ffffff"
  pillTextColor="#000000"
  theme="light"
  initialLoadAnimation={false}
/>
```

---

### 9. Dock
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Dock-TS-CSS
```

**Usage:**
```jsx
import Dock from './Dock';

const items = [
  { icon: <VscHome size={18} />, label: 'Home', onClick: () => alert('Home!') },
  { icon: <VscArchive size={18} />, label: 'Archive', onClick: () => alert('Archive!') },
  { icon: <VscAccount size={18} />, label: 'Profile', onClick: () => alert('Profile!') },
  { icon: <VscSettingsGear size={18} />, label: 'Settings', onClick: () => alert('Settings!') },
];

<Dock 
  items={items}
  panelHeight={68}
  baseItemSize={50}
  magnification={70}
/>
```

---

## 🎴 Card Components

### 10. Magic Bento
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/MagicBento-TS-CSS
```

**Usage:**
```jsx
import MagicBento from './MagicBento'

<MagicBento 
  textAutoHide={true}
  enableStars
  enableSpotlight
  enableBorderGlow={true}
  enableTilt={false}
  enableMagnetism={false}
  clickEffect
  spotlightRadius={400}
  particleCount={12}
  glowColor="132, 0, 255"
  disableAnimations={false}
/>
```

---

### 11. Reflective Card
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ReflectiveCard-TS-CSS
```

**Usage:**
```jsx
import ReflectiveCard from './ReflectiveCard';

<div style={{ height: '600px', position: 'relative' }}>
  <ReflectiveCard
    overlayColor="rgba(0, 0, 0, 0.2)"
    blurStrength={12}
    glassDistortion={30}
    metalness={1}
    roughness={0.75}
    displacementStrength={20}
    noiseScale={1}
    specularConstant={5}
    grayscale={0.15}
    color="#ffffff"
  />
</div>
```

---

### 12. Tilted Card
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/TiltedCard-TS-CSS
```

**Usage:**
```jsx
import TiltedCard from './TiltedCard';

<TiltedCard
  imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
  altText="Kendrick Lamar - GNX Album Cover"
  captionText="Kendrick Lamar - GNX"
  containerHeight="300px"
  containerWidth="300px"
  imageHeight="300px"
  imageWidth="300px"
  rotateAmplitude={12}
  scaleOnHover={1.05}
  showMobileWarning={false}
  showTooltip
  displayOverlayContent
  overlayContent={
    <p className="tilted-card-demo-text">
      Kendrick Lamar - GNX
    </p>
  }
/>
```

---

### 13. Spotlight Card
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/SpotlightCard-TS-CSS
```

**Usage:**
```jsx
import SpotlightCard from './SpotlightCard';
  
<SpotlightCard 
  className="custom-spotlight-card" 
  spotlightColor="rgba(0, 229, 255, 0.2)"
>
  {/* Content goes here */}
</SpotlightCard>
```

---

### 14. Pixel Card
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/PixelCard-TS-CSS
```

**Usage:**
```jsx
import PixelCard from './PixelCard';

<PixelCard variant="pink">
  {/* your card content (use position: absolute) */}
</PixelCard>
```

---

### 15. Decay Card
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/DecayCard-TS-CSS
```

**Usage:**
```jsx
import DecayCard from './DecayCard';

<DecayCard 
  width={200} 
  height={300} 
  image="https://picsum.photos/300/400?grayscale"
>
  <h2>Decay<br/>Card</h2>
</DecayCard>
```

---

### 16. Profile Card
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ProfileCard-TS-CSS
```

**Usage:**
```jsx
import ProfileCard from './ProfileCard'
  
<ProfileCard
  name="Javi A. Torres"
  title="Software Engineer"
  handle="javicodes"
  status="Online"
  contactText="Contact Me"
  avatarUrl="/path/to/avatar.jpg"
  showUserInfo={false}
  enableTilt={true}
  enableMobileTilt={false}
  onContactClick={() => console.log('Contact clicked')}
  showIcon
  showBehindGlow
  behindGlowColor="rgba(125, 190, 255, 0.67)"
  customInnerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
/>
```

---

### 17. Card Swap
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/CardSwap-TS-CSS
```

**Usage:**
```jsx
import CardSwap, { Card } from './CardSwap'

<div style={{ height: '600px', position: 'relative' }}>
  <CardSwap
    cardDistance={60}
    verticalDistance={70}
    delay={5000}
    pauseOnHover={false}
  >
    <Card>
      <h3>Card 1</h3>
      <p>Your content here</p>
    </Card>
    <Card>
      <h3>Card 2</h3>
      <p>Your content here</p>
    </Card>
    <Card>
      <h3>Card 3</h3>
      <p>Your content here</p>
    </Card>
  </CardSwap>
</div>
```

---

### 18. Bounce Cards
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/BounceCards-TS-CSS
```

**Usage:**
```jsx
import BounceCards from './BounceCards'

const images = [
  "https://picsum.photos/400/400?grayscale",
  "https://picsum.photos/500/500?grayscale",
  "https://picsum.photos/600/600?grayscale",
  "https://picsum.photos/700/700?grayscale",
  "https://picsum.photos/300/300?grayscale"
];

const transformStyles = [
  "rotate(5deg) translate(-150px)",
  "rotate(0deg) translate(-70px)",
  "rotate(-5deg)",
  "rotate(5deg) translate(70px)",
  "rotate(-5deg) translate(150px)"
];

<BounceCards
  className="custom-bounceCards"
  images={images}
  containerWidth={500}
  containerHeight={250}
  animationDelay={1}
  animationStagger={0.08}
  easeType="elastic.out(1, 0.5)"
  transformStyles={transformStyles}
  enableHover={false}
/>
```

---

## 🖼️ Gallery & Grid Components

### 19. Circular Gallery
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/CircularGallery-TS-CSS
```

**Usage:**
```jsx
import CircularGallery from './CircularGallery'

<div style={{ height: '600px', position: 'relative' }}>
  <CircularGallery 
    bend={1}
    borderRadius={0.05}
    scrollSpeed={2}
    scrollEase={0.05}
  />
</div>
```

---

### 20. Masonry
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Masonry-TS-CSS
```

**Usage:**
```jsx
import Masonry from './Masonry';

const items = [
  {
    id: "1",
    img: "https://picsum.photos/id/1015/600/900?grayscale",
    url: "https://example.com/one",
    height: 400,
  },
  {
    id: "2",
    img: "https://picsum.photos/id/1011/600/750?grayscale",
    url: "https://example.com/two",
    height: 250,
  },
  {
    id: "3",
    img: "https://picsum.photos/id/1020/600/800?grayscale",
    url: "https://example.com/three",
    height: 600,
  },
  // ... more items
];

<Masonry
  items={items}
  ease="power3.out"
  duration={0.6}
  stagger={0.05}
  animateFrom="bottom"
  scaleOnHover
  hoverScale={0.95}
  blurToFocus
  colorShiftOnHover={false}
/>
```

---

### 21. Dome Gallery
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/DomeGallery-TS-CSS
```

**Usage:**
```jsx
import DomeGallery from './DomeGallery';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <DomeGallery
        fit={0.8}
        minRadius={600}
        maxVerticalRotationDeg={0}
        segments={34}
        dragDampening={2}
        grayscale
      />
    </div>
  );
}
```

---

### 22. Chroma Grid
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ChromaGrid-TS-CSS
```

**Usage:**
```jsx
import ChromaGrid from './ChromaGrid'

const items = [
  {
    image: "https://i.pravatar.cc/300?img=1",
    title: "Sarah Johnson",
    subtitle: "Frontend Developer",
    handle: "@sarahjohnson",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #3B82F6, #000)",
    url: "https://github.com/sarahjohnson"
  },
  {
    image: "https://i.pravatar.cc/300?img=2",
    title: "Mike Chen",
    subtitle: "Backend Engineer",
    handle: "@mikechen",
    borderColor: "#10B981",
    gradient: "linear-gradient(180deg, #10B981, #000)",
    url: "https://linkedin.com/in/mikechen"
  }
];

<div style={{ height: '600px', position: 'relative' }}>
  <ChromaGrid 
    items={items}
    radius={300}
    damping={0.45}
    fadeOut={0.6}
    ease="power3.out"
  />
</div>
```

---

### 23. Flying Posters
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/FlyingPosters-TS-CSS
```

**Usage:**
```jsx
import FlyingPosters from './FlyingPosters'

const items = [
  'https://picsum.photos/500/500?grayscale', 
  'https://picsum.photos/600/600?grayscale', 
  'https://picsum.photos/400/400?grayscale'
];

<div style={{ height: '600px', position: 'relative' }}>
  <FlyingPosters 
    items={items}
    planeWidth={320}
    planeHeight={320}
    distortion={3}
    scrollEase={0.01}
    cameraFov={45}
    cameraZ={20}
  />
</div>
```

---

## 🎠 Slider & Carousel Components

### 24. Stack
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Stack-TS-CSS
```

**Usage:**
```jsx
import Stack from './Stack'

const images = [
  "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format"
];

<div style={{ width: 208, height: 208 }}>
  <Stack
    randomRotation={false}
    sensitivity={200}
    sendToBackOnClick={true}
    cards={images.map((src, i) => (
      <img 
        key={i} 
        src={src} 
        alt={`card-${i + 1}`} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
      />
    ))}
    autoplay={false}
    autoplayDelay={3000}
    pauseOnHover={false}
  />
</div>
```

---

### 25. Carousel
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Carousel-TS-CSS
```

**Usage:**
```jsx
import Carousel from './Carousel'

<div style={{ height: '600px', position: 'relative' }}>
  <Carousel
    baseWidth={300}
    autoplay={false}
    autoplayDelay={3000}
    pauseOnHover={false}
    loop={false}
    round={false}
  />
</div>
```

---

### 26. Elastic Slider
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ElasticSlider-TS-CSS
```

**Usage:**
```jsx
import ElasticSlider from './ElasticSlider'
  
<ElasticSlider
  leftIcon={<>...your icon...</>}
  rightIcon={<>...your icon...</>}
  startingValue={0}
  defaultValue={50}
  maxValue={100}
  isStepped={false}
  stepSize={1}
/>
```

---

## 🎯 Layout & Container Components

### 27. Scroll Stack
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ScrollStack-TS-CSS
```

**Usage:**
```jsx
import ScrollStack, { ScrollStackItem } from './ScrollStack'

<ScrollStack>
  <ScrollStackItem>
    <h2>Card 1</h2>
    <p>This is the first card in the stack</p>
  </ScrollStackItem>
  <ScrollStackItem>
    <h2>Card 2</h2>
    <p>This is the second card in the stack</p>
  </ScrollStackItem>
  <ScrollStackItem>
    <h2>Card 3</h2>
    <p>This is the third card in the stack</p>
  </ScrollStackItem>
</ScrollStack>
```

---

### 28. Glass Surface
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/GlassSurface-TS-CSS
```

**Usage:**
```jsx
import GlassSurface from './GlassSurface'

// Basic usage
<GlassSurface 
  width={300} 
  height={200}
  borderRadius={50}
  className="my-custom-class"
>
  <h2>Glass Surface Content</h2>
</GlassSurface>

// Custom displacement effects
<GlassSurface
  displace={0.5}
  distortionScale={-180}
  redOffset={0}
  greenOffset={10}
  blueOffset={20}
  brightness={50}
  opacity={0.93}
  mixBlendMode="screen"
>
  <span>Advanced Glass Distortion</span>
</GlassSurface>
```

---

### 29. Folder
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Folder-TS-CSS
```

**Usage:**
```jsx
import Folder from './Folder'

<div style={{ height: '600px', position: 'relative' }}>
  <Folder 
    color="#5227FF"
    size={2}
    className="custom-folder"
  />
</div>
```

---

## 🎨 Glass & 3D Effects Components

### 30. Fluid Glass
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/FluidGlass-TS-CSS
```

**Usage:**
```jsx
// IMPORTANT INFO BELOW
// This component requires a 3D model to function correctly.
// You can find three example models in the 'public/assets/3d' directory of the repository:
// - 'lens.glb'
// - 'bar.glb'
// - 'cube.glb'
// Make sure to place these models in the correct directory or update the paths accordingly.

import FluidGlass from './FluidGlass'

<div style={{ height: '600px', position: 'relative' }}>
  <FluidGlass 
    mode="lens" // or "bar", "cube"
    scale={0.25}
    ior={1.15}
    thickness={2}
    transmission={1}
    roughness={0}
    chromaticAberration={0.05}
    anisotropy={0.01}
  />
</div>
```

---

### 31. Glass Icons
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/GlassIcons-TS-CSS
```

**Usage:**
```jsx
import GlassIcons from './GlassIcons'

// update with your own icons and colors
const items = [
  { icon: <FiFileText />, color: 'blue', label: 'Files' },
  { icon: <FiBook />, color: 'purple', label: 'Books' },
  { icon: <FiHeart />, color: 'red', label: 'Health' },
  { icon: <FiCloud />, color: 'indigo', label: 'Weather' },
  { icon: <FiEdit />, color: 'orange', label: 'Notes' },
  { icon: <FiBarChart2 />, color: 'green', label: 'Stats' },
];

<div style={{ height: '600px', position: 'relative' }}>
  <GlassIcons 
    items={items} 
    className="custom-class"
    colorful={false}
  />
</div>
```

---

### 32. Model Viewer
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/ModelViewer-TS-CSS
```

**Usage:**
```jsx
import ModelViewer from './ModelViewer';

<ModelViewer
  url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
  width={400}
  height={400}
  modelXOffset={0.5}
  modelYOffset={0}
  enableMouseParallax
  enableHoverRotation
  environmentPreset="forest"
  fadeIn={false}
  autoRotate={false}
  autoRotateSpeed={0.35}
  showScreenshotButton
/>
```

---

### 33. Lanyard
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Lanyard-TS-CSS
```

**Usage:**
```jsx
import Lanyard from './Lanyard'

<Lanyard 
  position={[0, 0, 24]}
  gravity={[0, -40, 0]}
/>

/* IMPORTANT INFO BELOW

1. You MUST have the card.glb and lanyard.png files in your project and import them
   - these can be downloaded from the repo's files, under src/assets/lanyard

2. You can edit your card.glb file in this online .glb editor and change the texture:
   - https://modelviewer.dev/editor/

3. The png file is the texture for the lanyard's band and can be edited in any image editor

4. Your Vite configuration must be updated to include the following in vite.config.js:
   assetsInclude: ['**/*.glb']

5. For TS users, you might need these changes:

- src/global.d.ts
export { };

declare module '*.glb';
declare module '*.png';

declare module 'meshline' {
  export const MeshLineGeometry: any;
  export const MeshLineMaterial: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}

- src/vite-env.d.ts
/// <reference types="vite/client" />
declare module '*.glb';
declare module '*.png';
*/
```

---

## 🎮 Interactive UI Components

### 34. Counter
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Counter-TS-CSS
```

**Usage:**
```jsx
import Counter from './Counter';

<Counter
  value={1}
  places={[100, 10, 1]}
  fontSize={80}
  padding={5}
  gap={10}
  textColor="white"
  fontWeight={900}
  digitPlaceHolders
/>
```

---

### 35. Stepper
**Install:**
```bash
pnpm dlx shadcn@latest add @react-bits/Stepper-TS-CSS
```

**Usage:**
```jsx
import Stepper, { Step } from './Stepper';
  
<Stepper
  initialStep={1}
  onStepChange={(step) => {
    console.log(step);
  }}
  onFinalStepCompleted={() => console.log("All steps completed!")}
  backButtonText="Previous"
  nextButtonText="Next"
>
  <Step>
    <h2>Welcome to the React Bits stepper!</h2>
    <p>Check out the next step!</p>
  </Step>
  <Step>
    <h2>Step 2</h2>
    <img 
      style={{ 
        height: '100px', 
        width: '100%', 
        objectFit: 'cover', 
        objectPosition: 'center -70px', 
        borderRadius: '15px', 
        marginTop: '1em' 
      }} 
      src="https://www.purrfectcatgifts.co.uk/cdn/shop/collections/Funny_Cat_Cards_640x640.png?v=1663150894" 
    />
    <p>Custom step content!</p>
  </Step>
  <Step>
    <h2>How about an input?</h2>
    <input 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
      placeholder="Your name?" 
    />
  </Step>
  <Step>
    <h2>Final Step</h2>
    <p>You made it!</p>
  </Step>
</Stepper>
```

---

## 📋 Summary

Total: **35 komponen UI & Layout React Bits** yang dikelompokkan dalam 8 kategori utama:

1. **List & Menu Components** (6 komponen) - Animated List, Bubble Menu, Staggered Menu, Gooey Nav, Flowing Menu, Infinite Menu
2. **Navigation Components** (3 komponen) - Card Nav, Pill Nav, Dock
3. **Card Components** (9 komponen) - Magic Bento, Reflective Card, Tilted Card, Spotlight Card, Pixel Card, Decay Card, Profile Card, Card Swap, Bounce Cards
4. **Gallery & Grid Components** (5 komponen) - Circular Gallery, Masonry, Dome Gallery, Chroma Grid, Flying Posters
5. **Slider & Carousel Components** (3 komponen) - Stack, Carousel, Elastic Slider
6. **Layout & Container Components** (3 komponen) - Scroll Stack, Glass Surface, Folder
7. **Glass & 3D Effects Components** (4 komponen) - Fluid Glass, Glass Icons, Model Viewer, Lanyard
8. **Interactive UI Components** (2 komponen) - Counter, Stepper

Semua komponen menggunakan **pnpm** sebagai package manager dan dilengkapi dengan contoh penggunaan lengkap.

---

**Repository:** React Bits Components Library  
**License:** MIT  
**Documentation:** https://react-bits.dev

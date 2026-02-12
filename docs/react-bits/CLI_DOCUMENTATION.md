# 🚀 YourName UI - CLI Documentation

> Production-ready React components with one command. Support for npm, yarn, pnpm, and bun.

[![NPM Version](https://img.shields.io/npm/v/yourname-ui.svg)](https://www.npmjs.com/package/yourname-ui)
[![Downloads](https://img.shields.io/npm/dm/yourname-ui.svg)](https://www.npmjs.com/package/yourname-ui)
[![License](https://img.shields.io/npm/l/yourname-ui.svg)](https://github.com/yourname/yourname-ui/blob/main/LICENSE)

---

## 📦 Installation

### Quick Start

```bash
# NPM
npx yourname-ui@latest add hero-01

# Yarn
yarn dlx yourname-ui@latest add hero-01

# PNPM
pnpm dlx yourname-ui@latest add hero-01

# Bun
bunx yourname-ui@latest add hero-01
```

### Global Installation (Optional)

```bash
# NPM
npm install -g yourname-ui

# Yarn
yarn global add yourname-ui

# PNPM
pnpm add -g yourname-ui

# Bun
bun add -g yourname-ui
```

After global installation:
```bash
yourname-ui add hero-01
```

---

## 🎯 Commands

### `add` - Add Components

Install one or multiple components to your project.

**Syntax:**
```bash
yourname-ui add <component-name>
```

**Examples:**

```bash
# Single component
npx yourname-ui add hero-01

# Multiple components
npx yourname-ui add hero-01 pricing-07 footer-03

# All components from a category
npx yourname-ui add --category hero

# Interactive mode
npx yourname-ui add
```

**Options:**
- `--path <path>` - Custom installation path (default: `components/`)
- `--overwrite` - Overwrite existing files
- `--yes` - Skip confirmation prompts
- `--category <name>` - Install all components from category

**Examples with Options:**

```bash
# Custom path
npx yourname-ui add hero-01 --path src/components/blocks

# Overwrite mode
npx yourname-ui add hero-01 --overwrite

# Skip prompts
npx yourname-ui add hero-01 --yes

# All heroes
npx yourname-ui add --category hero
```

---

### `init` - Initialize Project

Set up yourname-ui in your project.

**Syntax:**
```bash
yourname-ui init
```

**What it does:**
1. Detects your framework (Next.js, Vite, etc.)
2. Installs required dependencies
3. Sets up configuration files
4. Creates component directories
5. Adds Tailwind CSS config (if needed)

**Interactive prompts:**

```bash
? Which framework are you using?
  ❯ Next.js
    Vite
    Create React App
    Remix
    Astro

? Which package manager?
  ❯ npm
    yarn
    pnpm
    bun

? Where to install components?
  ❯ components/
    src/components/
    app/components/
    Custom path

? Install TypeScript types? (Y/n) Y

✅ Initialized yourname-ui successfully!
```

**Options:**
- `--force` - Force initialization (overwrite existing config)
- `--yes` - Use default settings
- `--typescript` - Enable TypeScript support

---

### `list` - List Available Components

View all available components or filter by category.

**Syntax:**
```bash
yourname-ui list [category]
```

**Examples:**

```bash
# List all components
npx yourname-ui list

# List by category
npx yourname-ui list hero
npx yourname-ui list pricing
npx yourname-ui list footer

# List with details
npx yourname-ui list --details

# List installed components
npx yourname-ui list --installed
```

**Output Example:**

```bash
📦 Available Components (1000 total)

🎯 Hero Sections (175)
  hero-01          Simple hero with CTA
  hero-02          Video background hero
  hero-03          Animated gradient hero
  hero-04          3D parallax hero
  ...

💰 Pricing Tables (150)
  pricing-01       Simple pricing cards
  pricing-02       Comparison table
  pricing-03       Toggle annual/monthly
  ...

⭐ Testimonials (120)
  testimonial-01   Grid layout
  testimonial-02   Carousel slider
  testimonial-03   Video testimonials
  ...

Use: yourname-ui add <component-name>
```

**Options:**
- `--details` - Show component descriptions
- `--installed` - Show only installed components
- `--json` - Output in JSON format

---

### `remove` - Remove Components

Uninstall components from your project.

**Syntax:**
```bash
yourname-ui remove <component-name>
```

**Examples:**

```bash
# Remove single component
npx yourname-ui remove hero-01

# Remove multiple components
npx yourname-ui remove hero-01 pricing-07

# Remove with confirmation
npx yourname-ui remove hero-01 --yes
```

**Options:**
- `--yes` - Skip confirmation
- `--force` - Force removal (ignore dependencies)

---

### `update` - Update Components

Update installed components to latest versions.

**Syntax:**
```bash
yourname-ui update [component-name]
```

**Examples:**

```bash
# Update all components
npx yourname-ui update

# Update specific component
npx yourname-ui update hero-01

# Check for updates (dry-run)
npx yourname-ui update --check

# Update with changelog
npx yourname-ui update --changelog
```

**Output Example:**

```bash
🔍 Checking for updates...

📦 Updates available:
  hero-01       v1.2.0 → v1.3.0  (Bug fixes, performance)
  pricing-07    v2.0.0 → v2.1.0  (New variants)
  footer-03     v1.5.0 → v1.6.0  (Accessibility improvements)

? Update all? (Y/n) Y

✨ Updating hero-01...
✨ Updating pricing-07...
✨ Updating footer-03...

✅ Updated 3 components successfully!
```

**Options:**
- `--check` - Check for updates without installing
- `--changelog` - Show changelog for each update
- `--yes` - Update without confirmation

---

### `diff` - Show Component Changes

View differences between installed and latest versions.

**Syntax:**
```bash
yourname-ui diff <component-name>
```

**Examples:**

```bash
# Show diff for component
npx yourname-ui diff hero-01

# Show diff with line numbers
npx yourname-ui diff hero-01 --line-numbers

# Export diff to file
npx yourname-ui diff hero-01 > changes.diff
```

---

### `search` - Search Components

Search components by name, description, or tags.

**Syntax:**
```bash
yourname-ui search <query>
```

**Examples:**

```bash
# Search by name
npx yourname-ui search hero

# Search by feature
npx yourname-ui search "video background"

# Search by tag
npx yourname-ui search animation

# Advanced search
npx yourname-ui search video --category hero --tag animation
```

**Options:**
- `--category <name>` - Filter by category
- `--tag <tag>` - Filter by tag
- `--limit <number>` - Limit results

---

### `info` - Component Information

Get detailed information about a component.

**Syntax:**
```bash
yourname-ui info <component-name>
```

**Example:**

```bash
npx yourname-ui info hero-01
```

**Output:**

```bash
📦 hero-01 v1.3.0

Description:
  Simple hero section with CTA buttons and optional image

Features:
  • Responsive design
  • Dark mode support
  • Customizable colors
  • Animation on scroll
  • Accessible (WCAG AA)

Dependencies:
  • framer-motion ^11.0.0
  • lucide-react ^0.263.0

Files:
  • components/blocks/hero-01.tsx (4.2 KB)
  • components/blocks/hero-01.css (1.1 KB)

Tags:
  hero, landing, cta, animation

Install:
  npx yourname-ui add hero-01

Preview:
  https://yourdomain.com/blocks/hero-01
```

---

### `doctor` - Diagnose Issues

Check your project setup and fix common issues.

**Syntax:**
```bash
yourname-ui doctor
```

**What it checks:**
1. Dependencies installed correctly
2. Configuration files valid
3. Component paths accessible
4. TypeScript configuration
5. Tailwind CSS setup
6. Conflicting packages

**Example Output:**

```bash
🔍 Running diagnostics...

✅ Dependencies installed
✅ Configuration valid
✅ Component paths accessible
⚠️  TypeScript types missing
❌ Tailwind CSS not configured

Fixing issues...

✅ Installed @types/react
✅ Added Tailwind config

🎉 All issues resolved!
```

**Options:**
- `--fix` - Auto-fix issues
- `--verbose` - Show detailed output

---

## 📚 Component Categories

### 🎯 Hero Sections (175 components)
Landing page headers with CTAs, images, videos, and animations.

```bash
# Examples
yourname-ui add hero-01    # Simple with CTA
yourname-ui add hero-02    # Video background
yourname-ui add hero-03    # Animated gradient
yourname-ui add hero-04    # 3D parallax
yourname-ui add hero-05    # Split screen
```

### 💰 Pricing Tables (150 components)
Pricing cards, comparison tables, subscription plans.

```bash
# Examples
yourname-ui add pricing-01    # Simple cards
yourname-ui add pricing-02    # Comparison table
yourname-ui add pricing-03    # Toggle annual/monthly
yourname-ui add pricing-04    # Feature comparison
yourname-ui add pricing-05    # Tiered pricing
```

### ⭐ Testimonials (120 components)
Customer reviews, ratings, and social proof.

```bash
# Examples
yourname-ui add testimonial-01    # Grid layout
yourname-ui add testimonial-02    # Carousel
yourname-ui add testimonial-03    # Video testimonials
yourname-ui add testimonial-04    # Avatar wall
yourname-ui add testimonial-05    # Quote cards
```

### 🎨 Feature Sections (200 components)
Product features, benefits, and highlights.

```bash
# Examples
yourname-ui add feature-01    # Icon grid
yourname-ui add feature-02    # Alternating layout
yourname-ui add feature-03    # Bento grid
yourname-ui add feature-04    # Tabs interface
yourname-ui add feature-05    # Timeline
```

### 📝 Contact Forms (80 components)
Contact forms, newsletter signups, waitlists.

```bash
# Examples
yourname-ui add contact-01    # Simple form
yourname-ui add contact-02    # With map
yourname-ui add contact-03    # Multi-step
yourname-ui add contact-04    # Newsletter
yourname-ui add contact-05    # Waitlist
```

### 🔗 Navigation (100 components)
Headers, navbars, menus, and breadcrumbs.

```bash
# Examples
yourname-ui add navbar-01    # Simple header
yourname-ui add navbar-02    # Mega menu
yourname-ui add navbar-03    # Mobile friendly
yourname-ui add navbar-04    # Sticky header
yourname-ui add navbar-05    # With search
```

### 📦 Footer (75 components)
Page footers with links, social icons, and CTAs.

```bash
# Examples
yourname-ui add footer-01    # Simple footer
yourname-ui add footer-02    # Multi-column
yourname-ui add footer-03    # Newsletter signup
yourname-ui add footer-04    # App download
yourname-ui add footer-05    # Minimal
```

### 🖼️ Gallery (100 components)
Image galleries, portfolios, and media displays.

```bash
# Examples
yourname-ui add gallery-01    # Masonry grid
yourname-ui add gallery-02    # Lightbox
yourname-ui add gallery-03    # Carousel
yourname-ui add gallery-04    # Filterable
yourname-ui add gallery-05    # Full screen
```

---

## 🛠️ Package Manager Support

### NPM

```bash
# One-time usage
npx yourname-ui@latest add hero-01

# Global install
npm install -g yourname-ui
yourname-ui add hero-01

# Project dependency
npm install --save-dev yourname-ui
npx yourname-ui add hero-01
```

### Yarn

```bash
# One-time usage (Yarn 2+)
yarn dlx yourname-ui@latest add hero-01

# Global install
yarn global add yourname-ui
yourname-ui add hero-01

# Project dependency
yarn add -D yourname-ui
yarn yourname-ui add hero-01
```

### PNPM

```bash
# One-time usage
pnpm dlx yourname-ui@latest add hero-01

# Global install
pnpm add -g yourname-ui
yourname-ui add hero-01

# Project dependency
pnpm add -D yourname-ui
pnpm yourname-ui add hero-01
```

### Bun

```bash
# One-time usage
bunx yourname-ui@latest add hero-01

# Global install
bun add -g yourname-ui
yourname-ui add hero-01

# Project dependency
bun add -d yourname-ui
bunx yourname-ui add hero-01
```

---

## 🎨 Configuration

### Config File: `yourname-ui.json`

Created automatically with `yourname-ui init`.

```json
{
  "$schema": "https://yourdomain.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**Options:**

- `style` - Component style variant (`default`, `new-york`, `miami`)
- `rsc` - React Server Components mode
- `tsx` - Use TypeScript
- `tailwind.config` - Path to Tailwind config
- `tailwind.css` - Path to global CSS
- `tailwind.baseColor` - Base color scheme
- `tailwind.cssVariables` - Use CSS variables
- `aliases` - Import path aliases

### Environment Variables

```bash
# .env.local

# Custom registry URL (for self-hosted)
YOURNAME_UI_REGISTRY_URL=https://custom-registry.com

# API key for Pro features
YOURNAME_UI_API_KEY=your_api_key_here

# Disable telemetry
YOURNAME_UI_TELEMETRY=false
```

---

## 🚀 Advanced Usage

### Creating Templates

Combine multiple components into reusable templates.

```bash
# Create template from components
yourname-ui template create saas-landing \
  --components hero-01,feature-03,pricing-07,testimonial-02,footer-01

# Install template
yourname-ui template add saas-landing

# List templates
yourname-ui template list
```

### Custom Registry

Use your own component registry.

```bash
# Set custom registry
yourname-ui config set registry https://your-registry.com

# Add component from custom registry
yourname-ui add custom-hero-01

# Reset to default registry
yourname-ui config set registry https://registry.yourdomain.com
```

### Workspace Support (Monorepo)

```bash
# Install in specific workspace
yourname-ui add hero-01 --workspace packages/web

# Install in all workspaces
yourname-ui add hero-01 --all-workspaces

# List components per workspace
yourname-ui list --workspace packages/web
```

### Component Variants

Many components have multiple variants.

```bash
# Add specific variant
yourname-ui add hero-01:dark
yourname-ui add hero-01:minimal
yourname-ui add hero-01:animated

# List variants
yourname-ui info hero-01 --variants

# Add all variants
yourname-ui add hero-01:*
```

---

## 🔧 Troubleshooting

### Common Issues

**1. Command not found**

```bash
# Make sure you're using the latest version
npx yourname-ui@latest add hero-01

# Or install globally
npm install -g yourname-ui@latest
```

**2. Permission denied**

```bash
# Use sudo (not recommended)
sudo npm install -g yourname-ui

# Or use npx (recommended)
npx yourname-ui@latest add hero-01
```

**3. Component not found**

```bash
# Check spelling
yourname-ui list hero

# Update CLI
npm update -g yourname-ui

# Clear cache
yourname-ui cache clear
```

**4. Dependency conflicts**

```bash
# Run doctor
yourname-ui doctor --fix

# Manual fix
npm install framer-motion@latest
```

**5. TypeScript errors**

```bash
# Install types
npm install -D @types/react @types/react-dom

# Run doctor
yourname-ui doctor --fix
```

### Debug Mode

Enable verbose logging:

```bash
# Set environment variable
DEBUG=yourname-ui:* yourname-ui add hero-01

# Or use flag
yourname-ui add hero-01 --debug
```

### Clear Cache

```bash
# Clear component cache
yourname-ui cache clear

# Clear all data
yourname-ui cache clear --all
```

---

## 📖 Examples

### Example 1: Create Landing Page

```bash
# Initialize project
npx create-next-app my-landing --typescript
cd my-landing

# Initialize yourname-ui
npx yourname-ui init

# Add components
npx yourname-ui add hero-01 feature-03 pricing-07 testimonial-02 footer-01

# Start dev server
npm run dev
```

### Example 2: Monorepo Setup

```bash
# packages/web/package.json
{
  "scripts": {
    "ui:add": "yourname-ui add",
    "ui:list": "yourname-ui list",
    "ui:update": "yourname-ui update"
  }
}

# Usage
pnpm --filter web ui:add hero-01
```

### Example 3: Custom Installation Path

```bash
# Install to custom path
npx yourname-ui add hero-01 --path src/ui/blocks

# Update config for custom path
{
  "aliases": {
    "components": "@/ui",
    "blocks": "@/ui/blocks"
  }
}
```

### Example 4: Batch Install

```bash
# Install multiple components
npx yourname-ui add \
  hero-01 \
  hero-02 \
  feature-01 \
  feature-02 \
  pricing-01 \
  testimonial-01 \
  footer-01

# Or from file
npx yourname-ui add --file components.txt
```

**components.txt:**
```
hero-01
feature-01
pricing-01
testimonial-01
footer-01
```

---

## 🎓 Best Practices

### 1. Version Control

```bash
# Commit yourname-ui.json
git add yourname-ui.json
git commit -m "Add yourname-ui config"

# Don't commit node_modules
echo "node_modules" >> .gitignore
```

### 2. Component Organization

```
src/
├── components/
│   ├── blocks/          # yourname-ui blocks
│   │   ├── hero-01.tsx
│   │   ├── pricing-07.tsx
│   │   └── footer-01.tsx
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   └── input.tsx
│   └── custom/          # Your custom components
│       └── header.tsx
```

### 3. Customization Strategy

```tsx
// ❌ Don't modify original component
// components/blocks/hero-01.tsx

// ✅ Extend or wrap component
// components/custom/my-hero.tsx
import Hero01 from '@/components/blocks/hero-01';

export function MyHero() {
  return (
    <Hero01 
      title="Custom Title"
      className="custom-styles"
    />
  );
}
```

### 4. Update Strategy

```bash
# Check for updates monthly
yourname-ui update --check

# Review changelog before updating
yourname-ui update --changelog

# Test after updating
npm run build
npm run test
```

### 5. Performance

```tsx
// ✅ Lazy load heavy components
import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/blocks/hero-video'), {
  loading: () => <HeroSkeleton />
});
```

---

## 🔗 Links

- **Website:** https://yourdomain.com
- **Documentation:** https://docs.yourdomain.com
- **GitHub:** https://github.com/yourname/yourname-ui
- **NPM:** https://www.npmjs.com/package/yourname-ui
- **Discord:** https://discord.gg/yourname-ui
- **Twitter:** https://twitter.com/yourname_ui

---

## 📝 License

MIT © [Your Name](https://yourdomain.com)

---

## 🤝 Support

Need help?

- 📧 Email: support@yourdomain.com
- 💬 Discord: https://discord.gg/yourname-ui
- 🐦 Twitter: [@yourname_ui](https://twitter.com/yourname_ui)
- 📚 Docs: https://docs.yourdomain.com

---

**Built with ❤️ by developers, for developers.**

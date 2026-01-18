# 🗺️ Landing Page Builder - Roadmap & Architecture

**Last Updated:** 2026-01-18
**Status:** Post variant→blocks Migration
**Next Phase:** Numbering System + Thumbnail Previews

---

## 📖 Table of Contents

1. [Current State](#current-state)
2. [Migration History](#migration-history)
3. [Future Roadmap](#future-roadmap)
4. [Naming Convention Evolution](#naming-convention-evolution)
5. [Technical Architecture](#technical-architecture)

---

## 🎯 Current State

### Terminology: **BLOCKS** (v2.0)
```typescript
// Current naming (Descriptive)
hero: {
  block: "gradient-overlay"  // ✅ Current
  block: "centered-minimal"
  block: "split-screen"
}
```

### UI Components
- ✅ **BlockSidebar** - Icon-based list (Framer-style)
- ✅ **Block Types** - 15 blocks per section (90 total)
- ✅ **Icons** - lucide-react icons only

### Database
- **Storage:** JSONB field `landingConfig`
- **Key:** `block` (not `variant`)
- **Schema:** No changes needed for future migrations

---

## 📚 Migration History

### Phase 1: Initial System
```
variant → block (terminology only)
```
**Date:** 2026-01-18
**Reason:** Align with shadcn/blocks naming convention

**Changes:**
- ✅ Renamed `variant` → `block` (full stack)
- ✅ Renamed folder: `variants/` → `blocks/`
- ✅ Updated all types: `HeroVariant` → `HeroBlock`
- ✅ Migration script created (then removed - nuclear mode)

**Commits:**
- `bf20a25` - feat: Complete variant→blocks migration (full stack)
- `474e3af` - feat: Add variant→block data migration script
- `b60a3cf` - fix: Replace non-existent Tabs icon with Tags
- `85cb27a` - chore: Remove migration script (pure nuclear mode)

---

## 🚀 Future Roadmap

### Phase 2: Numbering System (NEXT)

**Target:** Q1 2026
**Inspired by:** [shadcnblocks.com](https://www.shadcnblocks.com/)

#### 🎯 Why Numbering?

**Current Problem (Descriptive Names):**
- ❌ **Taksonomi terlalu panjang** - "gradient-overlay", "centered-minimal"
- ❌ **Ribet bikin judul & deskripsi** - Harus mikir naming yang semantik
- ❌ **Tidak scalable** - Susah manage 50+ blocks per section
- ❌ **Icon-based UI** - Sulit visualize tanpa preview

**Solution (Numbering):**
- ✅ **Simple & Pragmatic** - `hero1`, `hero2`, `hero3`
- ✅ **Auto-generated** - Tinggal tambah nomor, no naming hell
- ✅ **Infinite scalability** - `hero1` sampai `hero999+`
- ✅ **Thumbnail-based** - Preview langsung keliatan

#### 🏗️ New System Structure

```typescript
// FROM (Current - Descriptive)
hero: {
  block: "gradient-overlay"  // ❌ Panjang, perlu deskripsi
}

// TO (Future - Numbering)
hero: {
  block: "hero1"  // ✅ Simple, thumbnail explains itself
}
```

#### 📦 Database Changes (Minor)

**Migration:** Super simple, just rename values
```sql
-- Example migration
UPDATE "Tenant"
SET "landingConfig" = jsonb_set(
  "landingConfig",
  '{hero,block}',
  '"hero1"'
)
WHERE "landingConfig"->'hero'->>'block' = 'gradient-overlay';
```

**Impact:** ✅ JSONB structure unchanged, only values different

---

## 🎨 UI/UX Revolution: Canva-Style Grid

### Current UI (Icon List)
```
┌─────────────────────────────┐
│  🎨 Choose Block Style      │
├─────────────────────────────┤
│  [Icon] Gradient Overlay    │
│  [Icon] Centered Minimal    │
│  [Icon] Split Screen        │
│  [Icon] Video Background    │
│  ...                        │
└─────────────────────────────┘
```

**Problems:**
- ❌ Icons don't show actual design
- ❌ List format = hard to compare
- ❌ No visual preview

### Future UI (Thumbnail Grid) ⭐

```
┌─────────────────────────────────────────┐
│  🎨 Choose Hero Block                   │
├─────────────────────────────────────────┤
│  ┌────────┐  ┌────────┐                │
│  │[THUMB] │  │[THUMB] │                │
│  │ hero1  │  │ hero2  │                │
│  └────────┘  └────────┘                │
│                                         │
│  ┌────────┐  ┌────────┐                │
│  │[THUMB] │  │[THUMB] │                │
│  │ hero3  │  │ hero4  │                │
│  └────────┘  └────────┘                │
│                                         │
│  ┌────────┐  ┌────────┐                │
│  │[THUMB] │  │[THUMB] │                │
│  │ hero5  │  │ hero6  │                │
│  └────────┘  └────────┘                │
└─────────────────────────────────────────┘
```

**Benefits:**
- ✅ **Visual preview** - See actual design before clicking
- ✅ **Grid layout** - 2 columns, easier to compare
- ✅ **Canva-style** - Professional, familiar UX
- ✅ **Faster selection** - Click thumbnail, done!

---

## 🔧 Technical Implementation Plan

### Step 1: Thumbnail Generation System

**Options:**

#### Option A: Static Screenshots (Recommended)
```
public/
  blocks/
    hero/
      hero1.jpg     ← Screenshot of actual block
      hero2.jpg
      hero3.jpg
    about/
      about1.jpg
      about2.jpg
```

**Pros:**
- Fast loading
- No runtime overhead
- Easy to manage

**Cons:**
- Manual screenshot process
- Need update when design changes

#### Option B: Dynamic Rendering (Future)
```typescript
// Use puppeteer or similar
async function generateThumbnail(blockId: string) {
  const screenshot = await renderBlock(blockId);
  return screenshot;
}
```

**Pros:**
- Auto-update when design changes
- Always accurate

**Cons:**
- Slower
- More complex
- Server overhead

### Step 2: BlockSidebar Component Refactor

**Current:** `client/src/components/landing-builder/block-sidebar.tsx`

```typescript
// CURRENT (Icon List)
interface BlockOption {
  value: string;
  label: string;
  description: string;
  icon: any;  // ❌ Icons
}

// FUTURE (Thumbnail Grid)
interface BlockOption {
  value: string;      // "hero1", "hero2"
  thumbnail: string;  // "/blocks/hero/hero1.jpg"
  title?: string;     // Optional short title
}
```

**New Layout:**
```tsx
// Grid: 2 columns
<div className="grid grid-cols-2 gap-4 p-4">
  {blocks.map((block) => (
    <Card
      key={block.value}
      onClick={() => onBlockSelect(block.value)}
      className="cursor-pointer hover:ring-2"
    >
      <CardContent className="p-0">
        <img
          src={block.thumbnail}
          alt={block.value}
          className="w-full h-32 object-cover rounded-t"
        />
        <div className="p-2 text-center text-sm font-medium">
          {block.value}
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

### Step 3: Data Migration Script

**File:** `server/src/migrations/descriptive-to-numbering.migration.ts`

```typescript
// Mapping old names → new numbers
const HERO_MAPPING = {
  'gradient-overlay': 'hero1',
  'centered-minimal': 'hero2',
  'split-screen': 'hero3',
  'video-background': 'hero4',
  'parallax': 'hero5',
  'animated-gradient': 'hero6',
  'glass-morphism': 'hero7',
  // ... etc
};

const ABOUT_MAPPING = {
  'side-by-side': 'about1',
  'centered': 'about2',
  'timeline': 'about3',
  // ... etc
};

// Migration logic same as variant→block
```

### Step 4: Type System Update

**File:** `client/src/types/landing.ts`

```typescript
// FROM
export type HeroBlock =
  | 'default'
  | 'gradient-overlay'
  | 'centered-minimal'
  | 'split-screen'
  // ...

// TO
export type HeroBlock =
  | 'hero1'
  | 'hero2'
  | 'hero3'
  | 'hero4'
  | 'hero5'
  | 'hero6'
  | 'hero7'
  | 'hero8'
  | 'hero9'
  | 'hero10'
  | 'hero11'
  | 'hero12'
  | 'hero13'
  | 'hero14'
  | 'hero15';

// Same for AboutBlock, ProductsBlock, etc.
```

### Step 5: Block Component Files

**Keep filenames semantic for developers:**
```
client/src/components/landing/blocks/hero/
  hero-gradient-overlay.tsx  ← File stays descriptive
  hero-centered-minimal.tsx
  hero-split-screen.tsx
```

**But export with numbers:**
```typescript
// blocks/hero/index.ts
export { HeroGradientOverlay as Hero1 } from './hero-gradient-overlay';
export { HeroCenteredMinimal as Hero2 } from './hero-centered-minimal';
export { HeroSplitScreen as Hero3 } from './hero-split-screen';
// ...
```

**Render component:**
```typescript
// tenant-hero.tsx
const block = config?.block || 'hero1';

switch (block) {
  case 'hero1':
    return <Hero1 {...props} />;
  case 'hero2':
    return <Hero2 {...props} />;
  case 'hero3':
    return <Hero3 {...props} />;
  // ...
}
```

---

## 📊 Comparison: Current vs Future

| Aspect | Current (Descriptive) | Future (Numbering) |
|--------|----------------------|---------------------|
| **Naming** | `gradient-overlay` | `hero1` |
| **Scalability** | Hard (naming fatigue) | Easy (just increment) |
| **UI Preview** | Icons only | Thumbnails |
| **Layout** | Vertical list | 2-column grid |
| **Management** | Manual descriptions | Auto-generated |
| **User Experience** | Text-heavy | Visual-first |
| **Developer DX** | Descriptive files | Numbered exports |

---

## 🎯 Naming Convention Evolution

### Timeline

```
v1.0 (Jan 2026) - "variant" era
  ├── hero.variant = "gradient-overlay"
  └── Descriptive names

v2.0 (Jan 2026) - "blocks" era ✅ CURRENT
  ├── hero.block = "gradient-overlay"
  └── Still descriptive, just renamed

v3.0 (Q1 2026) - "numbering" era 🎯 PLANNED
  ├── hero.block = "hero1"
  └── Number-based, thumbnail previews
```

### Why This Evolution?

**v1 → v2:** Terminology alignment with industry (shadcn/blocks)
**v2 → v3:** Pragmatic simplification + Better UX

---

## 🛠️ Migration Strategy

### When to Migrate?

**Triggers:**
1. ✅ When block count > 20 per section (hard to manage names)
2. ✅ When users complain about preview (icons not enough)
3. ✅ When design team has thumbnail assets ready
4. ✅ When competitor analysis shows grid > list

### Migration Approach

**Option A: Big Bang** (Recommended for pre-launch)
- One-time migration
- All blocks renamed at once
- Clean break, fresh start

**Option B: Gradual** (If already in production)
- Support both systems (dual mode)
- Migrate section by section
- Backwards compatible

**Current Status:** Pre-launch → Use **Option A**

---

## 📁 Folder Structure (Future)

```
client/src/
  components/
    landing-builder/
      block-sidebar.tsx          ← Refactor to grid layout
      block-thumbnail-card.tsx   ← NEW: Card component
    landing/
      blocks/                    ← Keep folder name
        hero/
          hero-gradient-overlay.tsx  ← Keep semantic filenames
          hero-centered-minimal.tsx
          index.ts               ← Export as Hero1, Hero2, etc.
        about/
        products/
        testimonials/
        contact/
        cta/

public/
  blocks/                        ← NEW: Thumbnail storage
    hero/
      hero1.jpg
      hero2.jpg
      ...
    about/
      about1.jpg
      about2.jpg
      ...
```

---

## 🎨 Design System Reference

**Inspiration:** [shadcnblocks.com](https://www.shadcnblocks.com/)

**What we love:**
- ✅ Simple numbering (hero1, hero2, hero3)
- ✅ Clean thumbnail grid
- ✅ Hover preview
- ✅ Copy code button
- ✅ Category filters

**What we'll adapt:**
- Grid layout (2 columns for sidebar)
- Thumbnail quality (16:9 ratio, 300x169px)
- Hover effects
- Click to select (no "Copy" button, direct insert)

---

## 🔮 Future Features (Beyond Numbering)

### Phase 3: Advanced Features
- [ ] **Live Preview** - Hover thumbnail → see full preview
- [ ] **Categories** - Filter by style (Modern, Classic, Minimal)
- [ ] **Tags** - #gradient, #minimal, #video
- [ ] **Search** - Quick find by keyword
- [ ] **Favorites** - Save preferred blocks
- [ ] **Recent** - Show recently used blocks

### Phase 4: Pro Features
- [ ] **Custom Blocks** - User-uploaded designs
- [ ] **AI Generation** - Generate block from description
- [ ] **A/B Testing** - Test multiple blocks
- [ ] **Analytics** - Which blocks convert best

---

## 🚦 Status Tracking

### Completed ✅
- [x] variant → blocks migration
- [x] BlockSidebar component (icon-based)
- [x] 15 blocks per section (90 total)
- [x] Type system (HeroBlock, AboutBlock, etc.)
- [x] Full stack sync (server + client)

### In Progress 🔄
- [ ] Thumbnail generation (design team)
- [ ] Grid layout prototype
- [ ] Numbering system planning

### Planned 📅
- [ ] Migration script (descriptive → numbering)
- [ ] Thumbnail storage setup
- [ ] BlockSidebar grid refactor
- [ ] Type system update (hero1, hero2, etc.)
- [ ] Component export mapping

---

## 📝 Notes for Future Developer

**When implementing numbering system:**

1. **Keep it simple** - `hero1`, `hero2`, no fancy names
2. **Thumbnails first** - Generate ALL thumbnails before migrating
3. **Test thoroughly** - Preview every single block works
4. **Document mapping** - Keep old name → new number reference
5. **Migrate data** - Don't forget existing tenants!

**Don't:**
- ❌ Mix numbering with descriptions (`hero1-gradient` ← bad!)
- ❌ Skip thumbnails (defeats the purpose)
- ❌ Forget to update validators
- ❌ Break existing data

**Do:**
- ✅ Use pure numbers (`hero1`, `hero2`)
- ✅ Generate high-quality thumbnails
- ✅ Update types + validators + components
- ✅ Test migration on staging first

---

## 🤝 Contributing

**When adding new blocks:**

### Current System (v2.0)
1. Add to `HERO_BLOCKS` array with icon
2. Create component in `blocks/hero/`
3. Add to switch case in `tenant-hero.tsx`
4. Update types in `landing.ts`

### Future System (v3.0)
1. Design the block component
2. Generate thumbnail screenshot
3. Save to `public/blocks/hero/heroN.jpg`
4. Add to `HERO_BLOCKS` with thumbnail path
5. Export as `HeroN` in `blocks/hero/index.ts`
6. Add to switch case with number
7. Update types (add `heroN`)

---

## 📚 References

- [shadcnblocks.com](https://www.shadcnblocks.com/) - Inspiration
- [Canva Templates](https://www.canva.com/templates/) - Grid UX reference
- [Framer Blocks](https://www.framer.com/marketplace/) - Icon-based (current)
- [Webflow Templates](https://webflow.com/templates) - Thumbnail grid

---

## 🎯 Success Metrics

**When we know numbering system is working:**

1. ✅ **Developer Velocity** - Adding new blocks < 5 minutes
2. ✅ **User Selection Speed** - Find desired block < 10 seconds
3. ✅ **Maintenance** - Zero naming conflicts
4. ✅ **Scalability** - Support 50+ blocks per section easily
5. ✅ **User Feedback** - "Easy to choose designs" reviews

---

**Last Updated:** 2026-01-18
**Next Review:** Q1 2026 (Before numbering migration)
**Maintainer:** Fibidy Team

---

**🚀 TL;DR:**
- **Current:** Descriptive names (`gradient-overlay`) + Icons
- **Future:** Numbered blocks (`hero1`) + Thumbnails + Grid layout
- **Why:** Pragmatic, scalable, better UX (Canva-style)
- **When:** Q1 2026 or when block count > 20

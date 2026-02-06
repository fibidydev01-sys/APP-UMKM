# Wizard Layout Refactor Progress

## ✅ Completed (Commit: b9e1f9d)

All 5 standalone settings pages have been refactored with wizard layout:

### 1. Hero Section (`/settings/hero-section`)

- **Steps:** 3 (Identitas Toko → Cerita Toko → Tampilan & CTA)
- **Pattern:** ← ○━━●━━○ → (arrows inline with step indicator)
- **Preview:** Sheet drawer (right side)
- **Status:** ✅ Done

### 2. About Section (`/settings/about`)

- **Steps:** 3 (Identitas Section → Konten & Visual → Fitur Unggulan)
- **Pattern:** ← ○━━●━━○ → (arrows inline)
- **Preview:** Sheet drawer
- **Status:** ✅ Done

### 3. Testimonials Section (`/settings/testimonials`)

- **Steps:** 2 (Header Section → Daftar Testimoni)
- **Pattern:** ← ○━● → (arrows inline)
- **Preview:** Sheet drawer
- **Status:** ✅ Done

### 4. Contact Section (`/settings/contact`)

- **Steps:** 3 (Header & Info Kontak → Integrasi Maps → Form Settings)
- **Pattern:** ← ○━━●━━○ → (arrows inline)
- **Preview:** Sheet drawer
- **Status:** ✅ Done

### 5. CTA Section (`/settings/cta`)

- **Steps:** 2 (Konten CTA → Tombol CTA)
- **Pattern:** ← ○━● → (arrows inline)
- **Preview:** Sheet drawer
- **Status:** ✅ Done

## 📋 Next: Toko Client Integration

File: `client/src/app/settings/toko/client.tsx`

**Current:** Tabbed interface with Card layout (all sections in one file)
**Target:** Convert all 5 tab contents to wizard layout

**Changes needed:**

- Convert `HeroSectionTabContent()` to 3-step wizard
- Convert `AboutTabContent()` to 3-step wizard
- Convert `TestimonialsTabContent()` to 2-step wizard
- Convert `ContactTabContent()` to 3-step wizard
- Convert `CtaTabContent()` to 2-step wizard
- Replace Sheet with Drawer (vaul)
- Add ChevronLeft/ChevronRight navigation
- Remove Card wrappers

**Estimated size:** ~2200 lines

## 🎯 Wizard Pattern

```
┌─ Header ───────────────────┐
│  ← ○━━●━━○ →              │  ← Arrows inline
│  [Step Title]              │
│  [Step Description]        │
├─ Body ────────────────────┤
│  [Form Fields]             │  ← min-h-[280px]
└────────────────────────────┘  ← NO Footer navigation
```

**Features:**

- Inline arrow navigation (no footer buttons)
- Step indicator centered between arrows
- Preview button → Drawer (bottom-up on mobile, right side on desktop)
- Soft validation warnings (toast.info)
- Min height body (280px) for consistency

---

**Branch:** `claude/store-story-layout-pQer7` **Last commit:** `b9e1f9d`
(2024-02-05)

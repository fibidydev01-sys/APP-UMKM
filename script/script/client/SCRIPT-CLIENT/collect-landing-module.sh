#!/bin/bash

# ============================================
# LANDING MODULE COLLECTOR
# Collects: Marketing pages + landing components
# ============================================
#
# SCOPE:
# - Landing pages (home, about, fitur, cara-kerja, harga)
# - Landing components (hero, features, pricing, etc.)
# - Shared dependencies (UI, lib, config)
#
# Usage:
# chmod +x collect-landing-module.sh
# ./collect-landing-module.sh
#
# Run from: /path/to/client (root folder Next.js)
#
# ============================================

# ============================================
# SETUP OUTPUT
# ============================================

OUTPUT_DIR="collections"
OUTPUT_FILE="$OUTPUT_DIR/landing-module-$(date +%Y%m%d-%H%M%S).txt"

if [ ! -d "$OUTPUT_DIR" ]; then
    mkdir -p "$OUTPUT_DIR"
fi

echo "🏠 Landing Module Collector"
echo "=============================================="
echo ""
echo "📍 Working directory: $(pwd)"
echo "📄 Output file: $OUTPUT_FILE"
echo ""

# Initialize counters
FOUND_COUNT=0
NOT_FOUND_COUNT=0
TOTAL_LINES=0
UI_COUNT=0

# Start file
cat > "$OUTPUT_FILE" << EOF
================================================================
LANDING MODULE - COMPLETE COLLECTION
Generated on: $(date)
Working Directory: $(pwd)
================================================================

SCOPE:
- Landing Pages (home, about, fitur, cara-kerja, harga)
- Landing Components (hero, features, pricing, testimonials, etc.)
- Shared Dependencies (UI, lib, config)

================================================================

EOF

# ============================================
# FUNCTION: Collect Full File
# ============================================

collect_file() {
    local file=$1
    local relative_path=$2
    
    if [ -f "$file" ]; then
        local line_count=$(wc -l < "$file")
        TOTAL_LINES=$((TOTAL_LINES + line_count))
        FOUND_COUNT=$((FOUND_COUNT + 1))
        echo "✅ $relative_path (${line_count} lines)"
        cat >> "$OUTPUT_FILE" << EOF

================================================
FILE: $relative_path
Lines: $line_count
================================================

$(cat "$file")

EOF
    else
        NOT_FOUND_COUNT=$((NOT_FOUND_COUNT + 1))
        echo "❌ NOT FOUND: $relative_path"
        cat >> "$OUTPUT_FILE" << EOF

================================================
FILE: $relative_path
Lines: 0
================================================

⚠️ FILE NOT FOUND

EOF
    fi
}

# ============================================
# FUNCTION: List UI Component
# ============================================

list_ui_component() {
    local file=$1
    local relative_path=$2
    
    if [ -f "$file" ]; then
        UI_COUNT=$((UI_COUNT + 1))
        echo "📦 $relative_path (shadcn/ui)"
    fi
}

# ============================================
# SECTION 1: LANDING PAGES (5 files)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📄 LANDING PAGES (5 files)"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/app/page.tsx" "src/app/page.tsx"
collect_file "src/app/about/page.tsx" "src/app/about/page.tsx"
collect_file "src/app/fitur/page.tsx" "src/app/fitur/page.tsx"
collect_file "src/app/cara-kerja/page.tsx" "src/app/cara-kerja/page.tsx"
collect_file "src/app/harga/page.tsx" "src/app/harga/page.tsx"

# ============================================
# SECTION 2: LAYOUT COMPONENTS (3 files)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🎨 LAYOUT COMPONENTS (3 files)"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/components/platform-landing/index.ts" "src/components/platform-landing/index.ts"
collect_file "src/components/platform-landing/landing-header.tsx" "src/components/platform-landing/landing-header.tsx"
collect_file "src/components/platform-landing/landing-footer.tsx" "src/components/platform-landing/landing-footer.tsx"

# ============================================
# SECTION 3: HERO & INTRO SECTIONS (6 files)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🚀 HERO & INTRO SECTIONS (6 files)"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/components/platform-landing/hero-section.tsx" "src/components/platform-landing/hero-section.tsx"
collect_file "src/components/platform-landing/logos-section.tsx" "src/components/platform-landing/logos-section.tsx"
collect_file "src/components/platform-landing/target-user-section.tsx" "src/components/platform-landing/target-user-section.tsx"
collect_file "src/components/platform-landing/problem-section.tsx" "src/components/platform-landing/problem-section.tsx"
collect_file "src/components/platform-landing/solution-section.tsx" "src/components/platform-landing/solution-section.tsx"
collect_file "src/components/platform-landing/honest-section.tsx" "src/components/platform-landing/honest-section.tsx"

# ============================================
# SECTION 4: FEATURE SECTIONS (4 files)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "✨ FEATURE SECTIONS (4 files)"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/components/platform-landing/features-section.tsx" "src/components/platform-landing/features-section.tsx"
collect_file "src/components/platform-landing/fibidy-ai-section.tsx" "src/components/platform-landing/fibidy-ai-section.tsx"
collect_file "src/components/platform-landing/categories-section.tsx" "src/components/platform-landing/categories-section.tsx"
collect_file "src/components/platform-landing/how-it-works-section.tsx" "src/components/platform-landing/how-it-works-section.tsx"

# ============================================
# SECTION 5: TESTIMONIAL SECTIONS (3 files)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "⭐ TESTIMONIAL SECTIONS (3 files)"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/components/platform-landing/testimonials-section.tsx" "src/components/platform-landing/testimonials-section.tsx"
collect_file "src/components/platform-landing/testimonial-highlight-section.tsx" "src/components/platform-landing/testimonial-highlight-section.tsx"
collect_file "src/components/platform-landing/lazy-testimonials.tsx" "src/components/platform-landing/lazy-testimonials.tsx"

# ============================================
# SECTION 6: PRICING & CTA (3 files)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "💰 PRICING & CTA (3 files)"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/components/platform-landing/pricing-section.tsx" "src/components/platform-landing/pricing-section.tsx"
collect_file "src/components/platform-landing/faq-section.tsx" "src/components/platform-landing/faq-section.tsx"
collect_file "src/components/platform-landing/cta-section.tsx" "src/components/platform-landing/cta-section.tsx"

# ============================================
# SECTION 7: UMKM SHOWCASE (2 files)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🏪 UMKM SHOWCASE (2 files)"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/components/platform-landing/umkm-showcase-section.tsx" "src/components/platform-landing/umkm-showcase-section.tsx"
collect_file "src/components/platform-landing/umkm-discover-section.tsx" "src/components/platform-landing/umkm-discover-section.tsx"

# ============================================
# SECTION 8: OPTIONAL SECTIONS (1 file)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📰 OPTIONAL SECTIONS (1 file)"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/components/platform-landing/blog-section.tsx" "src/components/platform-landing/blog-section.tsx"

# ============================================
# SECTION 9: SHARED UI COMPONENTS (List Only)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🟠 SHARED UI COMPONENTS (15+ files)"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================
SHARED UI COMPONENTS (shadcn/ui)
================================================

Auto-generated by CLI. Verify they exist:

EOF

list_ui_component "src/components/ui/button.tsx" "src/components/ui/button.tsx"
list_ui_component "src/components/ui/badge.tsx" "src/components/ui/badge.tsx"
list_ui_component "src/components/ui/card.tsx" "src/components/ui/card.tsx"
list_ui_component "src/components/ui/avatar.tsx" "src/components/ui/avatar.tsx"
list_ui_component "src/components/ui/input.tsx" "src/components/ui/input.tsx"
list_ui_component "src/components/ui/skeleton.tsx" "src/components/ui/skeleton.tsx"
list_ui_component "src/components/ui/accordion.tsx" "src/components/ui/accordion.tsx"
list_ui_component "src/components/ui/sheet.tsx" "src/components/ui/sheet.tsx"
list_ui_component "src/components/ui/navigation-menu.tsx" "src/components/ui/navigation-menu.tsx"
list_ui_component "src/components/ui/tabs.tsx" "src/components/ui/tabs.tsx"
list_ui_component "src/components/ui/dialog.tsx" "src/components/ui/dialog.tsx"
list_ui_component "src/components/ui/scroll-area.tsx" "src/components/ui/scroll-area.tsx"
list_ui_component "src/components/ui/bento-grid.tsx" "src/components/ui/bento-grid.tsx"
list_ui_component "src/components/ui/word-rotate.tsx" "src/components/ui/word-rotate.tsx"
list_ui_component "src/components/ui/interactive-hover-button.tsx" "src/components/ui/interactive-hover-button.tsx"

cat >> "$OUTPUT_FILE" << EOF

Required UI Components:
- button.tsx, badge.tsx, card.tsx, avatar.tsx
- input.tsx, skeleton.tsx, accordion.tsx
- sheet.tsx, navigation-menu.tsx, tabs.tsx
- dialog.tsx, scroll-area.tsx
- bento-grid.tsx, word-rotate.tsx
- interactive-hover-button.tsx

Generate missing with: npx shadcn@latest add [component]

================================================

EOF

# ============================================
# SECTION 10: SHARED LIB (6 files)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🔧 SHARED LIB UTILITIES (6 files)"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/lib/cn.ts" "src/lib/cn.ts"
collect_file "src/lib/utils.ts" "src/lib/utils.ts"
collect_file "src/lib/format.ts" "src/lib/format.ts"
collect_file "src/lib/seo.ts" "src/lib/seo.ts"
collect_file "src/lib/store-url.ts" "src/lib/store-url.ts"
collect_file "src/lib/validations.ts" "src/lib/validations.ts"

# ============================================
# SECTION 11: SHARED CONFIG (3 files)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "⚙️ SHARED CONFIG (3 files)"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/config/categories.ts" "src/config/categories.ts"
collect_file "src/config/seo.config.ts" "src/config/seo.config.ts"
collect_file "src/config/site.ts" "src/config/site.ts"

# ============================================
# SECTION 12: SEO COMPONENTS (2 files)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🔍 SEO COMPONENTS (2 files)"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/components/seo/index.ts" "src/components/seo/index.ts"
collect_file "src/components/seo/organization-schema.tsx" "src/components/seo/organization-schema.tsx"

# ============================================
# SECTION 13: LAYOUT & PROVIDERS (5 files)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🎨 LAYOUT & PROVIDERS (5 files)"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/app/layout.tsx" "src/app/layout.tsx"
collect_file "src/app/globals.css" "src/app/globals.css"
collect_file "src/providers/index.tsx" "src/providers/index.tsx"
collect_file "src/providers/theme-provider.tsx" "src/providers/theme-provider.tsx"
collect_file "src/providers/hydration-provider.tsx" "src/providers/hydration-provider.tsx"

# ============================================
# SUMMARY
# ============================================

TOTAL_COLLECTED=$((FOUND_COUNT + NOT_FOUND_COUNT))
TOTAL_FILES=$((TOTAL_COLLECTED + UI_COUNT))

echo ""
echo "═══════════════════════════════════════════"
echo "📊 COLLECTION SUMMARY"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================
COLLECTION SUMMARY
================================================================

📦 Landing Module:
   📄 Pages: 5 files
   🎨 Layout: 3 files
   🚀 Hero & Intro: 6 files
   ✨ Features: 4 files
   ⭐ Testimonials: 3 files
   💰 Pricing & CTA: 3 files
   🏪 UMKM Showcase: 2 files
   📰 Optional: 1 file
   🟠 UI Components: $UI_COUNT files (listed)
   🔧 Lib: 6 files
   ⚙️ Config: 3 files
   🔍 SEO: 2 files
   🎨 Layout & Providers: 5 files
   ─────────────────
   📁 Total: $TOTAL_FILES files
   
📝 Content Stats:
   ✅ Found: $FOUND_COUNT files
   ❌ Missing: $NOT_FOUND_COUNT files
   📝 Total lines: $TOTAL_LINES

📍 Output: $(pwd)/$OUTPUT_FILE

================================================================
END OF COLLECTION
================================================================
EOF

echo ""
echo "✅ Landing module collected!"
echo ""
echo "📄 Output: $OUTPUT_FILE"
echo "📊 Size: $(du -h "$OUTPUT_FILE" 2>/dev/null | cut -f1 || echo "N/A")"
echo ""
echo "📋 Summary:"
echo "   ✅ Files found: $FOUND_COUNT"
echo "   ❌ Missing: $NOT_FOUND_COUNT"
echo "   📝 Lines: $TOTAL_LINES"
echo ""
if [ $NOT_FOUND_COUNT -eq 0 ]; then
    echo "🎉 All files collected!"
else
    echo "⚠️ $NOT_FOUND_COUNT file(s) missing"
fi
echo ""
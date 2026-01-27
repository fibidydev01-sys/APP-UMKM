#!/bin/bash

# ============================================
# FILE COLLECTOR FOR MARKETING MODULE
# VERSION 2.0 - COMPLETE DEPENDENCIES
# ============================================
# 
# Script ini akan mengumpulkan SEMUA file yang dibutuhkan
# untuk implementasi 4-page marketing structure:
# - / (Home) - src/app/page.tsx
# - /fitur - src/app/fitur/page.tsx
# - /cara-kerja - src/app/cara-kerja/page.tsx
# - /harga - src/app/harga/page.tsx
#
# Usage:
# chmod +x collect-marketing-module-v2.sh
# ./collect-marketing-module-v2.sh
#
# Run from: /path/to/client (root folder Next.js)
#
# ============================================

OUTPUT_FILE="marketing-module-complete-$(date +%Y%m%d-%H%M%S).txt"

echo "🚀 Marketing Module Dependencies Collector v2.0"
echo "================================================"
echo ""
echo "📍 Working directory: $(pwd)"
echo "📄 Output file: $OUTPUT_FILE"
echo ""

# Initialize counters
FOUND_COUNT=0
NOT_FOUND_COUNT=0
TOTAL_LINES=0

# Start file
cat > "$OUTPUT_FILE" << EOF
================================================================
MARKETING MODULE - COMPLETE DEPENDENCIES v2.0
Generated on: $(date)
================================================================

EOF

# ============================================
# FUNCTION: Collect File
# ============================================

collect_file() {
    local file=$1
    local relative_path=$2
    
    if [ -f "$file" ]; then
        local line_count=$(wc -l < "$file")
        TOTAL_LINES=$((TOTAL_LINES + line_count))
        FOUND_COUNT=$((FOUND_COUNT + 1))
        echo "✅ Found: $relative_path (${line_count} lines)"
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

FILE NOT FOUND - Needs to be created!

EOF
    fi
}

# ============================================
# SECTION 1: PAGES
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🎯 PAGES"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/app/page.tsx" "src/app/page.tsx"
collect_file "src/app/fitur/page.tsx" "src/app/fitur/page.tsx"
collect_file "src/app/cara-kerja/page.tsx" "src/app/cara-kerja/page.tsx"
collect_file "src/app/harga/page.tsx" "src/app/harga/page.tsx"

# ============================================
# SECTION 2: PLATFORM LANDING COMPONENTS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🔴 PLATFORM LANDING COMPONENTS"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/components/platform-landing/index.ts" "src/components/platform-landing/index.ts"
collect_file "src/components/platform-landing/landing-header.tsx" "src/components/platform-landing/landing-header.tsx"
collect_file "src/components/platform-landing/landing-footer.tsx" "src/components/platform-landing/landing-footer.tsx"
collect_file "src/components/platform-landing/hero-section.tsx" "src/components/platform-landing/hero-section.tsx"
collect_file "src/components/platform-landing/logos-section.tsx" "src/components/platform-landing/logos-section.tsx"
collect_file "src/components/platform-landing/problem-section.tsx" "src/components/platform-landing/problem-section.tsx"
collect_file "src/components/platform-landing/solution-section.tsx" "src/components/platform-landing/solution-section.tsx"
collect_file "src/components/platform-landing/how-it-works-section.tsx" "src/components/platform-landing/how-it-works-section.tsx"
collect_file "src/components/platform-landing/testimonial-highlight-section.tsx" "src/components/platform-landing/testimonial-highlight-section.tsx"
collect_file "src/components/platform-landing/features-section.tsx" "src/components/platform-landing/features-section.tsx"
collect_file "src/components/platform-landing/testimonials-section.tsx" "src/components/platform-landing/testimonials-section.tsx"
collect_file "src/components/platform-landing/pricing-section.tsx" "src/components/platform-landing/pricing-section.tsx"
collect_file "src/components/platform-landing/faq-section.tsx" "src/components/platform-landing/faq-section.tsx"
collect_file "src/components/platform-landing/blog-section.tsx" "src/components/platform-landing/blog-section.tsx"
collect_file "src/components/platform-landing/cta-section.tsx" "src/components/platform-landing/cta-section.tsx"
collect_file "src/components/platform-landing/lazy-testimonials.tsx" "src/components/platform-landing/lazy-testimonials.tsx"

# ============================================
# SECTION 3: UI COMPONENTS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🟠 UI COMPONENTS"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/components/ui/button.tsx" "src/components/ui/button.tsx"
collect_file "src/components/ui/badge.tsx" "src/components/ui/badge.tsx"
collect_file "src/components/ui/card.tsx" "src/components/ui/card.tsx"
collect_file "src/components/ui/avatar.tsx" "src/components/ui/avatar.tsx"
collect_file "src/components/ui/accordion.tsx" "src/components/ui/accordion.tsx"
collect_file "src/components/ui/sheet.tsx" "src/components/ui/sheet.tsx"
collect_file "src/components/ui/navigation-menu.tsx" "src/components/ui/navigation-menu.tsx"
collect_file "src/components/ui/dot-pattern.tsx" "src/components/ui/dot-pattern.tsx"
collect_file "src/components/ui/word-rotate.tsx" "src/components/ui/word-rotate.tsx"
collect_file "src/components/ui/bento-grid.tsx" "src/components/ui/bento-grid.tsx"
collect_file "src/components/ui/highlighter.tsx" "src/components/ui/highlighter.tsx"
collect_file "src/components/ui/interactive-hover-button.tsx" "src/components/ui/interactive-hover-button.tsx"
collect_file "src/components/ui/dotted-map.tsx" "src/components/ui/dotted-map.tsx"
collect_file "src/components/ui/marquee.tsx" "src/components/ui/marquee.tsx"
collect_file "src/components/ui/globe.tsx" "src/components/ui/globe.tsx"
collect_file "src/components/ui/sonner.tsx" "src/components/ui/sonner.tsx"

# ============================================
# SECTION 4: SEO COMPONENTS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🔍 SEO COMPONENTS"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/components/seo/index.ts" "src/components/seo/index.ts"
collect_file "src/components/seo/organization-schema.tsx" "src/components/seo/organization-schema.tsx"

# ============================================
# SECTION 5: LIB UTILITIES
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🟡 LIB UTILITIES"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/lib/cn.ts" "src/lib/cn.ts"
collect_file "src/lib/utils.ts" "src/lib/utils.ts"
collect_file "src/lib/format.ts" "src/lib/format.ts"
collect_file "src/lib/validations.ts" "src/lib/validations.ts"
collect_file "src/lib/seo.ts" "src/lib/seo.ts"

# ============================================
# SECTION 6: STYLES & LAYOUT
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🎨 STYLES & LAYOUT"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/app/globals.css" "src/app/globals.css"
collect_file "src/app/layout.tsx" "src/app/layout.tsx"

# ============================================
# SECTION 7: PROVIDERS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🔌 PROVIDERS"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/providers/index.tsx" "src/providers/index.tsx"
collect_file "src/providers/theme-provider.tsx" "src/providers/theme-provider.tsx"
collect_file "src/providers/hydration-provider.tsx" "src/providers/hydration-provider.tsx"
collect_file "src/providers/toast-provider.tsx" "src/providers/toast-provider.tsx"

# ============================================
# SECTION 8: CONFIG
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "⚙️ CONFIG"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/config/site.ts" "src/config/site.ts"
collect_file "src/config/constants.ts" "src/config/constants.ts"
collect_file "src/config/categories.ts" "src/config/categories.ts"
collect_file "src/config/seo.config.ts" "src/config/seo.config.ts"

# ============================================
# SUMMARY
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📊 COLLECTION SUMMARY"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================
COLLECTION SUMMARY
================================================================

Total Files Collected: $((FOUND_COUNT + NOT_FOUND_COUNT))
Total Files Found: $FOUND_COUNT
Total Files Missing: $NOT_FOUND_COUNT
Total Lines: $TOTAL_LINES

================================================================
END OF COLLECTION
================================================================
EOF

echo ""
echo "✅ Collection complete!"
echo ""
echo "📄 Output file: $OUTPUT_FILE"
echo "📊 File size: $(du -h "$OUTPUT_FILE" 2>/dev/null | cut -f1 || echo "N/A")"
echo ""
echo "📋 Summary:"
echo "   ✅ Found: $FOUND_COUNT files"
echo "   ❌ Missing: $NOT_FOUND_COUNT files"
echo "   📝 Total lines: $TOTAL_LINES"
echo ""
echo "🎉 Done!"
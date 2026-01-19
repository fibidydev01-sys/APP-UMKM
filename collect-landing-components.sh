#!/bin/bash

# ============================================
# LANDING COMPONENTS COLLECTOR
# Path: src/components/landing/
# ============================================
#
# SCOPE:
# - Landing page components (tenant-*.tsx)
# - Block variants (hero, about, products, etc.)
# - Index files
#
# Usage:
# chmod +x collect-landing-components.sh
# ./collect-landing-components.sh
#
# ============================================

OUTPUT_DIR="collections"
OUTPUT_FILE="$OUTPUT_DIR/landing-components-$(date +%Y%m%d-%H%M%S).md"

mkdir -p "$OUTPUT_DIR"

echo "🎨 Landing Components Collector"
echo "=============================================="
echo ""
echo "📍 Working directory: $(pwd)"
echo "📄 Output file: $OUTPUT_FILE"
echo ""

FOUND_COUNT=0
NOT_FOUND_COUNT=0
TOTAL_LINES=0

cat > "$OUTPUT_FILE" << EOF
# LANDING COMPONENTS - COMPLETE COLLECTION
> Generated on: $(date)
> Working Directory: $(pwd)

## SCOPE:
- Landing Page Components (tenant-*.tsx)
- Block Variants (hero, about, products, testimonials, contact, cta)
- Index files & Mapping

---

EOF

collect_file() {
    local file=$1
    local relative_path=$2
    
    if [ -f "$file" ]; then
        local line_count=$(wc -l < "$file")
        TOTAL_LINES=$((TOTAL_LINES + line_count))
        FOUND_COUNT=$((FOUND_COUNT + 1))
        echo "✅ $relative_path (${line_count} lines)"
        
        # Detect file extension for syntax highlighting
        local ext="${file##*.}"
        local syntax="typescript"
        if [ "$ext" = "md" ]; then
            syntax="markdown"
        fi
        
        cat >> "$OUTPUT_FILE" << EOF

---

## FILE: \`$relative_path\`
> Lines: $line_count

\`\`\`$syntax
$(cat "$file")
\`\`\`

EOF
    else
        NOT_FOUND_COUNT=$((NOT_FOUND_COUNT + 1))
        echo "❌ NOT FOUND: $relative_path"
    fi
}

# ============================================
# SECTION 1: ROOT LANDING COMPONENTS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📄 ROOT LANDING COMPONENTS (7 files)"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << EOF

---

# 📄 ROOT LANDING COMPONENTS

EOF

collect_file "client/src/components/landing/index.ts" "src/components/landing/index.ts"
collect_file "client/src/components/landing/tenant-hero.tsx" "src/components/landing/tenant-hero.tsx"
collect_file "client/src/components/landing/tenant-about.tsx" "src/components/landing/tenant-about.tsx"
collect_file "client/src/components/landing/tenant-products.tsx" "src/components/landing/tenant-products.tsx"
collect_file "client/src/components/landing/tenant-testimonials.tsx" "src/components/landing/tenant-testimonials.tsx"
collect_file "client/src/components/landing/tenant-contact.tsx" "src/components/landing/tenant-contact.tsx"
collect_file "client/src/components/landing/tenant-cta.tsx" "src/components/landing/tenant-cta.tsx"

# ============================================
# SECTION 2: BLOCKS INDEX & MAPPING
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📁 BLOCKS INDEX & MAPPING (2 files)"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << EOF

---

# 📁 BLOCKS INDEX & MAPPING

EOF

collect_file "client/src/components/landing/blocks/index.ts" "src/components/landing/blocks/index.ts"
collect_file "client/src/components/landing/blocks/MAPPING.md" "src/components/landing/blocks/MAPPING.md"

# ============================================
# SECTION 3: HERO BLOCKS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🦸 HERO BLOCKS (8 files)"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << EOF

---

# 🦸 HERO BLOCKS

EOF

collect_file "client/src/components/landing/blocks/hero/index.ts" "src/components/landing/blocks/hero/index.ts"
collect_file "client/src/components/landing/blocks/hero/hero1.tsx" "src/components/landing/blocks/hero/hero1.tsx"
collect_file "client/src/components/landing/blocks/hero/hero2.tsx" "src/components/landing/blocks/hero/hero2.tsx"
collect_file "client/src/components/landing/blocks/hero/hero3.tsx" "src/components/landing/blocks/hero/hero3.tsx"
collect_file "client/src/components/landing/blocks/hero/hero4.tsx" "src/components/landing/blocks/hero/hero4.tsx"
collect_file "client/src/components/landing/blocks/hero/hero5.tsx" "src/components/landing/blocks/hero/hero5.tsx"
collect_file "client/src/components/landing/blocks/hero/hero6.tsx" "src/components/landing/blocks/hero/hero6.tsx"
collect_file "client/src/components/landing/blocks/hero/hero7.tsx" "src/components/landing/blocks/hero/hero7.tsx"

# ============================================
# SECTION 4: ABOUT BLOCKS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "ℹ️ ABOUT BLOCKS (8 files)"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << EOF

---

# ℹ️ ABOUT BLOCKS

EOF

collect_file "client/src/components/landing/blocks/about/index.ts" "src/components/landing/blocks/about/index.ts"
collect_file "client/src/components/landing/blocks/about/about1.tsx" "src/components/landing/blocks/about/about1.tsx"
collect_file "client/src/components/landing/blocks/about/about2.tsx" "src/components/landing/blocks/about/about2.tsx"
collect_file "client/src/components/landing/blocks/about/about3.tsx" "src/components/landing/blocks/about/about3.tsx"
collect_file "client/src/components/landing/blocks/about/about4.tsx" "src/components/landing/blocks/about/about4.tsx"
collect_file "client/src/components/landing/blocks/about/about5.tsx" "src/components/landing/blocks/about/about5.tsx"
collect_file "client/src/components/landing/blocks/about/about6.tsx" "src/components/landing/blocks/about/about6.tsx"
collect_file "client/src/components/landing/blocks/about/about7.tsx" "src/components/landing/blocks/about/about7.tsx"

# ============================================
# SECTION 5: PRODUCTS BLOCKS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🛍️ PRODUCTS BLOCKS (8 files)"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << EOF

---

# 🛍️ PRODUCTS BLOCKS

EOF

collect_file "client/src/components/landing/blocks/products/index.ts" "src/components/landing/blocks/products/index.ts"
collect_file "client/src/components/landing/blocks/products/products1.tsx" "src/components/landing/blocks/products/products1.tsx"
collect_file "client/src/components/landing/blocks/products/products2.tsx" "src/components/landing/blocks/products/products2.tsx"
collect_file "client/src/components/landing/blocks/products/products3.tsx" "src/components/landing/blocks/products/products3.tsx"
collect_file "client/src/components/landing/blocks/products/products4.tsx" "src/components/landing/blocks/products/products4.tsx"
collect_file "client/src/components/landing/blocks/products/products5.tsx" "src/components/landing/blocks/products/products5.tsx"
collect_file "client/src/components/landing/blocks/products/products6.tsx" "src/components/landing/blocks/products/products6.tsx"
collect_file "client/src/components/landing/blocks/products/products7.tsx" "src/components/landing/blocks/products/products7.tsx"

# ============================================
# SECTION 6: TESTIMONIALS BLOCKS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "💬 TESTIMONIALS BLOCKS (8 files)"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << EOF

---

# 💬 TESTIMONIALS BLOCKS

EOF

collect_file "client/src/components/landing/blocks/testimonials/index.ts" "src/components/landing/blocks/testimonials/index.ts"
collect_file "client/src/components/landing/blocks/testimonials/testimonials1.tsx" "src/components/landing/blocks/testimonials/testimonials1.tsx"
collect_file "client/src/components/landing/blocks/testimonials/testimonials2.tsx" "src/components/landing/blocks/testimonials/testimonials2.tsx"
collect_file "client/src/components/landing/blocks/testimonials/testimonials3.tsx" "src/components/landing/blocks/testimonials/testimonials3.tsx"
collect_file "client/src/components/landing/blocks/testimonials/testimonials4.tsx" "src/components/landing/blocks/testimonials/testimonials4.tsx"
collect_file "client/src/components/landing/blocks/testimonials/testimonials5.tsx" "src/components/landing/blocks/testimonials/testimonials5.tsx"
collect_file "client/src/components/landing/blocks/testimonials/testimonials6.tsx" "src/components/landing/blocks/testimonials/testimonials6.tsx"
collect_file "client/src/components/landing/blocks/testimonials/testimonials7.tsx" "src/components/landing/blocks/testimonials/testimonials7.tsx"

# ============================================
# SECTION 7: CONTACT BLOCKS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📞 CONTACT BLOCKS (8 files)"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << EOF

---

# 📞 CONTACT BLOCKS

EOF

collect_file "client/src/components/landing/blocks/contact/index.ts" "src/components/landing/blocks/contact/index.ts"
collect_file "client/src/components/landing/blocks/contact/contact1.tsx" "src/components/landing/blocks/contact/contact1.tsx"
collect_file "client/src/components/landing/blocks/contact/contact2.tsx" "src/components/landing/blocks/contact/contact2.tsx"
collect_file "client/src/components/landing/blocks/contact/contact3.tsx" "src/components/landing/blocks/contact/contact3.tsx"
collect_file "client/src/components/landing/blocks/contact/contact4.tsx" "src/components/landing/blocks/contact/contact4.tsx"
collect_file "client/src/components/landing/blocks/contact/contact5.tsx" "src/components/landing/blocks/contact/contact5.tsx"
collect_file "client/src/components/landing/blocks/contact/contact6.tsx" "src/components/landing/blocks/contact/contact6.tsx"
collect_file "client/src/components/landing/blocks/contact/contact7.tsx" "src/components/landing/blocks/contact/contact7.tsx"

# ============================================
# SECTION 8: CTA BLOCKS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🚀 CTA BLOCKS (8 files)"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << EOF

---

# 🚀 CTA BLOCKS

EOF

collect_file "client/src/components/landing/blocks/cta/index.ts" "src/components/landing/blocks/cta/index.ts"
collect_file "client/src/components/landing/blocks/cta/cta1.tsx" "src/components/landing/blocks/cta/cta1.tsx"
collect_file "client/src/components/landing/blocks/cta/cta2.tsx" "src/components/landing/blocks/cta/cta2.tsx"
collect_file "client/src/components/landing/blocks/cta/cta3.tsx" "src/components/landing/blocks/cta/cta3.tsx"
collect_file "client/src/components/landing/blocks/cta/cta4.tsx" "src/components/landing/blocks/cta/cta4.tsx"
collect_file "client/src/components/landing/blocks/cta/cta5.tsx" "src/components/landing/blocks/cta/cta5.tsx"
collect_file "client/src/components/landing/blocks/cta/cta6.tsx" "src/components/landing/blocks/cta/cta6.tsx"
collect_file "client/src/components/landing/blocks/cta/cta7.tsx" "src/components/landing/blocks/cta/cta7.tsx"

# ============================================
# SUMMARY
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📊 COLLECTION SUMMARY"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << EOF

---

# 📊 COLLECTION SUMMARY

## 📦 Landing Components Module:

| Section | Files |
|---------|-------|
| 📄 Root Components | 7 files |
| 📁 Blocks Index/Mapping | 2 files |
| 🦸 Hero Blocks | 8 files |
| ℹ️ About Blocks | 8 files |
| 🛍️ Products Blocks | 8 files |
| 💬 Testimonials Blocks | 8 files |
| 📞 Contact Blocks | 8 files |
| 🚀 CTA Blocks | 8 files |
| **Total** | **57 files** |

## 📝 Stats:
- ✅ Found: $FOUND_COUNT files
- ❌ Missing: $NOT_FOUND_COUNT files
- 📝 Total lines: $TOTAL_LINES

## 📍 Output:
\`$(pwd)/$OUTPUT_FILE\`

---

> END OF COLLECTION
EOF

echo ""
echo "✅ Landing components collected!"
echo "📄 Output: $OUTPUT_FILE"
echo "📊 Found: $FOUND_COUNT | Missing: $NOT_FOUND_COUNT | Lines: $TOTAL_LINES"
echo ""
#!/bin/bash

# ============================================
# SHARED PACKAGE COLLECTOR
# Collects shared package files (SKIP landing-blocks & UI components)
# ============================================

OUTPUT_DIR="../collections"
OUTPUT_FILE="$OUTPUT_DIR/shared-all-$(date +%Y%m%d-%H%M%S).txt"
BASE_PATH="../packages/shared/src"

mkdir -p "$OUTPUT_DIR"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

FOUND=0
TOTAL_LINES=0

# ============================================
# FUNCTIONS
# ============================================

collect_file() {
    local file=$1
    local rel_path=$2
    
    if [ -f "$file" ]; then
        local lines=$(wc -l < "$file")
        TOTAL_LINES=$((TOTAL_LINES + lines))
        FOUND=$((FOUND + 1))
        echo -e "  ${GREEN}✅ $rel_path${NC} ($lines lines)"
        
        cat >> "$OUTPUT_FILE" << EOF

================================================================================
FILE: $rel_path
Lines: $lines
================================================================================

$(cat "$file")

EOF
    fi
}

# ============================================
# MAIN
# ============================================

echo -e "${CYAN}╔═══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   📦 SHARED PACKAGE COLLECTOR         ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}⚠️  SKIPPING: landing-blocks & UI components (too many files)${NC}"
echo ""

# Initialize output
cat > "$OUTPUT_FILE" << EOF
================================================================================
SHARED PACKAGE - COLLECTION (Skip landing-blocks & UI)
================================================================================
Generated: $(date)
Working Directory: $(pwd)

SCOPE:
✅ API, Config, Hooks, Lib, Providers, Stores, Types, Utils
❌ SKIPPED: features/landing-blocks/* & ui/* (too many files)

================================================================================
EOF

# ============================================
# API
# ============================================

echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${PURPLE}🔌 API${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
🔌 API
================================================================================

EOF

collect_file "$BASE_PATH/api/index.ts" "api/index.ts"
collect_file "$BASE_PATH/api/client.ts" "api/client.ts"
collect_file "$BASE_PATH/api/products.ts" "api/products.ts"
collect_file "$BASE_PATH/api/tenants.ts" "api/tenants.ts"

# ============================================
# COMPONENTS
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${PURPLE}🎨 COMPONENTS${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
🎨 COMPONENTS
================================================================================

EOF

collect_file "$BASE_PATH/components/index.ts" "components/index.ts"
collect_file "$BASE_PATH/components/ui/optimized-image.tsx" "components/ui/optimized-image.tsx"

# ============================================
# CONFIG
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${PURPLE}⚙️  CONFIG${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
⚙️ CONFIG
================================================================================

EOF

collect_file "$BASE_PATH/config/index.ts" "config/index.ts"
collect_file "$BASE_PATH/config/categories.ts" "config/categories.ts"
collect_file "$BASE_PATH/config/constants.ts" "config/constants.ts"
collect_file "$BASE_PATH/config/seo.config.ts" "config/seo.config.ts"
collect_file "$BASE_PATH/config/site.ts" "config/site.ts"

# ============================================
# FEATURES (SKIP landing-blocks)
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${PURPLE}🎯 FEATURES${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
🎯 FEATURES
================================================================================

EOF

# PWA
echo -e "${BLUE}📱 PWA${NC}"
collect_file "$BASE_PATH/features/pwa/index.ts" "features/pwa/index.ts"
collect_file "$BASE_PATH/features/pwa/components/index.ts" "features/pwa/components/index.ts"
collect_file "$BASE_PATH/features/pwa/components/install-prompt.tsx" "features/pwa/components/install-prompt.tsx"
collect_file "$BASE_PATH/features/pwa/components/pwa-provider.tsx" "features/pwa/components/pwa-provider.tsx"

# SEO
echo -e "${BLUE}🔍 SEO${NC}"
collect_file "$BASE_PATH/features/seo/index.ts" "features/seo/index.ts"
collect_file "$BASE_PATH/features/seo/components/index.ts" "features/seo/components/index.ts"
collect_file "$BASE_PATH/features/seo/components/breadcrumb-schema.tsx" "features/seo/components/breadcrumb-schema.tsx"
collect_file "$BASE_PATH/features/seo/components/faq-schema.tsx" "features/seo/components/faq-schema.tsx"
collect_file "$BASE_PATH/features/seo/components/json-ld.tsx" "features/seo/components/json-ld.tsx"
collect_file "$BASE_PATH/features/seo/components/local-business-schema.tsx" "features/seo/components/local-business-schema.tsx"
collect_file "$BASE_PATH/features/seo/components/organization-schema.tsx" "features/seo/components/organization-schema.tsx"
collect_file "$BASE_PATH/features/seo/components/product-list-schema.tsx" "features/seo/components/product-list-schema.tsx"
collect_file "$BASE_PATH/features/seo/components/product-schema.tsx" "features/seo/components/product-schema.tsx"
collect_file "$BASE_PATH/features/seo/components/social-share.tsx" "features/seo/components/social-share.tsx"
collect_file "$BASE_PATH/features/seo/lib/index.ts" "features/seo/lib/index.ts"
collect_file "$BASE_PATH/features/seo/lib/schema.ts" "features/seo/lib/schema.ts"
collect_file "$BASE_PATH/features/seo/lib/seo.ts" "features/seo/lib/seo.ts"

# STORE
echo -e "${BLUE}🛒 STORE${NC}"
collect_file "$BASE_PATH/features/store/index.ts" "features/store/index.ts"
collect_file "$BASE_PATH/features/store/components/index.ts" "features/store/components/index.ts"
collect_file "$BASE_PATH/features/store/components/add-to-cart-button.tsx" "features/store/components/add-to-cart-button.tsx"
collect_file "$BASE_PATH/features/store/components/cart-badge.tsx" "features/store/components/cart-badge.tsx"
collect_file "$BASE_PATH/features/store/components/cart-sheet.tsx" "features/store/components/cart-sheet.tsx"
collect_file "$BASE_PATH/features/store/components/category-list.tsx" "features/store/components/category-list.tsx"
collect_file "$BASE_PATH/features/store/components/featured-products.tsx" "features/store/components/featured-products.tsx"
collect_file "$BASE_PATH/features/store/components/product-actions.tsx" "features/store/components/product-actions.tsx"
collect_file "$BASE_PATH/features/store/components/product-card.tsx" "features/store/components/product-card.tsx"
collect_file "$BASE_PATH/features/store/components/product-filters.tsx" "features/store/components/product-filters.tsx"
collect_file "$BASE_PATH/features/store/components/product-gallery.tsx" "features/store/components/product-gallery.tsx"
collect_file "$BASE_PATH/features/store/components/product-grid.tsx" "features/store/components/product-grid.tsx"
collect_file "$BASE_PATH/features/store/components/product-info.tsx" "features/store/components/product-info.tsx"
collect_file "$BASE_PATH/features/store/components/product-pagination.tsx" "features/store/components/product-pagination.tsx"
collect_file "$BASE_PATH/features/store/components/product-share.tsx" "features/store/components/product-share.tsx"
collect_file "$BASE_PATH/features/store/components/related-products.tsx" "features/store/components/related-products.tsx"
collect_file "$BASE_PATH/features/store/components/shipping-info.tsx" "features/store/components/shipping-info.tsx"
collect_file "$BASE_PATH/features/store/components/store-breadcrumb.tsx" "features/store/components/store-breadcrumb.tsx"
collect_file "$BASE_PATH/features/store/components/store-footer.tsx" "features/store/components/store-footer.tsx"
collect_file "$BASE_PATH/features/store/components/store-header.tsx" "features/store/components/store-header.tsx"
collect_file "$BASE_PATH/features/store/components/store-nav.tsx" "features/store/components/store-nav.tsx"
collect_file "$BASE_PATH/features/store/components/store-not-found.tsx" "features/store/components/store-not-found.tsx"
collect_file "$BASE_PATH/features/store/components/store-skeleton.tsx" "features/store/components/store-skeleton.tsx"
collect_file "$BASE_PATH/features/store/components/whatsapp-checkout-dialog.tsx" "features/store/components/whatsapp-checkout-dialog.tsx"
collect_file "$BASE_PATH/features/store/components/whatsapp-order-button.tsx" "features/store/components/whatsapp-order-button.tsx"

# ============================================
# HOOKS
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${PURPLE}🪝 HOOKS${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
🪝 HOOKS
================================================================================

EOF

collect_file "$BASE_PATH/hooks/index.ts" "hooks/index.ts"
collect_file "$BASE_PATH/hooks/use-debounce.ts" "hooks/use-debounce.ts"
collect_file "$BASE_PATH/hooks/use-mobile.ts" "hooks/use-mobile.ts"

# ============================================
# LIB
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${PURPLE}📚 LIB${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
📚 LIB
================================================================================

EOF

collect_file "$BASE_PATH/lib/index.ts" "lib/index.ts"
collect_file "$BASE_PATH/lib/cloudinary/index.ts" "lib/cloudinary/index.ts"
collect_file "$BASE_PATH/lib/formatters/index.ts" "lib/formatters/index.ts"
collect_file "$BASE_PATH/lib/landing-templates/index.ts" "lib/landing-templates/index.ts"
collect_file "$BASE_PATH/lib/landing-templates/constants.ts" "lib/landing-templates/constants.ts"
collect_file "$BASE_PATH/lib/landing-templates/defaults.ts" "lib/landing-templates/defaults.ts"
collect_file "$BASE_PATH/lib/landing-templates/helpers.ts" "lib/landing-templates/helpers.ts"
collect_file "$BASE_PATH/lib/landing-templates/utils.ts" "lib/landing-templates/utils.ts"
collect_file "$BASE_PATH/lib/landing-templates/context/index.ts" "lib/landing-templates/context/index.ts"
collect_file "$BASE_PATH/lib/landing-templates/context/template-context.tsx" "lib/landing-templates/context/template-context.tsx"
collect_file "$BASE_PATH/lib/landing-templates/templates/index.ts" "lib/landing-templates/templates/index.ts"
collect_file "$BASE_PATH/lib/landing-templates/templates/template-defaults.ts" "lib/landing-templates/templates/template-defaults.ts"
collect_file "$BASE_PATH/lib/landing-templates/templates/template-metadata.ts" "lib/landing-templates/templates/template-metadata.ts"
collect_file "$BASE_PATH/lib/landing-templates/templates/template-types.ts" "lib/landing-templates/templates/template-types.ts"
collect_file "$BASE_PATH/lib/seo/index.ts" "lib/seo/index.ts"
collect_file "$BASE_PATH/lib/seo/og.ts" "lib/seo/og.ts"
collect_file "$BASE_PATH/lib/seo/url.ts" "lib/seo/url.ts"
collect_file "$BASE_PATH/lib/theme/index.ts" "lib/theme/index.ts"
collect_file "$BASE_PATH/lib/theme/colors.ts" "lib/theme/colors.ts"

# ============================================
# PROVIDERS
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${PURPLE}🔧 PROVIDERS${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
🔧 PROVIDERS
================================================================================

EOF

collect_file "$BASE_PATH/providers/index.tsx" "providers/index.tsx"
collect_file "$BASE_PATH/providers/hydration-provider.tsx" "providers/hydration-provider.tsx"
collect_file "$BASE_PATH/providers/theme-provider.tsx" "providers/theme-provider.tsx"
collect_file "$BASE_PATH/providers/toast-provider.tsx" "providers/toast-provider.tsx"

# ============================================
# STORES
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${PURPLE}🏪 STORES${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
🏪 STORES
================================================================================

EOF

collect_file "$BASE_PATH/stores/index.ts" "stores/index.ts"
collect_file "$BASE_PATH/stores/cart-store.ts" "stores/cart-store.ts"
collect_file "$BASE_PATH/stores/ui-store.ts" "stores/ui-store.ts"

# ============================================
# TYPES
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${PURPLE}📝 TYPES${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
📝 TYPES
================================================================================

EOF

collect_file "$BASE_PATH/types/index.ts" "types/index.ts"
collect_file "$BASE_PATH/types/api.ts" "types/api.ts"
collect_file "$BASE_PATH/types/auth.ts" "types/auth.ts"
collect_file "$BASE_PATH/types/category.ts" "types/category.ts"
collect_file "$BASE_PATH/types/cloudinary.ts" "types/cloudinary.ts"
collect_file "$BASE_PATH/types/customer.ts" "types/customer.ts"
collect_file "$BASE_PATH/types/discover.ts" "types/discover.ts"
collect_file "$BASE_PATH/types/enums.ts" "types/enums.ts"
collect_file "$BASE_PATH/types/landing.ts" "types/landing.ts"
collect_file "$BASE_PATH/types/onboarding.ts" "types/onboarding.ts"
collect_file "$BASE_PATH/types/order.ts" "types/order.ts"
collect_file "$BASE_PATH/types/product.ts" "types/product.ts"
collect_file "$BASE_PATH/types/seo.ts" "types/seo.ts"
collect_file "$BASE_PATH/types/tenant.ts" "types/tenant.ts"

# ============================================
# UTILS
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${PURPLE}🛠️  UTILS${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
🛠️ UTILS
================================================================================

EOF

collect_file "$BASE_PATH/utils/index.ts" "utils/index.ts"
collect_file "$BASE_PATH/utils/cn.ts" "utils/cn.ts"
collect_file "$BASE_PATH/utils/format.ts" "utils/format.ts"

# Root index
collect_file "$BASE_PATH/index.ts" "index.ts"

# ============================================
# SUMMARY
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${PURPLE}📊 SUMMARY${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
📊 COLLECTION SUMMARY
================================================================================

Collected:
✅ API (4 files)
✅ Components (2 files)
✅ Config (5 files)
✅ Features - PWA (4 files)
✅ Features - SEO (11 files)
✅ Features - Store (24 files)
✅ Hooks (3 files)
✅ Lib (19 files)
✅ Providers (4 files)
✅ Stores (3 files)
✅ Types (14 files)
✅ Utils (3 files)

Skipped:
❌ features/landing-blocks/* (66 files - hero, about, products, testimonials, contact, cta)
❌ ui/* (80+ UI component files)

Statistics:
- ✅ Files collected: $FOUND
- 📝 Total lines: $TOTAL_LINES

Output: $(pwd)/$OUTPUT_FILE

================================================================================
END OF COLLECTION
================================================================================
EOF

echo -e "${GREEN}✅ Collection complete!${NC}"
echo -e "${BLUE}📄 Output: $OUTPUT_FILE${NC}"
echo -e "${CYAN}📊 Files: $FOUND | Lines: $TOTAL_LINES${NC}"
echo -e "${YELLOW}⚠️  Skipped: landing-blocks (66 files) & UI components (80+ files)${NC}"
echo ""
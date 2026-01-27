#!/bin/bash

# ============================================
# CORE MODULES COLLECTOR
# Collects: types, hooks, stores, lib, config
# For refactoring analysis
# ============================================
#
# Usage:
# chmod +x collect-core-modules.sh
# ./collect-core-modules.sh
#
# ============================================

OUTPUT_DIR="collections"
OUTPUT_FILE="$OUTPUT_DIR/core-modules-$(date +%Y%m%d-%H%M%S).txt"

mkdir -p "$OUTPUT_DIR"

echo "🔍 Core Modules Collector"
echo "=============================================="
echo ""
echo "📍 Working directory: $(pwd)"
echo "📄 Output file: $OUTPUT_FILE"
echo ""

FOUND_COUNT=0
NOT_FOUND_COUNT=0
TOTAL_LINES=0

cat > "$OUTPUT_FILE" << EOF
================================================================
CORE MODULES - COMPLETE COLLECTION
Generated on: $(date)
Working Directory: $(pwd)
================================================================

SCOPE:
- Types (src/types/)
- Hooks (src/hooks/)
- Stores (src/stores/)
- Lib (src/lib/)
- Config (src/config/)

================================================================

EOF

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
    fi
}

# ============================================
# SECTION 1: TYPES
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📝 TYPES (src/types/) - 9 files"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/types/index.ts" "src/types/index.ts"
collect_file "src/types/api.ts" "src/types/api.ts"
collect_file "src/types/auth.ts" "src/types/auth.ts"
collect_file "src/types/cloudinary.ts" "src/types/cloudinary.ts"
collect_file "src/types/customer.ts" "src/types/customer.ts"
collect_file "src/types/landing.ts" "src/types/landing.ts"
collect_file "src/types/order.ts" "src/types/order.ts"
collect_file "src/types/product.ts" "src/types/product.ts"
collect_file "src/types/tenant.ts" "src/types/tenant.ts"

# ============================================
# SECTION 2: HOOKS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🪝 HOOKS (src/hooks/) - 12 files"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/hooks/index.ts" "src/hooks/index.ts"
collect_file "src/hooks/use-auth.ts" "src/hooks/use-auth.ts"
collect_file "src/hooks/use-customers.ts" "src/hooks/use-customers.ts"
collect_file "src/hooks/use-debounce.ts" "src/hooks/use-debounce.ts"
collect_file "src/hooks/use-landing-config.ts" "src/hooks/use-landing-config.ts"
collect_file "src/hooks/use-media-query.ts" "src/hooks/use-media-query.ts"
collect_file "src/hooks/use-mobile.ts" "src/hooks/use-mobile.ts"
collect_file "src/hooks/use-mounted.ts" "src/hooks/use-mounted.ts"
collect_file "src/hooks/use-orders.ts" "src/hooks/use-orders.ts"
collect_file "src/hooks/use-products.ts" "src/hooks/use-products.ts"
collect_file "src/hooks/use-pwa.ts" "src/hooks/use-pwa.ts"
collect_file "src/hooks/use-tenant.ts" "src/hooks/use-tenant.ts"

# ============================================
# SECTION 3: STORES
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🏪 STORES (src/stores/) - 5 files"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/stores/index.ts" "src/stores/index.ts"
collect_file "src/stores/auth-store.ts" "src/stores/auth-store.ts"
collect_file "src/stores/cart-store.ts" "src/stores/cart-store.ts"
collect_file "src/stores/products-store.ts" "src/stores/products-store.ts"
collect_file "src/stores/ui-store.ts" "src/stores/ui-store.ts"

# ============================================
# SECTION 4: LIB (Non-API)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📚 LIB (src/lib/) - 12 files"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/lib/index.ts" "src/lib/index.ts"
collect_file "src/lib/cn.ts" "src/lib/cn.ts"
collect_file "src/lib/utils.ts" "src/lib/utils.ts"
collect_file "src/lib/format.ts" "src/lib/format.ts"
collect_file "src/lib/store-url.ts" "src/lib/store-url.ts"
collect_file "src/lib/cloudinary.ts" "src/lib/cloudinary.ts"
collect_file "src/lib/invoice.ts" "src/lib/invoice.ts"
collect_file "src/lib/landing-utils.ts" "src/lib/landing-utils.ts"
collect_file "src/lib/og-utils.ts" "src/lib/og-utils.ts"
collect_file "src/lib/schema.ts" "src/lib/schema.ts"
collect_file "src/lib/seo.ts" "src/lib/seo.ts"
collect_file "src/lib/validations.ts" "src/lib/validations.ts"

# ============================================
# SECTION 5: LIB/API
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🌐 LIB/API (src/lib/api/) - 8 files"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/lib/api/index.ts" "src/lib/api/index.ts"
collect_file "src/lib/api/client.ts" "src/lib/api/client.ts"
collect_file "src/lib/api/server.ts" "src/lib/api/server.ts"
collect_file "src/lib/api/auth.ts" "src/lib/api/auth.ts"
collect_file "src/lib/api/tenants.ts" "src/lib/api/tenants.ts"
collect_file "src/lib/api/products.ts" "src/lib/api/products.ts"
collect_file "src/lib/api/customers.ts" "src/lib/api/customers.ts"
collect_file "src/lib/api/orders.ts" "src/lib/api/orders.ts"

# ============================================
# SECTION 6: CONFIG
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "⚙️ CONFIG (src/config/) - 6 files"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/config/index.ts" "src/config/index.ts"
collect_file "src/config/categories.ts" "src/config/categories.ts"
collect_file "src/config/constants.ts" "src/config/constants.ts"
collect_file "src/config/navigation.ts" "src/config/navigation.ts"
collect_file "src/config/seo.config.ts" "src/config/seo.config.ts"
collect_file "src/config/site.ts" "src/config/site.ts"

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

📦 Core Modules:
   📝 Types:    9 files  (src/types/)
   🪝 Hooks:   12 files  (src/hooks/)
   🏪 Stores:   5 files  (src/stores/)
   📚 Lib:     12 files  (src/lib/)
   🌐 API:      8 files  (src/lib/api/)
   ⚙️ Config:   6 files  (src/config/)
   ─────────────────────────
   📁 Total:   52 files
   
📝 Stats:
   ✅ Found: $FOUND_COUNT files
   ❌ Missing: $NOT_FOUND_COUNT files
   📝 Total lines: $TOTAL_LINES

📍 Output: $(pwd)/$OUTPUT_FILE

================================================================
END OF COLLECTION
================================================================
EOF

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Core modules collected!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📄 Output: $OUTPUT_FILE"
echo "📊 Found: $FOUND_COUNT | Missing: $NOT_FOUND_COUNT | Lines: $TOTAL_LINES"
echo ""
echo "📋 Sections collected:"
echo "   • Types (src/types/)"
echo "   • Hooks (src/hooks/)"
echo "   • Stores (src/stores/)"
echo "   • Lib (src/lib/)"
echo "   • API (src/lib/api/)"
echo "   • Config (src/config/)"
echo ""
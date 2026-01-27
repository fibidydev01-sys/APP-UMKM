#!/bin/bash

# ============================================
# FILE COLLECTOR FOR SETTINGS MODULE DEPENDENCIES
# VERSION 3.0 - COMPLETE & CORRECTED
# ============================================
# 
# Script ini akan mengumpulkan SEMUA file yang dibutuhkan
# untuk refactor settings/page.tsx TANPA ERROR
#
# Usage:
# chmod +x collect-settings-deps-v3.sh
# ./collect-settings-deps-v3.sh
#
# Run from: /path/to/client (root folder Next.js)
#
# ============================================

OUTPUT_FILE="settings-dependencies-complete-$(date +%Y%m%d-%H%M%S).md"

echo "🚀 Settings Module Dependencies Collector v3.0"
echo "==============================================="
echo ""
echo "📍 Working directory: $(pwd)"
echo "📄 Output file: $OUTPUT_FILE"
echo ""

# Mulai menulis ke file
cat > "$OUTPUT_FILE" << 'EOF'
# Settings Module - Complete Dependencies v3.0
Generated on: $(date)

## Purpose
SEMUA file yang dibutuhkan untuk refactor `settings/page.tsx` TANPA ERROR.

## File Categories

### 🔴 CRITICAL - Settings Components (9 files)
- `src/components/settings/index.ts`
- `src/components/settings/settings-nav.tsx`
- `src/components/settings/store-info-form.tsx`
- `src/components/settings/appearance-settings.tsx`
- `src/components/settings/payment-settings.tsx`
- `src/components/settings/shipping-settings.tsx`
- `src/components/settings/seo-settings.tsx`
- `src/components/settings/bank-account-dialog.tsx`
- `src/components/settings/ewallet-dialog.tsx`

### 🟠 IMPORTANT - Landing Components (10 files)
- `src/components/landing/index.ts`
- `src/components/landing/landing-builder.tsx`
- `src/components/landing/landing-error-boundary.tsx`
- `src/components/landing/testimonial-editor.tsx`
- `src/components/landing/tenant-hero.tsx`
- `src/components/landing/tenant-about.tsx`
- `src/components/landing/tenant-products.tsx`
- `src/components/landing/tenant-testimonials.tsx`
- `src/components/landing/tenant-contact.tsx`
- `src/components/landing/tenant-cta.tsx`

### 🟡 SUPPORT - Upload Components (3 files)
- `src/components/upload/index.ts`
- `src/components/upload/image-upload.tsx`
- `src/components/upload/multi-image-upload.tsx`

### ✅ Standard Dependencies
- Hooks (12 files)
- Lib/API (8 files)
- Lib Utilities (12 files)
- Dashboard Components (9 files)
- Providers (4 files)
- Stores (5 files)
- Types (9 files)
- Config (6 files)

---

EOF

echo "📦 Collecting files..."
echo ""

# ============================================
# FUNGSI UNTUK COLLECT FILE
# ============================================

collect_file() {
    local file=$1
    local relative_path=$2
    
    if [ -f "$file" ]; then
        echo "✅ Found: $relative_path"
        cat >> "$OUTPUT_FILE" << EOF

## File: \`$relative_path\`

\`\`\`typescript
$(cat "$file")
\`\`\`

---

EOF
    else
        echo "❌ NOT FOUND: $relative_path"
        cat >> "$OUTPUT_FILE" << EOF

## File: \`$relative_path\`

> ⚠️ **FILE NOT FOUND** - Perlu dibuat atau path salah!

---

EOF
    fi
}

# ============================================
# SECTION 1: SETTINGS COMPONENTS (CRITICAL!)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🔴 CRITICAL: Settings Components"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << 'EOF'

# ═══════════════════════════════════════════════════════════════
# SECTION 1: SETTINGS COMPONENTS (CRITICAL!)
# ═══════════════════════════════════════════════════════════════

EOF

collect_file "src/components/settings/index.ts" "src/components/settings/index.ts"
collect_file "src/components/settings/settings-nav.tsx" "src/components/settings/settings-nav.tsx"
collect_file "src/components/settings/store-info-form.tsx" "src/components/settings/store-info-form.tsx"
collect_file "src/components/settings/appearance-settings.tsx" "src/components/settings/appearance-settings.tsx"
collect_file "src/components/settings/payment-settings.tsx" "src/components/settings/payment-settings.tsx"
collect_file "src/components/settings/shipping-settings.tsx" "src/components/settings/shipping-settings.tsx"
collect_file "src/components/settings/seo-settings.tsx" "src/components/settings/seo-settings.tsx"
collect_file "src/components/settings/bank-account-dialog.tsx" "src/components/settings/bank-account-dialog.tsx"
collect_file "src/components/settings/ewallet-dialog.tsx" "src/components/settings/ewallet-dialog.tsx"

# ============================================
# SECTION 2: LANDING COMPONENTS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🟠 IMPORTANT: Landing Components"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << 'EOF'

# ═══════════════════════════════════════════════════════════════
# SECTION 2: LANDING COMPONENTS
# ═══════════════════════════════════════════════════════════════

EOF

collect_file "src/components/landing/index.ts" "src/components/landing/index.ts"
collect_file "src/components/landing/landing-builder.tsx" "src/components/landing/landing-builder.tsx"
collect_file "src/components/landing/landing-error-boundary.tsx" "src/components/landing/landing-error-boundary.tsx"
collect_file "src/components/landing/testimonial-editor.tsx" "src/components/landing/testimonial-editor.tsx"
collect_file "src/components/landing/tenant-hero.tsx" "src/components/landing/tenant-hero.tsx"
collect_file "src/components/landing/tenant-about.tsx" "src/components/landing/tenant-about.tsx"
collect_file "src/components/landing/tenant-products.tsx" "src/components/landing/tenant-products.tsx"
collect_file "src/components/landing/tenant-testimonials.tsx" "src/components/landing/tenant-testimonials.tsx"
collect_file "src/components/landing/tenant-contact.tsx" "src/components/landing/tenant-contact.tsx"
collect_file "src/components/landing/tenant-cta.tsx" "src/components/landing/tenant-cta.tsx"

# ============================================
# SECTION 3: UPLOAD COMPONENTS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🟡 SUPPORT: Upload Components"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << 'EOF'

# ═══════════════════════════════════════════════════════════════
# SECTION 3: UPLOAD COMPONENTS
# ═══════════════════════════════════════════════════════════════

EOF

collect_file "src/components/upload/index.ts" "src/components/upload/index.ts"
collect_file "src/components/upload/image-upload.tsx" "src/components/upload/image-upload.tsx"
collect_file "src/components/upload/multi-image-upload.tsx" "src/components/upload/multi-image-upload.tsx"

# ============================================
# SECTION 4: HOOKS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📁 Hooks"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << 'EOF'

# ═══════════════════════════════════════════════════════════════
# SECTION 4: HOOKS
# ═══════════════════════════════════════════════════════════════

EOF

collect_file "src/hooks/index.ts" "src/hooks/index.ts"
collect_file "src/hooks/use-auth.ts" "src/hooks/use-auth.ts"
collect_file "src/hooks/use-tenant.ts" "src/hooks/use-tenant.ts"
collect_file "src/hooks/use-landing-config.ts" "src/hooks/use-landing-config.ts"
collect_file "src/hooks/use-debounce.ts" "src/hooks/use-debounce.ts"
collect_file "src/hooks/use-media-query.ts" "src/hooks/use-media-query.ts"
collect_file "src/hooks/use-mobile.ts" "src/hooks/use-mobile.ts"
collect_file "src/hooks/use-mounted.ts" "src/hooks/use-mounted.ts"
collect_file "src/hooks/use-customers.ts" "src/hooks/use-customers.ts"
collect_file "src/hooks/use-orders.ts" "src/hooks/use-orders.ts"
collect_file "src/hooks/use-products.ts" "src/hooks/use-products.ts"
collect_file "src/hooks/use-pwa.ts" "src/hooks/use-pwa.ts"

# ============================================
# SECTION 5: LIB/API
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📁 Lib/API"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << 'EOF'

# ═══════════════════════════════════════════════════════════════
# SECTION 5: LIB/API
# ═══════════════════════════════════════════════════════════════

EOF

collect_file "src/lib/api/index.ts" "src/lib/api/index.ts"
collect_file "src/lib/api/client.ts" "src/lib/api/client.ts"
collect_file "src/lib/api/server.ts" "src/lib/api/server.ts"
collect_file "src/lib/api/tenants.ts" "src/lib/api/tenants.ts"
collect_file "src/lib/api/auth.ts" "src/lib/api/auth.ts"
collect_file "src/lib/api/customers.ts" "src/lib/api/customers.ts"
collect_file "src/lib/api/orders.ts" "src/lib/api/orders.ts"
collect_file "src/lib/api/products.ts" "src/lib/api/products.ts"

# ============================================
# SECTION 6: LIB UTILITIES
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📁 Lib Utilities"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << 'EOF'

# ═══════════════════════════════════════════════════════════════
# SECTION 6: LIB UTILITIES
# ═══════════════════════════════════════════════════════════════

EOF

collect_file "src/lib/index.ts" "src/lib/index.ts"
collect_file "src/lib/utils.ts" "src/lib/utils.ts"
collect_file "src/lib/cn.ts" "src/lib/cn.ts"
collect_file "src/lib/format.ts" "src/lib/format.ts"
collect_file "src/lib/validations.ts" "src/lib/validations.ts"
collect_file "src/lib/landing-utils.ts" "src/lib/landing-utils.ts"
collect_file "src/lib/cloudinary.ts" "src/lib/cloudinary.ts"
collect_file "src/lib/invoice.ts" "src/lib/invoice.ts"
collect_file "src/lib/og-utils.ts" "src/lib/og-utils.ts"
collect_file "src/lib/schema.ts" "src/lib/schema.ts"
collect_file "src/lib/seo.ts" "src/lib/seo.ts"
collect_file "src/lib/store-url.ts" "src/lib/store-url.ts"

# ============================================
# SECTION 7: DASHBOARD COMPONENTS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📁 Dashboard Components"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << 'EOF'

# ═══════════════════════════════════════════════════════════════
# SECTION 7: DASHBOARD COMPONENTS
# ═══════════════════════════════════════════════════════════════

EOF

collect_file "src/components/dashboard/index.ts" "src/components/dashboard/index.ts"
collect_file "src/components/dashboard/dashboard-shell.tsx" "src/components/dashboard/dashboard-shell.tsx"
collect_file "src/components/dashboard/dashboard-header.tsx" "src/components/dashboard/dashboard-header.tsx"
collect_file "src/components/dashboard/dashboard-breadcrumb.tsx" "src/components/dashboard/dashboard-breadcrumb.tsx"
collect_file "src/components/dashboard/dashboard-layout.tsx" "src/components/dashboard/dashboard-layout.tsx"
collect_file "src/components/dashboard/dashboard-nav.tsx" "src/components/dashboard/dashboard-nav.tsx"
collect_file "src/components/dashboard/dashboard-sidebar.tsx" "src/components/dashboard/dashboard-sidebar.tsx"
collect_file "src/components/dashboard/dashboard-quick-actions.tsx" "src/components/dashboard/dashboard-quick-actions.tsx"
collect_file "src/components/dashboard/mobile-navbar.tsx" "src/components/dashboard/mobile-navbar.tsx"

# ============================================
# SECTION 8: PROVIDERS
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📁 Providers"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << 'EOF'

# ═══════════════════════════════════════════════════════════════
# SECTION 8: PROVIDERS
# ═══════════════════════════════════════════════════════════════

EOF

collect_file "src/providers/index.tsx" "src/providers/index.tsx"
collect_file "src/providers/toast-provider.tsx" "src/providers/toast-provider.tsx"
collect_file "src/providers/theme-provider.tsx" "src/providers/theme-provider.tsx"
collect_file "src/providers/hydration-provider.tsx" "src/providers/hydration-provider.tsx"

# ============================================
# SECTION 9: STORES
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📁 Stores"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << 'EOF'

# ═══════════════════════════════════════════════════════════════
# SECTION 9: STORES
# ═══════════════════════════════════════════════════════════════

EOF

collect_file "src/stores/index.ts" "src/stores/index.ts"
collect_file "src/stores/auth-store.ts" "src/stores/auth-store.ts"
collect_file "src/stores/ui-store.ts" "src/stores/ui-store.ts"
collect_file "src/stores/cart-store.ts" "src/stores/cart-store.ts"
collect_file "src/stores/products-store.ts" "src/stores/products-store.ts"

# ============================================
# SECTION 10: TYPES
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📁 Types"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << 'EOF'

# ═══════════════════════════════════════════════════════════════
# SECTION 10: TYPES
# ═══════════════════════════════════════════════════════════════

EOF

collect_file "src/types/index.ts" "src/types/index.ts"
collect_file "src/types/api.ts" "src/types/api.ts"
collect_file "src/types/auth.ts" "src/types/auth.ts"
collect_file "src/types/tenant.ts" "src/types/tenant.ts"
collect_file "src/types/landing.ts" "src/types/landing.ts"
collect_file "src/types/product.ts" "src/types/product.ts"
collect_file "src/types/customer.ts" "src/types/customer.ts"
collect_file "src/types/order.ts" "src/types/order.ts"
collect_file "src/types/cloudinary.ts" "src/types/cloudinary.ts"

# ============================================
# SECTION 11: CONFIG
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📁 Config"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << 'EOF'

# ═══════════════════════════════════════════════════════════════
# SECTION 11: CONFIG
# ═══════════════════════════════════════════════════════════════

EOF

collect_file "src/config/index.ts" "src/config/index.ts"
collect_file "src/config/constants.ts" "src/config/constants.ts"
collect_file "src/config/navigation.ts" "src/config/navigation.ts"
collect_file "src/config/site.ts" "src/config/site.ts"
collect_file "src/config/categories.ts" "src/config/categories.ts"
collect_file "src/config/seo.config.ts" "src/config/seo.config.ts"

# ============================================
# SECTION 12: TARGET FILE (Settings Page)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🎯 Target: Settings Page"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << 'EOF'

# ═══════════════════════════════════════════════════════════════
# SECTION 12: TARGET FILE TO REFACTOR
# ═══════════════════════════════════════════════════════════════

EOF

collect_file "src/app/(dashboard)/dashboard/settings/page.tsx" "src/app/(dashboard)/dashboard/settings/page.tsx"

# ============================================
# SUMMARY
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📊 SUMMARY"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << 'EOF'

# ═══════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════

## Total Files Collected:

| Section | Count | Status |
|---------|-------|--------|
| Settings Components | 9 | 🔴 CRITICAL |
| Landing Components | 10 | 🟠 IMPORTANT |
| Upload Components | 3 | 🟡 SUPPORT |
| Hooks | 12 | ✅ Standard |
| Lib/API | 8 | ✅ Standard |
| Lib Utilities | 12 | ✅ Standard |
| Dashboard Components | 9 | ✅ Standard |
| Providers | 4 | ✅ Standard |
| Stores | 5 | ✅ Standard |
| Types | 9 | ✅ Standard |
| Config | 6 | ✅ Standard |
| Target File | 1 | 🎯 TO REFACTOR |
| **TOTAL** | **88** | |

## Import Dependencies Map:

```
settings/page.tsx
├── @/components/ui/* (shadcn - external)
├── @/components/dashboard
│   └── PageHeader
├── @/components/landing
│   ├── LandingBuilder
│   └── LandingErrorBoundary
├── @/components/settings ← 🔴 CRITICAL
│   ├── SettingsNav
│   ├── StoreInfoForm
│   ├── AppearanceSettings
│   ├── PaymentSettings
│   ├── ShippingSettings
│   ├── SeoSettings
│   ├── BankAccountDialog
│   └── EwalletDialog
├── @/hooks
│   ├── useTenant
│   └── useLandingConfig
├── @/lib/api
│   └── tenantsApi
├── @/types
│   ├── BankAccount
│   ├── EWallet
│   ├── PaymentMethods
│   ├── ShippingMethods
│   ├── SocialLinks
│   └── CourierName
└── sonner
    └── toast
```

## Next Steps:
1. Review file ini untuk memastikan semua file ditemukan
2. Upload ke Claude
3. Claude akan membantu refactor sesuai kebutuhan

EOF

echo "✅ Collection complete!"
echo ""
echo "📄 Output file: $OUTPUT_FILE"
echo "📊 File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
echo ""
echo "📋 Files collected per section:"
echo "   🔴 Settings Components: 9 files"
echo "   🟠 Landing Components: 10 files"
echo "   🟡 Upload Components: 3 files"
echo "   📁 Hooks: 12 files"
echo "   📁 Lib/API: 8 files"
echo "   📁 Lib Utilities: 12 files"
echo "   📁 Dashboard Components: 9 files"
echo "   📁 Providers: 4 files"
echo "   📁 Stores: 5 files"
echo "   📁 Types: 9 files"
echo "   📁 Config: 6 files"
echo "   🎯 Target: 1 file"
echo ""
echo "   TOTAL: 88 files"
echo ""
echo "💡 Next steps:"
echo "   1. Review the generated .md file"
echo "   2. Check if all files are found (✅ vs ❌)"
echo "   3. Upload to Claude for refactoring"
echo ""
echo "🎉 Done!"
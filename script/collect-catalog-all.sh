#!/bin/bash

# ============================================
# CATALOG COMPONENTS COLLECTOR
# Collects all files from src/app and src/features
# ============================================

OUTPUT_DIR="../collections"
OUTPUT_FILE="$OUTPUT_DIR/catalog-all-$(date +%Y%m%d-%H%M%S).txt"
BASE_PATH="../catalog/src"

mkdir -p "$OUTPUT_DIR"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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
echo -e "${CYAN}║   📦 CATALOG COMPONENTS COLLECTOR     ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════╝${NC}"
echo ""

# Initialize output
cat > "$OUTPUT_FILE" << EOF
================================================================================
CATALOG COMPONENTS - FULL COLLECTION
================================================================================
Generated: $(date)
Working Directory: $(pwd)

SCOPE:
- All app/* files (pages, layouts, components)
- All features/* files (components, lib, utilities)
- All lib/* files (services, utilities)

================================================================================
EOF

# ============================================
# APP DIRECTORY
# ============================================

echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${PURPLE}📱 APP DIRECTORY${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
📱 APP DIRECTORY
================================================================================

EOF

# Root app files
collect_file "$BASE_PATH/app/globals.css" "app/globals.css"
collect_file "$BASE_PATH/app/layout.tsx" "app/layout.tsx"
collect_file "$BASE_PATH/app/page.tsx" "app/page.tsx"

# Discover
echo -e "${BLUE}📂 app/discover${NC}"
collect_file "$BASE_PATH/app/discover/client.tsx" "app/discover/client.tsx"
collect_file "$BASE_PATH/app/discover/page.tsx" "app/discover/page.tsx"
collect_file "$BASE_PATH/app/discover/[category]/client.tsx" "app/discover/[category]/client.tsx"
collect_file "$BASE_PATH/app/discover/[category]/not-found.tsx" "app/discover/[category]/not-found.tsx"
collect_file "$BASE_PATH/app/discover/[category]/page.tsx" "app/discover/[category]/page.tsx"

# Store
echo -e "${BLUE}📂 app/store/[slug]${NC}"
collect_file "$BASE_PATH/app/store/[slug]/layout.tsx" "app/store/[slug]/layout.tsx"
collect_file "$BASE_PATH/app/store/[slug]/opengraph-image.tsx" "app/store/[slug]/opengraph-image.tsx"
collect_file "$BASE_PATH/app/store/[slug]/page.tsx" "app/store/[slug]/page.tsx"
collect_file "$BASE_PATH/app/store/[slug]/about/page.tsx" "app/store/[slug]/about/page.tsx"
collect_file "$BASE_PATH/app/store/[slug]/contact/page.tsx" "app/store/[slug]/contact/page.tsx"
collect_file "$BASE_PATH/app/store/[slug]/testimonials/page.tsx" "app/store/[slug]/testimonials/page.tsx"
collect_file "$BASE_PATH/app/store/[slug]/products/page.tsx" "app/store/[slug]/products/page.tsx"
collect_file "$BASE_PATH/app/store/[slug]/products/[id]/not-found.tsx" "app/store/[slug]/products/[id]/not-found.tsx"
collect_file "$BASE_PATH/app/store/[slug]/products/[id]/opengraph-image.tsx" "app/store/[slug]/products/[id]/opengraph-image.tsx"
collect_file "$BASE_PATH/app/store/[slug]/products/[id]/page.tsx" "app/store/[slug]/products/[id]/page.tsx"
collect_file "$BASE_PATH/app/store/[slug]/components/store-landing.tsx" "app/store/[slug]/components/store-landing.tsx"

# ============================================
# FEATURES DIRECTORY
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${PURPLE}🎨 FEATURES DIRECTORY${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
🎨 FEATURES DIRECTORY
================================================================================

EOF

# Discover feature
echo -e "${BLUE}📂 features/discover${NC}"
collect_file "$BASE_PATH/features/discover/index.ts" "features/discover/index.ts"
collect_file "$BASE_PATH/features/discover/components/index.ts" "features/discover/components/index.ts"
collect_file "$BASE_PATH/features/discover/components/category-filter-bar.tsx" "features/discover/components/category-filter-bar.tsx"
collect_file "$BASE_PATH/features/discover/components/discover-footer.tsx" "features/discover/components/discover-footer.tsx"
collect_file "$BASE_PATH/features/discover/components/discover-header.tsx" "features/discover/components/discover-header.tsx"
collect_file "$BASE_PATH/features/discover/components/discover-hero.tsx" "features/discover/components/discover-hero.tsx"
collect_file "$BASE_PATH/features/discover/components/discover-search.tsx" "features/discover/components/discover-search.tsx"
collect_file "$BASE_PATH/features/discover/components/minimal-footer.tsx" "features/discover/components/minimal-footer.tsx"
collect_file "$BASE_PATH/features/discover/components/no-results.tsx" "features/discover/components/no-results.tsx"
collect_file "$BASE_PATH/features/discover/components/search-results-header.tsx" "features/discover/components/search-results-header.tsx"
collect_file "$BASE_PATH/features/discover/components/tenant-card.tsx" "features/discover/components/tenant-card.tsx"
collect_file "$BASE_PATH/features/discover/components/tenant-preview-drawer.tsx" "features/discover/components/tenant-preview-drawer.tsx"
collect_file "$BASE_PATH/features/discover/components/umkm-discover-section.tsx" "features/discover/components/umkm-discover-section.tsx"
collect_file "$BASE_PATH/features/discover/components/umkm-showcase-section.tsx" "features/discover/components/umkm-showcase-section.tsx"
collect_file "$BASE_PATH/features/discover/lib/index.ts" "features/discover/lib/index.ts"
collect_file "$BASE_PATH/features/discover/lib/api.ts" "features/discover/lib/api.ts"
collect_file "$BASE_PATH/features/discover/lib/constants.ts" "features/discover/lib/constants.ts"
collect_file "$BASE_PATH/features/discover/lib/utils.ts" "features/discover/lib/utils.ts"

# ============================================
# LIB DIRECTORY
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo -e "${PURPLE}📚 LIB DIRECTORY${NC}"
echo -e "${PURPLE}═══════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
📚 LIB DIRECTORY
================================================================================

EOF

collect_file "$BASE_PATH/lib/categories/unified-service.ts" "lib/categories/unified-service.ts"

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
echo ""
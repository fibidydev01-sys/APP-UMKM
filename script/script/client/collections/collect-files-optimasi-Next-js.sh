#!/bin/bash

# ================================================
# FIBIDY CLIENT - CLOUDINARY & IMAGE OPTIMIZATION
# Collection Script for Next.js Cloudinary Migration
# Version: 1.0
# Purpose: Collect all files related to image handling for optimization
# ================================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

# Path configuration - SESUAIKAN DENGAN PATH LU!
PROJECT_ROOT="/d/PRODUK-LPPM-FINAL/UMKM-MULTI-TENANT/client"
SRC_PATH="$PROJECT_ROOT/src"
OUTPUT_DIR="collections"
OUTPUT_FILE="$OUTPUT_DIR/cloudinary-optimization-files.txt"

# Statistics
total_files=0
total_lines=0

# Function: Display header
show_header() {
    clear
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                                                  ║${NC}"
    echo -e "${BLUE}║    ${BOLD}CLOUDINARY & IMAGE OPTIMIZATION COLLECTOR${NC}${BLUE}                 ║${NC}"
    echo -e "${BLUE}║         Next.js 15 + Cloudinary Migration                        ║${NC}"
    echo -e "${BLUE}║                                                                  ║${NC}"
    echo -e "${BLUE}║    ${CYAN}Files to collect:${NC}${BLUE}                                          ║${NC}"
    echo -e "${BLUE}║    ${CYAN}✓ Store Components (product images)${NC}${BLUE}                       ║${NC}"
    echo -e "${BLUE}║    ${CYAN}✓ Upload Components (image upload)${NC}${BLUE}                        ║${NC}"
    echo -e "${BLUE}║    ${CYAN}✓ Landing Components (hero, testimonials)${NC}${BLUE}                 ║${NC}"
    echo -e "${BLUE}║    ${CYAN}✓ Cloudinary Config & Types${NC}${BLUE}                               ║${NC}"
    echo -e "${BLUE}║    ${CYAN}✓ Next.js Config${NC}${BLUE}                                          ║${NC}"
    echo -e "${BLUE}║    ${CYAN}✓ Store Pages (tenant store)${NC}${BLUE}                              ║${NC}"
    echo -e "${BLUE}║                                                                  ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Function: Count lines in file
count_file_lines() {
    local file=$1
    if [ -f "$file" ]; then
        wc -l < "$file" 2>/dev/null || echo "0"
    else
        echo "0"
    fi
}

# Function: Process single file
process_file() {
    local file=$1
    local section_name=$2
    
    if [ ! -f "$file" ]; then
        echo -e "${YELLOW}  ⚠️  File not found: $file${NC}"
        return 1
    fi
    
    local relative_path=${file#$PROJECT_ROOT/}
    local lines=$(count_file_lines "$file")
    total_lines=$((total_lines + lines))
    total_files=$((total_files + 1))
    
    echo -e "${GREEN}    ├─ ${NC}$relative_path ${CYAN}(${lines} lines)${NC}"
    
    echo "================================================" >> "$OUTPUT_FILE"
    echo "FILE: $relative_path" >> "$OUTPUT_FILE"
    echo "Lines: $lines" >> "$OUTPUT_FILE"
    echo "================================================" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    cat "$file" >> "$OUTPUT_FILE" 2>/dev/null
    
    echo "" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    return 0
}

# Function: Process directory
process_directory() {
    local dir=$1
    local section_name=$2
    
    if [ ! -d "$dir" ]; then
        echo -e "${YELLOW}  ⚠️  Directory not found: $dir${NC}"
        return 1
    fi
    
    # Process TypeScript/JavaScript files
    for file in "$dir"/*.ts "$dir"/*.tsx "$dir"/*.js "$dir"/*.jsx; do
        if [ -f "$file" ]; then
            process_file "$file" "$section_name"
        fi
    done
    
    # Process subdirectories
    for subdir in "$dir"/*; do
        if [ -d "$subdir" ]; then
            process_directory "$subdir" "$section_name"
        fi
    done
    
    return 0
}

# Function: Add section header
add_section() {
    local section_name=$1
    local description=$2
    
    echo "" >> "$OUTPUT_FILE"
    echo "################################################################" >> "$OUTPUT_FILE"
    echo "##" >> "$OUTPUT_FILE"
    echo "##  SECTION: $section_name" >> "$OUTPUT_FILE"
    echo "##  $description" >> "$OUTPUT_FILE"
    echo "##" >> "$OUTPUT_FILE"
    echo "################################################################" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}$section_name${NC}"
    echo -e "${MAGENTA}║  ${CYAN}$description${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
}

# Function: Create file header
create_file_header() {
    cat > "$OUTPUT_FILE" << EOF
################################################################
##
##  FIBIDY CLIENT - CLOUDINARY & IMAGE OPTIMIZATION
##  Files Collection for Next.js Migration
##
##  Generated: $(date '+%Y-%m-%d %H:%M:%S')
##  Purpose: Optimize images with Cloudinary + next-cloudinary
##
################################################################

TARGET OPTIMIZATION:
- Replace <img> and next/image with CldImage
- Auto format (AVIF/WebP) via f_auto
- Auto quality via q_auto
- Responsive images with proper sizes
- AI-powered cropping (gravity: auto, face)
- Hero images with priority loading
- Blur placeholders

EXPECTED RESULTS:
- 60-80% smaller image files
- LCP improvement: 6s → 1.8s
- Mobile: Crash → Smooth 60fps

################################################################

EOF
}

# Function: Show summary
show_summary() {
    local file_size=$(du -h "$OUTPUT_FILE" 2>/dev/null | cut -f1 || echo "0")
    
    echo "" >> "$OUTPUT_FILE"
    echo "################################################################" >> "$OUTPUT_FILE"
    echo "##  COLLECTION SUMMARY" >> "$OUTPUT_FILE"
    echo "################################################################" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "Total Files: $total_files" >> "$OUTPUT_FILE"
    echo "Total Lines: $total_lines" >> "$OUTPUT_FILE"
    echo "File Size: $file_size" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "################################################################" >> "$OUTPUT_FILE"
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║                  ${BOLD}COLLECTION COMPLETED!${NC}${GREEN}                   ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}╠════════════════════════════════════════════════════════════╣${NC}"
    printf "${GREEN}║${NC}  ${YELLOW}Total Files:${NC}     %-38s ${GREEN}║${NC}\n" "$total_files"
    printf "${GREEN}║${NC}  ${YELLOW}Total Lines:${NC}     %-38s ${GREEN}║${NC}\n" "$total_lines"
    printf "${GREEN}║${NC}  ${YELLOW}File Size:${NC}       %-38s ${GREEN}║${NC}\n" "$file_size"
    echo -e "${GREEN}╠════════════════════════════════════════════════════════════╣${NC}"
    printf "${GREEN}║${NC}  ${CYAN}Output:${NC} %-48s ${GREEN}║${NC}\n" "$OUTPUT_FILE"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# ================================================================
# MAIN COLLECTION
# ================================================================

main() {
    show_header
    
    # Validate paths
    if [ ! -d "$SRC_PATH" ]; then
        echo -e "${RED}ERROR: Source path not found: $SRC_PATH${NC}"
        echo -e "${YELLOW}Please update PROJECT_ROOT variable.${NC}"
        exit 1
    fi
    
    # Create output directory
    mkdir -p "$OUTPUT_DIR"
    
    # Create file header
    create_file_header
    
    echo -e "${CYAN}Project: ${BOLD}FIBIDY Client${NC}"
    echo -e "${CYAN}Source: ${BOLD}$SRC_PATH${NC}"
    echo -e "${CYAN}Output: ${BOLD}$OUTPUT_FILE${NC}"
    echo ""
    
    # ============================================
    # SECTION 1: CLOUDINARY CONFIG & TYPES
    # ============================================
    add_section "CLOUDINARY CONFIG & TYPES" "Core Cloudinary configuration and type definitions"
    
    process_file "$SRC_PATH/lib/cloudinary.ts" "Cloudinary Config"
    process_file "$SRC_PATH/types/cloudinary.ts" "Cloudinary Types"
    
    # ============================================
    # SECTION 2: NEXT.JS CONFIG
    # ============================================
    add_section "NEXT.JS CONFIG" "Next.js configuration with image settings"
    
    process_file "$PROJECT_ROOT/next.config.ts" "Next.js Config"
    process_file "$PROJECT_ROOT/next.config.js" "Next.js Config JS"  # fallback
    process_file "$PROJECT_ROOT/next.config.mjs" "Next.js Config MJS"  # fallback
    
    # ============================================
    # SECTION 3: UPLOAD COMPONENTS
    # ============================================
    add_section "UPLOAD COMPONENTS" "Image upload handling components"
    
    process_directory "$SRC_PATH/components/upload" "Upload Components"
    
    # ============================================
    # SECTION 4: STORE COMPONENTS (Product Images)
    # ============================================
    add_section "STORE COMPONENTS" "Public store components with product images"
    
    # Key files for image optimization
    process_file "$SRC_PATH/components/store/product-card.tsx" "Product Card"
    process_file "$SRC_PATH/components/store/product-gallery.tsx" "Product Gallery"
    process_file "$SRC_PATH/components/store/product-grid.tsx" "Product Grid"
    process_file "$SRC_PATH/components/store/product-info.tsx" "Product Info"
    process_file "$SRC_PATH/components/store/featured-products.tsx" "Featured Products"
    process_file "$SRC_PATH/components/store/related-products.tsx" "Related Products"
    process_file "$SRC_PATH/components/store/store-header.tsx" "Store Header (Logo)"
    process_file "$SRC_PATH/components/store/store-hero.tsx" "Store Hero"
    process_file "$SRC_PATH/components/store/cart-sheet.tsx" "Cart Sheet"
    process_file "$SRC_PATH/components/store/index.ts" "Store Index"
    
    # ============================================
    # SECTION 5: LANDING COMPONENTS (Hero, Testimonials)
    # ============================================
    add_section "LANDING COMPONENTS" "Landing page components with images"
    
    process_file "$SRC_PATH/components/landing/tenant-hero.tsx" "Tenant Hero"
    process_file "$SRC_PATH/components/landing/tenant-about.tsx" "Tenant About"
    process_file "$SRC_PATH/components/landing/tenant-products.tsx" "Tenant Products"
    process_file "$SRC_PATH/components/landing/tenant-testimonials.tsx" "Tenant Testimonials"
    process_file "$SRC_PATH/components/landing/testimonial-editor.tsx" "Testimonial Editor"
    process_file "$SRC_PATH/components/landing/index.ts" "Landing Index"
    
    # ============================================
    # SECTION 6: STORE PAGES
    # ============================================
    add_section "STORE PAGES" "Tenant store pages"
    
    process_file "$SRC_PATH/app/store/[slug]/page.tsx" "Store Landing Page"
    process_file "$SRC_PATH/app/store/[slug]/layout.tsx" "Store Layout"
    process_file "$SRC_PATH/app/store/[slug]/products/page.tsx" "Products List Page"
    process_file "$SRC_PATH/app/store/[slug]/products/[id]/page.tsx" "Product Detail Page"
    
    # ============================================
    # SECTION 7: SETTINGS (Image Upload in Dashboard)
    # ============================================
    add_section "SETTINGS COMPONENTS" "Dashboard settings with image uploads"
    
    process_file "$SRC_PATH/components/settings/appearance-settings.tsx" "Appearance Settings"
    process_file "$SRC_PATH/components/settings/index.ts" "Settings Index"
    
    # ============================================
    # SECTION 8: PRODUCT FORM (Dashboard Upload)
    # ============================================
    add_section "PRODUCT FORM" "Product form with image upload"
    
    process_file "$SRC_PATH/components/products/product-form.tsx" "Product Form"
    
    # ============================================
    # SECTION 9: OPENGRAPH IMAGES
    # ============================================
    add_section "OPENGRAPH IMAGES" "Dynamic OG image generation"
    
    process_file "$SRC_PATH/app/opengraph-image.tsx" "Root OG Image"
    process_file "$SRC_PATH/app/store/[slug]/opengraph-image.tsx" "Store OG Image"
    process_file "$SRC_PATH/app/store/[slug]/products/[id]/opengraph-image.tsx" "Product OG Image"
    process_file "$SRC_PATH/lib/og-utils.ts" "OG Utils"
    
    # ============================================
    # SECTION 10: TYPES (Product, Tenant, Landing)
    # ============================================
    add_section "RELATED TYPES" "Type definitions for images"
    
    process_file "$SRC_PATH/types/product.ts" "Product Types"
    process_file "$SRC_PATH/types/tenant.ts" "Tenant Types"
    process_file "$SRC_PATH/types/landing.ts" "Landing Types"
    
    # ============================================
    # SECTION 11: API (Products, Tenants)
    # ============================================
    add_section "API CLIENTS" "API calls that handle images"
    
    process_file "$SRC_PATH/lib/api/products.ts" "Products API"
    process_file "$SRC_PATH/lib/api/tenants.ts" "Tenants API"
    
    # ============================================
    # SECTION 12: PLATFORM LANDING (Marketing Images)
    # ============================================
    add_section "PLATFORM LANDING" "Marketing page with images"
    
    process_file "$SRC_PATH/components/platform-landing/hero-section.tsx" "Hero Section"
    process_file "$SRC_PATH/components/platform-landing/testimonials-section.tsx" "Testimonials Section"
    process_file "$SRC_PATH/components/platform-landing/logos-section.tsx" "Logos Section"
    
    # Show summary
    show_summary
    
    echo -e "${GREEN}✨ Collection completed successfully!${NC}"
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║  ${BOLD}NEXT STEPS:${NC}${CYAN}                                              ║${NC}"
    echo -e "${CYAN}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║${NC}  1. Share this file with Claude AI                          ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  2. Request Cloudinary optimization for each component      ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  3. Replace <img> and Image with CldImage                   ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  4. Add proper transformations (f_auto, q_auto, etc.)       ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  5. Test with Lighthouse for performance gains              ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Run main function
main "$@"
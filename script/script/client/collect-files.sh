#!/bin/bash

# ================================================
# UMKM Multi-Tenant Client Collection Script v3.2
# FIXED VERSION - All folders included
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

# Path configuration - SESUAIKAN JIKA PERLU
PROJECT_ROOT="/d/PRODUK-LPPM-FINAL/UMKM-MULTI-TENANT/app/client"
SRC_PATH="$PROJECT_ROOT/src"
OUTPUT_DIR="collections"

# Statistics
total_categories=0
total_files=0
total_lines=0
failed_files=0
skipped_files=0

# Files to skip
SKIP_FILES=(
    "*.spec.ts"
    "*.spec.tsx"
    "*.test.ts"
    "*.test.tsx"
    ".DS_Store"
    ".gitkeep"
)

# Directories to skip (global)
SKIP_DIRS=(
    "node_modules"
    "dist"
    "build"
    ".git"
    "coverage"
    ".next"
)

# Function: Display header
show_header() {
    clear
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                                          ║${NC}"
    echo -e "${BLUE}║    ${BOLD}UMKM MULTI-TENANT - CLIENT COLLECTION v3.2${NC}${BLUE}     ║${NC}"
    echo -e "${BLUE}║         FIXED VERSION - All Folders Included            ║${NC}"
    echo -e "${BLUE}║                                                          ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Function: Show menu
show_menu() {
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                    ${BOLD}COLLECTION OPTIONS${NC}${CYAN}                    ║${NC}"
    echo -e "${CYAN}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}1.${NC} ${GREEN}Pages & Routes${NC} (FIXED)                              ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}     ${MAGENTA}→${NC} All app routes & pages                            ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}     ${MAGENTA}→${NC} (auth), (dashboard), store, about, discover       ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}     ${MAGENTA}→${NC} fitur, harga, cara-kerja, landing-builder         ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}2.${NC} ${GREEN}Components & UI${NC} (FIXED)                             ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}     ${MAGENTA}→${NC} All custom components                             ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}     ${MAGENTA}→${NC} + cloudinary, discover, landing-builder           ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}     ${MAGENTA}→${NC} + platform-landing, pwa, seo                      ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}     ${MAGENTA}→${NC} ${RED}SKIP: components/ui (Shadcn)${NC}                      ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}     ${MAGENTA}→${NC} ${RED}SKIP: landing/blocks (800+ template files)${NC}       ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}3.${NC} ${GREEN}Core & Infrastructure${NC}                              ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}     ${MAGENTA}→${NC} Lib, Hooks, Stores, Types, Config, Providers      ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}0.${NC} ${RED}Exit${NC}                                                 ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                            ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e -n "${YELLOW}Select option [0-3]: ${NC}"
}

# Function: Check if file should be skipped
should_skip_file() {
    local filename=$(basename "$1")
    
    for pattern in "${SKIP_FILES[@]}"; do
        if [[ "$filename" == $pattern ]]; then
            return 0
        fi
    done
    
    return 1
}

# Function: Check if directory should be skipped (global)
should_skip_directory() {
    local dirpath=$1
    
    for skip_dir in "${SKIP_DIRS[@]}"; do
        if [[ "$dirpath" == *"$skip_dir"* ]]; then
            return 0
        fi
    done
    
    return 1
}

# Function: Check if directory should be skipped for components collection
should_skip_ui_directory() {
    local dirpath=$1
    
    # Skip components/ui folder (Shadcn auto-generated)
    if [[ "$dirpath" == *"components/ui"* ]]; then
        return 0
    fi
    
    # Skip landing/blocks folder (800+ template files)
    if [[ "$dirpath" == *"landing/blocks"* ]]; then
        return 0
    fi
    
    return 1
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
    local output_file=$2
    local base_path=$3
    local skip_ui=${4:-false}
    local relative_path=${file#$base_path/}
    
    should_skip_file "$file" && {
        skipped_files=$((skipped_files + 1))
        return
    }
    
    # Skip UI components and landing blocks if flag is set
    if [ "$skip_ui" = true ]; then
        if [[ "$file" == *"components/ui/"* ]]; then
            skipped_files=$((skipped_files + 1))
            return
        fi
        if [[ "$file" == *"landing/blocks/"* ]]; then
            skipped_files=$((skipped_files + 1))
            return
        fi
    fi
    
    if [ ! -f "$file" ]; then
        return
    fi
    
    local lines=$(count_file_lines "$file")
    total_lines=$((total_lines + lines))
    total_files=$((total_files + 1))
    
    echo -e "${GREEN}    ├─ ${NC}$relative_path ${CYAN}(${lines} lines)${NC}"
    
    echo "================================================" >> "$output_file"
    echo "FILE: $relative_path" >> "$output_file"
    echo "Lines: $lines" >> "$output_file"
    echo "================================================" >> "$output_file"
    echo "" >> "$output_file"
    
    cat "$file" >> "$output_file" 2>/dev/null || {
        echo "ERROR: Unable to read file" >> "$output_file"
        failed_files=$((failed_files + 1))
    }
    
    echo "" >> "$output_file"
    echo "" >> "$output_file"
}

# Function: Process directory recursively
process_directory() {
    local dir=$1
    local output_file=$2
    local base_path=$3
    local skip_ui=${4:-false}
    
    should_skip_directory "$dir" && return
    
    # Skip UI directory and landing blocks if flag is set
    if [ "$skip_ui" = true ]; then
        should_skip_ui_directory "$dir" && {
            local dirname=$(basename "$dir")
            if [[ "$dir" == *"components/ui"* ]]; then
                echo -e "${YELLOW}    └─ ${NC}ui/ ${RED}(SKIPPED - Shadcn UI Components)${NC}"
            elif [[ "$dir" == *"landing/blocks"* ]]; then
                echo -e "${YELLOW}    └─ ${NC}blocks/ ${RED}(SKIPPED - 800+ Template Files)${NC}"
            fi
            return
        }
    fi
    
    if [ ! -d "$dir" ]; then
        return
    fi
    
    # Process TypeScript/JavaScript/React/Config files
    for ext in ts tsx js jsx json css scss md; do
        for file in "$dir"/*.$ext; do
            if [ -f "$file" ]; then
                process_file "$file" "$output_file" "$base_path" "$skip_ui"
            fi
        done
    done
    
    # Process subdirectories
    for subdir in "$dir"/*; do
        if [ -d "$subdir" ]; then
            process_directory "$subdir" "$output_file" "$base_path" "$skip_ui"
        fi
    done
}

# Function: Collect category
collect_category() {
    local category_name=$1
    local category_description=$2
    local output_file=$3
    local skip_ui=${4:-false}
    local category_path="$SRC_PATH/$category_name"
    
    if [ ! -d "$category_path" ]; then
        echo -e "${YELLOW}  ⚠️  Directory not found: $category_name${NC}"
        return 1
    fi
    
    echo "" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "##" >> "$output_file"
    echo "##  CATEGORY: $category_description" >> "$output_file"
    echo "##  Path: src/$category_name" >> "$output_file"
    echo "##" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "" >> "$output_file"
    
    total_categories=$((total_categories + 1))
    
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}$category_description${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    
    process_directory "$category_path" "$output_file" "$PROJECT_ROOT" "$skip_ui"
    
    echo -e "${GREEN}  ✓ Completed: $category_name${NC}"
    
    return 0
}

# Function: Collect root file
collect_root_file() {
    local filename=$1
    local output_file=$2
    local filepath="$SRC_PATH/$filename"
    
    if [ ! -f "$filepath" ]; then
        echo -e "${YELLOW}  ⚠️  File not found: $filename${NC}"
        return 1
    fi
    
    process_file "$filepath" "$output_file" "$PROJECT_ROOT" false
    return 0
}

# Function: Collect config file from root
collect_config_file() {
    local filename=$1
    local output_file=$2
    local filepath="$PROJECT_ROOT/$filename"
    
    if [ ! -f "$filepath" ]; then
        return 1
    fi
    
    process_file "$filepath" "$output_file" "$PROJECT_ROOT" false
    return 0
}

# Function: Create file header
create_file_header() {
    local output_file=$1
    local collection_type=$2
    
    cat > "$output_file" << EOF
################################################################
##
##  UMKM MULTI-TENANT SYSTEM
##  CLIENT SOURCE CODE COLLECTION
##
##  Collection Type: $collection_type
##  Generated: $(date '+%Y-%m-%d %H:%M:%S')
##  Script Version: 3.2 (FIXED)
##  Project: UMKM Multi-Tenant E-Commerce Platform (Next.js)
##
################################################################
EOF
    
    case $collection_type in
        "PAGES_ROUTES")
            cat >> "$output_file" << EOF

This collection contains ALL PAGES & ROUTES:

Authentication:
- app/(auth)/ - Login, Register, Forgot Password

Dashboard:
- app/(dashboard)/dashboard/ - Main dashboard
- app/(dashboard)/dashboard/customers/ - Customer management
- app/(dashboard)/dashboard/orders/ - Order management
- app/(dashboard)/dashboard/products/ - Product management
- app/(dashboard)/dashboard/settings/ - Settings
- app/(dashboard)/store/ - Store preview

Public Store:
- app/store/[slug]/ - Dynamic tenant store pages
- app/store/[slug]/about/ - Store about page
- app/store/[slug]/contact/ - Store contact page
- app/store/[slug]/products/ - Store products
- app/store/[slug]/testimonials/ - Store testimonials

Platform Pages:
- app/about/ - Platform about
- app/cara-kerja/ - How it works
- app/discover/ - Discover UMKM
- app/fitur/ - Features
- app/harga/ - Pricing
- app/landing-builder/ - Landing builder

SEO & Sitemap:
- app/server-sitemap/ - Dynamic sitemap
- app/server-sitemap-index.xml/ - Sitemap index

################################################################

EOF
            ;;
        "COMPONENTS_UI")
            cat >> "$output_file" << EOF

This collection contains CUSTOM COMPONENTS:

Core Components:
- components/auth/ - Authentication forms
- components/dashboard/ - Dashboard layout & navigation
- components/customers/ - Customer management
- components/orders/ - Order management
- components/products/ - Product management
- components/settings/ - Settings forms
- components/store/ - Public store components

Additional Components:
- components/cloudinary/ - Image wrapper components
- components/discover/ - UMKM discovery components
- components/landing/ - Landing page sections (excluding blocks/)
- components/landing-builder/ - Landing builder UI
- components/platform-landing/ - Platform landing sections
- components/pwa/ - Progressive Web App components
- components/seo/ - SEO schema components
- components/upload/ - Image upload components

EXCLUDED (to reduce file size):
- components/ui/ - Shadcn UI (auto-generated)
- components/landing/blocks/ - 800+ template files

################################################################

EOF
            ;;
        "CORE_INFRASTRUCTURE")
            cat >> "$output_file" << EOF

This collection contains CORE & INFRASTRUCTURE:

Libraries:
- lib/api/ - API client functions
- lib/discover/ - Discover utilities
- lib/landing/ - Landing page helpers
- lib/*.ts - Core utilities (format, cloudinary, invoice, etc.)

State & Hooks:
- hooks/ - Custom React hooks
- stores/ - Zustand state management
- providers/ - React context providers

Types & Config:
- types/ - TypeScript definitions
- config/ - App configuration

################################################################

EOF
            ;;
    esac
}

# Function: Show collection summary
show_summary() {
    local output_file=$1
    local end_time=$2
    local start_time=$3
    local duration=$((end_time - start_time))
    
    echo "" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "##" >> "$output_file"
    echo "##  COLLECTION SUMMARY" >> "$output_file"
    echo "##" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "" >> "$output_file"
    echo "Total Categories: $total_categories" >> "$output_file"
    echo "Total Files Collected: $total_files" >> "$output_file"
    echo "Skipped Files: $skipped_files" >> "$output_file"
    echo "Total Lines: $total_lines" >> "$output_file"
    echo "Failed Files: $failed_files" >> "$output_file"
    echo "Duration: ${duration}s" >> "$output_file"
    echo "Completed: $(date '+%Y-%m-%d %H:%M:%S')" >> "$output_file"
    echo "" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "##  END OF COLLECTION" >> "$output_file"
    echo "################################################################" >> "$output_file"
    
    local file_size=$(du -h "$output_file" 2>/dev/null | cut -f1 || echo "0")
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║                  ${BOLD}COLLECTION COMPLETED!${NC}${GREEN}                   ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}╠════════════════════════════════════════════════════════════╣${NC}"
    printf "${GREEN}║${NC}  ${YELLOW}Categories:${NC}         %-35s ${GREEN}║${NC}\n" "$total_categories"
    printf "${GREEN}║${NC}  ${YELLOW}Files Collected:${NC}    %-35s ${GREEN}║${NC}\n" "$total_files"
    printf "${GREEN}║${NC}  ${YELLOW}Skipped Files:${NC}      %-35s ${GREEN}║${NC}\n" "$skipped_files"
    printf "${GREEN}║${NC}  ${YELLOW}Total Lines:${NC}        %-35s ${GREEN}║${NC}\n" "$total_lines"
    printf "${GREEN}║${NC}  ${YELLOW}Failed Files:${NC}       %-35s ${GREEN}║${NC}\n" "$failed_files"
    printf "${GREEN}║${NC}  ${YELLOW}File Size:${NC}          %-35s ${GREEN}║${NC}\n" "$file_size"
    printf "${GREEN}║${NC}  ${YELLOW}Duration:${NC}           %-35s ${GREEN}║${NC}\n" "${duration}s"
    echo -e "${GREEN}╠════════════════════════════════════════════════════════════╣${NC}"
    printf "${GREEN}║${NC}  ${CYAN}Output:${NC} %-48s ${GREEN}║${NC}\n" "$output_file"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# ================================================
# OPTION 1: Pages & Routes (FIXED)
# ================================================
collect_pages_routes() {
    local output_file="$OUTPUT_DIR/umkm-client-pages-routes.txt"
    local start_time=$(date +%s)
    
    echo -e "${GREEN}✓ Starting Pages & Routes collection (FIXED v3.2)...${NC}"
    
    create_file_header "$output_file" "PAGES_ROUTES"
    
    # Authentication pages
    collect_category "app/(auth)" "Authentication Pages" "$output_file"
    
    # Dashboard routes
    collect_category "app/(dashboard)" "Dashboard Routes" "$output_file"
    
    # FIXED: Public store pages (was app/(store), now app/store)
    collect_category "app/store" "Public Store Pages" "$output_file"
    
    # NEW: Platform pages (were missing)
    collect_category "app/about" "About Page" "$output_file"
    collect_category "app/cara-kerja" "How It Works Page" "$output_file"
    collect_category "app/discover" "Discover UMKM Pages" "$output_file"
    collect_category "app/fitur" "Features Page" "$output_file"
    collect_category "app/harga" "Pricing Page" "$output_file"
    collect_category "app/landing-builder" "Landing Builder" "$output_file"
    
    # NEW: SEO routes (were missing)
    collect_category "app/server-sitemap" "Sitemap Routes" "$output_file"
    collect_category "app/server-sitemap-index.xml" "Sitemap Index" "$output_file"
    
    # Root app files
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Root App Files${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    
    collect_root_file "app/layout.tsx" "$output_file"
    collect_root_file "app/page.tsx" "$output_file"
    collect_root_file "app/globals.css" "$output_file"
    collect_root_file "app/favicon.ico" "$output_file"
    collect_root_file "app/opengraph-image.tsx" "$output_file"
    collect_root_file "app/twitter-image.tsx" "$output_file"
    
    echo -e "${GREEN}  ✓ Completed: Root app files${NC}"
    total_categories=$((total_categories + 1))
    
    local end_time=$(date +%s)
    show_summary "$output_file" "$end_time" "$start_time"
}

# ================================================
# OPTION 2: Components & UI (FIXED)
# ================================================
collect_components_ui() {
    local output_file="$OUTPUT_DIR/umkm-client-components-ui.txt"
    local start_time=$(date +%s)
    
    echo -e "${GREEN}✓ Starting Components & UI collection (FIXED v3.2)...${NC}"
    echo -e "${YELLOW}⚠️  Skipping: components/ui (Shadcn) & landing/blocks (800+ files)${NC}"
    echo ""
    
    create_file_header "$output_file" "COMPONENTS_UI"
    
    # Core components (existing)
    collect_category "components/auth" "Auth Components" "$output_file" true
    collect_category "components/dashboard" "Dashboard Components" "$output_file" true
    collect_category "components/customers" "Customer Components" "$output_file" true
    collect_category "components/orders" "Order Components" "$output_file" true
    collect_category "components/products" "Product Components" "$output_file" true
    collect_category "components/settings" "Settings Components" "$output_file" true
    collect_category "components/store" "Store Components" "$output_file" true
    collect_category "components/upload" "Upload Components" "$output_file" true
    
    # NEW: Missing components (were not in v3.1)
    collect_category "components/cloudinary" "Cloudinary Components" "$output_file" true
    collect_category "components/discover" "Discover Components" "$output_file" true
    collect_category "components/landing" "Landing Components" "$output_file" true
    collect_category "components/landing-builder" "Landing Builder Components" "$output_file" true
    collect_category "components/platform-landing" "Platform Landing Components" "$output_file" true
    collect_category "components/pwa" "PWA Components" "$output_file" true
    collect_category "components/seo" "SEO Schema Components" "$output_file" true
    
    # Note about skipped
    echo ""
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  ${BOLD}Skipped Folders:${NC}"
    echo -e "${YELLOW}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${YELLOW}║${NC}  • components/ui/ - Shadcn UI (auto-generated)            ${YELLOW}║${NC}"
    echo -e "${YELLOW}║${NC}  • components/landing/blocks/ - 800+ template files       ${YELLOW}║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
    
    local end_time=$(date +%s)
    show_summary "$output_file" "$end_time" "$start_time"
}

# ================================================
# OPTION 3: Core & Infrastructure (unchanged)
# ================================================
collect_core_infrastructure() {
    local output_file="$OUTPUT_DIR/umkm-client-core-infrastructure.txt"
    local start_time=$(date +%s)
    
    echo -e "${GREEN}✓ Starting Core & Infrastructure collection...${NC}"
    
    create_file_header "$output_file" "CORE_INFRASTRUCTURE"
    
    # Core modules
    collect_category "lib" "Library & Utilities" "$output_file"
    collect_category "hooks" "Custom React Hooks" "$output_file"
    collect_category "stores" "Zustand State Management" "$output_file"
    collect_category "types" "TypeScript Types" "$output_file"
    collect_category "config" "App Configuration" "$output_file"
    collect_category "providers" "React Providers" "$output_file"
    
    # Root files
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Additional Root Files${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    
    collect_root_file "proxy.ts" "$output_file"
    
    # Config files
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Configuration Files${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    
    collect_config_file "package.json" "$output_file"
    collect_config_file "tsconfig.json" "$output_file"
    collect_config_file "next.config.js" "$output_file"
    collect_config_file "next.config.mjs" "$output_file"
    collect_config_file "tailwind.config.ts" "$output_file"
    collect_config_file "tailwind.config.js" "$output_file"
    collect_config_file "postcss.config.js" "$output_file"
    collect_config_file "postcss.config.mjs" "$output_file"
    collect_config_file ".env.example" "$output_file"
    collect_config_file ".env.local.example" "$output_file"
    collect_config_file ".eslintrc.json" "$output_file"
    collect_config_file ".prettierrc" "$output_file"
    collect_config_file "components.json" "$output_file"
    collect_config_file "README.md" "$output_file"
    
    echo -e "${GREEN}  ✓ Completed: Configuration files${NC}"
    total_categories=$((total_categories + 1))
    
    local end_time=$(date +%s)
    show_summary "$output_file" "$end_time" "$start_time"
}

# Main execution
main() {
    show_header
    
    # Validate paths
    if [ ! -d "$SRC_PATH" ]; then
        echo -e "${RED}ERROR: Source path not found: $SRC_PATH${NC}"
        echo -e "${YELLOW}Current directory: $(pwd)${NC}"
        echo ""
        echo -e "${CYAN}Please update PROJECT_ROOT in the script to match your setup.${NC}"
        echo -e "${CYAN}Current setting: PROJECT_ROOT=\"$PROJECT_ROOT\"${NC}"
        exit 1
    fi
    
    # Create output directory
    mkdir -p "$OUTPUT_DIR"
    
    echo -e "${CYAN}Project: ${BOLD}UMKM Multi-Tenant Client${NC}"
    echo -e "${CYAN}Source: ${BOLD}$SRC_PATH${NC}"
    echo ""
    
    # Show menu and get user choice
    show_menu
    read -r choice
    
    echo ""
    
    case $choice in
        1)
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            echo -e "${BLUE}  Collection Mode: ${BOLD}Pages & Routes (FIXED)${NC}"
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            collect_pages_routes
            ;;
        2)
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            echo -e "${BLUE}  Collection Mode: ${BOLD}Components & UI (FIXED)${NC}"
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            collect_components_ui
            ;;
        3)
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            echo -e "${BLUE}  Collection Mode: ${BOLD}Core & Infrastructure${NC}"
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            collect_core_infrastructure
            ;;
        0)
            echo -e "${YELLOW}Exiting...${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please run the script again.${NC}"
            exit 1
            ;;
    esac
    
    if [ $failed_files -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Warning: $failed_files file(s) failed to process${NC}"
    fi
    
    if [ $skipped_files -gt 0 ]; then
        echo -e "${CYAN}ℹ️  Info: $skipped_files file(s) were skipped${NC}"
    fi
    
    echo -e "${GREEN}✨ Collection completed successfully!${NC}"
    echo -e "${CYAN}💡 Output saved to: collections/ folder${NC}"
    echo ""
}

# Reset statistics for each run
reset_stats() {
    total_categories=0
    total_files=0
    total_lines=0
    failed_files=0
    skipped_files=0
}

# Run main function
reset_stats
main "$@"
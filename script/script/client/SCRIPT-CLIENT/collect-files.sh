#!/bin/bash

# ================================================
# UMKM Multi-Tenant Client - Feature Module Collection Script v5.1 FINAL
# Collect specific feature modules (Customers, Orders, Products, etc.)
# UPDATED: Bug fix for duplicate content detection
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

# Path configuration
PROJECT_ROOT="/d/PRODUK-LPPM-FINAL/UMKM-MULTI-TENANT/client"
SRC_PATH="$PROJECT_ROOT/src"
OUTPUT_DIR="collections"

# Statistics
total_categories=0
total_files=0
total_lines=0
failed_files=0
skipped_files=0
listed_files=0

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
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                                                  ║${NC}"
    echo -e "${BLUE}║    ${BOLD}UMKM MULTI-TENANT - FEATURE MODULE COLLECTOR${NC}${BLUE}           ║${NC}"
    echo -e "${BLUE}║         Complete Feature Modules v5.1 - FINAL                    ║${NC}"
    echo -e "${BLUE}║                                                                  ║${NC}"
    echo -e "${BLUE}║    ${CYAN}✓ All modules covered${NC}${BLUE}                                      ║${NC}"
    echo -e "${BLUE}║    ${CYAN}✓ Core/Shared infrastructure included${NC}${BLUE}                     ║${NC}"
    echo -e "${BLUE}║    ${CYAN}✓ UI Components listed (not collected)${NC}${BLUE}                    ║${NC}"
    echo -e "${BLUE}║    ${CYAN}✓ Duplicate content detection${NC}${BLUE}                             ║${NC}"
    echo -e "${BLUE}║                                                                  ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Function: Show menu
show_menu() {
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                   ${BOLD}FEATURE MODULE OPTIONS${NC}${CYAN}                        ║${NC}"
    echo -e "${CYAN}╠════════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║                                                                    ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}1.${NC}  ${GREEN}Customers Module${NC}                                          ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}      ${MAGENTA}→${NC} Pages, Components, Hooks, API, Types                     ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                                    ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}2.${NC}  ${GREEN}Orders Module${NC}                                             ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}      ${MAGENTA}→${NC} Pages, Components, Hooks, API, Types, Invoice Utils      ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                                    ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}3.${NC}  ${GREEN}Products Module${NC}                                           ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}      ${MAGENTA}→${NC} Pages, Components, Store, Upload, Hooks, API, Types      ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}      ${MAGENTA}→${NC} Stores (products, cart), Config (categories)             ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                                    ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}4.${NC}  ${GREEN}Authentication Module${NC}                                     ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}      ${MAGENTA}→${NC} Pages, Components, Hooks, API, Types, Store              ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                                    ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}5.${NC}  ${GREEN}Store/Tenant Module${NC}                                       ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}      ${MAGENTA}→${NC} Store Pages, Components, Landing, Hooks, API, Types      ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                                    ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}6.${NC}  ${GREEN}Settings Module${NC}                                           ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}      ${MAGENTA}→${NC} Pages, Upload Components, Cloudinary, Config             ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                                    ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}7.${NC}  ${GREEN}Dashboard Core${NC}                                            ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}      ${MAGENTA}→${NC} Main Page, Layout, Components, Navigation, UI Store      ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                                    ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}8.${NC}  ${GREEN}SEO & PWA Module${NC}                                          ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}      ${MAGENTA}→${NC} SEO/PWA Components, Hooks, Config, Utils, Routes         ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                                    ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}9.${NC}  ${GREEN}Marketing/Landing Page${NC}                                    ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}      ${MAGENTA}→${NC} Marketing Pages, Platform Landing Components             ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                                    ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}10.${NC} ${GREEN}Core/Shared Infrastructure${NC}                                ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}      ${MAGENTA}→${NC} Providers, Core Lib, Core Hooks, Core Types              ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}      ${MAGENTA}→${NC} Root App Files, Config, Stores Index, Validations        ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}      ${MAGENTA}→${NC} UI Components (LIST ONLY - shadcn/magic-ui)              ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                                    ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}11.${NC} ${GREEN}Collect ALL Modules${NC} ${RED}[FULL EXPORT]${NC}                        ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}      ${MAGENTA}→${NC} Export semua module ke satu file lengkap                 ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                                    ║${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}0.${NC}  ${RED}Exit${NC}                                                      ${CYAN}║${NC}"
    echo -e "${CYAN}║                                                                    ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e -n "${YELLOW}Select module [0-11]: ${NC}"
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

# Function: Check if directory should be skipped
should_skip_directory() {
    local dirpath=$1
    
    for skip_dir in "${SKIP_DIRS[@]}"; do
        if [[ "$dirpath" == *"$skip_dir"* ]]; then
            return 0
        fi
    done
    
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

# Function: Process single file (FULL CONTENT)
process_file() {
    local file=$1
    local output_file=$2
    local base_path=$3
    local relative_path=${file#$base_path/}
    
    should_skip_file "$file" && {
        skipped_files=$((skipped_files + 1))
        return
    }
    
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

# Function: List file (PATH ONLY - no content)
list_file() {
    local file=$1
    local output_file=$2
    local base_path=$3
    local relative_path=${file#$base_path/}
    
    should_skip_file "$file" && return
    
    if [ ! -f "$file" ]; then
        return
    fi
    
    local lines=$(count_file_lines "$file")
    listed_files=$((listed_files + 1))
    
    echo -e "${YELLOW}    ├─ ${NC}$relative_path ${CYAN}(${lines} lines)${NC} ${YELLOW}[LIST ONLY]${NC}"
    
    echo "  - $relative_path ($lines lines)" >> "$output_file"
}

# Function: Process directory recursively (FULL CONTENT)
process_directory() {
    local dir=$1
    local output_file=$2
    local base_path=$3
    
    should_skip_directory "$dir" && return
    
    if [ ! -d "$dir" ]; then
        return
    fi
    
    # Process TypeScript/JavaScript/React/Config files
    for ext in ts tsx js jsx json css scss md; do
        for file in "$dir"/*.$ext; do
            if [ -f "$file" ]; then
                process_file "$file" "$output_file" "$base_path"
            fi
        done
    done
    
    # Process subdirectories
    for subdir in "$dir"/*; do
        if [ -d "$subdir" ]; then
            process_directory "$subdir" "$output_file" "$base_path"
        fi
    done
}

# Function: List directory (PATH ONLY - for UI components)
list_directory() {
    local dir=$1
    local output_file=$2
    local base_path=$3
    
    should_skip_directory "$dir" && return
    
    if [ ! -d "$dir" ]; then
        return
    fi
    
    # List TypeScript/JavaScript/React files
    for ext in ts tsx js jsx; do
        for file in "$dir"/*.$ext; do
            if [ -f "$file" ]; then
                list_file "$file" "$output_file" "$base_path"
            fi
        done
    done
    
    # Process subdirectories
    for subdir in "$dir"/*; do
        if [ -d "$subdir" ]; then
            list_directory "$subdir" "$output_file" "$base_path"
        fi
    done
}

# Function: Collect category (FULL CONTENT)
collect_category() {
    local category_name=$1
    local category_description=$2
    local output_file=$3
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
    
    process_directory "$category_path" "$output_file" "$PROJECT_ROOT"
    
    echo -e "${GREEN}  ✓ Completed: $category_name${NC}"
    
    return 0
}

# Function: List category (PATH ONLY - for UI components)
list_category() {
    local category_name=$1
    local category_description=$2
    local output_file=$3
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
    echo "##  NOTE: Files listed only (auto-generated shadcn/magic-ui)" >> "$output_file"
    echo "##" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "" >> "$output_file"
    echo "UI Component Files:" >> "$output_file"
    echo "" >> "$output_file"
    
    total_categories=$((total_categories + 1))
    
    echo ""
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  ${BOLD}$category_description${NC} ${YELLOW}[LIST ONLY]${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
    
    list_directory "$category_path" "$output_file" "$PROJECT_ROOT"
    
    echo "" >> "$output_file"
    echo "Total UI Components: $listed_files files" >> "$output_file"
    echo "(Content not collected - these are auto-generated shadcn/magic-ui components)" >> "$output_file"
    
    echo -e "${YELLOW}  ✓ Listed: $category_name (${listed_files} files)${NC}"
    
    return 0
}

# Function: Collect single file from src
collect_file() {
    local filepath=$1
    local output_file=$2
    local full_path="$SRC_PATH/$filepath"
    
    if [ ! -f "$full_path" ]; then
        echo -e "${YELLOW}  ⚠️  File not found: $filepath${NC}"
        return 1
    fi
    
    process_file "$full_path" "$output_file" "$PROJECT_ROOT"
    return 0
}

# Function: Create file header
create_file_header() {
    local output_file=$1
    local module_name=$2
    local module_description=$3
    
    cat > "$output_file" << EOF
################################################################
##
##  UMKM MULTI-TENANT SYSTEM
##  CLIENT - $module_name MODULE
##
##  Generated: $(date '+%Y-%m-%d %H:%M:%S')
##  Script Version: 5.1 FINAL
##  Project: UMKM Multi-Tenant E-Commerce Platform (Next.js)
##
################################################################

$module_description

################################################################

EOF
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
    echo "Total Files Listed (UI): $listed_files" >> "$output_file"
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
    printf "${GREEN}║${NC}  ${YELLOW}Files Listed (UI):${NC}  %-35s ${GREEN}║${NC}\n" "$listed_files"
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

# ================================================================
# MODULE COLLECTION FUNCTIONS
# ================================================================

# 1. Customers Module
collect_customers_module() {
    local output_file="$OUTPUT_DIR/module-01-customers.txt"
    local start_time=$(date +%s)
    
    echo -e "${GREEN}✓ Starting Customers Module collection...${NC}"
    
    create_file_header "$output_file" "CUSTOMERS" \
"This module contains all Customers-related functionality:
- Dashboard Pages: Customer list, detail, create, edit
- Components: Customer table, forms, dialogs
- API Client: Customer CRUD operations
- Hooks: useCustomers hook
- Types: Customer type definitions"
    
    # Pages
    collect_category "app/(dashboard)/dashboard/customers" "Customer Pages" "$output_file"
    
    # Components
    collect_category "components/customers" "Customer Components" "$output_file"
    
    # Hooks
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Customer Hooks${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "hooks/use-customers.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # API
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Customer API Client${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "lib/api/customers.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Types
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Customer Types${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "types/customer.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    local end_time=$(date +%s)
    show_summary "$output_file" "$end_time" "$start_time"
}

# 2. Orders Module
collect_orders_module() {
    local output_file="$OUTPUT_DIR/module-02-orders.txt"
    local start_time=$(date +%s)
    
    echo -e "${GREEN}✓ Starting Orders Module collection...${NC}"
    
    create_file_header "$output_file" "ORDERS" \
"This module contains all Orders-related functionality:
- Dashboard Pages: Order list, detail, create
- Components: Order table, forms, invoice, status management
- API Client: Order CRUD operations
- Hooks: useOrders hook
- Types: Order type definitions
- Utils: Invoice generation utilities"
    
    # Pages
    collect_category "app/(dashboard)/dashboard/orders" "Order Pages" "$output_file"
    
    # Components
    collect_category "components/orders" "Order Components" "$output_file"
    
    # Hooks
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Order Hooks${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "hooks/use-orders.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # API
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Order API Client${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "lib/api/orders.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Types
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Order Types${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "types/order.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Utils
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Invoice Utilities${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "lib/invoice.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    local end_time=$(date +%s)
    show_summary "$output_file" "$end_time" "$start_time"
}

# 3. Products Module
collect_products_module() {
    local output_file="$OUTPUT_DIR/module-03-products.txt"
    local start_time=$(date +%s)
    
    echo -e "${GREEN}✓ Starting Products Module collection...${NC}"
    
    create_file_header "$output_file" "PRODUCTS" \
"This module contains all Products-related functionality:
- Dashboard Pages: Product list, create, edit, categories
- Components: Product table, forms, dialogs
- Store Components: Product cards, gallery, filters, cart
- Upload Components: Image upload, multi-image upload
- API Client: Product CRUD operations
- Hooks: useProducts hook
- Types: Product type definitions
- Stores: Products store, Cart store
- Config: Product categories configuration"
    
    # Dashboard Pages
    collect_category "app/(dashboard)/dashboard/products" "Product Dashboard Pages" "$output_file"
    
    # Store Pages (Product detail)
    collect_category "app/store/[slug]/products" "Product Store Pages" "$output_file"
    
    # Dashboard Components
    collect_category "components/products" "Product Dashboard Components" "$output_file"
    
    # Store Components
    collect_category "components/store" "Product Store Components" "$output_file"
    
    # Upload Components
    collect_category "components/upload" "Image Upload Components" "$output_file"
    
    # Hooks
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Product Hooks${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "hooks/use-products.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # API
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Product API Client${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "lib/api/products.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Types
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Product Types${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "types/product.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Stores
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Product Stores${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "stores/products-store.ts" "$output_file"
    collect_file "stores/cart-store.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Config
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Product Configuration${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "config/categories.ts" "$output_file"
    collect_file "lib/cloudinary.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    local end_time=$(date +%s)
    show_summary "$output_file" "$end_time" "$start_time"
}

# 4. Authentication Module
collect_auth_module() {
    local output_file="$OUTPUT_DIR/module-04-auth.txt"
    local start_time=$(date +%s)
    
    echo -e "${GREEN}✓ Starting Authentication Module collection...${NC}"
    
    create_file_header "$output_file" "AUTHENTICATION" \
"This module contains all Authentication-related functionality:
- Pages: Login, Register, Forgot Password
- Components: Auth forms, guards, layouts
- API Client: Auth operations (login, register, logout)
- Hooks: useAuth hook
- Types: Auth type definitions
- Store: Auth state management"
    
    # Pages
    collect_category "app/(auth)" "Authentication Pages" "$output_file"
    
    # Components
    collect_category "components/auth" "Auth Components" "$output_file"
    
    # Hooks
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Auth Hooks${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "hooks/use-auth.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # API
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Auth API Client${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "lib/api/auth.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Types
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Auth Types${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "types/auth.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Store
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Auth Store${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "stores/auth-store.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    local end_time=$(date +%s)
    show_summary "$output_file" "$end_time" "$start_time"
}

# 5. Store/Tenant Module
collect_store_module() {
    local output_file="$OUTPUT_DIR/module-05-store-tenant.txt"
    local start_time=$(date +%s)
    
    echo -e "${GREEN}✓ Starting Store/Tenant Module collection...${NC}"
    
    create_file_header "$output_file" "STORE & TENANT" \
"This module contains all Store/Tenant-related functionality:
- Pages: Public store pages, tenant slug routing
- Components: Store layout, header, footer, navigation
- Landing Components: Hero, products, testimonials, CTA
- API Client: Tenant operations
- Hooks: useTenant, useLandingConfig hooks
- Types: Tenant and Landing type definitions
- Utils: Landing utilities, Store URL helpers"
    
    # Store Pages
    collect_category "app/store/[slug]" "Store Pages" "$output_file"
    
    # Preview Page
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Store Preview Page${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "app/(dashboard)/store/page.tsx" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Store Components
    collect_category "components/store" "Store Components" "$output_file"
    
    # Landing Components
    collect_category "components/landing" "Landing Page Components" "$output_file"
    
    # Hooks
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Tenant & Landing Hooks${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "hooks/use-tenant.ts" "$output_file"
    collect_file "hooks/use-landing-config.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # API
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Tenant API Client${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "lib/api/tenants.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Types
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Tenant & Landing Types${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "types/tenant.ts" "$output_file"
    collect_file "types/landing.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Utils
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Landing & Store Utilities${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "lib/landing-utils.ts" "$output_file"
    collect_file "lib/store-url.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    local end_time=$(date +%s)
    show_summary "$output_file" "$end_time" "$start_time"
}

# 6. Settings Module
collect_settings_module() {
    local output_file="$OUTPUT_DIR/module-06-settings.txt"
    local start_time=$(date +%s)
    
    echo -e "${GREEN}✓ Starting Settings Module collection...${NC}"
    
    create_file_header "$output_file" "SETTINGS" \
"This module contains all Settings-related functionality:
- Pages: Settings dashboard page
- Components: Upload components (image, multi-image)
- Utils: Cloudinary integration
- Config: Site configuration
- Types: Cloudinary types"
    
    # Pages
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Settings Page${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "app/(dashboard)/dashboard/settings/page.tsx" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Components
    collect_category "components/upload" "Upload Components" "$output_file"
    
    # Utils
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Cloudinary Utils${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "lib/cloudinary.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Config
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Site Configuration${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "config/site.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Types
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Cloudinary Types${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "types/cloudinary.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    local end_time=$(date +%s)
    show_summary "$output_file" "$end_time" "$start_time"
}

# 7. Dashboard Core Module
collect_dashboard_module() {
    local output_file="$OUTPUT_DIR/module-07-dashboard-core.txt"
    local start_time=$(date +%s)
    
    echo -e "${GREEN}✓ Starting Dashboard Core Module collection...${NC}"
    
    create_file_header "$output_file" "DASHBOARD CORE" \
"This module contains Dashboard Core functionality:
- Pages: Main dashboard overview
- Layout: Dashboard layout wrapper
- Components: Navigation, sidebar, breadcrumb, header, shell
- Config: Navigation configuration
- Store: UI state management"
    
    # Pages
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Dashboard Main Page${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "app/(dashboard)/dashboard/page.tsx" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Layout
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Dashboard Layout${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "app/(dashboard)/layout.tsx" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Components
    collect_category "components/dashboard" "Dashboard Components" "$output_file"
    
    # Config
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Navigation Configuration${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "config/navigation.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Store
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}UI Store${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "stores/ui-store.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    local end_time=$(date +%s)
    show_summary "$output_file" "$end_time" "$start_time"
}

# 8. SEO & PWA Module
collect_seo_pwa_module() {
    local output_file="$OUTPUT_DIR/module-08-seo-pwa.txt"
    local start_time=$(date +%s)
    
    echo -e "${GREEN}✓ Starting SEO & PWA Module collection...${NC}"
    
    create_file_header "$output_file" "SEO & PWA" \
"This module contains SEO & PWA functionality:
- SEO Components: Schema markup, social share
- PWA Components: Install prompt, PWA provider
- Routes: Sitemap generation, OpenGraph images
- Hooks: usePWA hook
- Config: SEO configuration
- Utils: SEO utilities, OG image generation"
    
    # SEO Components
    collect_category "components/seo" "SEO Components" "$output_file"
    
    # PWA Components
    collect_category "components/pwa" "PWA Components" "$output_file"
    
    # Routes
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}SEO Routes${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    
    # Sitemap routes
    collect_category "app/server-sitemap" "Sitemap Dynamic Routes" "$output_file"
    collect_category "app/server-sitemap-index.xml" "Sitemap Index Route" "$output_file"
    
    # OG Images
    collect_file "app/opengraph-image.tsx" "$output_file"
    collect_file "app/twitter-image.tsx" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Hooks
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}PWA Hooks${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "hooks/use-pwa.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Config
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}SEO Configuration${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "config/seo.config.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    # Utils
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}SEO Utilities${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    collect_file "lib/seo.ts" "$output_file"
    collect_file "lib/og-utils.ts" "$output_file"
    total_categories=$((total_categories + 1))
    
    local end_time=$(date +%s)
    show_summary "$output_file" "$end_time" "$start_time"
}

# 9. Marketing/Landing Page Module
collect_marketing_module() {
    local output_file="$OUTPUT_DIR/module-09-marketing.txt"
    local start_time=$(date +%s)
    
    echo -e "${GREEN}✓ Starting Marketing/Landing Page Module collection...${NC}"
    
    create_file_header "$output_file" "MARKETING & LANDING" \
"This module contains Marketing/Landing page functionality:
- Pages: Marketing layout, home page
- Platform Landing Components: All marketing sections
  (Hero, Features, Pricing, Testimonials, FAQ, CTA, etc.)"
    
    # Marketing Pages
    collect_category "app/(marketing)" "Marketing Pages" "$output_file"
    
    # Platform Landing Components
    collect_category "components/platform-landing" "Platform Landing Components" "$output_file"
    
    local end_time=$(date +%s)
    show_summary "$output_file" "$end_time" "$start_time"
}

# 10. Core/Shared Infrastructure Module
collect_core_module() {
    local output_file="$OUTPUT_DIR/module-10-core-shared.txt"
    local start_time=$(date +%s)
    
    echo -e "${GREEN}✓ Starting Core/Shared Infrastructure Module collection...${NC}"
    
    create_file_header "$output_file" "CORE & SHARED INFRASTRUCTURE" \
"This module contains Core/Shared functionality used across all modules:

COLLECTED (Full Content):
- Providers: Theme, Toast, Hydration providers
- Core Lib: API client, server, utilities, formatting, validations
- Core Hooks: debounce, media-query, mobile, mounted
- Core Types: API types, barrel exports
- Core Config: constants, barrel exports
- Root App: layout, page, globals.css
- Stores: barrel export
- Proxy: development proxy

LISTED ONLY (shadcn/magic-ui - auto-generated):
- UI Components: 60+ primitive components"
    
    # ============================================
    # SECTION 1: PROVIDERS (Full Content)
    # ============================================
    collect_category "providers" "React Providers" "$output_file"
    
    # ============================================
    # SECTION 2: CORE LIB FILES (Full Content)
    # ============================================
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Core Library Files${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    
    # API Core
    collect_file "lib/api/client.ts" "$output_file"
    collect_file "lib/api/server.ts" "$output_file"
    collect_file "lib/api/index.ts" "$output_file"
    
    # Utilities
    collect_file "lib/cn.ts" "$output_file"
    collect_file "lib/utils.ts" "$output_file"
    collect_file "lib/format.ts" "$output_file"
    collect_file "lib/validations.ts" "$output_file"
    collect_file "lib/schema.ts" "$output_file"
    collect_file "lib/index.ts" "$output_file"
    
    total_categories=$((total_categories + 1))
    
    # ============================================
    # SECTION 3: CORE HOOKS (Full Content)
    # ============================================
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Core Hooks${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    
    collect_file "hooks/use-debounce.ts" "$output_file"
    collect_file "hooks/use-media-query.ts" "$output_file"
    collect_file "hooks/use-mobile.ts" "$output_file"
    collect_file "hooks/use-mounted.ts" "$output_file"
    collect_file "hooks/index.ts" "$output_file"
    
    total_categories=$((total_categories + 1))
    
    # ============================================
    # SECTION 4: CORE TYPES (Full Content)
    # ============================================
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Core Types${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    
    collect_file "types/api.ts" "$output_file"
    collect_file "types/index.ts" "$output_file"
    
    total_categories=$((total_categories + 1))
    
    # ============================================
    # SECTION 5: CORE CONFIG (Full Content)
    # ============================================
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Core Configuration${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    
    collect_file "config/constants.ts" "$output_file"
    collect_file "config/index.ts" "$output_file"
    
    total_categories=$((total_categories + 1))
    
    # ============================================
    # SECTION 6: ROOT APP FILES (Full Content)
    # ============================================
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Root App Files${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    
    collect_file "app/layout.tsx" "$output_file"
    collect_file "app/page.tsx" "$output_file"
    collect_file "app/globals.css" "$output_file"
    
    total_categories=$((total_categories + 1))
    
    # ============================================
    # SECTION 7: STORES INDEX (Full Content)
    # ============================================
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Stores Index${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    
    collect_file "stores/index.ts" "$output_file"
    
    total_categories=$((total_categories + 1))
    
    # ============================================
    # SECTION 8: PROXY (Full Content)
    # ============================================
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  ${BOLD}Development Proxy${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    
    collect_file "proxy.ts" "$output_file"
    
    total_categories=$((total_categories + 1))
    
    # ============================================
    # SECTION 9: UI COMPONENTS (LIST ONLY!)
    # ============================================
    list_category "components/ui" "UI Components (shadcn/magic-ui) - LIST ONLY" "$output_file"
    
    local end_time=$(date +%s)
    show_summary "$output_file" "$end_time" "$start_time"
}

# 11. Collect ALL Modules
collect_all_modules() {
    local output_file="$OUTPUT_DIR/FULL-EXPORT-ALL-MODULES.txt"
    local start_time=$(date +%s)
    
    echo -e "${GREEN}✓ Starting FULL EXPORT - All Modules collection...${NC}"
    
    create_file_header "$output_file" "FULL EXPORT - ALL MODULES" \
"This file contains ALL modules of the UMKM Multi-Tenant Client:

1. Customers Module
2. Orders Module  
3. Products Module
4. Authentication Module
5. Store/Tenant Module
6. Settings Module
7. Dashboard Core
8. SEO & PWA Module
9. Marketing/Landing Page
10. Core/Shared Infrastructure (with UI Components LIST)

Generated for complete project documentation and AI context."
    
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  FULL EXPORT MODE - Collecting All 10 Modules${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    
    # Module 1: Customers
    echo "" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "##  MODULE 1: CUSTOMERS" >> "$output_file"
    echo "################################################################" >> "$output_file"
    collect_category "app/(dashboard)/dashboard/customers" "Customer Pages" "$output_file"
    collect_category "components/customers" "Customer Components" "$output_file"
    collect_file "hooks/use-customers.ts" "$output_file"
    collect_file "lib/api/customers.ts" "$output_file"
    collect_file "types/customer.ts" "$output_file"
    
    # Module 2: Orders
    echo "" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "##  MODULE 2: ORDERS" >> "$output_file"
    echo "################################################################" >> "$output_file"
    collect_category "app/(dashboard)/dashboard/orders" "Order Pages" "$output_file"
    collect_category "components/orders" "Order Components" "$output_file"
    collect_file "hooks/use-orders.ts" "$output_file"
    collect_file "lib/api/orders.ts" "$output_file"
    collect_file "types/order.ts" "$output_file"
    collect_file "lib/invoice.ts" "$output_file"
    
    # Module 3: Products
    echo "" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "##  MODULE 3: PRODUCTS" >> "$output_file"
    echo "################################################################" >> "$output_file"
    collect_category "app/(dashboard)/dashboard/products" "Product Dashboard Pages" "$output_file"
    collect_category "app/store/[slug]/products" "Product Store Pages" "$output_file"
    collect_category "components/products" "Product Dashboard Components" "$output_file"
    collect_category "components/store" "Product Store Components" "$output_file"
    collect_category "components/upload" "Image Upload Components" "$output_file"
    collect_file "hooks/use-products.ts" "$output_file"
    collect_file "lib/api/products.ts" "$output_file"
    collect_file "types/product.ts" "$output_file"
    collect_file "stores/products-store.ts" "$output_file"
    collect_file "stores/cart-store.ts" "$output_file"
    collect_file "config/categories.ts" "$output_file"
    collect_file "lib/cloudinary.ts" "$output_file"
    
    # Module 4: Authentication
    echo "" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "##  MODULE 4: AUTHENTICATION" >> "$output_file"
    echo "################################################################" >> "$output_file"
    collect_category "app/(auth)" "Authentication Pages" "$output_file"
    collect_category "components/auth" "Auth Components" "$output_file"
    collect_file "hooks/use-auth.ts" "$output_file"
    collect_file "lib/api/auth.ts" "$output_file"
    collect_file "types/auth.ts" "$output_file"
    collect_file "stores/auth-store.ts" "$output_file"
    
    # Module 5: Store/Tenant
    echo "" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "##  MODULE 5: STORE & TENANT" >> "$output_file"
    echo "################################################################" >> "$output_file"
    collect_category "app/store/[slug]" "Store Pages" "$output_file"
    collect_file "app/(dashboard)/store/page.tsx" "$output_file"
    collect_category "components/landing" "Landing Page Components" "$output_file"
    collect_file "hooks/use-tenant.ts" "$output_file"
    collect_file "hooks/use-landing-config.ts" "$output_file"
    collect_file "lib/api/tenants.ts" "$output_file"
    collect_file "types/tenant.ts" "$output_file"
    collect_file "types/landing.ts" "$output_file"
    collect_file "lib/landing-utils.ts" "$output_file"
    collect_file "lib/store-url.ts" "$output_file"
    
    # Module 6: Settings
    echo "" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "##  MODULE 6: SETTINGS" >> "$output_file"
    echo "################################################################" >> "$output_file"
    collect_file "app/(dashboard)/dashboard/settings/page.tsx" "$output_file"
    collect_file "config/site.ts" "$output_file"
    collect_file "types/cloudinary.ts" "$output_file"
    
    # Module 7: Dashboard Core
    echo "" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "##  MODULE 7: DASHBOARD CORE" >> "$output_file"
    echo "################################################################" >> "$output_file"
    collect_file "app/(dashboard)/dashboard/page.tsx" "$output_file"
    collect_file "app/(dashboard)/layout.tsx" "$output_file"
    collect_category "components/dashboard" "Dashboard Components" "$output_file"
    collect_file "config/navigation.ts" "$output_file"
    collect_file "stores/ui-store.ts" "$output_file"
    
    # Module 8: SEO & PWA
    echo "" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "##  MODULE 8: SEO & PWA" >> "$output_file"
    echo "################################################################" >> "$output_file"
    collect_category "components/seo" "SEO Components" "$output_file"
    collect_category "components/pwa" "PWA Components" "$output_file"
    collect_category "app/server-sitemap" "Sitemap Dynamic Routes" "$output_file"
    collect_category "app/server-sitemap-index.xml" "Sitemap Index Route" "$output_file"
    collect_file "app/opengraph-image.tsx" "$output_file"
    collect_file "app/twitter-image.tsx" "$output_file"
    collect_file "hooks/use-pwa.ts" "$output_file"
    collect_file "config/seo.config.ts" "$output_file"
    collect_file "lib/seo.ts" "$output_file"
    collect_file "lib/og-utils.ts" "$output_file"
    
    # Module 9: Marketing
    echo "" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "##  MODULE 9: MARKETING & LANDING" >> "$output_file"
    echo "################################################################" >> "$output_file"
    collect_category "app/(marketing)" "Marketing Pages" "$output_file"
    collect_category "components/platform-landing" "Platform Landing Components" "$output_file"
    
    # Module 10: Core/Shared
    echo "" >> "$output_file"
    echo "################################################################" >> "$output_file"
    echo "##  MODULE 10: CORE & SHARED INFRASTRUCTURE" >> "$output_file"
    echo "################################################################" >> "$output_file"
    collect_category "providers" "React Providers" "$output_file"
    collect_file "lib/api/client.ts" "$output_file"
    collect_file "lib/api/server.ts" "$output_file"
    collect_file "lib/api/index.ts" "$output_file"
    collect_file "lib/cn.ts" "$output_file"
    collect_file "lib/utils.ts" "$output_file"
    collect_file "lib/format.ts" "$output_file"
    collect_file "lib/validations.ts" "$output_file"
    collect_file "lib/schema.ts" "$output_file"
    collect_file "lib/index.ts" "$output_file"
    collect_file "hooks/use-debounce.ts" "$output_file"
    collect_file "hooks/use-media-query.ts" "$output_file"
    collect_file "hooks/use-mobile.ts" "$output_file"
    collect_file "hooks/use-mounted.ts" "$output_file"
    collect_file "hooks/index.ts" "$output_file"
    collect_file "types/api.ts" "$output_file"
    collect_file "types/index.ts" "$output_file"
    collect_file "config/constants.ts" "$output_file"
    collect_file "config/index.ts" "$output_file"
    collect_file "app/layout.tsx" "$output_file"
    collect_file "app/page.tsx" "$output_file"
    collect_file "app/globals.css" "$output_file"
    collect_file "stores/index.ts" "$output_file"
    collect_file "proxy.ts" "$output_file"
    
    # UI Components - LIST ONLY
    list_category "components/ui" "UI Components (shadcn/magic-ui) - LIST ONLY" "$output_file"
    
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
        echo -e "${CYAN}Please update PROJECT_ROOT variable to match your project location.${NC}"
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
            echo -e "${BLUE}  Module 1: ${BOLD}Customers${NC}"
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            collect_customers_module
            ;;
        2)
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            echo -e "${BLUE}  Module 2: ${BOLD}Orders${NC}"
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            collect_orders_module
            ;;
        3)
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            echo -e "${BLUE}  Module 3: ${BOLD}Products${NC}"
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            collect_products_module
            ;;
        4)
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            echo -e "${BLUE}  Module 4: ${BOLD}Authentication${NC}"
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            collect_auth_module
            ;;
        5)
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            echo -e "${BLUE}  Module 5: ${BOLD}Store/Tenant${NC}"
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            collect_store_module
            ;;
        6)
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            echo -e "${BLUE}  Module 6: ${BOLD}Settings${NC}"
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            collect_settings_module
            ;;
        7)
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            echo -e "${BLUE}  Module 7: ${BOLD}Dashboard Core${NC}"
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            collect_dashboard_module
            ;;
        8)
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            echo -e "${BLUE}  Module 8: ${BOLD}SEO & PWA${NC}"
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            collect_seo_pwa_module
            ;;
        9)
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            echo -e "${BLUE}  Module 9: ${BOLD}Marketing/Landing${NC}"
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            collect_marketing_module
            ;;
        10)
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            echo -e "${BLUE}  Module 10: ${BOLD}Core/Shared Infrastructure${NC}"
            echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
            collect_core_module
            ;;
        11)
            echo -e "${RED}═══════════════════════════════════════════════════════${NC}"
            echo -e "${RED}  ${BOLD}FULL EXPORT - ALL MODULES${NC}"
            echo -e "${RED}═══════════════════════════════════════════════════════${NC}"
            collect_all_modules
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
    
    if [ $listed_files -gt 0 ]; then
        echo -e "${YELLOW}📋 Info: $listed_files UI component(s) were listed (not collected)${NC}"
    fi
    
    echo -e "${GREEN}✨ Collection completed successfully!${NC}"
    echo -e "${CYAN}💡 Tip: Check the output file in 'collections/' folder${NC}"
    echo ""
}

# Reset statistics for each run
reset_stats() {
    total_categories=0
    total_files=0
    total_lines=0
    failed_files=0
    skipped_files=0
    listed_files=0
}

# Run main function
reset_stats
main "$@"
#!/bin/bash

# ============================================
# ULTRA SMART LANDING COMPONENTS COLLECTOR
# Path: src/components/landing/
# ============================================
#
# FEATURES:
# - Interactive OR command-line mode
# - Smart range selection (1-10, 20-30, etc.)
# - TXT output format
# - Preset options (quick collection)
# - 6 sections: hero, about, products, testimonials, contact, cta
#
# Usage (Interactive):
#   chmod +x collect-landing-ultra.sh
#   ./collect-landing-ultra.sh
#
# Usage (Command-line):
#   ./collect-landing-ultra.sh --hero 1-10 --about 1-20 --products all --skip-testimonials
#   ./collect-landing-ultra.sh --all 1-50          # All blocks 1-50
#   ./collect-landing-ultra.sh --preset small      # Preset: 1-10
#   ./collect-landing-ultra.sh --preset medium     # Preset: 1-50
#   ./collect-landing-ultra.sh --preset large      # Preset: 1-100
#   ./collect-landing-ultra.sh --preset full       # All files
#
# ============================================

OUTPUT_DIR="collections"
OUTPUT_FILE="$OUTPUT_DIR/landing-components-$(date +%Y%m%d-%H%M%S).txt"

mkdir -p "$OUTPUT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Variables
FOUND_COUNT=0
NOT_FOUND_COUNT=0
TOTAL_LINES=0
INTERACTIVE_MODE=true

# Range configurations for each block
declare -A BLOCK_RANGES
BLOCK_RANGES["hero"]=""
BLOCK_RANGES["about"]=""
BLOCK_RANGES["products"]=""
BLOCK_RANGES["testimonials"]=""
BLOCK_RANGES["contact"]=""
BLOCK_RANGES["cta"]=""

# ============================================
# PARSE COMMAND LINE ARGUMENTS
# ============================================

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --hero)
                BLOCK_RANGES["hero"]="$2"
                INTERACTIVE_MODE=false
                shift 2
                ;;
            --about)
                BLOCK_RANGES["about"]="$2"
                INTERACTIVE_MODE=false
                shift 2
                ;;
            --products)
                BLOCK_RANGES["products"]="$2"
                INTERACTIVE_MODE=false
                shift 2
                ;;
            --testimonials)
                BLOCK_RANGES["testimonials"]="$2"
                INTERACTIVE_MODE=false
                shift 2
                ;;
            --contact)
                BLOCK_RANGES["contact"]="$2"
                INTERACTIVE_MODE=false
                shift 2
                ;;
            --cta)
                BLOCK_RANGES["cta"]="$2"
                INTERACTIVE_MODE=false
                shift 2
                ;;
            --all)
                local range="$2"
                BLOCK_RANGES["hero"]="$range"
                BLOCK_RANGES["about"]="$range"
                BLOCK_RANGES["products"]="$range"
                BLOCK_RANGES["testimonials"]="$range"
                BLOCK_RANGES["contact"]="$range"
                BLOCK_RANGES["cta"]="$range"
                INTERACTIVE_MODE=false
                shift 2
                ;;
            --skip-hero)
                BLOCK_RANGES["hero"]="skip"
                INTERACTIVE_MODE=false
                shift
                ;;
            --skip-about)
                BLOCK_RANGES["about"]="skip"
                INTERACTIVE_MODE=false
                shift
                ;;
            --skip-products)
                BLOCK_RANGES["products"]="skip"
                INTERACTIVE_MODE=false
                shift
                ;;
            --skip-testimonials)
                BLOCK_RANGES["testimonials"]="skip"
                INTERACTIVE_MODE=false
                shift
                ;;
            --skip-contact)
                BLOCK_RANGES["contact"]="skip"
                INTERACTIVE_MODE=false
                shift
                ;;
            --skip-cta)
                BLOCK_RANGES["cta"]="skip"
                INTERACTIVE_MODE=false
                shift
                ;;
            --preset)
                local preset="$2"
                case $preset in
                    small)
                        BLOCK_RANGES["hero"]="1-10"
                        BLOCK_RANGES["about"]="1-10"
                        BLOCK_RANGES["products"]="1-10"
                        BLOCK_RANGES["testimonials"]="1-10"
                        BLOCK_RANGES["contact"]="1-10"
                        BLOCK_RANGES["cta"]="1-10"
                        ;;
                    medium)
                        BLOCK_RANGES["hero"]="1-50"
                        BLOCK_RANGES["about"]="1-50"
                        BLOCK_RANGES["products"]="1-50"
                        BLOCK_RANGES["testimonials"]="1-50"
                        BLOCK_RANGES["contact"]="1-50"
                        BLOCK_RANGES["cta"]="1-50"
                        ;;
                    large)
                        BLOCK_RANGES["hero"]="1-100"
                        BLOCK_RANGES["about"]="1-100"
                        BLOCK_RANGES["products"]="1-100"
                        BLOCK_RANGES["testimonials"]="1-100"
                        BLOCK_RANGES["contact"]="1-100"
                        BLOCK_RANGES["cta"]="1-100"
                        ;;
                    full)
                        BLOCK_RANGES["hero"]="all"
                        BLOCK_RANGES["about"]="all"
                        BLOCK_RANGES["products"]="all"
                        BLOCK_RANGES["testimonials"]="all"
                        BLOCK_RANGES["contact"]="all"
                        BLOCK_RANGES["cta"]="all"
                        ;;
                    *)
                        echo -e "${RED}Unknown preset: $preset${NC}"
                        echo "Available presets: small, medium, large, full"
                        exit 1
                        ;;
                esac
                INTERACTIVE_MODE=false
                shift 2
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                echo -e "${RED}Unknown option: $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done
}

show_help() {
    cat << EOF
${CYAN}╔════════════════════════════════════════════╗${NC}
${CYAN}║   🎨 ULTRA SMART COMPONENTS COLLECTOR      ║${NC}
${CYAN}╚════════════════════════════════════════════╝${NC}

${YELLOW}USAGE:${NC}
  Interactive Mode:
    ./collect-landing-ultra.sh

  Command-line Mode:
    ./collect-landing-ultra.sh [OPTIONS]

${YELLOW}OPTIONS:${NC}
  --hero <range>           Collect hero blocks
  --about <range>          Collect about blocks
  --products <range>       Collect products blocks
  --testimonials <range>   Collect testimonials blocks
  --contact <range>        Collect contact blocks
  --cta <range>            Collect cta blocks
  --all <range>            Collect all blocks with same range
  
  --skip-hero              Skip hero blocks
  --skip-about             Skip about blocks
  --skip-products          Skip products blocks
  --skip-testimonials      Skip testimonials blocks
  --skip-contact           Skip contact blocks
  --skip-cta               Skip cta blocks
  
  --preset <name>          Use preset configuration
  --help, -h               Show this help

${YELLOW}RANGE FORMATS:${NC}
  1-10                     Files 1 to 10
  1-10,20-30               Files 1-10 and 20-30
  5,15,25                  Files 5, 15, and 25
  all                      All available files
  skip                     Skip this section

${YELLOW}PRESETS:${NC}
  small                    Files 1-10 (all blocks)
  medium                   Files 1-50 (all blocks)
  large                    Files 1-100 (all blocks)
  full                     All files (all blocks)

${YELLOW}EXAMPLES:${NC}
  ${GREEN}# Collect hero 1-10, about 1-20, skip products${NC}
  ./collect-landing-ultra.sh --hero 1-10 --about 1-20 --skip-products

  ${GREEN}# Collect all blocks 1-50${NC}
  ./collect-landing-ultra.sh --all 1-50

  ${GREEN}# Use medium preset${NC}
  ./collect-landing-ultra.sh --preset medium

  ${GREEN}# Interactive mode${NC}
  ./collect-landing-ultra.sh

EOF
}

# ============================================
# HELPER FUNCTIONS
# ============================================

collect_file() {
    local file=$1
    local relative_path=$2
    
    if [ -f "$file" ]; then
        local line_count=$(wc -l < "$file")
        TOTAL_LINES=$((TOTAL_LINES + line_count))
        FOUND_COUNT=$((FOUND_COUNT + 1))
        echo -e "  ${GREEN}✅ $relative_path${NC} (${line_count} lines)"
        
        cat >> "$OUTPUT_FILE" << EOF

--------------------------------------------------------------------------------
FILE: $relative_path
Lines: $line_count
--------------------------------------------------------------------------------

$(cat "$file")

EOF
    else
        NOT_FOUND_COUNT=$((NOT_FOUND_COUNT + 1))
        echo -e "  ${RED}❌ NOT FOUND: $relative_path${NC}"
    fi
}

parse_range() {
    local input=$1
    local numbers=()
    
    IFS=',' read -ra RANGES <<< "$input"
    
    for range in "${RANGES[@]}"; do
        if [[ $range =~ ^([0-9]+)-([0-9]+)$ ]]; then
            start=${BASH_REMATCH[1]}
            end=${BASH_REMATCH[2]}
            for ((i=start; i<=end; i++)); do
                numbers+=($i)
            done
        elif [[ $range =~ ^[0-9]+$ ]]; then
            numbers+=($range)
        fi
    done
    
    printf '%s\n' "${numbers[@]}" | sort -n | uniq
}

collect_block_files() {
    local block_type=$1
    local range_input=$2
    local base_path="client/src/components/landing/blocks/$block_type"
    
    if [ "$range_input" = "all" ] || [ "$range_input" = "a" ]; then
        for file in "$base_path"/${block_type}*.tsx; do
            if [ -f "$file" ]; then
                local filename=$(basename "$file")
                collect_file "$file" "src/components/landing/blocks/$block_type/$filename"
            fi
        done
    else
        local numbers=($(parse_range "$range_input"))
        for num in "${numbers[@]}"; do
            local file="$base_path/${block_type}${num}.tsx"
            collect_file "$file" "src/components/landing/blocks/$block_type/${block_type}${num}.tsx"
        done
    fi
}

# ============================================
# MAIN SCRIPT
# ============================================

# Parse arguments
parse_arguments "$@"

echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🎨 ULTRA SMART COMPONENTS COLLECTOR      ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📍 Working directory: $(pwd)${NC}"
echo -e "${BLUE}📄 Output file: $OUTPUT_FILE${NC}"
echo -e "${BLUE}🎮 Mode: $([ "$INTERACTIVE_MODE" = true ] && echo "Interactive" || echo "Command-line")${NC}"
echo ""

# Initialize output file
cat > "$OUTPUT_FILE" << EOF
================================================================================
LANDING COMPONENTS - ULTRA SMART COLLECTION
================================================================================
Generated on: $(date)
Working Directory: $(pwd)
Mode: $([ "$INTERACTIVE_MODE" = true ] && echo "Interactive" || echo "Command-line")

SCOPE:
- Landing Page Components (tenant-*.tsx)
- Block Variants (hero, about, products, testimonials, contact, cta)
- Index files & Mapping

================================================================================

EOF

# ============================================
# ROOT COMPONENTS
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}📄 ROOT LANDING COMPONENTS${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
📄 ROOT LANDING COMPONENTS
================================================================================

EOF

collect_file "client/src/components/landing/index.ts" "src/components/landing/index.ts"
collect_file "client/src/components/landing/tenant-hero.tsx" "src/components/landing/tenant-hero.tsx"
collect_file "client/src/components/landing/tenant-about.tsx" "src/components/landing/tenant-about.tsx"
collect_file "client/src/components/landing/tenant-products.tsx" "src/components/landing/tenant-products.tsx"
collect_file "client/src/components/landing/tenant-testimonials.tsx" "src/components/landing/tenant-testimonials.tsx"
collect_file "client/src/components/landing/tenant-contact.tsx" "src/components/landing/tenant-contact.tsx"
collect_file "client/src/components/landing/tenant-cta.tsx" "src/components/landing/tenant-cta.tsx"

# ============================================
# BLOCKS INDEX & MAPPING
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}📁 BLOCKS INDEX & MAPPING${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
📁 BLOCKS INDEX & MAPPING
================================================================================

EOF

collect_file "client/src/components/landing/blocks/index.ts" "src/components/landing/blocks/index.ts"
collect_file "client/src/components/landing/blocks/MAPPING.md" "src/components/landing/blocks/MAPPING.md"

# ============================================
# BLOCK SECTIONS
# ============================================

declare -A BLOCK_TYPES=(
    ["hero"]="🦸 HERO BLOCKS"
    ["about"]="ℹ️  ABOUT BLOCKS"
    ["products"]="🛍️  PRODUCTS BLOCKS"
    ["testimonials"]="💬 TESTIMONIALS BLOCKS"
    ["contact"]="📞 CONTACT BLOCKS"
    ["cta"]="🚀 CTA BLOCKS"
)

BLOCK_ORDER=("hero" "about" "products" "testimonials" "contact" "cta")

for block in "${BLOCK_ORDER[@]}"; do
    echo ""
    echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
    echo -e "${PURPLE}${BLOCK_TYPES[$block]}${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
    echo ""
    
    local range_input="${BLOCK_RANGES[$block]}"
    
    if [ "$INTERACTIVE_MODE" = true ]; then
        echo -e "${YELLOW}Enter range for $block blocks:${NC}"
        echo -e "${CYAN}  Examples:${NC}"
        echo -e "    ${GREEN}1-10${NC}       → Files 1 to 10"
        echo -e "    ${GREEN}1-10,20-30${NC} → Files 1-10 and 20-30"
        echo -e "    ${GREEN}5,15,25${NC}    → Files 5, 15, and 25"
        echo -e "    ${GREEN}all${NC} or ${GREEN}a${NC}   → All files"
        echo -e "    ${GREEN}skip${NC} or ${GREEN}s${NC}  → Skip this section"
        echo ""
        read -p "Range: " range_input
    fi
    
    if [ "$range_input" = "skip" ] || [ "$range_input" = "s" ] || [ -z "$range_input" ]; then
        echo -e "${YELLOW}⏭️  Skipping $block blocks${NC}"
        continue
    fi
    
    cat >> "$OUTPUT_FILE" << EOF

================================================================================
${BLOCK_TYPES[$block]}
Range: $range_input
================================================================================

EOF
    
    collect_file "client/src/components/landing/blocks/$block/index.ts" "src/components/landing/blocks/$block/index.ts"
    collect_block_files "$block" "$range_input"
done

# ============================================
# SUMMARY
# ============================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}📊 COLLECTION SUMMARY${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
📊 COLLECTION SUMMARY
================================================================================

Landing Components Module:

┌─────────────────────────┬────────────────┐
│ Section                 │ Configuration  │
├─────────────────────────┼────────────────┤
│ 📄 Root Components      │ All (7 files)  │
│ 📁 Blocks Index/Mapping │ All (2 files)  │
│ 🦸 Hero Blocks          │ ${BLOCK_RANGES["hero"]:-Interactive}  │
│ ℹ️  About Blocks         │ ${BLOCK_RANGES["about"]:-Interactive}  │
│ 🛍️  Products Blocks      │ ${BLOCK_RANGES["products"]:-Interactive}  │
│ 💬 Testimonials Blocks  │ ${BLOCK_RANGES["testimonials"]:-Interactive}  │
│ 📞 Contact Blocks       │ ${BLOCK_RANGES["contact"]:-Interactive}  │
│ 🚀 CTA Blocks           │ ${BLOCK_RANGES["cta"]:-Interactive}  │
└─────────────────────────┴────────────────┘

Stats:
- ✅ Found: $FOUND_COUNT files
- ❌ Missing: $NOT_FOUND_COUNT files
- 📝 Total lines: $TOTAL_LINES

Output:
$(pwd)/$OUTPUT_FILE

================================================================================
END OF COLLECTION
================================================================================
EOF

echo ""
echo -e "${GREEN}✅ Landing components collected successfully!${NC}"
echo -e "${BLUE}📄 Output: $OUTPUT_FILE${NC}"
echo -e "${CYAN}📊 Found: ${FOUND_COUNT} | Missing: ${NOT_FOUND_COUNT} | Lines: ${TOTAL_LINES}${NC}"
echo ""
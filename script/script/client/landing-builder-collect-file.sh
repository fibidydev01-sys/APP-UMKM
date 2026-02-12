#!/bin/bash

# ============================================================================
# LANDING BUILDER FILE COLLECTOR - FULL ANALYSIS PACKAGE
# Collect all files needed for implementation analysis
# Output: Single TXT file with all source code
# ============================================================================

OUTPUT_DIR="landing-builder-analysis"
OUTPUT_FILE="$OUTPUT_DIR/landing-builder-files-$(date +%Y%m%d-%H%M%S).txt"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Stats
FOUND_COUNT=0
NOT_FOUND_COUNT=0
TOTAL_LINES=0

echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  🗂️  LANDING BUILDER FILE COLLECTOR        ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📍 Working directory: $(pwd)${NC}"
echo -e "${BLUE}📄 Output file: $OUTPUT_FILE${NC}"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# ============================================================================
# HELPER FUNCTION: Collect File
# ============================================================================

collect_file() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        local line_count=$(wc -l < "$file" 2>/dev/null || echo "0")
        TOTAL_LINES=$((TOTAL_LINES + line_count))
        FOUND_COUNT=$((FOUND_COUNT + 1))
        echo -e "  ${GREEN}✅ $file${NC} (${line_count} lines)"
        
        cat >> "$OUTPUT_FILE" << EOF

================================================================================
FILE: $file
Description: $description
Lines: $line_count
================================================================================

$(cat "$file")

EOF
    else
        NOT_FOUND_COUNT=$((NOT_FOUND_COUNT + 1))
        echo -e "  ${RED}❌ NOT FOUND: $file${NC}"
        
        cat >> "$OUTPUT_FILE" << EOF

================================================================================
FILE: $file (NOT FOUND)
Description: $description
================================================================================

[FILE NOT FOUND]

EOF
    fi
}

# ============================================================================
# INITIALIZE OUTPUT FILE
# ============================================================================

cat > "$OUTPUT_FILE" << EOF
================================================================================
LANDING BUILDER - COMPLETE FILE COLLECTION FOR ANALYSIS
================================================================================
Generated on: $(date)
Working Directory: $(pwd)

PURPOSE:
This collection contains ALL files needed to analyze and implement the
"Isolated Preview + Full Preview Modal" feature for the landing builder.

CONTENTS:
1. App/Landing-Builder Files (page, layout)
2. Landing-Builder Components (core implementation)
3. Landing Section Components (renderers)
4. Hooks (configuration management)
5. Types (TypeScript definitions)
6. Lib/Landing (utilities, templates, context)
7. UI Components (dialog, button, etc.)
8. Related Files (navigation, settings)

================================================================================

EOF

# ============================================================================
# SECTION 1: APP/LANDING-BUILDER FILES
# ============================================================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}📱 1. APP/LANDING-BUILDER FILES${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
📱 SECTION 1: APP/LANDING-BUILDER FILES
================================================================================
Main page and layout for the landing builder route.

EOF

collect_file "src/app/landing-builder/page.tsx" "Main landing builder page - contains state, handlers, and layout"
collect_file "src/app/landing-builder/layout.tsx" "Layout wrapper for landing builder route"

# ============================================================================
# SECTION 2: LANDING-BUILDER COMPONENTS (CORE)
# ============================================================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}🧩 2. LANDING-BUILDER COMPONENTS (CORE)${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
🧩 SECTION 2: LANDING-BUILDER COMPONENTS (CORE)
================================================================================
Core components for the builder interface.

EOF

collect_file "src/components/landing-builder/index.ts" "Export barrel - exports all landing-builder components"
collect_file "src/components/landing-builder/live-preview.tsx" "⭐ MAIN: Live preview component - WILL BE MODIFIED"
collect_file "src/components/landing-builder/builder-sidebar.tsx" "Left sidebar with section list and drag-drop"
collect_file "src/components/landing-builder/block-drawer.tsx" "Bottom drawer for block selection"
collect_file "src/components/landing-builder/builder-loading-steps.tsx" "Loading animation for builder"
collect_file "src/components/landing-builder/landing-error-boundary.tsx" "Error boundary wrapper"
collect_file "src/components/landing-builder/block-options.ts" "Block configuration and metadata"
collect_file "src/components/landing-builder/device-frame.tsx" "Device preview frame (mobile/tablet/desktop)"
collect_file "src/components/landing-builder/section-sheet.tsx" "Section configuration sheet (may be deprecated)"
collect_file "src/components/landing-builder/template-selector.tsx" "Template selection component"
collect_file "src/components/landing-builder/testimonial-editor.tsx" "Testimonial editor component"
collect_file "src/components/landing-builder/preview-mode-toggle.tsx" "Preview mode toggle (if exists)"

# Old/deprecated (for reference)
collect_file "src/components/landing-builder/landing-builder.tsx" "Old landing builder component (deprecated, for reference)"
collect_file "src/components/landing-builder/landing-builder-simplified.tsx" "Simplified builder (deprecated, for reference)"

# ============================================================================
# SECTION 3: LANDING SECTION COMPONENTS
# ============================================================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}🎨 3. LANDING SECTION COMPONENTS${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
🎨 SECTION 3: LANDING SECTION COMPONENTS
================================================================================
Components that render each section of the landing page.

EOF

collect_file "src/components/landing/index.ts" "Landing components export barrel"
collect_file "src/components/landing/tenant-hero.tsx" "Hero section renderer"
collect_file "src/components/landing/tenant-about.tsx" "About section renderer"
collect_file "src/components/landing/tenant-products.tsx" "Products section renderer"
collect_file "src/components/landing/tenant-testimonials.tsx" "Testimonials section renderer"
collect_file "src/components/landing/tenant-cta.tsx" "CTA section renderer"
collect_file "src/components/landing/tenant-contact.tsx" "Contact section renderer"

# ============================================================================
# SECTION 4: HOOKS
# ============================================================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}🪝 4. HOOKS${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
🪝 SECTION 4: HOOKS
================================================================================
Custom React hooks for state management.

EOF

collect_file "src/hooks/index.ts" "Hooks export barrel"
collect_file "src/hooks/use-landing-config.ts" "Landing configuration hook - manages config state, save, publish"
collect_file "src/hooks/use-tenant.ts" "Tenant data hook"

# ============================================================================
# SECTION 5: TYPES
# ============================================================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}📝 5. TYPES${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
📝 SECTION 5: TYPES
================================================================================
TypeScript type definitions.

EOF

collect_file "src/types/index.ts" "Types export barrel"
collect_file "src/types/landing.ts" "Landing page types - TenantLandingConfig, SectionType, etc."
collect_file "src/types/tenant.ts" "Tenant types"
collect_file "src/types/product.ts" "Product types"

# ============================================================================
# SECTION 6: LIB/LANDING
# ============================================================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}📚 6. LIB/LANDING (UTILITIES & TEMPLATES)${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
📚 SECTION 6: LIB/LANDING (UTILITIES & TEMPLATES)
================================================================================
Landing page utilities, templates, and context.

EOF

collect_file "src/lib/landing/index.ts" "Landing lib export barrel"
collect_file "src/lib/landing/constants.ts" "Landing constants"
collect_file "src/lib/landing/defaults.ts" "Default configurations"
collect_file "src/lib/landing/helpers.ts" "Helper functions"
collect_file "src/lib/landing/utils.ts" "Utility functions"

# Templates
echo ""
echo -e "${YELLOW}  📁 Templates${NC}"
collect_file "src/lib/landing/templates/index.ts" "Templates export barrel"
collect_file "src/lib/landing/templates/template-defaults.ts" "Template default configurations"
collect_file "src/lib/landing/templates/template-metadata.ts" "Template metadata"
collect_file "src/lib/landing/templates/template-types.ts" "Template type definitions"

# Context
echo ""
echo -e "${YELLOW}  📁 Context${NC}"
collect_file "src/lib/landing/context/index.ts" "Context export barrel"
collect_file "src/lib/landing/context/template-context.tsx" "Template provider context"

# ============================================================================
# SECTION 7: UI COMPONENTS
# ============================================================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}🎨 7. UI COMPONENTS${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
🎨 SECTION 7: UI COMPONENTS
================================================================================
UI primitives used in landing builder.

EOF

collect_file "src/components/ui/dialog.tsx" "Dialog/Modal component - needed for FullPreviewModal"
collect_file "src/components/ui/button.tsx" "Button component"
collect_file "src/components/ui/badge.tsx" "Badge component"
collect_file "src/components/ui/menubar.tsx" "Menubar component"
collect_file "src/components/ui/sheet.tsx" "Sheet component (drawer variant)"

# ============================================================================
# SECTION 8: RELATED FILES
# ============================================================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}🔗 8. RELATED FILES${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
🔗 SECTION 8: RELATED FILES
================================================================================
Navigation, settings, and other related files.

EOF

collect_file "src/components/dashboard/dashboard-nav.tsx" "Dashboard navigation - has link to landing-builder"
collect_file "src/components/settings/landing-content-settings.tsx" "Landing content settings (if exists)"

# ============================================================================
# SUMMARY
# ============================================================================

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo -e "${PURPLE}📊 COLLECTION SUMMARY${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════${NC}"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================================
📊 COLLECTION SUMMARY
================================================================================

Files Collected for Landing Builder Analysis:

┌─────────────────────────────────┬─────────────┐
│ Section                         │ Files       │
├─────────────────────────────────┼─────────────┤
│ 📱 App/Landing-Builder          │ 2           │
│ 🧩 Landing-Builder Components   │ ~14         │
│ 🎨 Landing Section Components   │ 7           │
│ 🪝 Hooks                        │ 3           │
│ 📝 Types                        │ 4           │
│ 📚 Lib/Landing                  │ ~11         │
│ 🎨 UI Components                │ 5           │
│ 🔗 Related Files                │ ~2          │
└─────────────────────────────────┴─────────────┘

Statistics:
- ✅ Found: $FOUND_COUNT files
- ❌ Missing: $NOT_FOUND_COUNT files
- 📝 Total lines: $TOTAL_LINES

Output:
$(pwd)/$OUTPUT_FILE

KEY FILES FOR IMPLEMENTATION:
1. ⭐ src/components/landing-builder/live-preview.tsx (MODIFY)
2. ⭐ src/app/landing-builder/page.tsx (MODIFY)
3. ⭐ src/components/landing-builder/index.ts (MODIFY)
4. 🆕 src/components/landing-builder/full-preview-modal.tsx (CREATE NEW)

IMPLEMENTATION COMPLEXITY:
- Code Changes:     🟢 LOW
- Logic Changes:    🟢 LOW
- State Management: 🟢 LOW
- Drag & Drop:      🟢 NO IMPACT
- Breaking Changes: 🟢 NONE

RECOMMENDATION: ✅ GO FOR IT!

================================================================================
END OF COLLECTION
================================================================================

Next Steps:
1. Review collected files in: $OUTPUT_FILE
2. Read IMPLEMENTATION_DOCS.md for detailed implementation plan
3. Run tests before implementing changes
4. Implement changes following the documentation
5. Test thoroughly (unit tests + manual tests)

Questions? Check the implementation docs or edge cases section.

================================================================================
EOF

echo ""
echo -e "${GREEN}✅ Collection complete!${NC}"
echo -e "${BLUE}📄 Output: $OUTPUT_FILE${NC}"
echo ""
echo -e "${CYAN}📊 Statistics:${NC}"
echo -e "   ✅ Found: ${GREEN}$FOUND_COUNT${NC} files"
echo -e "   ❌ Missing: ${RED}$NOT_FOUND_COUNT${NC} files"
echo -e "   📝 Total lines: ${YELLOW}$TOTAL_LINES${NC}"
echo ""
echo -e "${YELLOW}📖 Next steps:${NC}"
echo -e "   1. Review: ${BLUE}cat $OUTPUT_FILE | less${NC}"
echo -e "   2. Search: ${BLUE}grep 'LivePreview' $OUTPUT_FILE${NC}"
echo -e "   3. Implement: Follow IMPLEMENTATION_DOCS.md"
echo ""
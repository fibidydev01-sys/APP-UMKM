#!/bin/bash

# ============================================================================
# LANDING BUILDER COMPREHENSIVE DEPENDENCY ANALYZER
# Track ALL files related to landing-builder including dependency chains
# ============================================================================

OUTPUT_FILE="landing-builder-full-analysis.txt"
SEARCH_DIR="."

echo "🔍 Running comprehensive landing-builder analysis..."
echo "Output: $OUTPUT_FILE"
echo ""

# Clear output
echo "" > "$OUTPUT_FILE"

# Function to write section
write_section() {
    echo "" >> "$OUTPUT_FILE"
    echo "============================================================================" >> "$OUTPUT_FILE"
    echo "$1" >> "$OUTPUT_FILE"
    echo "============================================================================" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
}

# Header
cat > "$OUTPUT_FILE" << 'EOF'
============================================================================
LANDING BUILDER COMPREHENSIVE DEPENDENCY ANALYSIS
============================================================================
Generated: $(date)

This report tracks ALL files related to landing-builder including:
- Direct references to /landing-builder route
- Component imports from landing-builder folder
- Files that use landing-builder components
- Dependency chains (files that import files that import landing-builder)

EOF

# ============================================================================
# SECTION 1: Landing Builder Page Files
# ============================================================================
write_section "1. LANDING BUILDER PAGE FILES (app/landing-builder/*)"
echo "📂 Finding landing-builder page files..."

find ./src/app/landing-builder -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) 2>/dev/null >> "$OUTPUT_FILE"

# ============================================================================
# SECTION 2: Landing Builder Component Files
# ============================================================================
write_section "2. LANDING BUILDER COMPONENT FILES (components/landing-builder/*)"
echo "📂 Finding landing-builder component files..."

find ./src/components/landing-builder -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) 2>/dev/null >> "$OUTPUT_FILE"

# ============================================================================
# SECTION 3: Files with Route References
# ============================================================================
write_section "3. FILES WITH ROUTE REFERENCES TO /landing-builder"
echo "🔗 Searching route references..."

grep -rn '"/landing-builder"\|'"'"'/landing-builder'"'"'\|`/landing-builder`' ./src \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir="node_modules" \
  --exclude-dir=".next" \
  2>/dev/null >> "$OUTPUT_FILE"

# ============================================================================
# SECTION 4: Files Importing from @/components/landing-builder
# ============================================================================
write_section "4. FILES IMPORTING FROM @/components/landing-builder"
echo "📦 Finding component imports..."

grep -rn "from.*@/components/landing-builder\|import.*@/components/landing-builder" ./src \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir="node_modules" \
  --exclude-dir=".next" \
  2>/dev/null >> "$OUTPUT_FILE"

# ============================================================================
# SECTION 5: Files Importing from @/app/landing-builder
# ============================================================================
write_section "5. FILES IMPORTING FROM @/app/landing-builder"
echo "📦 Finding page imports..."

grep -rn "from.*@/app/landing-builder\|import.*@/app/landing-builder" ./src \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir="node_modules" \
  --exclude-dir=".next" \
  2>/dev/null >> "$OUTPUT_FILE"

# ============================================================================
# SECTION 6: Files Using Landing Builder Components (by component name)
# ============================================================================
write_section "6. FILES USING LANDING BUILDER COMPONENTS"
echo "🎨 Finding component usage..."

echo "=== LivePreview Usage ===" >> "$OUTPUT_FILE"
grep -rn "<LivePreview\|LivePreview" ./src \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir="node_modules" \
  --exclude-dir=".next" \
  2>/dev/null >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "=== BuilderSidebar Usage ===" >> "$OUTPUT_FILE"
grep -rn "<BuilderSidebar\|BuilderSidebar" ./src \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir="node_modules" \
  --exclude-dir=".next" \
  2>/dev/null >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "=== BlockDrawer Usage ===" >> "$OUTPUT_FILE"
grep -rn "<BlockDrawer\|BlockDrawer" ./src \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir="node_modules" \
  --exclude-dir=".next" \
  2>/dev/null >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "=== LandingBuilder Usage ===" >> "$OUTPUT_FILE"
grep -rn "<LandingBuilder\|LandingBuilder" ./src \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir="node_modules" \
  --exclude-dir=".next" \
  2>/dev/null >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "=== TemplateSelector Usage ===" >> "$OUTPUT_FILE"
grep -rn "<TemplateSelector\|TemplateSelector" ./src \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir="node_modules" \
  --exclude-dir=".next" \
  2>/dev/null >> "$OUTPUT_FILE"

# ============================================================================
# SECTION 7: Type Imports
# ============================================================================
write_section "7. TYPE IMPORTS FROM LANDING BUILDER"
echo "📝 Finding type imports..."

grep -rn "import type.*landing-builder" ./src \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir="node_modules" \
  --exclude-dir=".next" \
  2>/dev/null >> "$OUTPUT_FILE"

# ============================================================================
# SECTION 8: Navigation/Link Usage
# ============================================================================
write_section "8. NAVIGATION AND LINK USAGE"
echo "🧭 Finding navigation usage..."

echo "=== href usage ===" >> "$OUTPUT_FILE"
grep -rn 'href.*landing-builder' ./src \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir="node_modules" \
  --exclude-dir=".next" \
  2>/dev/null >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "=== router.push usage ===" >> "$OUTPUT_FILE"
grep -rn "push.*landing-builder\|navigate.*landing-builder" ./src \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir="node_modules" \
  --exclude-dir=".next" \
  2>/dev/null >> "$OUTPUT_FILE"

# ============================================================================
# SECTION 9: Hooks and API Calls
# ============================================================================
write_section "9. HOOKS AND API RELATED TO LANDING BUILDER"
echo "🪝 Finding hooks usage..."

grep -rn "useLandingConfig\|use-landing-config" ./src \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir="node_modules" \
  --exclude-dir=".next" \
  2>/dev/null >> "$OUTPUT_FILE"

# ============================================================================
# SECTION 10: Files in Settings that Might Reference Landing
# ============================================================================
write_section "10. SETTINGS FILES (Potential Landing Config)"
echo "⚙️ Finding settings files..."

grep -rn "landing\|Landing" ./src/app/settings ./src/components/settings 2>/dev/null \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  -l >> "$OUTPUT_FILE"

# ============================================================================
# SECTION 11: UNIQUE FILES SUMMARY
# ============================================================================
write_section "11. UNIQUE FILES SUMMARY (ALL FILES THAT TOUCH LANDING BUILDER)"
echo "📊 Generating comprehensive summary..."

{
  # Page files
  find ./src/app/landing-builder -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null
  
  # Component files
  find ./src/components/landing-builder -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null
  
  # Files with references
  grep -rl "landing-builder\|LivePreview\|BuilderSidebar\|BlockDrawer\|LandingBuilder\|TemplateSelector\|useLandingConfig" ./src \
    --include="*.ts" \
    --include="*.tsx" \
    --include="*.js" \
    --include="*.jsx" \
    --exclude-dir="node_modules" \
    --exclude-dir=".next" \
    2>/dev/null
    
} | sort -u >> "$OUTPUT_FILE"

# ============================================================================
# SECTION 12: DEPENDENCY GRAPH (Which files import which)
# ============================================================================
write_section "12. DEPENDENCY GRAPH"
echo "🕸️ Building dependency graph..."

echo "Files that import landing-builder components and what they import:" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

while IFS= read -r file; do
    if [[ -f "$file" ]]; then
        imports=$(grep "from.*@/components/landing-builder\|from.*@/app/landing-builder" "$file" 2>/dev/null)
        if [[ -n "$imports" ]]; then
            echo "📁 $file" >> "$OUTPUT_FILE"
            echo "$imports" | sed 's/^/    /' >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        fi
    fi
done < <(find ./src -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null)

# ============================================================================
# END
# ============================================================================
write_section "END OF COMPREHENSIVE ANALYSIS"

# Stats
echo "" >> "$OUTPUT_FILE"
echo "STATISTICS:" >> "$OUTPUT_FILE"
echo "-----------------------------------" >> "$OUTPUT_FILE"
TOTAL_FILES=$(grep -rl "landing-builder\|LivePreview\|BuilderSidebar\|BlockDrawer\|LandingBuilder" ./src \
  --include="*.ts" \
  --include="*.tsx" \
  --exclude-dir="node_modules" \
  --exclude-dir=".next" \
  2>/dev/null | wc -l)
echo "Total files involved: $TOTAL_FILES" >> "$OUTPUT_FILE"

COMPONENT_FILES=$(find ./src/components/landing-builder -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null | wc -l)
echo "Landing builder components: $COMPONENT_FILES" >> "$OUTPUT_FILE"

PAGE_FILES=$(find ./src/app/landing-builder -type f \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null | wc -l)
echo "Landing builder pages: $PAGE_FILES" >> "$OUTPUT_FILE"

# Console output
echo ""
echo "✅ Comprehensive analysis complete!"
echo "📄 Full report: $OUTPUT_FILE"
echo ""
echo "📊 Quick Stats:"
echo "-----------------------------------"
echo "Total files involved: $TOTAL_FILES"
echo "Component files: $COMPONENT_FILES"
echo "Page files: $PAGE_FILES"
echo ""
echo "🔍 Key sections in report:"
echo "  1. Landing Builder Page Files"
echo "  2. Landing Builder Component Files"
echo "  3. Route References"
echo "  4. Component Imports"
echo "  5. Type Imports"
echo "  6. Component Usage (LivePreview, BuilderSidebar, etc.)"
echo "  7. Navigation Usage"
echo "  8. Hooks Usage"
echo "  9. Settings Files"
echo " 10. Unique Files Summary"
echo " 11. Dependency Graph"
echo ""
echo "📖 View report:"
echo "   cat $OUTPUT_FILE | less"
echo ""
echo "🔍 Search in report:"
echo "   grep 'LivePreview' $OUTPUT_FILE"
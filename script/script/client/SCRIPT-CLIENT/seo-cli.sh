#!/bin/bash

# ==========================================
# SEO CLI - UMKM Multi-Tenant Platform
# Version: 2.0.0
# Last Updated: 2026-01-14
# ==========================================
# 
# CHANGELOG & DEPRECATION NOTES:
# - Google Sitemap Ping: DEPRECATED (June 2023)
#   Alternatif: Submit via Search Console atau robots.txt
# - Bing Sitemap Ping: DEPRECATED (2022)
#   Alternatif: Gunakan IndexNow
# - Google Indexing API: Hanya untuk JobPosting & BroadcastEvent (Sep 2024)
# - IndexNow: RECOMMENDED untuk real-time indexing (Bing, Yandex, Naver, Seznam)
#
# ==========================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
API_URL="${SEO_API_URL:-https://umkm-server.fibidy.com/api}"
SITE_URL="${SEO_SITE_URL:-https://fibidy.com}"
INDEXNOW_KEY="${INDEXNOW_KEY:-}"  # Set this in environment or .env file
BING_API_KEY="${BING_API_KEY:-}" # From Bing Webmaster Tools

# ==========================================
# UTILITY FUNCTIONS
# ==========================================

print_header() {
    clear
    echo -e "${MAGENTA}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                                                              ║"
    echo "║     ${BOLD}🔍 SEO CLI - UMKM Multi-Tenant Platform${NC}${MAGENTA}                  ║"
    echo "║                                                              ║"
    echo "║     Version: 2.0.0 | Updated: 2026-01-14                    ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_section() {
    echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${BLUE}  $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

press_enter() {
    echo ""
    read -p "Tekan Enter untuk melanjutkan..."
}

# ==========================================
# MENU FUNCTIONS
# ==========================================

show_main_menu() {
    print_header
    echo -e "${BOLD}Pilih kategori:${NC}\n"
    echo -e "  ${GREEN}1)${NC} 📊 Status & Monitoring"
    echo -e "  ${GREEN}2)${NC} 🗺️  Sitemap Management"
    echo -e "  ${GREEN}3)${NC} 📤 URL Submission (IndexNow)"
    echo -e "  ${GREEN}4)${NC} 🔎 Google Indexing"
    echo -e "  ${GREEN}5)${NC} 🅱️  Bing Webmaster"
    echo -e "  ${GREEN}6)${NC} 🔧 Utilities"
    echo -e "  ${GREEN}7)${NC} 📚 Documentation & Help"
    echo ""
    echo -e "  ${RED}0)${NC} Exit"
    echo ""
    read -p "Pilihan [0-7]: " choice
    
    case $choice in
        1) status_menu ;;
        2) sitemap_menu ;;
        3) indexnow_menu ;;
        4) google_menu ;;
        5) bing_menu ;;
        6) utilities_menu ;;
        7) help_menu ;;
        0) 
            echo -e "\n${GREEN}Sampai jumpa! 👋${NC}\n"
            exit 0 
            ;;
        *) 
            print_error "Pilihan tidak valid"
            sleep 1
            show_main_menu 
            ;;
    esac
}

# ==========================================
# 1. STATUS & MONITORING MENU
# ==========================================

status_menu() {
    print_header
    print_section "📊 Status & Monitoring"
    
    echo -e "  ${GREEN}1)${NC} Cek SEO Backend Status"
    echo -e "  ${GREEN}2)${NC} Cek Sitemap Statistics"
    echo -e "  ${GREEN}3)${NC} Cek Google Indexing Quota"
    echo -e "  ${GREEN}4)${NC} Cek IndexNow Status"
    echo -e "  ${GREEN}5)${NC} Full System Health Check"
    echo ""
    echo -e "  ${YELLOW}0)${NC} Kembali ke Menu Utama"
    echo ""
    read -p "Pilihan [0-5]: " choice
    
    case $choice in
        1) cmd_seo_status ;;
        2) cmd_sitemap_stats ;;
        3) cmd_google_quota ;;
        4) cmd_indexnow_status ;;
        5) cmd_health_check ;;
        0) show_main_menu ;;
        *) status_menu ;;
    esac
}

cmd_seo_status() {
    print_section "SEO Backend Status"
    echo -e "${CYAN}Fetching from: $API_URL/seo/status${NC}\n"
    
    response=$(curl -s "$API_URL/seo/status")
    
    if [ -z "$response" ]; then
        print_error "Tidak dapat terhubung ke server"
    else
        # Pretty print with jq if available, otherwise raw
        if command -v jq > /dev/null 2>&1; then
            echo "$response" | jq '.'
        else
            echo "$response"
        fi
        print_success "Status retrieved successfully"
    fi
    
    press_enter
    status_menu
}

cmd_sitemap_stats() {
    print_section "Sitemap Statistics"
    echo -e "${CYAN}Fetching from: $API_URL/sitemap/stats${NC}\n"
    
    response=$(curl -s "$API_URL/sitemap/stats")
    
    if [ -z "$response" ]; then
        print_error "Tidak dapat terhubung ke server"
    else
        if command -v jq > /dev/null 2>&1; then
            echo "$response" | jq '.'
            
            # Extract and display summary
            tenants=$(echo "$response" | jq -r '.stats.tenants // 0')
            products=$(echo "$response" | jq -r '.stats.products // 0')
            estimated=$(echo "$response" | jq -r '.stats.estimatedUrls // 0')
            
            echo ""
            echo -e "${BOLD}Summary:${NC}"
            echo -e "  • Tenants: ${GREEN}$tenants${NC}"
            echo -e "  • Products: ${GREEN}$products${NC}"
            echo -e "  • Estimated URLs: ${GREEN}$estimated${NC}"
        else
            echo "$response"
        fi
    fi
    
    press_enter
    status_menu
}

cmd_google_quota() {
    print_section "Google Indexing API Quota"
    
    response=$(curl -s "$API_URL/seo/status")
    
    if command -v jq > /dev/null 2>&1; then
        enabled=$(echo "$response" | jq -r '.googleIndexing.enabled // false')
        total_keys=$(echo "$response" | jq -r '.googleIndexing.totalKeys // 0')
        total_capacity=$(echo "$response" | jq -r '.googleIndexing.totalCapacity // 0')
        total_used=$(echo "$response" | jq -r '.googleIndexing.totalUsed // 0')
        remaining=$(echo "$response" | jq -r '.googleIndexing.remainingToday // 0')
        
        echo -e "${BOLD}Google Indexing API:${NC}"
        echo -e "  • Enabled: $([ "$enabled" = "true" ] && echo "${GREEN}Yes${NC}" || echo "${RED}No${NC}")"
        echo -e "  • Service Account Keys: ${CYAN}$total_keys${NC}"
        echo -e "  • Total Daily Capacity: ${CYAN}$total_capacity${NC}"
        echo -e "  • Used Today: ${YELLOW}$total_used${NC}"
        echo -e "  • Remaining Today: ${GREEN}$remaining${NC}"
        
        echo ""
        print_warning "CATATAN: Google Indexing API hanya untuk:"
        echo "         - JobPosting schema"
        echo "         - BroadcastEvent dalam VideoObject"
        echo "         (Per September 2024)"
    else
        echo "$response"
    fi
    
    press_enter
    status_menu
}

cmd_indexnow_status() {
    print_section "IndexNow Status"
    
    response=$(curl -s "$API_URL/seo/status")
    
    if command -v jq > /dev/null 2>&1; then
        indexnow_enabled=$(echo "$response" | jq -r '.indexNow.enabled // false')
        
        echo -e "${BOLD}IndexNow Protocol:${NC}"
        echo -e "  • Enabled: $([ "$indexnow_enabled" = "true" ] && echo "${GREEN}Yes${NC}" || echo "${RED}No${NC}")"
        
        echo ""
        echo -e "${BOLD}Supported Search Engines:${NC}"
        echo -e "  • ${CYAN}Bing${NC} (Microsoft)"
        echo -e "  • ${CYAN}Yandex${NC} (Russia)"
        echo -e "  • ${CYAN}Naver${NC} (Korea) - since July 2023"
        echo -e "  • ${CYAN}Seznam.cz${NC} (Czech)"
        echo -e "  • ${CYAN}Yep${NC}"
        
        echo ""
        print_info "IndexNow adalah protokol terbuka untuk instant indexing"
        print_info "Submit sekali, shared ke semua search engine yang berpartisipasi"
    else
        echo "$response"
    fi
    
    press_enter
    status_menu
}

cmd_health_check() {
    print_section "Full System Health Check"
    
    echo -e "${BOLD}Checking all SEO components...${NC}\n"
    
    # 1. Backend API
    echo -n "1. Backend API Connection... "
    if curl -s --max-time 5 "$API_URL/seo/status" > /dev/null 2>&1; then
        print_success "OK"
    else
        print_error "FAILED"
    fi
    
    # 2. Sitemap
    echo -n "2. Sitemap Accessibility... "
    if curl -s --max-time 5 "$SITE_URL/sitemap.xml" | grep -q '<?xml' 2>/dev/null; then
        print_success "OK"
    else
        print_warning "NOT ACCESSIBLE (mungkin belum deploy)"
    fi
    
    # 3. Robots.txt
    echo -n "3. Robots.txt... "
    if curl -s --max-time 5 "$SITE_URL/robots.txt" | grep -qi 'user-agent' 2>/dev/null; then
        print_success "OK"
    else
        print_warning "NOT FOUND"
    fi
    
    # 4. IndexNow Key File (if configured)
    if [ -n "$INDEXNOW_KEY" ]; then
        echo -n "4. IndexNow Key File... "
        if curl -s --max-time 5 "$SITE_URL/$INDEXNOW_KEY.txt" | grep -q "$INDEXNOW_KEY" 2>/dev/null; then
            print_success "OK"
        else
            print_error "NOT FOUND at $SITE_URL/$INDEXNOW_KEY.txt"
        fi
    else
        echo -e "4. IndexNow Key File... ${YELLOW}NOT CONFIGURED${NC}"
    fi
    
    # 5. Dynamic Sitemap
    echo -n "5. Dynamic Sitemap Index... "
    if curl -s --max-time 5 "$SITE_URL/server-sitemap-index.xml" | grep -q '<?xml' 2>/dev/null; then
        print_success "OK"
    else
        print_warning "NOT ACCESSIBLE"
    fi
    
    echo ""
    print_info "Health check complete"
    
    press_enter
    status_menu
}

# ==========================================
# 2. SITEMAP MANAGEMENT MENU
# ==========================================

sitemap_menu() {
    print_header
    print_section "🗺️ Sitemap Management"
    
    echo -e "  ${GREEN}1)${NC} Generate Static Sitemap (next-sitemap)"
    echo -e "  ${GREEN}2)${NC} View Sitemap URLs"
    echo -e "  ${GREEN}3)${NC} Validate Sitemap XML"
    echo -e "  ${GREEN}4)${NC} List All Sitemaps"
    echo -e "  ${GREEN}5)${NC} Count URLs in Sitemap"
    echo ""
    echo -e "  ${YELLOW}0)${NC} Kembali ke Menu Utama"
    echo ""
    read -p "Pilihan [0-5]: " choice
    
    case $choice in
        1) cmd_generate_sitemap ;;
        2) cmd_view_sitemap ;;
        3) cmd_validate_sitemap ;;
        4) cmd_list_sitemaps ;;
        5) cmd_count_urls ;;
        0) show_main_menu ;;
        *) sitemap_menu ;;
    esac
}

cmd_generate_sitemap() {
    print_section "Generate Static Sitemap"
    
    print_info "Running next-sitemap..."
    echo ""
    
    npx next-sitemap
    
    echo ""
    print_success "Sitemap generation complete"
    
    press_enter
    sitemap_menu
}

cmd_view_sitemap() {
    print_section "View Sitemap URLs"
    
    read -p "Masukkan URL sitemap (default: $SITE_URL/sitemap.xml): " sitemap_url
    sitemap_url=${sitemap_url:-$SITE_URL/sitemap.xml}
    
    echo ""
    echo -e "${CYAN}Fetching: $sitemap_url${NC}\n"
    
    content=$(curl -s "$sitemap_url" 2>/dev/null)
    
    if [ -z "$content" ]; then
        print_error "Tidak dapat mengakses sitemap"
    else
        # Extract and display URLs
        echo -e "${BOLD}URLs found:${NC}\n"
        echo "$content" | grep -oP '(?<=<loc>)[^<]+' | head -20
        
        total=$(echo "$content" | grep -c '<loc>')
        echo ""
        echo -e "${CYAN}Showing first 20 of $total URLs${NC}"
    fi
    
    press_enter
    sitemap_menu
}

cmd_validate_sitemap() {
    print_section "Validate Sitemap XML"
    
    read -p "Masukkan URL sitemap (default: $SITE_URL/sitemap.xml): " sitemap_url
    sitemap_url=${sitemap_url:-$SITE_URL/sitemap.xml}
    
    echo ""
    echo -e "${CYAN}Validating: $sitemap_url${NC}\n"
    
    content=$(curl -s "$sitemap_url" 2>/dev/null)
    
    if [ -z "$content" ]; then
        print_error "Tidak dapat mengakses sitemap"
    elif echo "$content" | grep -q '<?xml'; then
        print_success "Valid XML format"
        
        # Check for required elements
        echo ""
        echo -e "${BOLD}Validation Results:${NC}"
        
        if echo "$content" | grep -q '<urlset'; then
            print_success "Contains <urlset> element"
        elif echo "$content" | grep -q '<sitemapindex'; then
            print_success "Contains <sitemapindex> element (sitemap index)"
        else
            print_warning "Missing urlset or sitemapindex"
        fi
        
        if echo "$content" | grep -q '<loc>'; then
            print_success "Contains <loc> elements"
        else
            print_warning "No <loc> elements found"
        fi
        
        if echo "$content" | grep -q '<lastmod>'; then
            print_success "Contains <lastmod> elements"
        else
            print_info "No <lastmod> elements (optional but recommended)"
        fi
        
    else
        print_error "Invalid XML format"
    fi
    
    press_enter
    sitemap_menu
}

cmd_list_sitemaps() {
    print_section "List All Sitemaps"
    
    echo -e "${BOLD}Available Sitemaps:${NC}\n"
    
    echo -e "1. ${CYAN}Static Sitemap${NC}"
    echo "   $SITE_URL/sitemap.xml"
    echo ""
    
    echo -e "2. ${CYAN}Dynamic Sitemap Index${NC}"
    echo "   $SITE_URL/server-sitemap-index.xml"
    echo ""
    
    echo -e "3. ${CYAN}Robots.txt Sitemap Reference${NC}"
    echo "   $SITE_URL/robots.txt"
    
    echo ""
    echo -e "${BOLD}Fetching dynamic sitemap count...${NC}"
    
    index_content=$(curl -s "$SITE_URL/server-sitemap-index.xml" 2>/dev/null)
    if [ -n "$index_content" ]; then
        sitemap_count=$(echo "$index_content" | grep -c '<loc>')
        echo -e "Dynamic sitemaps found: ${GREEN}$sitemap_count${NC}"
    else
        echo -e "Dynamic sitemaps: ${YELLOW}Not accessible${NC}"
    fi
    
    press_enter
    sitemap_menu
}

cmd_count_urls() {
    print_section "Count URLs in Sitemap"
    
    read -p "Masukkan URL sitemap (default: $SITE_URL/sitemap.xml): " sitemap_url
    sitemap_url=${sitemap_url:-$SITE_URL/sitemap.xml}
    
    echo ""
    echo -e "${CYAN}Counting URLs in: $sitemap_url${NC}\n"
    
    content=$(curl -s "$sitemap_url" 2>/dev/null)
    
    if [ -z "$content" ]; then
        print_error "Tidak dapat mengakses sitemap"
    else
        url_count=$(echo "$content" | grep -c '<loc>')
        echo -e "Total URLs: ${GREEN}${BOLD}$url_count${NC}"
        
        # If it's a sitemap index, count child sitemaps too
        if echo "$content" | grep -q '<sitemapindex'; then
            echo ""
            echo -e "${BOLD}This is a sitemap index. Child sitemaps:${NC}"
            echo "$content" | grep -oP '(?<=<loc>)[^<]+' | while read -r child_url; do
                child_count=$(curl -s "$child_url" 2>/dev/null | grep -c '<loc>')
                echo "  • $child_url: $child_count URLs"
            done
        fi
    fi
    
    press_enter
    sitemap_menu
}

# ==========================================
# 3. INDEXNOW MENU
# ==========================================

indexnow_menu() {
    print_header
    print_section "📤 IndexNow URL Submission"
    
    echo -e "${YELLOW}IndexNow adalah protokol untuk instant indexing ke:${NC}"
    echo -e "Bing, Yandex, Naver, Seznam.cz, Yep\n"
    
    echo -e "  ${GREEN}1)${NC} Submit Single URL"
    echo -e "  ${GREEN}2)${NC} Submit Multiple URLs (Batch)"
    echo -e "  ${GREEN}3)${NC} Submit via Backend API"
    echo -e "  ${GREEN}4)${NC} Check IndexNow Key Setup"
    echo -e "  ${GREEN}5)${NC} Generate IndexNow Key"
    echo ""
    echo -e "  ${YELLOW}0)${NC} Kembali ke Menu Utama"
    echo ""
    read -p "Pilihan [0-5]: " choice
    
    case $choice in
        1) cmd_indexnow_single ;;
        2) cmd_indexnow_batch ;;
        3) cmd_indexnow_backend ;;
        4) cmd_indexnow_check_key ;;
        5) cmd_indexnow_generate_key ;;
        0) show_main_menu ;;
        *) indexnow_menu ;;
    esac
}

cmd_indexnow_single() {
    print_section "Submit Single URL to IndexNow"
    
    if [ -z "$INDEXNOW_KEY" ]; then
        print_error "INDEXNOW_KEY tidak dikonfigurasi"
        print_info "Set environment variable: export INDEXNOW_KEY=your-key"
        print_info "Atau generate key baru di menu option 5"
        press_enter
        indexnow_menu
        return
    fi
    
    read -p "Masukkan URL yang akan di-submit: " url
    
    if [ -z "$url" ]; then
        print_error "URL tidak boleh kosong"
        press_enter
        indexnow_menu
        return
    fi
    
    # Extract host from SITE_URL
    host=$(echo "$SITE_URL" | sed 's|https\?://||' | sed 's|/.*||')
    
    echo ""
    echo -e "${CYAN}Submitting to IndexNow...${NC}"
    echo -e "Host: $host"
    echo -e "Key: $INDEXNOW_KEY"
    echo -e "URL: $url"
    echo ""
    
    response=$(curl -s -w "\n%{http_code}" -X POST "https://api.indexnow.org/indexnow" \
        -H "Content-Type: application/json" \
        -d "{
            \"host\": \"$host\",
            \"key\": \"$INDEXNOW_KEY\",
            \"keyLocation\": \"https://$host/$INDEXNOW_KEY.txt\",
            \"urlList\": [\"$url\"]
        }")
    
    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | sed '$d')
    
    echo ""
    case $http_code in
        200) print_success "URL submitted successfully (200 OK)" ;;
        202) print_success "URL accepted, key validation pending (202 Accepted)" ;;
        400) print_error "Bad request - Invalid format (400)" ;;
        403) print_error "Key not valid (403 Forbidden)" ;;
        422) print_error "Invalid URL (422)" ;;
        429) print_error "Too many requests (429)" ;;
        *) print_warning "Response code: $http_code" ;;
    esac
    
    if [ -n "$body" ]; then
        echo -e "\nResponse: $body"
    fi
    
    press_enter
    indexnow_menu
}

cmd_indexnow_batch() {
    print_section "Submit Multiple URLs to IndexNow"
    
    if [ -z "$INDEXNOW_KEY" ]; then
        print_error "INDEXNOW_KEY tidak dikonfigurasi"
        press_enter
        indexnow_menu
        return
    fi
    
    echo "Masukkan URLs (satu per baris, ketik 'done' untuk selesai):"
    echo ""
    
    urls=()
    while true; do
        read -p "> " url
        if [ "$url" = "done" ] || [ -z "$url" ]; then
            break
        fi
        urls+=("\"$url\"")
    done
    
    if [ ${#urls[@]} -eq 0 ]; then
        print_error "Tidak ada URL yang dimasukkan"
        press_enter
        indexnow_menu
        return
    fi
    
    # Join URLs with commas
    url_list=$(IFS=,; echo "${urls[*]}")
    host=$(echo "$SITE_URL" | sed 's|https\?://||' | sed 's|/.*||')
    
    echo ""
    echo -e "${CYAN}Submitting ${#urls[@]} URLs to IndexNow...${NC}"
    
    response=$(curl -s -w "\n%{http_code}" -X POST "https://api.indexnow.org/indexnow" \
        -H "Content-Type: application/json" \
        -d "{
            \"host\": \"$host\",
            \"key\": \"$INDEXNOW_KEY\",
            \"keyLocation\": \"https://$host/$INDEXNOW_KEY.txt\",
            \"urlList\": [$url_list]
        }")
    
    http_code=$(echo "$response" | tail -1)
    
    echo ""
    case $http_code in
        200) print_success "${#urls[@]} URLs submitted successfully" ;;
        202) print_success "${#urls[@]} URLs accepted, validation pending" ;;
        *) print_warning "Response code: $http_code" ;;
    esac
    
    print_info "Limit: 10,000 URLs per submission"
    
    press_enter
    indexnow_menu
}

cmd_indexnow_backend() {
    print_section "Submit via Backend API"
    
    read -p "Masukkan URL yang akan di-submit: " url
    
    if [ -z "$url" ]; then
        print_error "URL tidak boleh kosong"
        press_enter
        indexnow_menu
        return
    fi
    
    echo ""
    echo -e "${CYAN}Submitting via backend: $API_URL/seo/indexnow${NC}"
    
    # Try different endpoint variations
    response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/seo/indexnow/submit" \
        -H "Content-Type: application/json" \
        -d "{\"urls\": [\"$url\"]}" 2>/dev/null)
    
    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "404" ]; then
        print_warning "Endpoint tidak ditemukan. Mencoba endpoint alternatif..."
        
        # Try alternative endpoint
        response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/indexnow/submit" \
            -H "Content-Type: application/json" \
            -d "{\"url\": \"$url\"}" 2>/dev/null)
        
        http_code=$(echo "$response" | tail -1)
        body=$(echo "$response" | sed '$d')
    fi
    
    echo ""
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        print_success "Submitted successfully"
    else
        print_warning "Response: $http_code"
        print_info "Backend endpoint mungkin berbeda. Cek dokumentasi API."
    fi
    
    if [ -n "$body" ]; then
        echo -e "\nResponse: $body"
    fi
    
    press_enter
    indexnow_menu
}

cmd_indexnow_check_key() {
    print_section "Check IndexNow Key Setup"
    
    if [ -z "$INDEXNOW_KEY" ]; then
        print_warning "INDEXNOW_KEY environment variable tidak di-set"
        echo ""
        read -p "Masukkan IndexNow key untuk cek: " key
        if [ -z "$key" ]; then
            press_enter
            indexnow_menu
            return
        fi
        INDEXNOW_KEY=$key
    fi
    
    key_url="$SITE_URL/$INDEXNOW_KEY.txt"
    
    echo -e "${CYAN}Checking key file at: $key_url${NC}\n"
    
    content=$(curl -s "$key_url" 2>/dev/null)
    
    if [ -z "$content" ]; then
        print_error "Key file tidak dapat diakses"
        print_info "Pastikan file $INDEXNOW_KEY.txt ada di root website"
    elif echo "$content" | grep -q "$INDEXNOW_KEY"; then
        print_success "Key file valid!"
        echo ""
        echo -e "Content: ${GREEN}$content${NC}"
    else
        print_error "Key file ditemukan tapi content tidak sesuai"
        echo "Expected: $INDEXNOW_KEY"
        echo "Found: $content"
    fi
    
    press_enter
    indexnow_menu
}

cmd_indexnow_generate_key() {
    print_section "Generate IndexNow Key"
    
    # Generate random hexadecimal key (32 characters)
    new_key=$(cat /dev/urandom | tr -dc 'a-f0-9' | head -c 32)
    
    echo -e "${BOLD}Generated IndexNow Key:${NC}"
    echo ""
    echo -e "  ${GREEN}$new_key${NC}"
    echo ""
    echo -e "${BOLD}Setup Instructions:${NC}"
    echo ""
    echo "1. Create file: public/$new_key.txt"
    echo "   Content: $new_key"
    echo ""
    echo "2. Set environment variable:"
    echo "   export INDEXNOW_KEY=$new_key"
    echo ""
    echo "3. Add to .env file:"
    echo "   INDEXNOW_KEY=$new_key"
    echo ""
    echo "4. Deploy dan verify di: $SITE_URL/$new_key.txt"
    
    echo ""
    read -p "Create key file sekarang di ./public/? (y/n): " create_file
    
    if [ "$create_file" = "y" ] || [ "$create_file" = "Y" ]; then
        if [ -d "./public" ]; then
            echo "$new_key" > "./public/$new_key.txt"
            print_success "File created: ./public/$new_key.txt"
        else
            print_warning "Directory ./public tidak ditemukan"
            print_info "Buat file secara manual"
        fi
    fi
    
    press_enter
    indexnow_menu
}

# ==========================================
# 4. GOOGLE INDEXING MENU
# ==========================================

google_menu() {
    print_header
    print_section "🔎 Google Indexing"
    
    echo -e "${YELLOW}⚠️  PENTING: Google Indexing API Update (Sep 2024)${NC}"
    echo -e "${YELLOW}   Hanya untuk JobPosting & BroadcastEvent schema!${NC}\n"
    
    echo -e "  ${GREEN}1)${NC} Submit URL ke Google Indexing API"
    echo -e "  ${GREEN}2)${NC} Check URL Status (via backend)"
    echo -e "  ${GREEN}3)${NC} View Google Quota"
    echo -e "  ${GREEN}4)${NC} Submit Sitemap ke Search Console (Info)"
    echo ""
    echo -e "  ${RED}✗${NC}  Google Ping - ${RED}DEPRECATED (June 2023)${NC}"
    echo ""
    echo -e "  ${YELLOW}0)${NC} Kembali ke Menu Utama"
    echo ""
    read -p "Pilihan [0-4]: " choice
    
    case $choice in
        1) cmd_google_submit ;;
        2) cmd_google_check ;;
        3) cmd_google_quota ;;
        4) cmd_google_sitemap_info ;;
        0) show_main_menu ;;
        *) google_menu ;;
    esac
}

cmd_google_submit() {
    print_section "Submit URL ke Google Indexing API"
    
    print_warning "Google Indexing API HANYA untuk:"
    echo "  • Pages dengan JobPosting schema"
    echo "  • Pages dengan BroadcastEvent dalam VideoObject"
    echo ""
    
    read -p "URL yang akan di-submit: " url
    read -p "Type (URL_UPDATED/URL_DELETED) [URL_UPDATED]: " type
    type=${type:-URL_UPDATED}
    
    if [ -z "$url" ]; then
        print_error "URL tidak boleh kosong"
        press_enter
        google_menu
        return
    fi
    
    echo ""
    echo -e "${CYAN}Submitting via backend...${NC}"
    
    response=$(curl -s -X POST "$API_URL/seo/google-indexing/submit" \
        -H "Content-Type: application/json" \
        -d "{\"url\": \"$url\", \"type\": \"$type\"}" 2>/dev/null)
    
    if [ -z "$response" ]; then
        print_error "Tidak dapat terhubung ke backend"
    else
        if command -v jq > /dev/null 2>&1; then
            echo "$response" | jq '.'
        else
            echo "$response"
        fi
    fi
    
    press_enter
    google_menu
}

cmd_google_check() {
    print_section "Check URL Status"
    
    read -p "URL yang akan dicek: " url
    
    if [ -z "$url" ]; then
        print_error "URL tidak boleh kosong"
        press_enter
        google_menu
        return
    fi
    
    echo ""
    echo -e "${CYAN}Checking status via backend...${NC}"
    
    response=$(curl -s "$API_URL/seo/google-indexing/status?url=$(echo $url | sed 's|:|%3A|g' | sed 's|/|%2F|g')" 2>/dev/null)
    
    if [ -z "$response" ]; then
        print_error "Tidak dapat terhubung ke backend"
    else
        if command -v jq > /dev/null 2>&1; then
            echo "$response" | jq '.'
        else
            echo "$response"
        fi
    fi
    
    press_enter
    google_menu
}

cmd_google_sitemap_info() {
    print_section "Submit Sitemap ke Google Search Console"
    
    echo -e "${BOLD}Cara Submit Sitemap ke Google:${NC}"
    echo ""
    echo "1. ${CYAN}Via Google Search Console (Recommended)${NC}"
    echo "   - Buka https://search.google.com/search-console"
    echo "   - Pilih property website"
    echo "   - Klik Sitemaps di sidebar"
    echo "   - Masukkan URL sitemap: /sitemap.xml"
    echo "   - Klik Submit"
    echo ""
    echo "2. ${CYAN}Via robots.txt${NC}"
    echo "   Tambahkan di robots.txt:"
    echo "   Sitemap: $SITE_URL/sitemap.xml"
    echo "   Sitemap: $SITE_URL/server-sitemap-index.xml"
    echo ""
    echo -e "${RED}❌ DEPRECATED:${NC}"
    echo "   Google Ping endpoint (June 2023)"
    echo "   URL: google.com/ping?sitemap=... → Returns 404"
    echo ""
    print_info "Google sekarang mengandalkan lastmod di sitemap"
    print_info "Update lastmod hanya untuk perubahan signifikan"
    
    press_enter
    google_menu
}

# ==========================================
# 5. BING WEBMASTER MENU
# ==========================================

bing_menu() {
    print_header
    print_section "🅱️ Bing Webmaster Tools"
    
    echo -e "  ${GREEN}1)${NC} Submit URL via Bing API"
    echo -e "  ${GREEN}2)${NC} Submit Batch URLs via Bing API"
    echo -e "  ${GREEN}3)${NC} Check Bing Submission Quota"
    echo -e "  ${GREEN}4)${NC} Submit via IndexNow (Recommended)"
    echo ""
    echo -e "  ${RED}✗${NC}  Bing Sitemap Ping - ${RED}DEPRECATED (2022)${NC}"
    echo ""
    echo -e "  ${YELLOW}0)${NC} Kembali ke Menu Utama"
    echo ""
    read -p "Pilihan [0-4]: " choice
    
    case $choice in
        1) cmd_bing_submit ;;
        2) cmd_bing_batch ;;
        3) cmd_bing_quota ;;
        4) indexnow_menu ;;
        0) show_main_menu ;;
        *) bing_menu ;;
    esac
}

cmd_bing_submit() {
    print_section "Submit URL via Bing API"
    
    if [ -z "$BING_API_KEY" ]; then
        print_warning "BING_API_KEY tidak dikonfigurasi"
        echo ""
        echo "Cara mendapatkan API Key:"
        echo "1. Login ke https://www.bing.com/webmasters"
        echo "2. Klik Settings (gear icon)"
        echo "3. Klik API Access"
        echo "4. Generate API Key"
        echo ""
        read -p "Masukkan Bing API Key: " api_key
        if [ -z "$api_key" ]; then
            press_enter
            bing_menu
            return
        fi
        BING_API_KEY=$api_key
    fi
    
    read -p "Site URL (e.g., https://fibidy.com): " site_url
    site_url=${site_url:-$SITE_URL}
    read -p "URL yang akan di-submit: " url
    
    if [ -z "$url" ]; then
        print_error "URL tidak boleh kosong"
        press_enter
        bing_menu
        return
    fi
    
    echo ""
    echo -e "${CYAN}Submitting to Bing...${NC}"
    
    response=$(curl -s -X POST "https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl?apikey=$BING_API_KEY" \
        -H "Content-Type: application/json" \
        -H "charset: utf-8" \
        -d "{\"siteUrl\":\"$site_url\", \"url\": \"$url\"}")
    
    echo ""
    if echo "$response" | grep -q '"d":null'; then
        print_success "URL submitted successfully"
    else
        print_warning "Response: $response"
    fi
    
    print_info "Bing dapat submit hingga 10,000 URLs/hari"
    
    press_enter
    bing_menu
}

cmd_bing_batch() {
    print_section "Submit Batch URLs via Bing API"
    
    if [ -z "$BING_API_KEY" ]; then
        print_error "BING_API_KEY tidak dikonfigurasi"
        press_enter
        bing_menu
        return
    fi
    
    read -p "Site URL: " site_url
    site_url=${site_url:-$SITE_URL}
    
    echo "Masukkan URLs (satu per baris, ketik 'done' untuk selesai):"
    
    urls=()
    while true; do
        read -p "> " url
        if [ "$url" = "done" ] || [ -z "$url" ]; then
            break
        fi
        urls+=("\"$url\"")
    done
    
    if [ ${#urls[@]} -eq 0 ]; then
        print_error "Tidak ada URL yang dimasukkan"
        press_enter
        bing_menu
        return
    fi
    
    url_list=$(IFS=,; echo "${urls[*]}")
    
    echo ""
    echo -e "${CYAN}Submitting ${#urls[@]} URLs to Bing...${NC}"
    
    response=$(curl -s -X POST "https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey=$BING_API_KEY" \
        -H "Content-Type: application/json" \
        -H "charset: utf-8" \
        -d "{\"siteUrl\":\"$site_url\", \"urlList\":[$url_list]}")
    
    echo ""
    if echo "$response" | grep -q '"d":null'; then
        print_success "${#urls[@]} URLs submitted successfully"
    else
        print_warning "Response: $response"
    fi
    
    press_enter
    bing_menu
}

cmd_bing_quota() {
    print_section "Check Bing Submission Quota"
    
    if [ -z "$BING_API_KEY" ]; then
        print_error "BING_API_KEY tidak dikonfigurasi"
        press_enter
        bing_menu
        return
    fi
    
    read -p "Site URL: " site_url
    site_url=${site_url:-$SITE_URL}
    
    # URL encode the site URL
    encoded_site=$(echo "$site_url" | sed 's|:|%3A|g' | sed 's|/|%2F|g')
    
    echo ""
    echo -e "${CYAN}Checking quota...${NC}"
    
    response=$(curl -s "https://ssl.bing.com/webmaster/api.svc/json/GetUrlSubmissionQuota?siteUrl=$encoded_site&apikey=$BING_API_KEY")
    
    echo ""
    if command -v jq > /dev/null 2>&1; then
        daily=$(echo "$response" | jq -r '.d.DailyQuota // "N/A"')
        monthly=$(echo "$response" | jq -r '.d.MonthlyQuota // "N/A"')
        
        echo -e "${BOLD}Bing URL Submission Quota:${NC}"
        echo -e "  • Daily Remaining: ${GREEN}$daily${NC}"
        echo -e "  • Monthly Remaining: ${GREEN}$monthly${NC}"
    else
        echo "$response"
    fi
    
    press_enter
    bing_menu
}

# ==========================================
# 6. UTILITIES MENU
# ==========================================

utilities_menu() {
    print_header
    print_section "🔧 Utilities"
    
    echo -e "  ${GREEN}1)${NC} Test URL Accessibility"
    echo -e "  ${GREEN}2)${NC} Check robots.txt"
    echo -e "  ${GREEN}3)${NC} Extract URLs from Sitemap"
    echo -e "  ${GREEN}4)${NC} JSON Formatter (jq check)"
    echo -e "  ${GREEN}5)${NC} Export Configuration"
    echo ""
    echo -e "  ${YELLOW}0)${NC} Kembali ke Menu Utama"
    echo ""
    read -p "Pilihan [0-5]: " choice
    
    case $choice in
        1) cmd_test_url ;;
        2) cmd_check_robots ;;
        3) cmd_extract_urls ;;
        4) cmd_check_jq ;;
        5) cmd_export_config ;;
        0) show_main_menu ;;
        *) utilities_menu ;;
    esac
}

cmd_test_url() {
    print_section "Test URL Accessibility"
    
    read -p "URL to test: " url
    
    if [ -z "$url" ]; then
        print_error "URL tidak boleh kosong"
        press_enter
        utilities_menu
        return
    fi
    
    echo ""
    echo -e "${CYAN}Testing: $url${NC}\n"
    
    response=$(curl -s -o /dev/null -w "%{http_code}|%{time_total}|%{size_download}" "$url" 2>/dev/null)
    
    IFS='|' read -r http_code time_total size <<< "$response"
    
    echo -e "${BOLD}Results:${NC}"
    echo -e "  • HTTP Status: $([ "$http_code" = "200" ] && echo "${GREEN}$http_code${NC}" || echo "${RED}$http_code${NC}")"
    echo -e "  • Response Time: ${CYAN}${time_total}s${NC}"
    echo -e "  • Size: ${CYAN}${size} bytes${NC}"
    
    press_enter
    utilities_menu
}

cmd_check_robots() {
    print_section "Check robots.txt"
    
    read -p "Site URL (default: $SITE_URL): " site
    site=${site:-$SITE_URL}
    
    echo ""
    echo -e "${CYAN}Fetching: $site/robots.txt${NC}\n"
    
    content=$(curl -s "$site/robots.txt" 2>/dev/null)
    
    if [ -z "$content" ]; then
        print_error "robots.txt tidak ditemukan"
    else
        echo "$content"
        echo ""
        
        # Check for sitemap references
        if echo "$content" | grep -qi "sitemap"; then
            print_success "Sitemap reference found"
        else
            print_warning "No sitemap reference in robots.txt"
        fi
    fi
    
    press_enter
    utilities_menu
}

cmd_extract_urls() {
    print_section "Extract URLs from Sitemap"
    
    read -p "Sitemap URL: " sitemap
    read -p "Output file (default: urls.txt): " output
    output=${output:-urls.txt}
    
    echo ""
    echo -e "${CYAN}Extracting URLs...${NC}"
    
    curl -s "$sitemap" 2>/dev/null | grep -oP '(?<=<loc>)[^<]+' > "$output"
    
    count=$(wc -l < "$output")
    
    if [ "$count" -gt 0 ]; then
        print_success "Extracted $count URLs to $output"
    else
        print_error "No URLs extracted"
    fi
    
    press_enter
    utilities_menu
}

cmd_check_jq() {
    print_section "JSON Formatter Check"
    
    if command -v jq > /dev/null 2>&1; then
        print_success "jq is installed"
        jq --version
    else
        print_warning "jq is NOT installed"
        echo ""
        echo "Install jq for better JSON formatting:"
        echo "  • macOS: brew install jq"
        echo "  • Ubuntu: sudo apt install jq"
        echo "  • Windows: choco install jq"
    fi
    
    press_enter
    utilities_menu
}

cmd_export_config() {
    print_section "Export Configuration"
    
    echo -e "${BOLD}Current Configuration:${NC}"
    echo ""
    echo "API_URL=$API_URL"
    echo "SITE_URL=$SITE_URL"
    echo "INDEXNOW_KEY=${INDEXNOW_KEY:-<not set>}"
    echo "BING_API_KEY=${BING_API_KEY:+<set>}${BING_API_KEY:-<not set>}"
    echo ""
    
    read -p "Export to .env file? (y/n): " export
    
    if [ "$export" = "y" ] || [ "$export" = "Y" ]; then
        cat > .env.seo << EOF
# SEO CLI Configuration
# Generated: $(date)

SEO_API_URL=$API_URL
SEO_SITE_URL=$SITE_URL
INDEXNOW_KEY=$INDEXNOW_KEY
BING_API_KEY=$BING_API_KEY
EOF
        print_success "Configuration exported to .env.seo"
    fi
    
    press_enter
    utilities_menu
}

# ==========================================
# 7. HELP & DOCUMENTATION MENU
# ==========================================

help_menu() {
    print_header
    print_section "📚 Documentation & Help"
    
    echo -e "  ${GREEN}1)${NC} Quick Start Guide"
    echo -e "  ${GREEN}2)${NC} IndexNow Documentation"
    echo -e "  ${GREEN}3)${NC} Google Indexing API Info"
    echo -e "  ${GREEN}4)${NC} Bing Webmaster API Info"
    echo -e "  ${GREEN}5)${NC} Deprecation Notes"
    echo -e "  ${GREEN}6)${NC} Environment Variables"
    echo ""
    echo -e "  ${YELLOW}0)${NC} Kembali ke Menu Utama"
    echo ""
    read -p "Pilihan [0-6]: " choice
    
    case $choice in
        1) cmd_help_quickstart ;;
        2) cmd_help_indexnow ;;
        3) cmd_help_google ;;
        4) cmd_help_bing ;;
        5) cmd_help_deprecation ;;
        6) cmd_help_env ;;
        0) show_main_menu ;;
        *) help_menu ;;
    esac
}

cmd_help_quickstart() {
    print_section "Quick Start Guide"
    
    cat << 'EOF'
🚀 QUICK START GUIDE

1. SETUP INDEXNOW (Recommended)
   a. Generate key: Menu 3 → Option 5
   b. Deploy key file ke public/
   c. Set environment: export INDEXNOW_KEY=your-key
   d. Submit URLs: Menu 3 → Option 1

2. GENERATE SITEMAP
   Menu 2 → Option 1 (npx next-sitemap)

3. SUBMIT KE SEARCH ENGINES
   a. IndexNow (Bing, Yandex, Naver): Menu 3
   b. Google: Submit sitemap via Search Console
   c. Bing: Menu 5 atau IndexNow

4. MONITOR STATUS
   Menu 1 → Option 5 (Health Check)

📋 RECOMMENDED WORKFLOW:
   1. Buat/update konten
   2. Generate sitemap
   3. Submit URL baru via IndexNow
   4. Monitor di Search Console / Bing Webmaster

EOF
    
    press_enter
    help_menu
}

cmd_help_indexnow() {
    print_section "IndexNow Documentation"
    
    cat << 'EOF'
📤 INDEXNOW PROTOCOL

IndexNow adalah protokol terbuka yang memungkinkan website owner
memberitahu search engines langsung saat konten berubah.

SUPPORTED SEARCH ENGINES:
  • Bing (Microsoft)
  • Yandex (Russia)
  • Naver (Korea) - sejak July 2023
  • Seznam.cz (Czech)
  • Yep

CARA KERJA:
  1. Generate API key (8-128 karakter hex)
  2. Host key file di root website: /{key}.txt
  3. Submit URL via HTTP POST ke api.indexnow.org
  4. URL otomatis di-share ke semua search engine

LIMITS:
  • Max 10,000 URLs per submission
  • Key: 8-128 karakter (a-z, A-Z, 0-9, -)
  • Submit kapan saja saat konten berubah

RESPONSE CODES:
  200 - Success
  202 - Accepted (key validation pending)
  400 - Bad request
  403 - Key not valid
  422 - Invalid URL
  429 - Too many requests

DOCUMENTATION:
  https://www.indexnow.org/documentation

EOF
    
    press_enter
    help_menu
}

cmd_help_google() {
    print_section "Google Indexing API Info"
    
    cat << 'EOF'
🔎 GOOGLE INDEXING API

⚠️  UPDATE SEPTEMBER 2024:
Google Indexing API sekarang HANYA untuk:
  • Pages dengan JobPosting schema
  • Pages dengan BroadcastEvent dalam VideoObject

TIDAK BERLAKU UNTUK:
  • Regular web pages
  • Blog posts
  • Product pages
  • E-commerce pages

ALTERNATIF UNTUK REGULAR PAGES:
  1. Submit sitemap via Google Search Console
  2. Gunakan lastmod yang akurat di sitemap
  3. Internal linking yang baik
  4. Fetch as Google di Search Console

QUOTA:
  • Default: 200 requests/day per project
  • Bisa request peningkatan via form

API ENDPOINTS:
  • Submit: POST /v1/urlNotifications:publish
  • Status: GET /v1/urlNotifications/metadata

DOCUMENTATION:
  https://developers.google.com/search/apis/indexing-api/v3/quickstart

EOF
    
    press_enter
    help_menu
}

cmd_help_bing() {
    print_section "Bing Webmaster API Info"
    
    cat << 'EOF'
🅱️  BING WEBMASTER TOOLS API

⚠️  JUNI 2025 UPDATE:
Microsoft merekomendasikan IndexNow sebagai metode utama
untuk real-time URL submission.

BING URL SUBMISSION API:
  • Submit URL tunggal atau batch
  • Limit: 10,000 URLs/hari (dapat di-request naik)
  • Endpoint: ssl.bing.com/webmaster/api.svc/json/

ENDPOINTS:
  • SubmitUrl - Submit single URL
  • SubmitUrlBatch - Submit multiple URLs
  • GetUrlSubmissionQuota - Check remaining quota

BING CONTENT SUBMISSION API:
  • Submit konten langsung (HTML, images)
  • Bypass crawling
  • Untuk advanced use cases

CARA DAPAT API KEY:
  1. Login ke https://www.bing.com/webmasters
  2. Add & verify site
  3. Settings → API Access → Generate Key

DOCUMENTATION:
  https://www.bing.com/webmasters/url-submission-api

EOF
    
    press_enter
    help_menu
}

cmd_help_deprecation() {
    print_section "Deprecation Notes (2023-2025)"
    
    cat << 'EOF'
❌ DEPRECATED FEATURES

1. GOOGLE SITEMAP PING (June 2023)
   URL: google.com/ping?sitemap=...
   Status: Returns 404
   Reason: Spam abuse, tidak efektif
   Alternative: Submit via Search Console, robots.txt

2. BING SITEMAP PING (2022)
   URL: bing.com/ping?sitemap=...
   Status: Deprecated
   Alternative: IndexNow, Bing Webmaster API

3. YAHOO SITE EXPLORER (2011)
   Status: Shut down
   Alternative: Bing (Yahoo uses Bing's index)

4. GOOGLE INDEXING API - GENERAL PAGES (Sep 2024)
   Status: Limited to JobPosting & BroadcastEvent only
   Alternative: Search Console, sitemaps

✅ CURRENT BEST PRACTICES (2025):

1. Real-time Indexing:
   → IndexNow (Bing, Yandex, Naver)
   → Bing URL Submission API

2. Batch/Discovery:
   → XML Sitemaps dengan lastmod akurat
   → Submit via Search Console (Google)
   → Submit via Webmaster Tools (Bing)

3. robots.txt:
   → Include Sitemap: directive
   → Keep updated

EOF
    
    press_enter
    help_menu
}

cmd_help_env() {
    print_section "Environment Variables"
    
    cat << 'EOF'
🔧 ENVIRONMENT VARIABLES

Required/Recommended:
  SEO_API_URL      - Backend API URL
                     Default: https://umkm-server.fibidy.com/api
  
  SEO_SITE_URL     - Website URL
                     Default: https://fibidy.com
  
  INDEXNOW_KEY     - IndexNow API key (32 char hex)
                     Generate via Menu 3 → Option 5

Optional:
  BING_API_KEY     - Bing Webmaster Tools API key
                     Get from Bing Webmaster Tools

SETUP:
  1. Export di terminal:
     export INDEXNOW_KEY=abc123...
     export BING_API_KEY=xyz789...

  2. Atau buat file .env:
     INDEXNOW_KEY=abc123...
     BING_API_KEY=xyz789...

  3. Load file .env:
     source .env

EOF
    
    press_enter
    help_menu
}

# ==========================================
# MAIN ENTRY POINT
# ==========================================

# Load .env file if exists
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs 2>/dev/null)
fi

if [ -f ".env.seo" ]; then
    export $(grep -v '^#' .env.seo | xargs 2>/dev/null)
fi

# Check for command line arguments
if [ $# -gt 0 ]; then
    case "$1" in
        "status")
            curl -s "$API_URL/seo/status" | (command -v jq > /dev/null && jq || cat)
            ;;
        "stats")
            curl -s "$API_URL/sitemap/stats" | (command -v jq > /dev/null && jq || cat)
            ;;
        "sitemap")
            npx next-sitemap
            ;;
        "validate")
            url=${2:-$SITE_URL/sitemap.xml}
            if curl -s "$url" | grep -q '<?xml'; then
                echo "✅ Valid XML: $url"
                curl -s "$url" | grep -c '<loc>' | xargs -I {} echo "URLs found: {}"
            else
                echo "❌ Invalid or not accessible: $url"
            fi
            ;;
        "indexnow")
            if [ -z "$2" ]; then
                echo "Usage: $0 indexnow <url>"
                exit 1
            fi
            if [ -z "$INDEXNOW_KEY" ]; then
                echo "❌ INDEXNOW_KEY not set"
                exit 1
            fi
            host=$(echo "$SITE_URL" | sed 's|https\?://||' | sed 's|/.*||')
            curl -s -X POST "https://api.indexnow.org/indexnow" \
                -H "Content-Type: application/json" \
                -d "{\"host\":\"$host\",\"key\":\"$INDEXNOW_KEY\",\"urlList\":[\"$2\"]}"
            echo ""
            ;;
        "help"|"--help"|"-h")
            echo "SEO CLI - UMKM Multi-Tenant Platform"
            echo ""
            echo "Interactive Mode:"
            echo "  $0"
            echo ""
            echo "Command Line Mode:"
            echo "  $0 status              Check SEO backend status"
            echo "  $0 stats               Get sitemap statistics"
            echo "  $0 sitemap             Generate sitemap (next-sitemap)"
            echo "  $0 validate [url]      Validate sitemap XML"
            echo "  $0 indexnow <url>      Submit URL to IndexNow"
            echo "  $0 help                Show this help"
            echo ""
            echo "Environment Variables:"
            echo "  SEO_API_URL, SEO_SITE_URL, INDEXNOW_KEY, BING_API_KEY"
            ;;
        *)
            echo "Unknown command: $1"
            echo "Run '$0 help' for usage"
            exit 1
            ;;
    esac
else
    # Interactive mode
    show_main_menu
fi
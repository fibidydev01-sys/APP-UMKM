#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_URL="http://localhost:8000"
EMAIL="burgerchina@fibidy.com"
PASSWORD="password123"
COOKIE_FILE="/tmp/fibidy_cookies.txt"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}🍪 TESTING API TENANT (COOKIES)${NC}"
echo -e "${BLUE}================================${NC}\n"

# 1. LOGIN (Simpan cookies)
echo -e "${YELLOW}📍 Step 1: LOGIN${NC}"
echo -e "${YELLOW}POST ${BASE_URL}/api/auth/login${NC}\n"

LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -c "${COOKIE_FILE}" \
  -d "{
    \"email\": \"${EMAIL}\",
    \"password\": \"${PASSWORD}\"
  }")

echo -e "${GREEN}Response:${NC}"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Check cookies
if [ -f "${COOKIE_FILE}" ]; then
  echo -e "${GREEN}✅ Cookies tersimpan di: ${COOKIE_FILE}${NC}"
  cat "${COOKIE_FILE}"
  echo ""
else
  echo -e "${RED}❌ Cookies tidak tersimpan!${NC}"
  exit 1
fi

# 2. GET TENANT (Pakai cookies)
echo -e "${YELLOW}📍 Step 2: GET CURRENT TENANT${NC}"
echo -e "${YELLOW}GET ${BASE_URL}/api/tenants/me${NC}\n"

GET_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/tenants/me" \
  -b "${COOKIE_FILE}")

echo -e "${GREEN}Response:${NC}"
echo "$GET_RESPONSE" | jq '.' 2>/dev/null || echo "$GET_RESPONSE"
echo ""

# 3. PATCH TENANT - TEST ALL UNIFIED STATE FIELDS (Pakai cookies)
echo -e "${YELLOW}📍 Step 3: UPDATE TENANT - ALL FIELDS (PATCH)${NC}"
echo -e "${YELLOW}PATCH ${BASE_URL}/api/tenants/me${NC}\n"

PATCH_RESPONSE=$(curl -s -X PATCH "${BASE_URL}/api/tenants/me" \
  -H "Content-Type: application/json" \
  -b "${COOKIE_FILE}" \
  -d '{
    "category": "CATERING",
    "name": "Test Store UPDATED",
    "description": "Test Description UPDATED",
    "phone": "+6281234567890",
    "whatsapp": "6281234567890",
    "address": "Test Address UPDATED",
    "heroTitle": "TEST HERO TITLE UPDATED",
    "heroSubtitle": "TEST HERO SUBTITLE UPDATED",
    "heroCtaText": "TEST HERO CTA TEXT",
    "heroCtaLink": "/products-test",
    "heroBackgroundImage": "https://example.com/hero-updated.jpg",
    "aboutTitle": "TEST ABOUT TITLE UPDATED",
    "aboutSubtitle": "TEST ABOUT SUBTITLE UPDATED",
    "aboutContent": "TEST ABOUT CONTENT UPDATED - This is a long description about our store.",
    "aboutImage": "https://example.com/about-updated.jpg",
    "aboutFeatures": [
      {
        "icon": "🔥",
        "title": "Test Feature 1",
        "description": "Feature 1 description"
      },
      {
        "icon": "⭐",
        "title": "Test Feature 2",
        "description": "Feature 2 description"
      }
    ],
    "testimonialsTitle": "TEST TESTIMONIALS TITLE UPDATED",
    "testimonialsSubtitle": "TEST TESTIMONIALS SUBTITLE UPDATED",
    "testimonials": [
      {
        "name": "Test User 1",
        "role": "Test Role 1",
        "content": "This is test testimonial 1",
        "avatar": "https://example.com/avatar1.jpg"
      },
      {
        "name": "Test User 2",
        "role": "Test Role 2",
        "content": "This is test testimonial 2",
        "avatar": "https://example.com/avatar2.jpg"
      }
    ],
    "contactTitle": "TEST CONTACT TITLE UPDATED",
    "contactSubtitle": "TEST CONTACT SUBTITLE UPDATED",
    "contactMapUrl": "https://maps.google.com/test",
    "contactShowMap": true,
    "contactShowForm": true,
    "ctaTitle": "TEST CTA TITLE UPDATED",
    "ctaSubtitle": "TEST CTA SUBTITLE UPDATED",
    "ctaButtonText": "TEST CTA BUTTON",
    "ctaButtonLink": "/test-cta-link",
    "ctaButtonStyle": "primary"
  }')

echo -e "${GREEN}Response:${NC}"
echo "$PATCH_RESPONSE" | jq '.' 2>/dev/null || echo "$PATCH_RESPONSE"
echo ""

# 4. VERIFY UPDATE - CHECK ALL FIELDS
echo -e "${YELLOW}📍 Step 4: VERIFY UPDATE - ALL UNIFIED STATE FIELDS${NC}"
echo -e "${YELLOW}GET ${BASE_URL}/api/tenants/me${NC}\n"

VERIFY_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/tenants/me" \
  -b "${COOKIE_FILE}")

echo -e "${GREEN}Response (All Updated Fields):${NC}"
echo "$VERIFY_RESPONSE" | jq '{
  category,
  name,
  description,
  phone,
  whatsapp,
  address,
  heroTitle,
  heroSubtitle,
  heroCtaText,
  heroCtaLink,
  heroBackgroundImage,
  aboutTitle,
  aboutSubtitle,
  aboutContent,
  aboutImage,
  aboutFeatures,
  testimonialsTitle,
  testimonialsSubtitle,
  testimonials,
  contactTitle,
  contactSubtitle,
  contactMapUrl,
  contactShowMap,
  contactShowForm,
  ctaTitle,
  ctaSubtitle,
  ctaButtonText,
  ctaButtonLink,
  ctaButtonStyle
}' 2>/dev/null || echo "$VERIFY_RESPONSE"

echo -e "\n${BLUE}================================${NC}"
echo -e "${GREEN}✅ TEST SELESAI${NC}"
echo -e "${BLUE}================================${NC}"

# Cleanup
rm -f "${COOKIE_FILE}"
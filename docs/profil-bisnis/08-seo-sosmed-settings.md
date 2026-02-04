# SEO & Media Sosial Settings - Dokumentasi

## 📍 Lokasi File
**Path**: `app/client/src/app/settings/seo/page.tsx`

**Access**: Standalone page

**Sidebar Menu**: "SEO & Sosmed" (icon: 🔍)

---

## 🎯 Tujuan Halaman

Halaman ini untuk mengatur:
1. **SEO Metadata**: Meta title, meta description untuk meningkatkan visibilitas di Google
2. **Social Media Links**: Link profil media sosial (Instagram, Facebook, TikTok, YouTube, Twitter)

Setting ini penting untuk:
- **Organic Traffic** dari Google Search
- **Social Proof** dan **Brand Presence**
- **Multi-channel Marketing**

---

## 📋 Form Fields

### Section 1: SEO Metadata

| # | Field | Tipe Input | Required | Character Limit | Keterangan |
|---|-------|-----------|----------|-----------------|------------|
| 1 | **Meta Title** | `Input` (text) | ❌ Tidak | Max 60 chars | Judul yang muncul di Google Search Results<br/>💡 Format: "{Keyword} | {Nama Toko}"<br/>⚠️ Jika kosong, auto-generate dari nama toko |
| 2 | **Meta Description** | `Textarea` (3 rows) | ❌ Tidak | Max 160 chars | Deskripsi yang muncul di bawah title di Google<br/>💡 Include: keyword, USP, call-to-action<br/>⚠️ Jika kosong, auto-generate dari deskripsi toko |

**Character Counter**: Real-time display untuk membantu user tidak exceed limit

---

### Section 2: Social Media Links

| # | Field | Tipe Input | Required | Keterangan |
|---|-------|-----------|----------|------------|
| 3 | **Instagram** | `Input` (URL) | ❌ Tidak | Link profil Instagram<br/>Format: `https://instagram.com/username`<br/>atau `https://www.instagram.com/username` |
| 4 | **Facebook** | `Input` (URL) | ❌ Tidak | Link halaman Facebook<br/>Format: `https://facebook.com/pagename`<br/>atau `https://www.facebook.com/pagename` |
| 5 | **TikTok** | `Input` (URL) | ❌ Tidak | Link profil TikTok<br/>Format: `https://tiktok.com/@username`<br/>atau `https://www.tiktok.com/@username` |
| 6 | **YouTube** | `Input` (URL) | ❌ Tidak | Link channel YouTube<br/>Format: `https://youtube.com/@channelname`<br/>atau `https://www.youtube.com/c/channelname` |
| 7 | **Twitter / X** | `Input` (URL) | ❌ Tidak | Link profil Twitter/X<br/>Format: `https://twitter.com/username`<br/>atau `https://x.com/username` |

---

## 🔌 API Integration

### Request Body (Contoh)

```json
{
  "metaTitle": "Toko Bunga Segar Online Jakarta | Toko Bunga Mawar",
  "metaDescription": "Pesan bunga segar untuk acara spesial Anda. Gratis ongkir Jakarta. Pengiriman cepat dalam 24 jam. Order sekarang!",
  "socialLinks": {
    "instagram": "https://instagram.com/tokobungamawar",
    "facebook": "https://facebook.com/tokobungamawar",
    "tiktok": "https://tiktok.com/@tokobungamawar",
    "youtube": "https://youtube.com/@tokobungamawar",
    "twitter": "https://twitter.com/tokobungamawar"
  }
}
```

### API Endpoint

```
PATCH /api/tenants/{tenantId}
```

### Fields Mapping

| Form Field | API Field Path | Tipe Data |
|-----------|----------------|-----------|
| Meta Title | `metaTitle` | string (max 60 chars) |
| Meta Description | `metaDescription` | string (max 160 chars) |
| Instagram | `socialLinks.instagram` | string (URL) |
| Facebook | `socialLinks.facebook` | string (URL) |
| TikTok | `socialLinks.tiktok` | string (URL) |
| YouTube | `socialLinks.youtube` | string (URL) |
| Twitter/X | `socialLinks.twitter` | string (URL) |

---

## 🎨 Preview Component

### Google Search Result Preview (Inline)

**Live Preview** di halaman settings:

```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Google Search Preview                                │
│                                                         │
│ Toko Bunga Segar Online Jakarta | Toko Bunga Mawar     │
│ https://tokobungamawar.fibidy.com                       │
│ Pesan bunga segar untuk acara spesial Anda. Gratis ... │
│ ongkir Jakarta. Pengiriman cepat dalam 24 jam.         │
└─────────────────────────────────────────────────────────┘
```

**Color Coding**:
- Title: Blue (clickable link)
- URL: Green
- Description: Gray

**Character Counter Indicator**:
```
Meta Title: [42/60] ✅ Optimal
Meta Description: [155/160] ✅ Good
```

---

## 🔄 Alur Data

```
1. User mengisi Meta Title & Description
   ↓
2. Real-time character counter update
   ↓
3. Live preview Google Search Result update
   ↓
4. User mengisi social media links (opsional)
   ↓
5. User klik "Simpan"
   ↓
6. Validasi (URL format, character limits)
   ↓
7. tenantsApi.update(tenantId, seoData)
   ↓
8. Backend menyimpan ke database
   ↓
9. useTenant().refresh()
   ↓
10. Toast notification
   ↓
11. Meta tags ter-update di <head> landing page
   ↓
12. Social icons ter-update di footer
```

---

## ✅ Validasi

### Client-Side Validation

```javascript
// Validasi Meta Title
if (metaTitle && metaTitle.length > 60) {
  toast.error('Meta Title maksimal 60 karakter');
  return;
}

if (metaTitle && metaTitle.length < 30) {
  toast.warning('Meta Title sebaiknya 30-60 karakter untuk optimal');
}

// Validasi Meta Description
if (metaDescription && metaDescription.length > 160) {
  toast.error('Meta Description maksimal 160 karakter');
  return;
}

if (metaDescription && metaDescription.length < 120) {
  toast.warning('Meta Description sebaiknya 120-160 karakter');
}

// Validasi Social Media URLs
const urlFields = [
  { field: 'instagram', value: instagram, pattern: /instagram\.com/ },
  { field: 'facebook', value: facebook, pattern: /facebook\.com/ },
  { field: 'tiktok', value: tiktok, pattern: /tiktok\.com/ },
  { field: 'youtube', value: youtube, pattern: /youtube\.com/ },
  { field: 'twitter', value: twitter, pattern: /(twitter\.com|x\.com)/ }
];

urlFields.forEach(({ field, value, pattern }) => {
  if (value && value.trim() !== '') {
    // Harus dimulai dengan https://
    if (!value.startsWith('https://') && !value.startsWith('http://')) {
      toast.error(`Link ${field} harus dimulai dengan https://`);
      return;
    }
    
    // Harus contain domain yang sesuai
    if (!pattern.test(value)) {
      toast.error(`Link ${field} tidak valid (harus dari ${field}.com)`);
      return;
    }
  }
});
```

### Business Rules

1. **Meta Title**: Max 60 chars (optimal 30-60)
2. **Meta Description**: Max 160 chars (optimal 120-160)
3. **Social Links**: Harus valid URL, opsional
4. **Auto-generation**: Jika meta title/description kosong, auto-generate dari nama toko & deskripsi

---

## 💡 Best Practices

### Meta Title Best Practices

**Formula yang Efektif**:
```
[Primary Keyword] | [Secondary Keyword] | [Brand Name]

Contoh:
❌ BURUK:
"Toko Bunga" (terlalu pendek, tidak spesifik)
"Toko Bunga Mawar - Jual Bunga Segar Murah Online Jakarta Gratis Ongkir" (terlalu panjang, 72 chars)

✅ BAIK:
"Toko Bunga Segar Jakarta | Gratis Ongkir | Bunga Mawar" (57 chars)
"Jual Bunga Online Murah Jakarta | Toko Bunga Mawar" (53 chars)
"Bunga Pernikahan Jakarta | Same Day Delivery | Mawar" (54 chars)
```

**Tips**:
1. **Front-load keywords**: Keyword penting di awal
2. **Include location**: Jika target lokal (Jakarta, Bandung)
3. **Unique per page**: Jangan duplikat dengan kompetitor
4. **Brand name di akhir**: Separator dengan | atau -
5. **Avoid keyword stuffing**: Natural dan readable

**Character Sweet Spot**: 50-60 characters

---

### Meta Description Best Practices

**Structure yang Efektif**:
```
[What you offer] + [USP/Benefit] + [Call to Action]

Contoh:
❌ BURUK:
"Toko bunga." (terlalu pendek)
"Kami adalah toko bunga yang menjual berbagai macam bunga segar dengan harga terjangkau dan kualitas terbaik serta pelayanan yang memuaskan untuk Anda..." (terlalu panjang, 175 chars)

✅ BAIK:
"Pesan bunga segar untuk acara spesial Anda. Gratis ongkir Jakarta, pengiriman cepat 24 jam. Rangkaian custom tersedia. Order sekarang!" (137 chars)

"Toko bunga online Jakarta dengan 1000+ rangkaian segar. Same-day delivery, gratis konsultasi. Harga mulai Rp 100rb. Pesan sekarang!" (134 chars)
```

**Tips**:
1. **Action words**: Pesan, Order, Dapatkan, Beli
2. **Numbers**: "Gratis ongkir Jakarta", "1000+ rangkaian", "Mulai Rp 100rb"
3. **Benefits**: Fast delivery, gratis konsultasi, custom design
4. **Urgency**: "Pesan sekarang", "Order hari ini"
5. **Relevant**: Sesuai dengan content halaman

**Character Sweet Spot**: 140-160 characters

---

### Meta Title & Description - Industry Examples

**E-Commerce Fashion**:
```
Title: "Baju Korea Import Murah | Free Ongkir | FashionHub" (54)
Description: "Koleksi baju Korea import terbaru dengan harga terjangkau. Gratis ongkir seluruh Indonesia untuk pembelian > Rp 200rb. Order sekarang!" (142)
```

**Food Delivery**:
```
Title: "Catering Jakarta Murah | Pesan Nasi Box Online | Delicio" (59)
Description: "Layanan catering Jakarta untuk acara kantor & pribadi. Nasi box mulai Rp 15rb, free delivery min 50 box. Pesan H-1 bisa. Order sekarang!" (140)
```

**Jasa Konsultasi**:
```
Title: "Konsultan Pajak Jakarta | Gratis Konsultasi | TaxPro" (54)
Description: "Jasa konsultan pajak berpengalaman 10+ tahun. Gratis konsultasi awal, harga transparan, garansi revisi. Hubungi kami hari ini!" (129)
```

**Beauty/Salon**:
```
Title: "Salon Kecantikan Jakarta Selatan | Promo 30% | Glowup" (56)
Description: "Treatment kecantikan premium dengan harga terjangkau. Promo diskon 30% untuk member baru. Booking online mudah. Reservasi sekarang!" (135)
```

---

### Social Media Strategy

**Platform Priority** (berdasarkan audience):

**B2C Products** (Fashion, Food, Beauty):
```
1. Instagram (MUST HAVE)
   - Visual-first
   - Shopping features
   - Stories for engagement

2. TikTok (TRENDING)
   - Viral potential
   - Younger demographic (18-30)
   - Video content

3. Facebook (STILL RELEVANT)
   - Older demographic (30-50)
   - Groups & Community
   - Marketplace

4. YouTube (OPTIONAL)
   - Tutorial, Review
   - Long-form content
   - SEO benefit

5. Twitter/X (LOW PRIORITY for B2C)
```

**B2B Services**:
```
1. LinkedIn (MUST HAVE for B2B)
2. Facebook (for community)
3. Twitter/X (for updates, news)
4. Instagram (optional, for branding)
5. TikTok (optional, thought leadership)
```

**Content Strategy per Platform**:
```
Instagram:
- Product photos (high quality)
- Behind the scenes
- Customer testimonials (repost UGC)
- Stories: daily updates, polls, Q&A

TikTok:
- Short videos (15-60s)
- Trends & challenges
- Educational content
- Unboxing, reviews

Facebook:
- Longer posts
- Community engagement
- Customer service
- Events, promotions

YouTube:
- Product demos
- How-to tutorials
- Brand story
- Customer success stories

Twitter/X:
- Quick updates
- News & announcements
- Customer support
- Engage in conversations
```

---

## 🔧 Troubleshooting

### Masalah Umum

**1. Meta title terpotong di Google**
```
Penyebab: > 60 karakter
Solusi:
- Cek di preview: apakah ada "..."?
- Shorten title, prioritize keywords di awal
- Remove filler words: "dan", "atau", "untuk"
```

**2. Meta description tidak muncul di Google**
```
Penyebab:
- Google bisa override dengan snippet dari page content
- Description tidak relevan dengan search query

Solusi:
- Pastikan description match dengan page content
- Include keywords yang user cari
- Update content page agar align dengan meta description
```

**3. Social media icon tidak muncul di footer**
```
Cek:
- Apakah link sudah tersimpan? (klik "Simpan")
- Apakah format URL benar? (harus https://)
- Apakah frontend render social icons dari tenant.socialLinks?
- Refresh halaman
```

**4. Link social media tidak bisa diklik**
```
Cek:
- Apakah URL valid? (test buka di browser)
- Apakah ada typo?
- Apakah akun social media masih aktif?
```

**5. Google tidak index website**
```
Cek:
- Submit sitemap ke Google Search Console
- Pastikan robots.txt tidak block Googlebot
- Meta robots tidak ada "noindex"
- Website accessible dan tidak password-protected
```

---

## 📱 Responsive Behavior

**Social Icons di Footer**:

### Desktop (> 1024px)
- Horizontal list
- Icon size: 32px
- Spacing: 16px between icons

### Tablet (768px - 1024px)
- Horizontal list
- Icon size: 28px
- Spacing: 12px

### Mobile (< 768px)
- Horizontal list (wrap if needed)
- Icon size: 28px
- Spacing: 12px
- Center aligned

---

## 🚀 Future Enhancements

Fitur yang bisa ditambahkan:

1. **Open Graph Meta Tags** (for social sharing)
   ```html
   <meta property="og:title" content="..." />
   <meta property="og:description" content="..." />
   <meta property="og:image" content="..." />
   <meta property="og:url" content="..." />
   ```

2. **Twitter Card Meta Tags**
   ```html
   <meta name="twitter:card" content="summary_large_image" />
   <meta name="twitter:title" content="..." />
   <meta name="twitter:description" content="..." />
   <meta name="twitter:image" content="..." />
   ```

3. **Schema.org Structured Data** (LocalBusiness, Product)
   ```json
   {
     "@context": "https://schema.org",
     "@type": "LocalBusiness",
     "name": "Toko Bunga Mawar",
     "image": "...",
     "telephone": "+62-812-3456-7890",
     "address": { ... }
   }
   ```

4. **Canonical URL** configuration

5. **Sitemap Generator** (auto-generate XML sitemap)

6. **Google Analytics Integration**
   - GA4 tracking code input
   - Google Tag Manager

7. **Facebook Pixel** integration

8. **SEO Audit Tool**
   - Score meta title/description
   - Keyword density checker
   - Readability score

9. **Social Share Buttons** generator
   - WhatsApp share
   - Facebook share
   - Twitter share

10. **SEO Monitoring Dashboard**
    - Organic traffic stats
    - Top keywords
    - Click-through rate (CTR)

---

## 📊 SEO Performance Metrics

### Key Metrics to Track

```
1. Organic Traffic
   - Sessions from Google/Bing
   - Target: +10% MoM (month over month)

2. Click-Through Rate (CTR)
   - Clicks / Impressions in Google Search
   - Good: > 3%
   - Average: 1-3%
   - Poor: < 1%

3. Average Position
   - Where you rank in Google for keywords
   - Target: Top 10 (first page)

4. Page Load Speed
   - Core Web Vitals
   - Target: < 3 seconds

5. Mobile Usability
   - Mobile-friendly test
   - Target: 100% mobile-friendly

6. Backlinks
   - Number of sites linking to you
   - Target: +5 quality backlinks per month
```

**Tools untuk Monitor**:
- Google Search Console (FREE)
- Google Analytics (FREE)
- Semrush / Ahrefs (PAID, advanced)

---

## 📝 Checklist Before Go-Live

**SEO Setup**:
- [ ] Meta Title optimized (30-60 chars, include keywords)
- [ ] Meta Description compelling (120-160 chars, with CTA)
- [ ] Preview looks good in Google Search Result
- [ ] No duplicate meta tags with other pages
- [ ] Keywords research done (target 3-5 main keywords)

**Social Media**:
- [ ] At least 2 social media accounts created & active
- [ ] Profile complete (bio, profile pic, cover, contact)
- [ ] Links tested (bisa dibuka)
- [ ] Icons render correctly di footer website

**Technical SEO**:
- [ ] Sitemap.xml created and submitted to Google
- [ ] Robots.txt configured correctly
- [ ] Google Search Console verified
- [ ] Google Analytics installed
- [ ] SSL certificate installed (HTTPS)
- [ ] Mobile-friendly (test dengan Google Mobile-Friendly Test)
- [ ] Page speed < 3 seconds

**Content**:
- [ ] Homepage content > 300 words (for SEO)
- [ ] Images have alt text
- [ ] H1, H2, H3 tags used correctly
- [ ] Internal links to other pages
- [ ] External links to authoritative sources (if applicable)

---

## 🎯 SEO Action Plan (First 3 Months)

### Month 1: Foundation
```
Week 1-2:
- Setup Google Search Console & Analytics
- Keyword research (use Google Keyword Planner, free)
- Optimize meta title & description
- Submit sitemap

Week 3-4:
- Create 4-8 blog posts (target keywords)
- Optimize product descriptions
- Add alt text to all images
- Fix any broken links
```

### Month 2: Content & Links
```
Week 1-2:
- Create 4-8 more blog posts
- Guest post di blog lain (get backlinks)
- Submit to local directories (Google My Business, etc)

Week 3-4:
- Engage di social media (daily posts)
- Reach out untuk backlinks
- Create infographic / shareable content
```

### Month 3: Optimization
```
Week 1-2:
- Analyze Google Search Console data
- Identify top keywords & optimize further
- Create content for keywords with high impressions but low CTR

Week 3-4:
- Technical SEO audit (use Screaming Frog free version)
- Fix any issues found
- Continue content creation
```

**Expected Results**:
- Month 1: 0-50 organic visitors
- Month 2: 50-200 organic visitors
- Month 3: 200-500 organic visitors

*(Results vary based on competition, niche, effort)*

---

## 🔍 Keyword Research Guide (Quick)

### Free Tools:
```
1. Google Keyword Planner
   - Keyword ideas
   - Search volume
   - Competition

2. Google Autocomplete
   - Type keyword, see suggestions
   - "Toko bunga jakarta ..."

3. Google "People Also Ask"
   - Related questions
   - Content ideas

4. AnswerThePublic (Free limited)
   - Visualize search questions
```

### How to Choose Keywords:
```
1. Relevance: Sesuai dengan bisnis?
2. Search Volume: Min 100 searches/month
3. Competition: Low to Medium (untuk UMKM baru)
4. Intent: Transactional > Informational

Example for "Toko Bunga":
✅ GOOD:
- "toko bunga jakarta" (transactional, local)
- "pesan bunga online" (transactional)
- "bunga pernikahan murah" (transactional, low competition)

❌ AVOID:
- "bunga" (too broad, high competition)
- "cara merawat bunga" (informational, not buying intent)
- "bunga mawar" (high competition, not specific)
```

---

## 💬 Social Media Best Practices

### Username Consistency
```
✅ BAIK:
Instagram: @tokobungamawar
Facebook: facebook.com/tokobungamawar
TikTok: @tokobungamawar
Twitter: @tokobungamawar
YouTube: @tokobungamawar

Benefit: Easy to remember, brand consistency

❌ HINDARI:
Instagram: @tokobungamawar
Facebook: @bunga_mawar_official
TikTok: @bungamawar123
(Inconsistent, confusing)
```

### Profile Optimization
```
Bio Template:
[What you do] | [USP] | [Location]
[CTA]
[Website link]

Contoh:
🌹 Toko Bunga Segar Online
✨ Same Day Delivery Jakarta
📦 Gratis Ongkir min Rp 200rb
🛒 Order via link di bio 👇
```

### Content Calendar (Example)
```
Monday: Product Showcase
Tuesday: Behind the Scenes
Wednesday: Customer Testimonial
Thursday: Tips & Tricks
Friday: Promo / Giveaway
Saturday: User-Generated Content (repost customer)
Sunday: Inspirational / Quote
```

---

*Dokumentasi dibuat: Februari 2025*  
*Versi: 1.0*

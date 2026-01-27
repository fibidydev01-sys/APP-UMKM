# 🔥 UNIFIED STATE STRUCTURE - Dokumentasi Lengkap

## 📋 DAFTAR ISI
1. [Overview](#overview)
2. [Struktur Data Lengkap](#struktur-data-lengkap)
3. [Lokasi File Penting](#lokasi-file-penting)
4. [Alur Data (Data Flow)](#alur-data-data-flow)
5. [Cara Debug](#cara-debug)

---

## Overview

**MASALAH LAMA:** Ada 2 state terpisah (`formData` + `landingContent`) dengan lifecycle berbeda → race condition → data hilang setelah login!

**SOLUSI SEKARANG:** 1 UNIFIED STATE `storeTabData` yang menggabungkan SEMUA data toko dalam satu objek!

---

## Struktur Data Lengkap

### 🔥 `storeTabData` - Unified State Object

Lokasi: `/client/src/app/(dashboard)/dashboard/settings/page.tsx` (line 123-160)

```typescript
const [storeTabData, setStoreTabData] = useState<{
  // ========================================
  // SECTION 1: Informasi Dasar
  // ========================================
  name: string;                    // Nama toko
  description: string;             // Deskripsi toko
  phone: string;                   // Nomor telepon
  address: string;                 // Alamat lengkap
  logo: string | undefined;        // URL logo
  banner: string | undefined;      // URL banner
  primaryColor: string;            // Warna tema (hex color)

  // ========================================
  // SECTION 2: Hero Section
  // ========================================
  heroTitle: string;               // Judul hero
  heroSubtitle: string;            // Subtitle hero
  heroCtaText: string;             // Teks tombol CTA hero
  heroCtaLink: string;             // Link tombol CTA hero
  heroBackgroundImage: string;     // URL gambar background hero

  // ========================================
  // SECTION 3: About Section
  // ========================================
  aboutTitle: string;              // Judul about
  aboutSubtitle: string;           // Subtitle about
  aboutContent: string;            // Deskripsi lengkap about
  aboutImage: string;              // URL gambar about
  aboutFeatures: FeatureItem[];    // Array fitur-fitur
                                   // FeatureItem: { icon: string, title: string, description: string }

  // ========================================
  // SECTION 4: Testimonials Section
  // ========================================
  testimonialsTitle: string;       // Judul testimonial
  testimonialsSubtitle: string;    // Subtitle testimonial
  testimonials: Testimonial[];     // Array testimonial
                                   // Testimonial: { name: string, role: string, content: string, avatar?: string }

  // ========================================
  // SECTION 5: Contact Section
  // ========================================
  contactTitle: string;            // Judul kontak
  contactSubtitle: string;         // Subtitle kontak
  contactMapUrl: string;           // URL Google Maps embed
  contactShowMap: boolean;         // Toggle tampil/sembunyikan peta
  contactShowForm: boolean;        // Toggle tampil/sembunyikan form kontak

  // ========================================
  // SECTION 6: CTA Section
  // ========================================
  ctaTitle: string;                // Judul CTA
  ctaSubtitle: string;             // Subtitle CTA
  ctaButtonText: string;           // Teks tombol CTA
  ctaButtonLink: string;           // Link tombol CTA
  ctaButtonStyle: 'primary' | 'secondary' | 'outline';  // Gaya tombol
} | null>(null);
```

---

## Lokasi File Penting

### 🎯 FRONTEND

#### 1. **Settings Page** (Di mana unified state tinggal)
```
📁 /client/src/app/(dashboard)/dashboard/settings/page.tsx
```
- **Line 123-160:** Definisi `storeTabData` state
- **Line 183-232:** `useEffect` untuk inisialisasi state dari tenant
- **Line 369-461:** `handleSaveStoreTab()` - Fungsi save unified state
- **Line 596-603:** `updateStoreTabData()` - Helper untuk update state
- **Line 639-872:** Form UI untuk semua fields

#### 2. **TypeScript Types** (Definisi tipe data)
```
📁 /client/src/types/tenant.ts
```
- **`Tenant` interface:** Definisi lengkap semua fields tenant
- **`FeatureItem` interface:** `{ icon: string, title: string, description: string }`
- **`Testimonial` interface:** `{ name: string, role: string, content: string, avatar?: string }`

#### 3. **Auth Store** (State management global)
```
📁 /client/src/stores/auth-store.ts
```
- **Line 30-54:** Zustand store definition
- **Line 62-66:** Event listener untuk 401 unauthorized
- **Line 78-116:** Hydration-safe hooks (useIsAuthenticated, useCurrentTenant, dll)

#### 4. **Auth Guard** (Cek auth & inisialisasi tenant)
```
📁 /client/src/components/auth/auth-guard.tsx
```
- **Line 40-62:** `useEffect` yang memanggil `/auth/status` endpoint
- **Line 47:** `authApi.status()` - API call yang mengisi tenant state

#### 5. **API Client** (Auth API calls)
```
📁 /client/src/lib/api/auth.ts
```
- **Line 39-41:** `status()` - Endpoint yang dipanggil saat page load

---

### 🎯 BACKEND

#### 1. **Auth Service** (✅ SUDAH FIXED!)
```
📁 /server/src/auth/auth.service.ts
```
- **Line 60-120:** `verifyToken()` method dengan SELECT statement LENGKAP
- **PENTING:** Method ini dipanggil oleh `/auth/status` endpoint
- **Line 70-110:** SELECT semua fields tenant termasuk landing content fields

#### 2. **Auth Controller** (HTTP endpoints)
```
📁 /server/src/auth/auth.controller.ts
```
- **Line 123-138:** `/auth/status` endpoint - GET request
- **Line 133:** Memanggil `this.authService.verifyToken(token)`

#### 3. **Database Schema** (Prisma)
```
📁 /server/prisma/schema.prisma
```
- **Model `Tenant`:** Definisi tabel database
- **Field types:**
  - `String` → untuk text pendek (VARCHAR)
  - `String? @db.Text` → untuk text panjang (TEXT)
  - `Json?` → untuk array/object (aboutFeatures, testimonials)
  - `Boolean` → untuk toggle (contactShowMap, contactShowForm)

---

## Alur Data (Data Flow)

### 🔄 LOGIN FLOW
```
1. User login → POST /auth/login
2. Backend: Set cookie 'fibidy_auth' dengan JWT token
3. Frontend: Cookie disimpan di browser (HttpOnly)
4. Redirect ke /dashboard
```

### 🔄 PAGE LOAD FLOW (Settings Page)
```
1. AuthGuard mount
   ↓
2. Call: GET /auth/status (with cookie)
   ↓
3. Backend: auth.controller.ts → checkStatus()
   ↓
4. Backend: auth.service.ts → verifyToken()
   ↓
5. Backend: Prisma SELECT * FROM tenant (SEMUA FIELDS!)
   ↓
6. Response: { authenticated: true, tenant: {...} }
   ↓
7. Frontend: authStore.setTenant(tenant)
   ↓
8. Frontend: useTenant() hook return tenant
   ↓
9. Settings Page: useEffect init storeTabData dari tenant
   ↓
10. Form fields populated! ✅
```

### 🔄 SAVE FLOW
```
1. User click "Simpan Semua Perubahan"
   ↓
2. handleSaveStoreTab() dipanggil
   ↓
3. Call: PATCH /tenants/me (with ALL storeTabData fields)
   ↓
4. Backend: Update database
   ↓
5. Frontend: refresh() - fetch latest tenant data
   ↓
6. Update storeTabData dengan fresh data
   ↓
7. Toast success! ✅
```

---

## Cara Debug

### 🐛 Jika Form Fields Kosong Setelah Login

**1. Cek apakah backend mengembalikan data lengkap:**
```javascript
// Di browser console:
fetch('http://localhost:3000/api/auth/status', {
  credentials: 'include'
}).then(r => r.json()).then(data => {
  console.log('Authenticated:', data.authenticated);
  console.log('Tenant exists:', !!data.tenant);
  console.log('contactTitle:', data.tenant?.contactTitle);
  console.log('contactSubtitle:', data.tenant?.contactSubtitle);
  console.log('ctaTitle:', data.tenant?.ctaTitle);
  console.log('ctaSubtitle:', data.tenant?.ctaSubtitle);
});
```

**Hasil yang BENAR:**
```
authenticated: true ✅
tenant exists: true ✅
contactTitle: "Hubungi Kami" ✅
contactSubtitle: "Kami siap membantu" ✅
```

**Hasil yang SALAH:**
```
authenticated: true ✅
tenant exists: true ✅
contactTitle: undefined ❌  ← MASALAH DI BACKEND!
contactSubtitle: undefined ❌
```

**FIX:** Cek `/server/src/auth/auth.service.ts` → `verifyToken()` → pastikan SELECT statement punya semua fields!

---

**2. Cek apakah storeTabData ter-inisialisasi:**
```javascript
// Settings page sudah ada console.log bawaan!
// Cari di console browser:
"🔥 Initializing storeTabData with tenant:"
"✅ storeTabData initialized!"
"📋 storeTabData updated:"
```

Jika tidak muncul → berarti `tenant` masih null → cek AuthGuard/AuthStore

---

**3. Cek auth store:**
```javascript
// Di browser console:
import { useAuthStore } from '@/stores';
const tenant = useAuthStore.getState().tenant;
console.log('Tenant in store:', tenant);
```

Jika null → masalah di AuthGuard atau API call

---

### 🐛 Jika Data Tidak Tersimpan

**1. Cek network tab:**
- Buka DevTools → Network
- Click "Simpan Semua Perubahan"
- Cari request: `PATCH /tenants/me`
- Cek payload apakah semua fields terkirim

**2. Cek backend logs:**
```bash
# Di terminal server:
npm run start:dev
# Lihat output saat save
```

**3. Cek database:**
```bash
# Di terminal server:
npx prisma studio
# Buka browser → cek tabel Tenant
```

---

### 🐛 Jika Race Condition Terjadi Lagi

**Gejala:**
- Beberapa fields kosong, beberapa terisi
- Data hilang setelah refresh
- Inconsistent state

**Penyebab:**
- Ada state terpisah lagi?
- Ada multiple `useEffect` yang modify state berbeda?

**FIX:**
- HARUS 1 UNIFIED STATE `storeTabData`
- HARUS 1 `useEffect` untuk init
- HARUS 1 save function `handleSaveStoreTab()`

**Cek:**
```
📁 /client/src/app/(dashboard)/dashboard/settings/page.tsx
```
- Pastikan CUMA ada 1 `useState` untuk semua store tab data
- Pastikan CUMA ada 1 `useEffect` yang init state (line 183-232)
- Pastikan CUMA ada 1 save handler (line 369-461)

---

## 📝 SUMMARY

### ✅ YANG SUDAH BENAR:
1. **Unified State:** 1 state `storeTabData` untuk semua data
2. **Backend Complete:** `/auth/status` return semua fields lengkap
3. **Form Complete:** Semua fields dari backend ada di form UI
4. **Type Safe:** TypeScript interfaces semua match

### 🎯 STRUKTUR FILE PENTING:
```
Frontend:
  /client/src/app/(dashboard)/dashboard/settings/page.tsx  ← Main file!
  /client/src/stores/auth-store.ts                         ← Global auth state
  /client/src/types/tenant.ts                              ← Type definitions
  /client/src/components/auth/auth-guard.tsx               ← Auth checker

Backend:
  /server/src/auth/auth.service.ts                         ← verifyToken() method
  /server/src/auth/auth.controller.ts                      ← /auth/status endpoint
  /server/prisma/schema.prisma                             ← Database schema
```

### 🔄 DATA FLOW:
```
Login → Cookie dibuat → AuthGuard load → /auth/status called →
verifyToken() → SELECT * tenant → Response with ALL fields →
authStore.setTenant() → Settings page init → storeTabData populated →
Form fields filled! ✅
```

### 🐛 DEBUG CHECKLIST:
1. ✅ Backend returning all fields? → Test with fetch() di console
2. ✅ Tenant in auth store? → Check `useAuthStore.getState().tenant`
3. ✅ storeTabData initialized? → Look for console.logs "🔥 Initializing..."
4. ✅ Form fields wired correctly? → Check `value={storeTabData.fieldName}`
5. ✅ Save working? → Check Network tab PATCH /tenants/me
---
VERIFIKASI VIA CLI TEST-API:
Fibidy@DESKTOP-44A8LMC MINGW64 /d/PRODUK-LPPM-FINAL/UMKM-MULTI-TENANT/app/server (main)
$ ./test-api.sh
================================
🍪 TESTING API TENANT (COOKIES)
================================

📍 Step 1: LOGIN
POST http://localhost:8000/api/auth/login

Response:
{
  "message": "Login berhasil",        
  "tenant": {
    "id": "cmkl0w7k60000tzn8wmca87e1",
    "slug": "burgerchina",
    "name": "Test Store UPDATED",
    "category": "RESTORAN",
    "description": "Test Description UPDATED",
    "whatsapp": "6281234567890",
    "email": "burgerchina@fibidy.com",
    "phone": "+6281234567890",
    "address": "Test Address UPDATED",
    "logo": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&h=200&fit=crop&q=80",
    "banner": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=1200&h=400&fit=crop&q=80",
    "theme": {
      "primaryColor": "#f97316"
    },
    "landingConfig": {
      "cta": {
        "block": "cta1",
        "enabled": true
      },
      "hero": {
        "block": "hero1",
        "enabled": true
      },
      "about": {
        "block": "about1",
        "enabled": true
      },
      "contact": {
        "block": "contact1",
        "enabled": true
      },
      "products": {
        "block": "products1",
        "config": {
          "limit": 8,
          "displayMode": "featured",
          "showViewAll": true
        },
        "enabled": true
      },
      "template": "modern-starter",
      "testimonials": {
        "block": "testimonials1",
        "enabled": true
      }
    },
    "metaTitle": "Burger China - Burger Premium Asia Fusion",
    "metaDescription": "Nikmati burger premium dengan cita rasa Asia fusion. Bahan berkualitas, rasa juara! Pesan sekarang via WhatsApp.",
    "socialLinks": {
      "tiktok": "https://tiktok.com/@burgerchina",
      "facebook": "https://facebook.com/burgerchina",
      "instagram": "https://instagram.com/burgerchina"
    },
    "currency": "IDR",
    "taxRate": 0,
    "paymentMethods": null,
    "freeShippingThreshold": null,
    "defaultShippingCost": 0,
    "shippingMethods": null,
    "heroTitle": "Burger Premium dengan Cita Rasa Asia Fusion",
    "heroSubtitle": "Rasakan sensasi burger berkualitas dengan bumbu rahasia khas Asia. Dibuat fresh setiap hari dengan bahan-bahan pilihan.",
    "heroCtaText": "Pesan Sekarang",
    "heroCtaLink": "/products",
    "heroBackgroundImage": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=1200&h=400&fit=crop&q=80",
    "aboutTitle": "Kenapa Burger China?",
    "aboutSubtitle": "Kami percaya bahwa burger bukan sekadar makanan cepat saji",
    "aboutContent": "Didirikan sejak 2019, Burger China hadir dengan konsep unik: memadukan kelezatan burger Amerika dengan sentuhan bumbu Asia. Setiap burger dibuat dengan daging sapi pilihan, roti homemade yang dipanggang sempurna, dan saus rahasia yang bikin ketagihan.\n\nKami menggunakan 100% daging segar tanpa pengawet, sayuran organik dari petani lokal, dan keju premium impor. Semua demi satu tujuan: memberikan pengalaman burger terbaik untuk Anda.",
    "aboutImage": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&h=200&fit=crop&q=80",
    "aboutFeatures": [
      {
        "icon": "beef",
        "title": "Daging Premium",
        "description": "100% daging sapi pilihan tanpa campuran"
      },
      {
        "icon": "leaf",
        "title": "Bahan Segar",
        "description": "Sayuran organik dari petani lokal"
      },
      {
        "icon": "flame",
        "title": "Fresh Grilled",
        "description": "Dipanggang fresh saat order"
      },
      {
        "icon": "award",
        "title": "Resep Rahasia",
        "description": "Bumbu Asia fusion yang unik"
      }
    ],
    "testimonialsTitle": "Kata Mereka",
    "testimonialsSubtitle": "Apa kata pelanggan tentang Burger China",
    "testimonials": [
      {
        "id": "t1",
        "name": "Budi Santoso",
        "role": "Food Blogger",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
        "rating": 5,
        "content": "Ini burger terenak yang pernah saya coba di Jakarta! Pattynya juicy, sausnya unik banget. Wajib coba Double Dragon Burger!"
      },
      {
        "id": "t2",
        "name": "Siti Rahayu",
        "role": "Office Worker",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
        "rating": 5,
        "content": "Langganan order buat makan siang kantor. Delivery cepat, burger masih hangat, dan harganya worth it banget!"
      },
      {
        "id": "t3",
        "name": "Ahmad Rizki",
        "role": "Mahasiswa",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80",
        "rating": 5,
        "content": "Porsinya gede, rasanya mantap, harga mahasiswa friendly. Spicy Dragon jadi favorit saya!"
      },
      {
        "id": "t4",
        "name": "Linda Chen",
        "role": "Ibu Rumah Tangga",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80",
        "rating": 5,
        "content": "Anak-anak suka banget sama Chicken Teriyaki Burger-nya. Nggak terlalu pedas, cocok untuk keluarga."
      }
    ],
    "contactTitle": "TEST CONTACT TITLE UPDATED",
    "contactSubtitle": "TEST CONTACT SUBTITLE UPDATED",
    "contactMapUrl": "",
    "contactShowMap": false,
    "contactShowForm": false,
    "ctaTitle": "TEST CTA TITLE UPDATED",
    "ctaSubtitle": "TEST CTA SUBTITLE UPDATED",
    "ctaButtonText": "Order via WhatsApp",
    "ctaButtonLink": "https://wa.me/6281234567890",
    "ctaButtonStyle": "primary",
    "status": "ACTIVE",
    "createdAt": "2026-01-19T10:29:09.317Z",
    "updatedAt": "2026-01-19T10:46:45.979Z"
  }
}

✅ Cookies tersimpan di: /tmp/fibidy_cookies.txt
# Netscape HTTP Cookie File
# https://curl.se/docs/http-cookies.html
# This file was generated by libcurl! Edit at your own risk.

#HttpOnly_localhost     FALSE   /       FALSE   1769431554      fibidy_auth     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWtsMHc3azYwMDAwdHpuOHdtY2E4N2UxIiwiZW1haWwiOiJidXJnZXJjaGluYUBmaWJpZHkuY29tIiwic2x1ZyI6ImJ1cmdlcmNoaW5hIiwiaWF0IjoxNzY4ODI2NzU0LCJleHAiOjE3Njk0MzE1NTR9.XlglgqXjFqzs1DdSEZ4ZxuJIv7wrEQ3idaqWqDT-Oac

📍 Step 2: GET CURRENT TENANT
GET http://localhost:8000/api/tenants/me

Response:
{
  "id": "cmkl0w7k60000tzn8wmca87e1",
  "slug": "burgerchina",
  "name": "Test Store UPDATED",
  "email": "burgerchina@fibidy.com",
  "category": "RESTORAN",
  "description": "Test Description UPDATED",
  "whatsapp": "6281234567890",
  "phone": "+6281234567890",
  "address": "Test Address UPDATED",
  "logo": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&h=200&fit=crop&q=80",
  "banner": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=1200&h=400&fit=crop&q=80",
  "theme": {
    "primaryColor": "#f97316"
  },
  "landingConfig": {
    "cta": {
      "block": "cta1",
      "enabled": true
    },
    "hero": {
      "block": "hero1",
      "enabled": true
    },
    "about": {
      "block": "about1",
      "enabled": true
    },
    "contact": {
      "block": "contact1",
      "enabled": true
    },
    "products": {
      "block": "products1",
      "config": {
        "limit": 8,
        "displayMode": "featured",
        "showViewAll": true
      },
      "enabled": true
    },
    "template": "modern-starter",
    "testimonials": {
      "block": "testimonials1",
      "enabled": true
    }
  },
  "metaTitle": "Burger China - Burger Premium Asia Fusion",
  "metaDescription": "Nikmati burger premium dengan cita rasa Asia fusion. Bahan berkualitas, rasa juara! Pesan sekarang via WhatsApp.",
  "socialLinks": {
    "tiktok": "https://tiktok.com/@burgerchina",
    "facebook": "https://facebook.com/burgerchina",
    "instagram": "https://instagram.com/burgerchina"
  },
  "currency": "IDR",
  "taxRate": 0,
  "paymentMethods": null,
  "freeShippingThreshold": null,
  "defaultShippingCost": 0,
  "shippingMethods": null,
  "heroTitle": "Burger Premium dengan Cita Rasa Asia Fusion",
  "heroSubtitle": "Rasakan sensasi burger berkualitas dengan bumbu rahasia khas Asia. Dibuat fresh setiap hari dengan bahan-bahan pilihan.",
  "heroCtaText": "Pesan Sekarang",
  "heroCtaLink": "/products",
  "heroBackgroundImage": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=1200&h=400&fit=crop&q=80",
  "aboutTitle": "Kenapa Burger China?",
  "aboutSubtitle": "Kami percaya bahwa burger bukan sekadar makanan cepat saji",
  "aboutContent": "Didirikan sejak 2019, Burger China hadir dengan konsep unik: memadukan kelezatan burger Amerika dengan sentuhan bumbu Asia. Setiap burger dibuat dengan daging sapi pilihan, roti homemade yang dipanggang sempurna, dan saus rahasia yang bikin ketagihan.\n\nKami menggunakan 100% daging segar tanpa pengawet, sayuran organik dari petani lokal, dan keju premium impor. Semua 
demi satu tujuan: memberikan pengalaman burger terbaik untuk Anda.",
  "aboutImage": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&h=200&fit=crop&q=80",
  "aboutFeatures": [
    {
      "icon": "beef",
      "title": "Daging Premium",
      "description": "100% daging sapi pilihan tanpa campuran"
    },
    {
      "icon": "leaf",
      "title": "Bahan Segar",
      "description": "Sayuran organik dari petani lokal"
    },
    {
      "icon": "flame",
      "title": "Fresh Grilled",
      "description": "Dipanggang fresh saat order"
    },
    {
      "icon": "award",
      "title": "Resep Rahasia",
      "description": "Bumbu Asia fusion yang unik"
    }
  ],
  "testimonialsTitle": "Kata Mereka",
  "testimonialsSubtitle": "Apa kata pelanggan tentang Burger China",
  "testimonials": [
    {
      "id": "t1",
      "name": "Budi Santoso",
      "role": "Food Blogger",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
      "rating": 5,
      "content": "Ini burger terenak yang pernah saya coba di Jakarta! Pattynya juicy, sausnya unik banget. Wajib coba Double Dragon Burger!"
    },
    {
      "id": "t2",
      "name": "Siti Rahayu",
      "role": "Office Worker",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
      "rating": 5,
      "content": "Langganan order buat makan siang kantor. Delivery cepat, burger masih hangat, dan harganya worth it banget!"
    },
    {
      "id": "t3",
      "name": "Ahmad Rizki",
      "role": "Mahasiswa",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80",
      "rating": 5,
      "content": "Porsinya gede, rasanya mantap, harga mahasiswa friendly. Spicy Dragon jadi favorit saya!"
    },
    {
      "id": "t4",
      "name": "Linda Chen",
      "role": "Ibu Rumah Tangga",
      "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80",
      "rating": 5,
      "content": "Anak-anak suka banget sama Chicken Teriyaki Burger-nya. Nggak terlalu pedas, cocok untuk keluarga."
    }
  ],
  "contactTitle": "TEST CONTACT TITLE UPDATED",
  "contactSubtitle": "TEST CONTACT SUBTITLE UPDATED",
  "contactMapUrl": "",
  "contactShowMap": false,
  "contactShowForm": false,
  "ctaTitle": "TEST CTA TITLE UPDATED",
  "ctaSubtitle": "TEST CTA SUBTITLE UPDATED",
  "ctaButtonText": "Order via WhatsApp",
  "ctaButtonLink": "https://wa.me/6281234567890",
  "ctaButtonStyle": "primary",
  "status": "ACTIVE",
  "createdAt": "2026-01-19T10:29:09.317Z",
  "updatedAt": "2026-01-19T10:46:45.979Z",
  "_count": {
    "products": 20,
    "customers": 3,
    "orders": 5
  }
}

📍 Step 3: UPDATE TENANT (PATCH)
PATCH http://localhost:8000/api/tenants/me

Response:
{
  "message": "Profil berhasil diupdate",
  "tenant": {
    "id": "cmkl0w7k60000tzn8wmca87e1",
    "slug": "burgerchina",
    "name": "Test Store UPDATED",
    "email": "burgerchina@fibidy.com",
    "category": "RESTORAN",
    "description": "Test Description UPDATED",
    "whatsapp": "6281234567890",
    "phone": "+6281234567890",
    "address": "Test Address UPDATED",
    "logo": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&h=200&fit=crop&q=80",
    "banner": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=1200&h=400&fit=crop&q=80",
    "theme": {
      "primaryColor": "#f97316"
    },
    "landingConfig": {
      "cta": {
        "block": "cta1",
        "enabled": true
      },
      "hero": {
        "block": "hero1",
        "enabled": true
      },
      "about": {
        "block": "about1",
        "enabled": true
      },
      "contact": {
        "block": "contact1",
        "enabled": true
      },
      "products": {
        "block": "products1",
        "config": {
          "limit": 8,
          "displayMode": "featured",
          "showViewAll": true
        },
        "enabled": true
      },
      "template": "modern-starter",
      "testimonials": {
        "block": "testimonials1",
        "enabled": true
      }
    },
    "metaTitle": "Burger China - Burger Premium Asia Fusion",
    "metaDescription": "Nikmati burger premium dengan cita rasa Asia fusion. Bahan berkualitas, rasa juara! Pesan sekarang via WhatsApp.",
    "socialLinks": {
      "tiktok": "https://tiktok.com/@burgerchina",
      "facebook": "https://facebook.com/burgerchina",
      "instagram": "https://instagram.com/burgerchina"
    },
    "currency": "IDR",
    "taxRate": 0,
    "paymentMethods": null,
    "freeShippingThreshold": null,
    "defaultShippingCost": 0,
    "shippingMethods": null,
    "heroTitle": "Burger Premium dengan Cita Rasa Asia Fusion",
    "heroSubtitle": "Rasakan sensasi burger berkualitas dengan bumbu rahasia khas Asia. Dibuat fresh setiap hari dengan bahan-bahan pilihan.",
    "heroCtaText": "Pesan Sekarang",
    "heroCtaLink": "/products",
    "heroBackgroundImage": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=1200&h=400&fit=crop&q=80",
    "aboutTitle": "Kenapa Burger China?",
    "aboutSubtitle": "Kami percaya bahwa burger bukan sekadar makanan cepat saji",
    "aboutContent": "Didirikan sejak 2019, Burger China hadir dengan konsep unik: memadukan kelezatan burger Amerika dengan sentuhan bumbu Asia. Setiap burger dibuat dengan daging sapi pilihan, roti homemade yang dipanggang sempurna, dan saus rahasia yang bikin ketagihan.\n\nKami menggunakan 100% daging segar tanpa pengawet, sayuran organik dari petani lokal, dan keju premium impor. Semua demi satu tujuan: memberikan pengalaman burger terbaik untuk Anda.",
    "aboutImage": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&h=200&fit=crop&q=80",
    "aboutFeatures": [
      {
        "icon": "beef",
        "title": "Daging Premium",
        "description": "100% daging sapi pilihan tanpa campuran"
      },
      {
        "icon": "leaf",
        "title": "Bahan Segar",
        "description": "Sayuran organik dari petani lokal"
      },
      {
        "icon": "flame",
        "title": "Fresh Grilled",
        "description": "Dipanggang fresh saat order"
      },
      {
        "icon": "award",
        "title": "Resep Rahasia",
        "description": "Bumbu Asia fusion yang unik"
      }
    ],
    "testimonialsTitle": "Kata Mereka",
    "testimonialsSubtitle": "Apa kata pelanggan tentang Burger China",
    "testimonials": [
      {
        "id": "t1",
        "name": "Budi Santoso",
        "role": "Food Blogger",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
        "rating": 5,
        "content": "Ini burger terenak yang pernah saya coba di Jakarta! Pattynya juicy, sausnya unik banget. Wajib coba Double Dragon Burger!"
      },
      {
        "id": "t2",
        "name": "Siti Rahayu",
        "role": "Office Worker",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
        "rating": 5,
        "content": "Langganan order buat makan siang kantor. Delivery cepat, burger masih hangat, dan harganya worth it banget!"
      },
      {
        "id": "t3",
        "name": "Ahmad Rizki",
        "role": "Mahasiswa",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80",
        "rating": 5,
        "content": "Porsinya gede, rasanya mantap, harga mahasiswa friendly. Spicy Dragon jadi favorit saya!"
      },
      {
        "id": "t4",
        "name": "Linda Chen",
        "role": "Ibu Rumah Tangga",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80",
        "rating": 5,
        "content": "Anak-anak suka banget sama Chicken Teriyaki Burger-nya. Nggak terlalu pedas, cocok untuk keluarga."
      }
    ],
    "contactTitle": "TEST CONTACT TITLE UPDATED",
    "contactSubtitle": "TEST CONTACT SUBTITLE UPDATED",
    "contactMapUrl": "",
    "contactShowMap": false,
    "contactShowForm": false,
    "ctaTitle": "TEST CTA TITLE UPDATED",
    "ctaSubtitle": "TEST CTA SUBTITLE UPDATED",
    "ctaButtonText": "Order via WhatsApp",
    "ctaButtonLink": "https://wa.me/6281234567890",
    "ctaButtonStyle": "primary",
    "status": "ACTIVE",
    "updatedAt": "2026-01-19T12:45:56.976Z"
  }
}

📍 Step 4: VERIFY UPDATE
GET http://localhost:8000/api/tenants/me

Response (Fields yang diupdate):
{
  "name": "Test Store UPDATED",
  "description": "Test Description UPDATED",
  "phone": "+6281234567890",
  "address": "Test Address UPDATED",
  "contactTitle": "TEST CONTACT TITLE UPDATED",
  "contactSubtitle": "TEST CONTACT SUBTITLE UPDATED",
  "ctaTitle": "TEST CTA TITLE UPDATED",
  "ctaSubtitle": "TEST CTA SUBTITLE UPDATED"
}

================================
✅ TEST SELESAI
================================

Fibidy@DESKTOP-44A8LMC MINGW64 /d/PRODUK-LPPM-FINAL/UMKM-MULTI-TENANT/app/server (main)
$
---

**Dibuat:** 2026-01-19
**Terakhir Update:** Setelah fix unified state & complete form fields
**Status:** ✅ WORKING - No more race conditions!

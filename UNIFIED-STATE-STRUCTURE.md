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

**Dibuat:** 2026-01-19
**Terakhir Update:** Setelah fix unified state & complete form fields
**Status:** ✅ WORKING - No more race conditions!

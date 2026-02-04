# Contact Section Settings - Dokumentasi

## 📍 Lokasi File
**Path**: `app/client/src/app/settings/contact/page.tsx`

**Dual Access**:
1. **Standalone Route**: `/settings/contact` (dengan tombol Kembali)
2. **Tab di Toko**: `/settings/toko` → Tab "Contact" (dengan Drawer preview)

---

## 🎯 Tujuan Halaman

Halaman ini untuk mengatur **section kontak** pada landing page, termasuk informasi kontak toko (telepon, WhatsApp, email, alamat), Google Maps, dan form kontak. Ini adalah cara pelanggan untuk menghubungi dan menemukan toko Anda.

---

## 📋 Form Fields

### Tabel Field Details

| # | Field | Tipe Input | Required | Default | Keterangan |
|---|-------|-----------|----------|---------|------------|
| 1 | **Judul Section** | `Input` (text) | ❌ Tidak | "Hubungi Kami" | Heading utama section Contact |
| 2 | **Subtitle Section** | `Input` (text) | ❌ Tidak | - | Sub-heading di bawah judul<br/>Contoh: "Kami Siap Melayani Anda" |
| 3 | **Nomor Telepon** | `Input` (text) | ❌ Tidak | - | Format: +62 812-3456-7890<br/>💡 Bisa klik untuk telepon langsung di mobile |
| 4 | **WhatsApp** | `Input` (text) | ✅ Ya | - | Format tanpa +: 6281234567890<br/>💡 Link langsung ke WhatsApp chat |
| 5 | **Email** | `Input` (disabled) | 🔒 Readonly | Email tenant | Email tenant dari registrasi<br/>Tidak bisa diubah |
| 6 | **Domain Toko** | `Input` (disabled) | 🔒 Readonly | `{slug}.fibidy.com` | Otomatis dari slug tenant<br/>Tidak bisa diubah |
| 7 | **Alamat Lengkap** | `Textarea` (2 rows) | ❌ Tidak | - | Alamat fisik toko<br/>💡 Bisa klik untuk buka di Google Maps |
| 8 | **URL Google Maps Embed** | `Input` (text) | ❌ Tidak | - | URL iframe embed dari Google Maps<br/>Cara dapat: Share → Embed a map |
| 9 | **Tampilkan Peta** | `Switch` toggle | ❌ Tidak | `false` | Show/hide Google Maps di landing page |
| 10 | **Tampilkan Form** | `Switch` toggle | ❌ Tidak | `true` | Show/hide form kontak di landing page |

---

## 🔌 API Integration

### Request Body (Contoh)

```json
{
  "contactTitle": "Hubungi Kami",
  "contactSubtitle": "Kami Siap Membantu Anda 24/7",
  "phone": "+62 812-3456-7890",
  "whatsapp": "6281234567890",
  "address": "Jl. Merdeka No. 123, Kelurahan Menteng, Kecamatan Menteng, Jakarta Pusat 10310, DKI Jakarta",
  "contactMapUrl": "https://www.google.com/maps/embed?pb=!1m18...",
  "contactShowMap": true,
  "contactShowForm": true
}
```

### API Endpoint

```
PATCH /api/tenants/{tenantId}
```

### Fields Mapping

| Form Field | API Field Path | Tipe Data |
|-----------|----------------|-----------|
| Judul Section | `contactTitle` | string |
| Subtitle Section | `contactSubtitle` | string |
| Nomor Telepon | `phone` | string |
| WhatsApp | `whatsapp` | string |
| Email | `email` (readonly) | string |
| Domain Toko | Auto-generated | string |
| Alamat Lengkap | `address` | string (long text) |
| URL Google Maps Embed | `contactMapUrl` | string (URL) |
| Tampilkan Peta | `contactShowMap` | boolean |
| Tampilkan Form | `contactShowForm` | boolean |

---

## 🎨 Preview Component

**Component**: `Contact1`

**Lokasi Preview**:
- **Standalone page**: Live preview di bawah form
- **Tab di Toko**: Drawer preview (slide-out panel)

**Preview menampilkan**:
- Title & subtitle
- Contact info cards:
  - 📞 Phone (clickable tel: link)
  - 💬 WhatsApp (clickable wa.me link)
  - ✉️ Email (clickable mailto: link)
  - 📍 Address (clickable Google Maps link)
- Google Maps iframe (jika enabled)
- Contact form (jika enabled):
  - Nama
  - Email
  - Subject
  - Pesan
  - Tombol "Kirim Pesan"

---

## 🔄 Alur Data

```
1. User mengisi contact info
   ↓
2. useState untuk semua fields
   ↓
3. Toggle untuk showMap & showForm
   ↓
4. User paste Google Maps Embed URL
   ↓
5. User klik "Simpan"
   ↓
6. Validasi (WhatsApp wajib, format phone/email valid)
   ↓
7. tenantsApi.update(tenantId, contactData)
   ↓
8. Backend menyimpan ke database
   ↓
9. useTenant().refresh()
   ↓
10. Toast notification
   ↓
11. Preview ter-update dengan contact info baru
```

---

## ✅ Validasi

### Client-Side Validation

```javascript
// WhatsApp wajib diisi
if (!whatsapp || whatsapp.trim() === '') {
  toast.error('Nomor WhatsApp wajib diisi');
  return;
}

// Validasi format WhatsApp (harus dimulai dengan 62)
if (!whatsapp.startsWith('62')) {
  toast.error('Format WhatsApp: 6281234567890 (tanpa tanda +)');
  return;
}

// Validasi hanya angka
if (!/^\d+$/.test(whatsapp)) {
  toast.error('WhatsApp hanya boleh berisi angka');
  return;
}

// Validasi panjang (minimal 10 digit setelah 62)
if (whatsapp.length < 12 || whatsapp.length > 15) {
  toast.error('Panjang nomor WhatsApp tidak valid');
  return;
}

// Validasi format telepon (opsional)
if (phone && !/^[+\d\s\-()]+$/.test(phone)) {
  toast.error('Format nomor telepon tidak valid');
  return;
}

// Validasi Google Maps URL (opsional)
if (contactMapUrl && !contactMapUrl.includes('google.com/maps/embed')) {
  toast.error('URL harus dari Google Maps Embed (Share → Embed a map)');
  return;
}
```

### Business Rules

1. **WhatsApp**: Wajib diisi, format 62XXXXXXXXXX (tanpa + dan spasi)
2. **Phone**: Opsional, format bebas dengan + - () spasi
3. **Email**: Readonly, tidak bisa diubah (dari registrasi)
4. **Domain**: Auto-generated dari slug, tidak bisa diubah
5. **Google Maps URL**: Harus dari embed URL, bukan regular Maps URL
6. **Show Map**: Default false (untuk privacy)
7. **Show Form**: Default true (untuk lead generation)

---

## 💡 Best Practices

### Phone Number Formatting

**Format Rekomendasi**:
```
✅ BAIK:
+62 812-3456-7890  (dengan country code dan separator)
+62 21 5555-1234   (telp kantor dengan area code)
(021) 5555-1234    (format lokal Jakarta)

❌ HINDARI:
081234567890       (tanpa country code untuk bisnis)
+62-812-345-678-90 (separator berlebihan)
```

**Clickable Phone Links**:
```html
<!-- Di frontend, render sebagai: -->
<a href="tel:+6281234567890">+62 812-3456-7890</a>

<!-- Saat diklik di mobile, langsung buka dialer -->
```

### WhatsApp Best Practices

**Format Nomor**:
```
Stored in DB: 6281234567890 (tanpa +)
Link format:  https://wa.me/6281234567890
              https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20bertanya

✅ BAIK:
- 6281234567890 (Indonesia mobile)
- 6287654321098 (Indonesia mobile)

❌ SALAH:
- +6281234567890 (ada tanda +)
- 62 812 3456 7890 (ada spasi)
- 081234567890 (tanpa country code 62)
```

**Pre-filled Message** (Future Enhancement):
```javascript
const whatsappLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
  'Halo, saya tertarik dengan produk Anda. Bisa dibantu?'
)}`;
```

### Address Guidelines

**Format Lengkap**:
```
[Nama Jalan & Nomor]
[Kelurahan], [Kecamatan]
[Kota] [Kode Pos]
[Provinsi]

Contoh:
Jl. Sudirman No. 45
Kelurahan Karet Tengsin, Kecamatan Tanah Abang
Jakarta Pusat 10250
DKI Jakarta
```

**Clickable Address** (akan dibuat link ke Google Maps):
```
https://www.google.com/maps/search/?api=1&query=Jl.+Sudirman+No.+45+Jakarta
```

---

## 🗺️ Google Maps Integration

### Cara Mendapatkan Embed URL

**Langkah-langkah**:

1. Buka [Google Maps](https://www.google.com/maps)
2. Cari lokasi toko Anda
3. Klik **Share** button
4. Pilih tab **Embed a map**
5. Copy **HTML code** yang muncul
6. Extract URL dari `src="..."` dalam iframe

**Contoh HTML dari Google**:
```html
<iframe 
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966..." 
  width="600" 
  height="450" 
  style="border:0;" 
  allowfullscreen="" 
  loading="lazy">
</iframe>
```

**Yang perlu di-copy**: 
```
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966...
```

### Map Display Options

| Option | Use Case | Privacy Level |
|--------|----------|---------------|
| **Show Map + Show Form** | Toko fisik dengan kantor/outlet | Low (alamat terlihat jelas) |
| **Show Map Only** | Toko dengan lokasi publik tapi tidak menerima kunjungan langsung | Medium |
| **Show Form Only** | Toko online tanpa outlet fisik | High (alamat tidak ditampilkan) |
| **Hide Both** | Contact via social media only | Highest |

**Rekomendasi**:
- **Retail/F&B**: Show Map + Show Form
- **Home-based business**: Show Form only (hide map untuk privacy)
- **Service business**: Show Form only
- **Wholesale/B2B**: Show Map only (appointment required)

---

## 📧 Contact Form Integration

### Form Fields (Frontend)

```javascript
const contactFormFields = [
  {
    name: 'name',
    label: 'Nama Lengkap',
    type: 'text',
    required: true,
    placeholder: 'John Doe'
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'john@example.com'
  },
  {
    name: 'subject',
    label: 'Subjek',
    type: 'text',
    required: false,
    placeholder: 'Pertanyaan tentang produk'
  },
  {
    name: 'message',
    label: 'Pesan',
    type: 'textarea',
    required: true,
    rows: 4,
    placeholder: 'Tulis pesan Anda di sini...'
  }
];
```

### Form Submission Flow

```
User mengisi form
  ↓
Frontend validation
  ↓
POST /api/contact-messages
  ↓
Backend:
  - Save to database
  - Send email notification to tenant.email
  - Send auto-reply to customer email
  ↓
Success response
  ↓
Toast notification: "Pesan berhasil dikirim!"
  ↓
Clear form
```

**Email Template** (yang diterima oleh tenant):
```
Subject: [Toko XYZ] Pesan Baru dari {nama}

Nama: {nama}
Email: {email}
Subjek: {subjek}

Pesan:
{message}

---
Dikirim dari: {namatoko}.fibidy.com
Waktu: {timestamp}
```

---

## 🔧 Troubleshooting

### Masalah Umum

**1. Google Maps tidak muncul**
```
Cek:
- Apakah URL embed benar? (harus dari google.com/maps/embed)
- Apakah toggle "Tampilkan Peta" sudah ON?
- Apakah browser memblokir iframe? (cek console errors)
- Apakah koneksi internet stabil?
```

**2. WhatsApp link tidak berfungsi**
```
Cek:
- Format: 6281234567890 (tanpa + dan spasi)
- Apakah WhatsApp terinstall di device?
- Di desktop, akan buka WhatsApp Web
```

**3. Phone number tidak clickable di mobile**
```
Frontend harus render sebagai:
<a href="tel:+6281234567890">Display Number</a>

Bukan plain text.
```

**4. Email readonly, tidak bisa diubah**
```
Email adalah identifier utama tenant, tidak bisa diubah.
Jika perlu ubah email:
1. Hubungi admin sistem
2. Atau buat tenant baru dengan email berbeda
```

**5. Contact form tidak terkirim**
```
Cek:
- Apakah API endpoint /api/contact-messages tersedia?
- Apakah email server configured? (SMTP settings)
- Cek network tab di browser developer tools
```

---

## 📱 Responsive Behavior

### Desktop (> 1024px)
- Contact info: 2x2 grid (Phone, WhatsApp, Email, Address)
- Google Maps: Full width, height 400px
- Contact form: 2 columns (Name & Email side by side)

### Tablet (768px - 1024px)
- Contact info: 2x2 grid tetap
- Google Maps: Full width, height 350px
- Contact form: 2 columns

### Mobile (< 768px)
- Contact info: Stack vertical, 1 column
- Google Maps: Full width, height 300px
- Contact form: 1 column (semua field full width)
- Phone & WhatsApp buttons lebih besar (thumb-friendly)

---

## 🎨 Design Variations

### Contact Info Card Styles

**Style 1: Icon + Text (Minimal)**
```
📞 +62 812-3456-7890
💬 WhatsApp
✉️ info@tokobungamawar.com
📍 Jakarta Pusat
```

**Style 2: Card with Background**
```
┌─────────────────────┐
│  📞                 │
│  Phone              │
│  +62 812-3456-7890  │
└─────────────────────┘
```

**Style 3: Horizontal List**
```
[📞 Phone] [💬 WhatsApp] [✉️ Email] [📍 Address]
```

---

## 🚀 Future Enhancements

Fitur yang bisa ditambahkan:

1. **Multiple Locations** support (multi-branch)
2. **Business Hours** display (Buka: Senin-Jumat 09:00-17:00)
3. **Live Chat Widget** integration (Tawk.to, Crisp)
4. **Social Media Buttons** di contact section
5. **QR Code** untuk WhatsApp quick scan
6. **Callback Request Form** (untuk high-intent customers)
7. **FAQ Section** terintegrasi dengan contact
8. **Contact Form with File Upload** (untuk custom orders)
9. **Auto-reply Messages** customizable
10. **Zendesk/Intercom Integration** untuk enterprise

---

## 📝 Catatan Penting

⚠️ **Privacy Concern**: 
- Jika bisnis Anda home-based, pertimbangkan untuk **tidak menampilkan peta** (toggle OFF)
- Gunakan P.O. Box atau alamat kantor virtual jika perlu

⚠️ **WhatsApp Business vs Personal**:
- Gunakan **WhatsApp Business** untuk fitur auto-reply, greeting message, dll
- Nomor WhatsApp bisa sama dengan nomor telepon (tapi tidak harus)

✅ **Response Time Matters**:
- Set expectation di subtitle: "Kami balas dalam 1x24 jam"
- Atau gunakan auto-reply: "Terima kasih! Tim kami akan segera menghubungi Anda."

💡 **Multi-Channel Strategy**:
- Sediakan **minimal 2 channel** kontak (WhatsApp + Form, atau WhatsApp + Phone)
- Beberapa customer prefer form (lebih formal), beberapa prefer instant messaging

---

## 🔐 Security & Spam Prevention

### Contact Form Security

**1. Rate Limiting**
```javascript
// Backend: Limit 5 submissions per IP per hour
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests
  message: 'Terlalu banyak pesan dari IP ini, coba lagi nanti.'
});

app.post('/api/contact-messages', contactLimiter, ...);
```

**2. CAPTCHA** (Recommended)
```
Implementasi Google reCAPTCHA v3 untuk prevent spam bots
```

**3. Email Validation**
```javascript
// Disposable email detection
const disposableEmailDomains = ['tempmail.com', '10minutemail.com'];
if (disposableEmailDomains.includes(emailDomain)) {
  throw new Error('Please use a valid email address');
}
```

**4. Honeypot Field**
```html
<!-- Hidden field untuk trap bots -->
<input type="text" name="website" style="display:none" tabindex="-1">

// Backend: Reject jika field ini terisi
if (req.body.website) {
  return res.status(400).json({ error: 'Spam detected' });
}
```

---

## 📊 Analytics & Tracking

### Metrics to Track

1. **Form Submission Rate**
   - Views vs submissions
   - Completion time
   - Drop-off fields

2. **Contact Method Preferences**
   - WhatsApp clicks vs Phone calls vs Form submissions
   - Time of day patterns

3. **Response Time**
   - Time from submission to first reply
   - Average resolution time

4. **Conversion Rate**
   - Contact → Quote → Sale funnel

**Implementation**:
```javascript
// Track dengan Google Analytics atau Mixpanel
gtag('event', 'contact_form_submit', {
  'event_category': 'engagement',
  'event_label': 'contact_page'
});

gtag('event', 'whatsapp_click', {
  'event_category': 'engagement',
  'event_label': 'contact_page'
});
```

---

## 📋 Checklist Before Go-Live

Sebelum aktivasi contact section:

- [ ] WhatsApp number sudah benar dan terinstall WhatsApp (Business)
- [ ] Email notifications working (test kirim pesan via form)
- [ ] Google Maps menampilkan lokasi yang tepat
- [ ] Alamat lengkap dan akurat
- [ ] Phone number clickable di mobile
- [ ] Auto-reply message sudah di-setup (jika ada)
- [ ] Privacy policy updated (mention data collection from contact form)
- [ ] Contact info konsisten di semua channel (website, social media, Google My Business)

---

*Dokumentasi dibuat: Februari 2025*  
*Versi: 1.0*

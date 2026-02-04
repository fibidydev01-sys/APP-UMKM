# 🤖 AI CONTENT GENERATOR - Implementation Guide

> Solusi untuk mengatasi "Writer's Block" - Pain Point #1 user UMKM saat mengisi content landing page.

---

## 🎯 Problem Statement

**User Pain Points**:
```
❌ "Saya ga bisa nulis, bingung harus nulis apa"
❌ "Kelamaan mikir, udah 30 menit masih kosong"
❌ "Bahasa saya ga bagus, takut keliatan unprofessional"
❌ "Ga tahu struktur yang bagus kayak gimana"
```

**Current State**:
- 40% user leave About section empty
- 60% user isi cuma 1-2 kalimat (not compelling)
- Average time stuck: 20-30 minutes per section
- Many give up and abandon setup

**Desired State**:
- 90%+ user fill About section with quality content
- Average time: 2-3 minutes per section
- Content quality: Professional & persuasive
- User confidence: High

---

## 🏗️ Architecture

### Option 1: OpenAI API (Recommended) ⭐⭐⭐

**Pros**:
- Best quality output
- Supports Indonesian language well
- Flexible prompting
- Fast response time (2-5 seconds)

**Cons**:
- Cost per generation: ~$0.002-0.01 (Rp 30-150)
- Need API key management
- External dependency

**Cost Analysis**:
```
Assumptions:
- 100 new tenants/month
- Each tenant generate 5 sections (Hero, About, Testimonials, CTA, Meta Description)
- Cost per generation: $0.005 (average)

Monthly cost: 100 x 5 x $0.005 = $2.5 (Rp 38,000)
Yearly cost: $30 (Rp 456,000)

→ Very affordable for the value it provides!
```

---

### Option 2: Anthropic Claude API (Alternative)

**Pros**:
- Better at following instructions
- Good for structured output
- Strong reasoning

**Cons**:
- Similar cost to OpenAI
- Less common (more risk if API changes)

---

### Option 3: Self-Hosted Model (Advanced)

**Pros**:
- No per-generation cost
- Full control
- Data privacy

**Cons**:
- High initial setup cost
- Requires GPU server ($100-500/month)
- Need ML expertise to maintain
- Indonesian language quality may be lower

**Verdict**: Not worth it for UMKM scale. Use OpenAI.

---

## 🔧 Implementation

### Backend API Endpoint

```javascript
// /api/generate-content

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { 
      type, // 'about', 'hero', 'testimonial', 'cta', 'meta'
      businessName,
      businessType,
      products,
      targetCustomer,
      uniqueSellingPoint,
      yearFounded,
      location
    } = await req.json();
    
    // Rate limiting per tenant (max 10 generations/day)
    const tenantId = req.user.tenantId;
    const todayGenerations = await checkGenerationCount(tenantId);
    
    if (todayGenerations >= 10) {
      return Response.json(
        { error: 'Limit harian tercapai (10 generasi/hari)' },
        { status: 429 }
      );
    }
    
    // Get prompt based on type
    const prompt = getPrompt(type, {
      businessName,
      businessType,
      products,
      targetCustomer,
      uniqueSellingPoint,
      yearFounded,
      location
    });
    
    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // or gpt-3.5-turbo for cheaper
      messages: [
        {
          role: 'system',
          content: 'Anda adalah copywriter profesional untuk UMKM Indonesia. Tulis konten yang persuasif, natural, dan meyakinkan dalam Bahasa Indonesia.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7, // Balance between creativity and consistency
      max_tokens: 500,
    });
    
    const generatedContent = completion.choices[0].message.content;
    
    // Log usage for billing
    await logGeneration({
      tenantId,
      type,
      tokens: completion.usage.total_tokens,
      cost: calculateCost(completion.usage.total_tokens)
    });
    
    return Response.json({
      content: generatedContent,
      tokensUsed: completion.usage.total_tokens
    });
    
  } catch (error) {
    console.error('AI Generation Error:', error);
    return Response.json(
      { error: 'Gagal generate content. Coba lagi.' },
      { status: 500 }
    );
  }
}
```

---

### Prompt Templates

#### 1. About Section Prompt

```javascript
function getAboutPrompt(data) {
  return `
Tulis konten "Tentang Kami" untuk landing page bisnis berikut:

Nama Bisnis: ${data.businessName}
Jenis Bisnis: ${data.businessType}
Produk/Layanan: ${data.products}
Target Customer: ${data.targetCustomer}
Keunggulan Utama (USP): ${data.uniqueSellingPoint}
Tahun Berdiri: ${data.yearFounded}
Lokasi: ${data.location}

Requirements:
- Panjang: 150-250 kata
- Bahasa: Indonesia yang natural dan persuasif
- Struktur: 3 paragraf (Origin Story → What Makes You Different → Customer-Centric)
- Tone: Professional tapi friendly
- Include: Angka konkret jika memungkinkan (tahun berdiri, jumlah pelanggan, dll)
- Hindari: Kata-kata berlebihan, klaim tidak realistis

Output hanya konten, tanpa heading "Tentang Kami".
  `.trim();
}
```

**Example Output**:
```
Toko Bunga Mawar berdiri sejak 2015 dengan misi menghadirkan bunga-bunga 
segar berkualitas tinggi untuk setiap momen spesial Anda. Berawal dari 
hobi merangkai bunga, kami kini telah melayani ribuan pelanggan di Jakarta 
dan sekitarnya untuk berbagai acara seperti pernikahan, ulang tahun, dan 
corporate events.

Apa yang membedakan kami adalah komitmen terhadap kesegaran. Kami bekerja 
sama langsung dengan petani lokal dan melakukan restocking setiap pagi untuk 
memastikan bunga yang Anda terima selalu dalam kondisi prima. Dengan layanan 
same-day delivery dan tim florist berpengalaman, kami siap mewujudkan visi 
Anda menjadi rangkaian bunga yang indah.

Kepuasan pelanggan adalah prioritas utama kami. Lebih dari 5,000 pelanggan 
telah mempercayai kami untuk momen-momen penting mereka, dengan rating 4.8 
dari 5 berdasarkan 800+ ulasan. Mari bergabung dengan keluarga besar Toko 
Bunga Mawar dan rasakan pelayanan terbaik dari kami.
```

---

#### 2. Hero Title & Subtitle Prompt

```javascript
function getHeroPrompt(data) {
  return `
Generate marketing copy untuk Hero Section landing page:

Bisnis: ${data.businessName}
Jenis: ${data.businessType}
Produk: ${data.products}
USP: ${data.uniqueSellingPoint}
Target: ${data.targetCustomer}

Generate 2 items:
1. HERO TITLE (5-10 kata, eye-catching, action-oriented)
2. HERO SUBTITLE (10-15 kata, fokus benefit, include USP)

Format output:
TITLE: [judul di sini]
SUBTITLE: [subtitle di sini]

Contoh bagus:
TITLE: Dapatkan Bunga Segar Setiap Hari
SUBTITLE: Gratis ongkir Jakarta, rangkaian custom, pengiriman cepat 24 jam

Hindari: Kalimat terlalu panjang, kata-kata klise ("terbaik", "terpercaya"), 
keyword stuffing.
  `.trim();
}
```

**Example Output**:
```
TITLE: Wujudkan Momen Spesial dengan Bunga Segar
SUBTITLE: Same-day delivery Jakarta, garansi kesegaran 7 hari, konsultasi gratis
```

---

#### 3. CTA Prompt

```javascript
function getCtaPrompt(data) {
  return `
Generate Call-to-Action copy untuk landing page:

Bisnis: ${data.businessName}
Action Goal: ${data.goalAction || 'pembelian'} // e.g., "pembelian", "konsultasi", "daftar"

Generate 3 items:
1. CTA TITLE (5-8 kata, pertanyaan atau ajakan)
2. CTA SUBTITLE (10-15 kata, benefit atau urgency)
3. BUTTON TEXT (2-3 kata, action verb)

Format:
TITLE: [judul]
SUBTITLE: [subtitle]
BUTTON: [teks tombol]

Contoh:
TITLE: Siap Mempercantik Hari Anda?
SUBTITLE: Pesan sekarang dan nikmati gratis konsultasi florist profesional
BUTTON: Pesan Sekarang
  `.trim();
}
```

---

#### 4. Meta Description Prompt

```javascript
function getMetaDescriptionPrompt(data) {
  return `
Tulis Meta Description untuk SEO Google Search:

Bisnis: ${data.businessName}
Produk: ${data.products}
Lokasi: ${data.location}
USP: ${data.uniqueSellingPoint}

Requirements:
- Panjang: 140-160 karakter
- Include: Keyword utama, lokasi, USP, call-to-action
- Tone: Persuasif, actionable
- Format: [What you offer] + [USP/Benefit] + [CTA]

Contoh bagus (155 chars):
"Toko bunga online Jakarta dengan 1000+ rangkaian segar. Same-day delivery, 
gratis konsultasi. Harga mulai Rp 100rb. Pesan sekarang!"

Output hanya meta description, tanpa label.
  `.trim();
}
```

---

#### 5. Testimonial Generation (Advanced)

```javascript
function getTestimonialPrompt(data) {
  return `
Generate 3 testimonial realistis untuk bisnis:

Bisnis: ${data.businessName}
Produk: ${data.products}
Target: ${data.targetCustomer}

Setiap testimonial harus punya:
1. Nama (natural Indonesian name)
2. Role/Pekerjaan (sesuai target customer)
3. Testimoni (50-100 kata, struktur: Problem → Solution → Result)

Output format JSON:
[
  {
    "name": "...",
    "role": "...",
    "testimonial": "..."
  }
]

Pastikan testimonial terdengar natural dan spesifik (sebutkan detail konkret, 
bukan generic praise).
  `.trim();
}
```

---

### Frontend Implementation

#### Modal Component

```jsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export function AIGeneratorModal({ type, onGenerate, onClose }) {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    products: '',
    targetCustomer: '',
    uniqueSellingPoint: '',
    yearFounded: '',
    location: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  
  const handleGenerate = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...formData })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
      
      const data = await response.json();
      setGeneratedContent(data.content);
      
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUse = () => {
    onGenerate(generatedContent);
    onClose();
  };
  
  return (
    <Modal open onClose={onClose} maxWidth="lg">
      <ModalHeader>
        <h2>✨ Generate Content dengan AI</h2>
        <p className="text-sm text-gray-600">
          Ceritakan tentang bisnis Anda, AI akan buatkan content profesional
        </p>
      </ModalHeader>
      
      <ModalBody>
        {!generatedContent ? (
          // Input Form
          <div className="space-y-4">
            <Input
              label="Nama Bisnis"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Toko Bunga Mawar"
              required
            />
            
            <Input
              label="Jenis Bisnis"
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              placeholder="Toko bunga online"
              required
            />
            
            <Input
              label="Produk/Layanan Utama"
              value={formData.products}
              onChange={(e) => setFormData({ ...formData, products: e.target.value })}
              placeholder="Bunga segar untuk pernikahan, ulang tahun, corporate events"
              required
            />
            
            <Input
              label="Target Customer"
              value={formData.targetCustomer}
              onChange={(e) => setFormData({ ...formData, targetCustomer: e.target.value })}
              placeholder="B2C, usia 25-45, middle-upper class"
            />
            
            <Input
              label="Keunggulan Utama (USP)"
              value={formData.uniqueSellingPoint}
              onChange={(e) => setFormData({ ...formData, uniqueSellingPoint: e.target.value })}
              placeholder="Same-day delivery Jakarta, garansi kesegaran 7 hari"
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tahun Berdiri"
                type="number"
                value={formData.yearFounded}
                onChange={(e) => setFormData({ ...formData, yearFounded: e.target.value })}
                placeholder="2015"
              />
              
              <Input
                label="Lokasi"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Jakarta"
              />
            </div>
          </div>
        ) : (
          // Generated Content
          <div className="space-y-4">
            <Alert type="success">
              ✅ Content berhasil di-generate! Anda bisa edit langsung di bawah.
            </Alert>
            
            <Textarea
              label="Generated Content"
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              rows={12}
              helperText="Edit seperlunya sebelum menggunakan"
            />
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setGeneratedContent('')}
              >
                ← Generate Ulang
              </Button>
              
              <Button 
                variant="primary" 
                onClick={handleUse}
              >
                ✅ Gunakan Content Ini
              </Button>
            </div>
          </div>
        )}
      </ModalBody>
      
      <ModalFooter>
        {!generatedContent && (
          <>
            <Button variant="ghost" onClick={onClose}>
              Batal
            </Button>
            
            <Button 
              variant="primary" 
              onClick={handleGenerate}
              disabled={loading || !formData.businessName || !formData.businessType}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                '✨ Generate Content'
              )}
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}
```

---

#### Usage in Form

```jsx
'use client';

import { useState } from 'react';
import { AIGeneratorModal } from './ai-generator-modal';

export function AboutForm() {
  const [aboutContent, setAboutContent] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>Deskripsi Lengkap</Label>
        
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setShowAIModal(true)}
        >
          ✨ Generate dengan AI
        </Button>
      </div>
      
      <Textarea
        value={aboutContent}
        onChange={(e) => setAboutContent(e.target.value)}
        rows={6}
        placeholder="Ceritakan tentang bisnis Anda..."
      />
      
      {showAIModal && (
        <AIGeneratorModal
          type="about"
          onGenerate={(content) => setAboutContent(content)}
          onClose={() => setShowAIModal(false)}
        />
      )}
    </div>
  );
}
```

---

## 💰 Cost Management

### Rate Limiting Strategy

```javascript
// Per tenant limits
const LIMITS = {
  free: {
    generationsPerDay: 5,
    generationsPerMonth: 50
  },
  paid: {
    generationsPerDay: 20,
    generationsPerMonth: 200
  }
};

// Check before generation
async function checkLimit(tenantId, plan) {
  const today = await getGenerationCount(tenantId, 'today');
  const month = await getGenerationCount(tenantId, 'month');
  
  const limit = LIMITS[plan];
  
  if (today >= limit.generationsPerDay) {
    throw new Error('Limit harian tercapai. Coba lagi besok.');
  }
  
  if (month >= limit.generationsPerMonth) {
    throw new Error('Limit bulanan tercapai. Upgrade untuk lebih banyak generasi.');
  }
  
  return true;
}
```

---

### Caching Strategy

```javascript
// Cache generated content untuk reduce cost
const cacheKey = `ai_gen_${type}_${hash(formData)}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return cached; // Return cached result, no API call
}

// If not cached, generate and cache for 7 days
const result = await generateWithAI(formData);
await redis.setex(cacheKey, 7 * 24 * 60 * 60, result);

return result;
```

---

## 📊 Metrics to Track

### Key Metrics

```javascript
// Track these for optimization
const metrics = {
  // Usage
  totalGenerations: 1234,
  generationsPerTenant: 5.2,
  generationsPerDay: 45,
  
  // Quality
  contentAcceptanceRate: 0.85, // User kept generated content
  editRate: 0.40, // User edited before accepting
  regenerationRate: 0.15, // User hit "Generate Again"
  
  // Cost
  totalCost: 12.50, // USD
  costPerGeneration: 0.010, // USD
  costPerTenant: 0.052, // USD
  
  // Performance
  avgResponseTime: 3.2, // seconds
  errorRate: 0.02, // 2%
  
  // Business Impact
  setupCompletionRateWithAI: 0.85,
  setupCompletionRateWithoutAI: 0.45,
  timeToCompleteWithAI: 35, // minutes
  timeToCompleteWithoutAI: 90 // minutes
};
```

---

## 🎯 Success Criteria

AI Generator is successful if:

1. ✅ **85%+ acceptance rate** (users keep generated content)
2. ✅ **< 5 seconds response time** for generation
3. ✅ **< 2% error rate** (API failures, timeouts)
4. ✅ **Monthly cost < $50** (assuming 100 tenants/month)
5. ✅ **Setup completion rate increases** from 45% → 85%

---

## 🚀 Rollout Plan

### Phase 1: Beta (Week 1-2)
- Release to 10 beta tenants
- Collect feedback
- Monitor cost & quality
- Iterate on prompts

### Phase 2: Soft Launch (Week 3-4)
- Release to all new tenants
- Daily limit: 3 generations
- Monitor usage patterns

### Phase 3: Full Launch (Week 5+)
- Release to all existing tenants
- Increase limits based on plan
- Add more content types

---

*This is a GAME CHANGER feature that will dramatically improve user experience and setup completion rate!*

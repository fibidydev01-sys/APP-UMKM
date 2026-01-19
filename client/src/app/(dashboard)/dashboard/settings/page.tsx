/**
 * ============================================================================
 * FILE: app/(dashboard)/dashboard/settings/page.tsx
 * ============================================================================
 * Route: /dashboard/settings
 * Description: Settings page orchestrator - manages state and delegates to components
 * Refactored: January 2026
 * ============================================================================
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Loader2, Save, Plus, Trash2, MoveUp, MoveDown, Check } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PageHeader } from '@/components/dashboard';
import {
  SettingsNav,
  PaymentSettings,
  ShippingSettings,
  SeoSettings,
  BankAccountDialog,
  EwalletDialog,
} from '@/components/settings';
import type { LandingContentData } from '@/components/settings';
import { ImageUpload } from '@/components/upload';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type {
  BankAccount,
  EWallet,
  PaymentMethods,
  ShippingMethods,
  SocialLinks,
  CourierName,
  FeatureItem,
  Testimonial,
} from '@/types';

// ============================================================================
// CONSTANTS
// ============================================================================

const THEME_COLORS = [
  { name: 'Sky', value: '#0ea5e9', class: 'bg-sky-500' },
  { name: 'Emerald', value: '#10b981', class: 'bg-emerald-500' },
  { name: 'Rose', value: '#f43f5e', class: 'bg-rose-500' },
  { name: 'Amber', value: '#f59e0b', class: 'bg-amber-500' },
  { name: 'Violet', value: '#8b5cf6', class: 'bg-violet-500' },
  { name: 'Orange', value: '#f97316', class: 'bg-orange-500' },
] as const;

const COURIER_OPTIONS: CourierName[] = [
  'JNE',
  'J&T Express',
  'SiCepat',
  'AnterAja',
  'Ninja Express',
  'ID Express',
  'SAP Express',
  'Lion Parcel',
  'Pos Indonesia',
  'TIKI',
  'Other',
];

const DEFAULT_PAYMENT_METHODS: PaymentMethods = {
  bankAccounts: [],
  eWallets: [],
  cod: { enabled: false, note: '' },
};

const DEFAULT_SHIPPING_METHODS: ShippingMethods = {
  couriers: COURIER_OPTIONS.slice(0, 5).map((name, index) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    name,
    enabled: index < 2,
    note: '',
  })),
};

const generateId = () => Math.random().toString(36).substring(2, 9);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SettingsPage() {
  // ---------------------------------------------------------------------------
  // Hooks
  // ---------------------------------------------------------------------------
  const { tenant, refresh } = useTenant();

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('store');
  const [sheetOpen, setSheetOpen] = useState(false);

  // Saving states
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [isSavingShipping, setIsSavingShipping] = useState(false);
  const [isSavingSeo, setIsSavingSeo] = useState(false);
  // isSavingLanding removed - now using unified isSaving for store tab
  const [isRemovingLogo, setIsRemovingLogo] = useState(false);
  const [isRemovingBanner, setIsRemovingBanner] = useState(false);

  // Dialog states
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [ewalletDialogOpen, setEwalletDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [editingEwallet, setEditingEwallet] = useState<EWallet | null>(null);

  // 🔥 UNIFIED STATE: Merge formData + landingContent into one!
  const [storeTabData, setStoreTabData] = useState<{
    // Basic Store Info (used across sections)
    name: string;
    description: string;
    phone: string;
    whatsapp: string; // NEW: WhatsApp number (REQUIRED)
    address: string;
    logo: string | undefined;
    banner: string | undefined;
    primaryColor: string;
    category: string; // NEW: Store category (REQUIRED)
    // Landing Content - Hero
    heroTitle: string;
    heroSubtitle: string;
    heroCtaText: string;
    heroCtaLink: string;
    heroBackgroundImage: string;
    // About
    aboutTitle: string;
    aboutSubtitle: string;
    aboutContent: string;
    aboutImage: string;
    aboutFeatures: FeatureItem[];
    // Testimonials
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    testimonials: Testimonial[];
    // Contact
    contactTitle: string;
    contactSubtitle: string;
    contactMapUrl: string;
    contactShowMap: boolean;
    contactShowForm: boolean;
    // CTA
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButtonText: string;
    ctaButtonLink: string;
    ctaButtonStyle: 'primary' | 'secondary' | 'outline';
  } | null>(null);

  const [paymentSettings, setPaymentSettings] = useState<{
    currency: string;
    taxRate: number;
    paymentMethods: PaymentMethods;
  } | null>(null);

  const [shippingSettings, setShippingSettings] = useState<{
    freeShippingThreshold: number | null;
    defaultShippingCost: number;
    shippingMethods: ShippingMethods;
  } | null>(null);

  const [seoSettings, setSeoSettings] = useState<{
    metaTitle: string;
    metaDescription: string;
    socialLinks: SocialLinks;
  } | null>(null);

  // ---------------------------------------------------------------------------
  // Initialize form data from tenant - 🔥 UNIFIED: One useEffect for all store tab data!
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (tenant && storeTabData === null) {
      console.log('🔥 Initializing storeTabData with tenant:', {
        contactTitle: tenant.contactTitle,
        contactSubtitle: tenant.contactSubtitle,
        ctaTitle: tenant.ctaTitle,
        ctaSubtitle: tenant.ctaSubtitle,
      });
      const themeData = tenant.theme as { primaryColor?: string } | null;
      setStoreTabData({
        // Basic Store Info
        name: tenant.name || '',
        description: tenant.description || '',
        phone: tenant.phone || '',
        whatsapp: tenant.whatsapp || '',
        address: tenant.address || '',
        logo: tenant.logo || undefined,
        banner: tenant.banner || undefined,
        primaryColor: themeData?.primaryColor || THEME_COLORS[0].value,
        category: tenant.category || '',
        // Hero
        heroTitle: tenant.heroTitle || '',
        heroSubtitle: tenant.heroSubtitle || '',
        heroCtaText: tenant.heroCtaText || '',
        heroCtaLink: tenant.heroCtaLink || '',
        heroBackgroundImage: tenant.heroBackgroundImage || '',
        // About
        aboutTitle: tenant.aboutTitle || '',
        aboutSubtitle: tenant.aboutSubtitle || '',
        aboutContent: tenant.aboutContent || '',
        aboutImage: tenant.aboutImage || '',
        aboutFeatures: (tenant.aboutFeatures as FeatureItem[]) || [],
        // Testimonials
        testimonialsTitle: tenant.testimonialsTitle || '',
        testimonialsSubtitle: tenant.testimonialsSubtitle || '',
        testimonials: (tenant.testimonials as Testimonial[]) || [],
        // Contact
        contactTitle: tenant.contactTitle || '',
        contactSubtitle: tenant.contactSubtitle || '',
        contactMapUrl: tenant.contactMapUrl || '',
        contactShowMap: tenant.contactShowMap ?? false,
        contactShowForm: tenant.contactShowForm ?? true,
        // CTA
        ctaTitle: tenant.ctaTitle || '',
        ctaSubtitle: tenant.ctaSubtitle || '',
        ctaButtonText: tenant.ctaButtonText || '',
        ctaButtonLink: tenant.ctaButtonLink || '',
        ctaButtonStyle: tenant.ctaButtonStyle || 'primary',
      });
      console.log('✅ storeTabData initialized!');
    }
  }, [tenant, storeTabData]);

  useEffect(() => {
    if (tenant && paymentSettings === null) {
      setPaymentSettings({
        currency: tenant.currency || 'IDR',
        taxRate: tenant.taxRate || 0,
        paymentMethods: tenant.paymentMethods || DEFAULT_PAYMENT_METHODS,
      });
    }
  }, [tenant, paymentSettings]);

  useEffect(() => {
    if (tenant && shippingSettings === null) {
      setShippingSettings({
        freeShippingThreshold: tenant.freeShippingThreshold ?? null,
        defaultShippingCost: tenant.defaultShippingCost || 0,
        shippingMethods: tenant.shippingMethods || DEFAULT_SHIPPING_METHODS,
      });
    }
  }, [tenant, shippingSettings]);

  useEffect(() => {
    if (tenant && seoSettings === null) {
      setSeoSettings({
        metaTitle: tenant.metaTitle || '',
        metaDescription: tenant.metaDescription || '',
        socialLinks: tenant.socialLinks || {},
      });
    }
  }, [tenant, seoSettings]);

  const tenantLoading = tenant === null;

  // 🔥 DEBUG: Log storeTabData changes
  useEffect(() => {
    if (storeTabData) {
      console.log('📋 storeTabData updated:', {
        contactTitle: storeTabData.contactTitle,
        contactSubtitle: storeTabData.contactSubtitle,
        ctaTitle: storeTabData.ctaTitle,
        ctaSubtitle: storeTabData.ctaSubtitle,
      });
    }
  }, [storeTabData]);

  // ---------------------------------------------------------------------------
  // Tab Navigation Handlers
  // ---------------------------------------------------------------------------
  const handleTabChange = useCallback(
    (newTab: string) => {
      setActiveTab(newTab);
      setSheetOpen(false);
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Save Handlers - 🔥 UNIFIED STATE
  // ---------------------------------------------------------------------------
  const handleSavePayment = async () => {
    if (!tenant || !paymentSettings) return;
    setIsSavingPayment(true);
    try {
      await tenantsApi.update({
        currency: paymentSettings.currency,
        taxRate: paymentSettings.taxRate,
        paymentMethods: paymentSettings.paymentMethods,
      });
      await refresh();
      toast.success('Pengaturan pembayaran berhasil disimpan');
    } catch (error) {
      console.error('Failed to save payment settings:', error);
      toast.error('Gagal menyimpan pengaturan pembayaran');
    } finally {
      setIsSavingPayment(false);
    }
  };

  const handleSaveShipping = async () => {
    if (!tenant || !shippingSettings) return;
    setIsSavingShipping(true);
    try {
      await tenantsApi.update({
        freeShippingThreshold: shippingSettings.freeShippingThreshold,
        defaultShippingCost: shippingSettings.defaultShippingCost,
        shippingMethods: shippingSettings.shippingMethods,
      });
      await refresh();
      toast.success('Pengaturan pengiriman berhasil disimpan');
    } catch (error) {
      console.error('Failed to save shipping settings:', error);
      toast.error('Gagal menyimpan pengaturan pengiriman');
    } finally {
      setIsSavingShipping(false);
    }
  };

  const handleSaveSeo = async () => {
    if (!tenant || !seoSettings) return;
    setIsSavingSeo(true);
    try {
      await tenantsApi.update({
        metaTitle: seoSettings.metaTitle || undefined,
        metaDescription: seoSettings.metaDescription || undefined,
        socialLinks: seoSettings.socialLinks,
      });
      await refresh();
      toast.success('Pengaturan SEO berhasil disimpan');
    } catch (error) {
      console.error('Failed to save SEO settings:', error);
      toast.error('Gagal menyimpan pengaturan SEO');
    } finally {
      setIsSavingSeo(false);
    }
  };

  // 🔥 UNIFIED SAVE: Save all store tab data at once (no race condition!)
  const handleSaveStoreTab = async () => {
    if (!tenant || !storeTabData) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        // Store Info
        name: storeTabData.name || undefined,
        description: storeTabData.description || undefined,
        phone: storeTabData.phone || undefined,
        whatsapp: storeTabData.whatsapp || undefined,
        address: storeTabData.address || undefined,
        // Branding
        logo: storeTabData.logo || undefined,
        banner: storeTabData.banner || undefined,
        theme: { primaryColor: storeTabData.primaryColor },
        // Hero
        heroTitle: storeTabData.heroTitle,
        heroSubtitle: storeTabData.heroSubtitle,
        heroCtaText: storeTabData.heroCtaText,
        heroCtaLink: storeTabData.heroCtaLink,
        heroBackgroundImage: storeTabData.heroBackgroundImage,
        // About
        aboutTitle: storeTabData.aboutTitle,
        aboutSubtitle: storeTabData.aboutSubtitle,
        aboutContent: storeTabData.aboutContent,
        aboutImage: storeTabData.aboutImage,
        aboutFeatures: storeTabData.aboutFeatures,
        // Testimonials
        testimonialsTitle: storeTabData.testimonialsTitle,
        testimonialsSubtitle: storeTabData.testimonialsSubtitle,
        testimonials: storeTabData.testimonials,
        // Contact
        contactTitle: storeTabData.contactTitle,
        contactSubtitle: storeTabData.contactSubtitle,
        contactMapUrl: storeTabData.contactMapUrl,
        contactShowMap: storeTabData.contactShowMap,
        contactShowForm: storeTabData.contactShowForm,
        // CTA
        ctaTitle: storeTabData.ctaTitle,
        ctaSubtitle: storeTabData.ctaSubtitle,
        ctaButtonText: storeTabData.ctaButtonText,
        ctaButtonLink: storeTabData.ctaButtonLink,
        ctaButtonStyle: storeTabData.ctaButtonStyle,
      });

      // 🔥 FIX: Get fresh data and immediately update unified state
      // No race condition because there's only ONE state now!
      const freshTenant = await refresh();
      if (freshTenant) {
        const themeData = freshTenant.theme as { primaryColor?: string } | null;
        setStoreTabData({
          // Basic Store Info
          name: freshTenant.name || '',
          description: freshTenant.description || '',
          phone: freshTenant.phone || '',
          whatsapp: freshTenant.whatsapp || '',
          address: freshTenant.address || '',
          logo: freshTenant.logo || undefined,
          banner: freshTenant.banner || undefined,
          primaryColor: themeData?.primaryColor || THEME_COLORS[0].value,
          category: freshTenant.category || '',
          // Hero
          heroTitle: freshTenant.heroTitle || '',
          heroSubtitle: freshTenant.heroSubtitle || '',
          heroCtaText: freshTenant.heroCtaText || '',
          heroCtaLink: freshTenant.heroCtaLink || '',
          heroBackgroundImage: freshTenant.heroBackgroundImage || '',
          // About
          aboutTitle: freshTenant.aboutTitle || '',
          aboutSubtitle: freshTenant.aboutSubtitle || '',
          aboutContent: freshTenant.aboutContent || '',
          aboutImage: freshTenant.aboutImage || '',
          aboutFeatures: (freshTenant.aboutFeatures as FeatureItem[]) || [],
          // Testimonials
          testimonialsTitle: freshTenant.testimonialsTitle || '',
          testimonialsSubtitle: freshTenant.testimonialsSubtitle || '',
          testimonials: (freshTenant.testimonials as Testimonial[]) || [],
          // Contact
          contactTitle: freshTenant.contactTitle || '',
          contactSubtitle: freshTenant.contactSubtitle || '',
          contactMapUrl: freshTenant.contactMapUrl || '',
          contactShowMap: freshTenant.contactShowMap ?? false,
          contactShowForm: freshTenant.contactShowForm ?? true,
          // CTA
          ctaTitle: freshTenant.ctaTitle || '',
          ctaSubtitle: freshTenant.ctaSubtitle || '',
          ctaButtonText: freshTenant.ctaButtonText || '',
          ctaButtonLink: freshTenant.ctaButtonLink || '',
          ctaButtonStyle: freshTenant.ctaButtonStyle || 'primary',
        });
      }

      toast.success('Semua perubahan berhasil disimpan');
    } catch (error) {
      console.error('Failed to save store tab:', error);
      toast.error('Gagal menyimpan perubahan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!tenant || !storeTabData) return;
    setIsRemovingLogo(true);
    try {
      setStoreTabData({ ...storeTabData, logo: undefined });
      await tenantsApi.update({ logo: '' });
      await refresh();
      toast.success('Logo berhasil dihapus');
    } catch (error) {
      console.error('Failed to remove logo:', error);
      toast.error('Gagal menghapus logo');
      setStoreTabData({ ...storeTabData, logo: tenant.logo || undefined });
    } finally {
      setIsRemovingLogo(false);
    }
  };

  const handleRemoveBanner = async () => {
    if (!tenant || !storeTabData) return;
    setIsRemovingBanner(true);
    try {
      setStoreTabData({ ...storeTabData, banner: undefined });
      await tenantsApi.update({ banner: '' });
      await refresh();
      toast.success('Banner berhasil dihapus');
    } catch (error) {
      console.error('Failed to remove banner:', error);
      toast.error('Gagal menghapus banner');
      setStoreTabData({ ...storeTabData, banner: tenant.banner || undefined });
    } finally {
      setIsRemovingBanner(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Payment Methods Handlers
  // ---------------------------------------------------------------------------
  const handleSaveBank = (bank: BankAccount) => {
    if (!paymentSettings) return;
    const existing = paymentSettings.paymentMethods.bankAccounts.find((b) => b.id === bank.id);
    let updatedBanks: BankAccount[];

    if (existing) {
      updatedBanks = paymentSettings.paymentMethods.bankAccounts.map((b) =>
        b.id === bank.id ? bank : b
      );
    } else {
      updatedBanks = [...paymentSettings.paymentMethods.bankAccounts, { ...bank, id: generateId() }];
    }

    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: { ...paymentSettings.paymentMethods, bankAccounts: updatedBanks },
    });
    setBankDialogOpen(false);
    setEditingBank(null);
  };

  const handleDeleteBank = (id: string) => {
    if (!paymentSettings) return;
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        bankAccounts: paymentSettings.paymentMethods.bankAccounts.filter((b) => b.id !== id),
      },
    });
  };

  const handleToggleBank = (id: string) => {
    if (!paymentSettings) return;
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        bankAccounts: paymentSettings.paymentMethods.bankAccounts.map((b) =>
          b.id === id ? { ...b, enabled: !b.enabled } : b
        ),
      },
    });
  };

  const handleSaveEwallet = (ewallet: EWallet) => {
    if (!paymentSettings) return;
    const existing = paymentSettings.paymentMethods.eWallets.find((e) => e.id === ewallet.id);
    let updatedEwallets: EWallet[];

    if (existing) {
      updatedEwallets = paymentSettings.paymentMethods.eWallets.map((e) =>
        e.id === ewallet.id ? ewallet : e
      );
    } else {
      updatedEwallets = [
        ...paymentSettings.paymentMethods.eWallets,
        { ...ewallet, id: generateId() },
      ];
    }

    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: { ...paymentSettings.paymentMethods, eWallets: updatedEwallets },
    });
    setEwalletDialogOpen(false);
    setEditingEwallet(null);
  };

  const handleDeleteEwallet = (id: string) => {
    if (!paymentSettings) return;
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        eWallets: paymentSettings.paymentMethods.eWallets.filter((e) => e.id !== id),
      },
    });
  };

  const handleToggleEwallet = (id: string) => {
    if (!paymentSettings) return;
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        eWallets: paymentSettings.paymentMethods.eWallets.map((e) =>
          e.id === id ? { ...e, enabled: !e.enabled } : e
        ),
      },
    });
  };

  // ---------------------------------------------------------------------------
  // Form Data Helpers - 🔥 UNIFIED STATE
  // ---------------------------------------------------------------------------
  const updateStoreTabData = <K extends keyof typeof storeTabData>(
    key: K,
    value: any
  ) => {
    if (storeTabData) {
      setStoreTabData({ ...storeTabData, [key]: value });
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div>
      <PageHeader
        title="Pengaturan"
        description="Kelola pengaturan toko dan preferensi Anda"
      />

      {/* Dialogs */}
      <BankAccountDialog
        open={bankDialogOpen}
        onOpenChange={setBankDialogOpen}
        bank={editingBank}
        onSave={handleSaveBank}
      />
      <EwalletDialog
        open={ewalletDialogOpen}
        onOpenChange={setEwalletDialogOpen}
        ewallet={editingEwallet}
        onSave={handleSaveEwallet}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
        {/* Navigation */}
        <SettingsNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          sheetOpen={sheetOpen}
          onSheetOpenChange={setSheetOpen}
        />

        {/* Tab: Store Info - FLAT LAYOUT (NO ACCORDION) */}
        <TabsContent value="store" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Toko</CardTitle>
              <CardDescription>
                Kelola informasi toko dan konten landing page. Semua data disimpan ke database yang sama.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tenantLoading || !storeTabData ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <Accordion type="multiple" defaultValue={['hero', 'about', 'testimonials', 'contact', 'cta', 'branding']} className="w-full">
                    {/* ============================================ */}
                    {/* SECTION 1: Hero Section - Landing Page Banner */}
                    {/* ============================================ */}
                    <AccordionItem value="hero">
                      <AccordionTrigger className="text-lg font-semibold">
                        Hero Section - Banner Utama
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="store-name">Nama Toko *</Label>
                            <Input
                              id="store-name"
                              placeholder="Burger China"
                              value={storeTabData.name}
                              onChange={(e) => updateStoreTabData('name', e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Nama resmi toko Anda (digunakan di hero banner & branding)
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="store-description">Deskripsi Singkat</Label>
                            <Input
                              id="store-description"
                              placeholder="Burger premium dengan cita rasa Asia fusion"
                              value={storeTabData.description}
                              onChange={(e) => updateStoreTabData('description', e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Tagline atau deskripsi singkat (1 kalimat)
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="heroTitle">Judul Marketing (Hero Title)</Label>
                            <Input
                              id="heroTitle"
                              placeholder="Burger Premium dengan Cita Rasa Asia Fusion"
                              value={storeTabData.heroTitle}
                              onChange={(e) => updateStoreTabData('heroTitle', e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Headline marketing yang eye-catching
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="heroSubtitle">Subtitle (Value Proposition)</Label>
                            <Input
                              id="heroSubtitle"
                              placeholder="Rasakan sensasi burger berkualitas dengan bumbu rahasia khas Asia"
                              value={storeTabData.heroSubtitle}
                              onChange={(e) => updateStoreTabData('heroSubtitle', e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Value proposition atau penjelasan singkat
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="heroCtaText">Teks Tombol CTA</Label>
                            <Input
                              id="heroCtaText"
                              placeholder="Pesan Sekarang"
                              value={storeTabData.heroCtaText}
                              onChange={(e) => updateStoreTabData('heroCtaText', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="heroCtaLink">Link Tombol CTA</Label>
                            <Input
                              id="heroCtaLink"
                              placeholder="/products"
                              value={storeTabData.heroCtaLink}
                              onChange={(e) => updateStoreTabData('heroCtaLink', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="heroBackgroundImage">URL Background Image</Label>
                          <Input
                            id="heroBackgroundImage"
                            placeholder="https://example.com/hero-bg.jpg"
                            value={storeTabData.heroBackgroundImage}
                            onChange={(e) => updateStoreTabData('heroBackgroundImage', e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Masukkan URL gambar background untuk hero section (Rekomendasi: 1920x800px)
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* ============================================ */}
                    {/* SECTION 3: About - Tentang Toko */}
                    {/* ============================================ */}
                    <AccordionItem value="about">
                      <AccordionTrigger className="text-lg font-semibold">
                        About - Tentang Toko
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="aboutTitle">Judul</Label>
                            <Input
                              id="aboutTitle"
                              placeholder="Tentang Kami"
                              value={storeTabData.aboutTitle}
                              onChange={(e) => updateStoreTabData('aboutTitle', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="aboutSubtitle">Subtitle</Label>
                            <Input
                              id="aboutSubtitle"
                              placeholder="Cerita di balik toko kami"
                              value={storeTabData.aboutSubtitle}
                              onChange={(e) => updateStoreTabData('aboutSubtitle', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="aboutContent">Deskripsi Lengkap</Label>
                          <Textarea
                            id="aboutContent"
                            placeholder="Ceritakan tentang toko Anda..."
                            rows={4}
                            value={storeTabData.aboutContent}
                            onChange={(e) => updateStoreTabData('aboutContent', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="aboutImage">URL Gambar About</Label>
                          <Input
                            id="aboutImage"
                            placeholder="https://example.com/image.jpg"
                            value={storeTabData.aboutImage}
                            onChange={(e) => updateStoreTabData('aboutImage', e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Masukkan URL gambar untuk section About
                          </p>
                        </div>

                        {/* About Features Editor */}
                        <div className="space-y-3 pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <Label>Fitur-Fitur Unggulan (About Features)</Label>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newFeature: FeatureItem = { icon: '', title: '', description: '' };
                                updateStoreTabData('aboutFeatures', [...storeTabData.aboutFeatures, newFeature]);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Tambah Fitur
                            </Button>
                          </div>
                          {storeTabData.aboutFeatures.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Belum ada fitur. Klik "Tambah Fitur" untuk menambahkan.</p>
                          ) : (
                            <div className="space-y-3">
                              {storeTabData.aboutFeatures.map((feature, index) => (
                                <Card key={index} className="p-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">Fitur #{index + 1}</span>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          const updated = storeTabData.aboutFeatures.filter((_, i) => i !== index);
                                          updateStoreTabData('aboutFeatures', updated);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-3">
                                      <div className="space-y-1">
                                        <Label className="text-xs">Icon/Emoji</Label>
                                        <Input
                                          placeholder="🔥 atau 'star'"
                                          value={feature.icon || ''}
                                          onChange={(e) => {
                                            const updated = [...storeTabData.aboutFeatures];
                                            updated[index] = { ...updated[index], icon: e.target.value };
                                            updateStoreTabData('aboutFeatures', updated);
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs">Judul</Label>
                                        <Input
                                          placeholder="Kualitas Terjamin"
                                          value={feature.title}
                                          onChange={(e) => {
                                            const updated = [...storeTabData.aboutFeatures];
                                            updated[index] = { ...updated[index], title: e.target.value };
                                            updateStoreTabData('aboutFeatures', updated);
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs">Deskripsi</Label>
                                        <Input
                                          placeholder="Produk berkualitas tinggi"
                                          value={feature.description}
                                          onChange={(e) => {
                                            const updated = [...storeTabData.aboutFeatures];
                                            updated[index] = { ...updated[index], description: e.target.value };
                                            updateStoreTabData('aboutFeatures', updated);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* ============================================ */}
                    {/* SECTION 4: Testimonials - NEW! */}
                    {/* ============================================ */}
                    <AccordionItem value="testimonials">
                      <AccordionTrigger className="text-lg font-semibold">
                        Testimonials - Testimoni Pelanggan
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="testimonialsTitle">Judul</Label>
                            <Input
                              id="testimonialsTitle"
                              placeholder="Kata Mereka"
                              value={storeTabData.testimonialsTitle}
                              onChange={(e) => updateStoreTabData('testimonialsTitle', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="testimonialsSubtitle">Subtitle</Label>
                            <Input
                              id="testimonialsSubtitle"
                              placeholder="Apa kata pelanggan tentang kami"
                              value={storeTabData.testimonialsSubtitle}
                              onChange={(e) => updateStoreTabData('testimonialsSubtitle', e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Testimonials Editor */}
                        <div className="space-y-3 pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <Label>Daftar Testimonial</Label>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newTestimonial: Testimonial = {
                                  name: '',
                                  role: '',
                                  content: '',
                                  avatar: '',
                                };
                                updateStoreTabData('testimonials', [...storeTabData.testimonials, newTestimonial]);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Tambah Testimonial
                            </Button>
                          </div>
                          {storeTabData.testimonials.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              Belum ada testimonial. Klik "Tambah Testimonial" untuk menambahkan.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {storeTabData.testimonials.map((testimonial, index) => (
                                <Card key={index} className="p-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">Testimonial #{index + 1}</span>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          const updated = storeTabData.testimonials.filter((_, i) => i !== index);
                                          updateStoreTabData('testimonials', updated);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                      <div className="space-y-1">
                                        <Label className="text-xs">Nama</Label>
                                        <Input
                                          placeholder="John Doe"
                                          value={testimonial.name}
                                          onChange={(e) => {
                                            const updated = [...storeTabData.testimonials];
                                            updated[index] = { ...updated[index], name: e.target.value };
                                            updateStoreTabData('testimonials', updated);
                                          }}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs">Role/Pekerjaan</Label>
                                        <Input
                                          placeholder="Food Blogger"
                                          value={testimonial.role}
                                          onChange={(e) => {
                                            const updated = [...storeTabData.testimonials];
                                            updated[index] = { ...updated[index], role: e.target.value };
                                            updateStoreTabData('testimonials', updated);
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">URL Avatar (Opsional)</Label>
                                      <Input
                                        placeholder="https://example.com/avatar.jpg"
                                        value={testimonial.avatar || ''}
                                        onChange={(e) => {
                                          const updated = [...storeTabData.testimonials];
                                          updated[index] = { ...updated[index], avatar: e.target.value };
                                          updateStoreTabData('testimonials', updated);
                                        }}
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Testimoni</Label>
                                      <Textarea
                                        placeholder="Produknya sangat berkualitas dan pelayanannya memuaskan!"
                                        rows={3}
                                        value={testimonial.content}
                                        onChange={(e) => {
                                          const updated = [...storeTabData.testimonials];
                                          updated[index] = { ...updated[index], content: e.target.value };
                                          updateStoreTabData('testimonials', updated);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* ============================================ */}
                    {/* SECTION 5: Contact - Informasi Kontak */}
                    {/* ============================================ */}
                    <AccordionItem value="contact">
                      <AccordionTrigger className="text-lg font-semibold">
                        Contact - Informasi Kontak
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        {/* Section Header & Subtitle */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="contactTitle">Judul</Label>
                            <Input
                              id="contactTitle"
                              placeholder="Hubungi Kami"
                              value={storeTabData.contactTitle}
                              onChange={(e) => updateStoreTabData('contactTitle', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactSubtitle">Subtitle</Label>
                            <Input
                              id="contactSubtitle"
                              placeholder="Kami siap membantu Anda"
                              value={storeTabData.contactSubtitle}
                              onChange={(e) => updateStoreTabData('contactSubtitle', e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Contact Information - NEW! */}
                        <div className="space-y-3 pt-2 border-t">
                          <h4 className="text-sm font-medium">Informasi Kontak</h4>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="store-phone">Nomor Telepon</Label>
                              <Input
                                id="store-phone"
                                placeholder="+62 812-3456-7890"
                                value={storeTabData.phone}
                                onChange={(e) => updateStoreTabData('phone', e.target.value)}
                              />
                              <p className="text-xs text-muted-foreground">
                                Nomor telepon toko (ditampilkan di halaman kontak)
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="store-whatsapp">WhatsApp *</Label>
                              <Input
                                id="store-whatsapp"
                                placeholder="6281234567890"
                                value={storeTabData.whatsapp}
                                onChange={(e) => updateStoreTabData('whatsapp', e.target.value)}
                              />
                              <p className="text-xs text-muted-foreground">
                                Nomor WhatsApp (tanpa +, contoh: 6281234567890)
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="store-email">Email</Label>
                              <Input
                                id="store-email"
                                value={tenant?.email || ''}
                                disabled
                              />
                              <p className="text-xs text-muted-foreground">
                                Email tidak dapat diubah
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="store-domain">Domain Toko</Label>
                              <Input
                                id="store-domain"
                                value={`${tenant?.slug || ''}.fibidy.com`}
                                disabled
                              />
                              <p className="text-xs text-muted-foreground">
                                URL toko Anda (otomatis dari slug)
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="store-address">Alamat Lengkap</Label>
                            <Textarea
                              id="store-address"
                              placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota, Provinsi 12345"
                              rows={2}
                              value={storeTabData.address}
                              onChange={(e) => updateStoreTabData('address', e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Alamat lengkap toko (ditampilkan di halaman kontak)
                            </p>
                          </div>
                        </div>

                        {/* Google Maps */}
                        <div className="space-y-2 pt-2 border-t">
                          <Label htmlFor="contactMapUrl">URL Google Maps Embed</Label>
                          <Input
                            id="contactMapUrl"
                            placeholder="https://www.google.com/maps/embed?pb=..."
                            value={storeTabData.contactMapUrl}
                            onChange={(e) => updateStoreTabData('contactMapUrl', e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Masukkan URL embed dari Google Maps untuk menampilkan lokasi toko
                          </p>
                        </div>

                        {/* Display Options */}
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <Label htmlFor="contactShowMap">Tampilkan Peta</Label>
                              <p className="text-xs text-muted-foreground">
                                Menampilkan Google Maps di halaman kontak
                              </p>
                            </div>
                            <Switch
                              id="contactShowMap"
                              checked={storeTabData.contactShowMap}
                              onCheckedChange={(checked) => updateStoreTabData('contactShowMap', checked)}
                            />
                          </div>
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <Label htmlFor="contactShowForm">Tampilkan Form</Label>
                              <p className="text-xs text-muted-foreground">
                                Menampilkan form kontak di halaman kontak
                              </p>
                            </div>
                            <Switch
                              id="contactShowForm"
                              checked={storeTabData.contactShowForm}
                              onCheckedChange={(checked) => updateStoreTabData('contactShowForm', checked)}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* ============================================ */}
                    {/* SECTION 6: CTA - Call to Action */}
                    {/* ============================================ */}
                    <AccordionItem value="cta">
                      <AccordionTrigger className="text-lg font-semibold">
                        CTA - Call to Action
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="ctaTitle">Judul CTA</Label>
                            <Input
                              id="ctaTitle"
                              placeholder="Siap Memulai?"
                              value={storeTabData.ctaTitle}
                              onChange={(e) => updateStoreTabData('ctaTitle', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ctaSubtitle">Subtitle CTA</Label>
                            <Input
                              id="ctaSubtitle"
                              placeholder="Bergabunglah dengan kami"
                              value={storeTabData.ctaSubtitle}
                              onChange={(e) => updateStoreTabData('ctaSubtitle', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ctaButtonText">Teks Tombol</Label>
                            <Input
                              id="ctaButtonText"
                              placeholder="Mulai Sekarang"
                              value={storeTabData.ctaButtonText}
                              onChange={(e) => updateStoreTabData('ctaButtonText', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ctaButtonLink">Link Tombol</Label>
                            <Input
                              id="ctaButtonLink"
                              placeholder="/products"
                              value={storeTabData.ctaButtonLink}
                              onChange={(e) => updateStoreTabData('ctaButtonLink', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ctaButtonStyle">Gaya Tombol</Label>
                          <Select
                            value={storeTabData.ctaButtonStyle}
                            onValueChange={(value: 'primary' | 'secondary' | 'outline') =>
                              updateStoreTabData('ctaButtonStyle', value)
                            }
                          >
                            <SelectTrigger id="ctaButtonStyle">
                              <SelectValue placeholder="Pilih gaya tombol" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="primary">Primary (Biru)</SelectItem>
                              <SelectItem value="secondary">Secondary (Abu-abu)</SelectItem>
                              <SelectItem value="outline">Outline (Hanya Border)</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            Pilih gaya visual untuk tombol CTA
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* ============================================ */}
                    {/* SECTION 7: Kategori & Branding */}
                    {/* ============================================ */}
                    <AccordionItem value="branding">
                      <AccordionTrigger className="text-lg font-semibold">
                        Kategori & Branding
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        {/* Category - Readonly Display */}
                        <div className="space-y-2">
                          <Label htmlFor="store-category">Kategori Toko</Label>
                          <Input
                            id="store-category"
                            value={storeTabData.category || 'Belum dipilih'}
                            disabled
                            className="bg-muted"
                          />
                          <p className="text-xs text-muted-foreground">
                            Kategori hanya dapat dipilih saat pendaftaran dan tidak dapat diubah
                          </p>
                        </div>

                        {/* Logo Upload */}
                        <div className="space-y-2 pt-2 border-t">
                          <Label>Logo Toko</Label>
                          <div className="max-w-[200px]">
                            <ImageUpload
                              value={storeTabData.logo}
                              onChange={(url) => updateStoreTabData('logo', url)}
                              onRemove={handleRemoveLogo}
                              disabled={isRemovingLogo}
                              folder="fibidy/logos"
                              aspectRatio={1}
                              placeholder="Upload logo toko"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Rekomendasi: 200x200px, format PNG atau JPG
                          </p>
                        </div>

                        {/* Banner Upload */}
                        <div className="space-y-2 pt-2 border-t">
                          <Label>Banner Toko</Label>
                          <ImageUpload
                            value={storeTabData.banner}
                            onChange={(url) => updateStoreTabData('banner', url)}
                            onRemove={handleRemoveBanner}
                            disabled={isRemovingBanner}
                            folder="fibidy/banners"
                            aspectRatio={3}
                            placeholder="Upload banner toko"
                          />
                          <p className="text-xs text-muted-foreground">
                            Rekomendasi: 1200x400px, format PNG atau JPG
                          </p>
                        </div>

                        {/* Primary Color */}
                        <div className="space-y-3 pt-2 border-t">
                          <Label>Warna Tema</Label>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                            {THEME_COLORS.map((color) => (
                              <button
                                key={color.value}
                                type="button"
                                onClick={() => updateStoreTabData('primaryColor', color.value)}
                                disabled={isSaving}
                                className={cn(
                                  'relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                                  storeTabData.primaryColor === color.value
                                    ? 'border-primary bg-primary/5'
                                    : 'border-transparent hover:border-muted-foreground/20',
                                  isSaving && 'opacity-50 cursor-not-allowed'
                                )}
                              >
                                <div
                                  className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center',
                                    color.class
                                  )}
                                >
                                  {storeTabData.primaryColor === color.value && (
                                    <Check className="h-5 w-5 text-white" />
                                  )}
                                </div>
                                <span className="text-xs font-medium">{color.name}</span>
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Pilih warna utama untuk toko online Anda
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* ============================================ */}
                  {/* UNIFIED SAVE BUTTON */}
                  {/* ============================================ */}
                  <div className="flex justify-end pt-6 mt-6 border-t">
                    <Button onClick={handleSaveStoreTab} disabled={isSaving} size="lg">
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Semua Perubahan
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Payment */}
        <TabsContent value="payment" className="mt-6">
          <PaymentSettings
            settings={paymentSettings}
            isLoading={tenantLoading}
            isSaving={isSavingPayment}
            onSettingsChange={setPaymentSettings}
            onSave={handleSavePayment}
            onAddBank={() => {
              setEditingBank(null);
              setBankDialogOpen(true);
            }}
            onEditBank={(bank) => {
              setEditingBank(bank);
              setBankDialogOpen(true);
            }}
            onDeleteBank={handleDeleteBank}
            onToggleBank={handleToggleBank}
            onAddEwallet={() => {
              setEditingEwallet(null);
              setEwalletDialogOpen(true);
            }}
            onEditEwallet={(ewallet) => {
              setEditingEwallet(ewallet);
              setEwalletDialogOpen(true);
            }}
            onDeleteEwallet={handleDeleteEwallet}
            onToggleEwallet={handleToggleEwallet}
          />
        </TabsContent>

        {/* Tab: Shipping */}
        <TabsContent value="shipping" className="mt-6">
          <ShippingSettings
            settings={shippingSettings}
            isLoading={tenantLoading}
            isSaving={isSavingShipping}
            onSettingsChange={setShippingSettings}
            onSave={handleSaveShipping}
          />
        </TabsContent>

        {/* Tab: SEO */}
        <TabsContent value="seo" className="mt-6">
          <SeoSettings
            settings={seoSettings}
            tenantName={tenant?.name}
            tenantSlug={tenant?.slug}
            tenantDescription={tenant?.description}
            isLoading={tenantLoading}
            isSaving={isSavingSeo}
            onSettingsChange={setSeoSettings}
            onSave={handleSaveSeo}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
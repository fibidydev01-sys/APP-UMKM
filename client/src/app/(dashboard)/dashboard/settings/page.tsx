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
import { Loader2, Save } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/dashboard';
import {
  SettingsNav,
  AppearanceSettings,
  PaymentSettings,
  ShippingSettings,
  SeoSettings,
  BankAccountDialog,
  EwalletDialog,
} from '@/components/settings';
import type { LandingContentData } from '@/components/settings';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
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
  const [isSavingAppearance, setIsSavingAppearance] = useState(false);
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
    // Informasi Dasar (was formData)
    name: string;
    description: string;
    phone: string;
    address: string;
    logo: string | undefined;
    banner: string | undefined;
    primaryColor: string;
    // Landing Content (was landingContent) - Hero
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
        // Informasi Dasar
        name: tenant.name || '',
        description: tenant.description || '',
        phone: tenant.phone || '',
        address: tenant.address || '',
        logo: tenant.logo || undefined,
        banner: tenant.banner || undefined,
        primaryColor: themeData?.primaryColor || THEME_COLORS[0].value,
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
  const handleSaveAppearance = async () => {
    if (!tenant || !storeTabData) return;
    setIsSavingAppearance(true);
    try {
      await tenantsApi.update({
        logo: storeTabData.logo || undefined,
        banner: storeTabData.banner || undefined,
        theme: { primaryColor: storeTabData.primaryColor },
      });
      await refresh();
      toast.success('Tampilan toko berhasil disimpan');
    } catch (error) {
      console.error('Failed to save appearance:', error);
      toast.error('Gagal menyimpan tampilan toko');
    } finally {
      setIsSavingAppearance(false);
    }
  };

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
        address: storeTabData.address || undefined,
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
          // Informasi Dasar
          name: freshTenant.name || '',
          description: freshTenant.description || '',
          phone: freshTenant.phone || '',
          address: freshTenant.address || '',
          logo: freshTenant.logo || undefined,
          banner: freshTenant.banner || undefined,
          primaryColor: themeData?.primaryColor || THEME_COLORS[0].value,
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
            <CardContent className="space-y-8">
              {/* ============================================ */}
              {/* SECTION 1: Informasi Dasar - 🔥 UNIFIED STATE */}
              {/* ============================================ */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Informasi Dasar</h3>
                {tenantLoading || !storeTabData ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="store-name">Nama Toko</Label>
                        <Input
                          id="store-name"
                          placeholder="Nama toko Anda"
                          value={storeTabData.name}
                          onChange={(e) => updateStoreTabData('name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-email">Email Toko</Label>
                        <Input
                          id="store-email"
                          value={tenant?.email || ''}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-phone">Nomor Telepon</Label>
                        <Input
                          id="store-phone"
                          placeholder="+62 xxx xxxx xxxx"
                          value={storeTabData.phone}
                          onChange={(e) => updateStoreTabData('phone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-slug">URL Toko</Label>
                        <Input
                          id="store-slug"
                          value={`fibidy.com/store/${tenant?.slug || ''}`}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-description">Deskripsi Toko</Label>
                      <Textarea
                        id="store-description"
                        placeholder="Ceritakan tentang toko Anda..."
                        rows={3}
                        value={storeTabData.description}
                        onChange={(e) => updateStoreTabData('description', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-address">Alamat</Label>
                      <Textarea
                        id="store-address"
                        placeholder="Alamat lengkap toko"
                        rows={2}
                        value={storeTabData.address}
                        onChange={(e) => updateStoreTabData('address', e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* ============================================ */}
              {/* SECTION 2: About - Tentang Toko - 🔥 UNIFIED STATE */}
              {/* ============================================ */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">About - Tentang Toko</h3>
                {tenantLoading || !storeTabData ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* ============================================ */}
              {/* SECTION 3: Contact - Informasi Kontak - 🔥 UNIFIED STATE */}
              {/* ============================================ */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Contact - Informasi Kontak</h3>
                {tenantLoading || !storeTabData ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* ============================================ */}
              {/* SECTION 4: CTA - Call to Action - 🔥 UNIFIED STATE */}
              {/* ============================================ */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">CTA - Call to Action</h3>
                {tenantLoading || !storeTabData ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* ============================================ */}
              {/* UNIFIED SAVE BUTTON */}
              {/* ============================================ */}
              <div className="flex justify-end pt-6 border-t">
                <Button onClick={handleSaveStoreTab} disabled={isSaving} size="lg">
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Semua Perubahan
                </Button>
              </div>
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

        {/* Tab: Appearance - 🔥 UNIFIED STATE */}
        <TabsContent value="appearance" className="mt-6">
          <AppearanceSettings
            formData={storeTabData ? { logo: storeTabData.logo, banner: storeTabData.banner, primaryColor: storeTabData.primaryColor } : null}
            isLoading={tenantLoading}
            isSaving={isSavingAppearance}
            isRemovingLogo={isRemovingLogo}
            isRemovingBanner={isRemovingBanner}
            onLogoChange={(url) => storeTabData && setStoreTabData({ ...storeTabData, logo: url })}
            onBannerChange={(url) => storeTabData && setStoreTabData({ ...storeTabData, banner: url })}
            onColorChange={(color) => storeTabData && setStoreTabData({ ...storeTabData, primaryColor: color })}
            onRemoveLogo={handleRemoveLogo}
            onRemoveBanner={handleRemoveBanner}
            onSave={handleSaveAppearance}
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
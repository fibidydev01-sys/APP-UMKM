/**
 * ============================================================================
 * FILE: app/settings/page.tsx
 * ============================================================================
 * Route: /settings
 * Description: Settings page with sidebar navigation (desktop) and sheet (mobile)
 * Updated: January 2026
 * ============================================================================
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PaymentSettings,
  ShippingSettings,
  SeoSettings,
  BankAccountDialog,
  EwalletDialog,
} from '@/components/settings';
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
} from '@/types';

// ============================================================================
// CONSTANTS
// ============================================================================

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
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Hooks
  // ---------------------------------------------------------------------------
  const { tenant, refresh } = useTenant();

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('payment'); // Default to 'payment' (store tab navigates to /settings/toko)

  // Saving states
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [isSavingShipping, setIsSavingShipping] = useState(false);
  const [isSavingSeo, setIsSavingSeo] = useState(false);

  // Dialog states
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [ewalletDialogOpen, setEwalletDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [editingEwallet, setEditingEwallet] = useState<EWallet | null>(null);

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
  // Initialize form data from tenant
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Tab Navigation Handlers
  // ---------------------------------------------------------------------------
  const handleTabChange = useCallback((newTab: string) => {
    setActiveTab(newTab);
  }, []);

  // ---------------------------------------------------------------------------
  // Save Handlers
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
      updatedBanks = [
        ...paymentSettings.paymentMethods.bankAccounts,
        { ...bank, id: generateId() },
      ];
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
  // Render Content Based on Active Tab
  // ---------------------------------------------------------------------------
  const renderContent = () => {
    switch (activeTab) {
      case 'store':
        // Redirect handled by useEffect above - show nothing while redirecting
        return null;

      case 'payment':
        return (
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
        );

      case 'shipping':
        return (
          <ShippingSettings
            settings={shippingSettings}
            isLoading={tenantLoading}
            isSaving={isSavingShipping}
            onSettingsChange={setShippingSettings}
            onSave={handleSaveShipping}
          />
        );

      case 'seo':
        return (
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
        );

      default:
        return null;
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
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

      {/* Content - Sidebar is now in layout */}
      {renderContent()}
    </>
  );
}

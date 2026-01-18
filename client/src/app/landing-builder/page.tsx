/**
 * ============================================================================
 * FILE: app/landing-builder/page.tsx
 * ============================================================================
 * Route: /landing-builder
 * Description: Full-Screen Landing Page Builder (Isolated from Dashboard)
 * Layout: Sidebar (left) | Preview (center) | Wide Sheet (right overlay)
 * ============================================================================
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LivePreview,
  LandingErrorBoundary,
  BuilderSidebar,
  LandingBuilder,
} from '@/components/landing-builder';
import type { SectionType } from '@/components/landing-builder';
import { SectionSheet } from '@/components/landing-builder/section-sheet';
import { VariantSidebar } from '@/components/landing-builder/variant-sidebar';
import { useTenant } from '@/hooks';
import { useLandingConfig } from '@/hooks/use-landing-config';
import { productsApi } from '@/lib/api';
import { mergeWithTemplateDefaults } from '@/lib/landing';
import { Save, Home, PanelLeftClose, PanelLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import type { TenantLandingConfig, Product } from '@/types';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function LandingBuilderPage() {
  const searchParams = useSearchParams();
  const initialTemplateParam = searchParams.get('template');

  const { tenant, refresh } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // UI State
  const [activeSection, setActiveSection] = useState<SectionType | null>(null);
  const [showVariantSidebar, setShowVariantSidebar] = useState(false);
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ============================================================================
  // LANDING CONFIG HOOK
  // ============================================================================

  const {
    config: landingConfig,
    hasUnsavedChanges,
    isSaving,
    validationErrors,
    updateConfig: setLandingConfig,
    publishChanges: handlePublish,
    discardChanges: handleDiscard,
    resetToDefaults: handleReset,
    clearValidationErrors: clearErrors,
  } = useLandingConfig({
    initialConfig: tenant?.landingConfig,
    onSaveSuccess: () => refresh(),
  });

  // ============================================================================
  // FETCH PRODUCTS FOR PREVIEW
  // ============================================================================

  useEffect(() => {
    const fetchProducts = async () => {
      if (!tenant) return;

      try {
        setProductsLoading(true);
        const response = await productsApi.getByStore(tenant.slug, {
          isActive: true,
          limit: 12,
        });
        setProducts(response.data);
      } catch (error) {
        console.error('[LandingBuilder] Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [tenant]);

  // ============================================================================
  // INITIAL TEMPLATE APPLICATION
  // ============================================================================

  useEffect(() => {
    if (!tenant) return;
    if (!initialTemplateParam) return;
    if (landingConfig?.template === initialTemplateParam) return;

    const mergedConfig = mergeWithTemplateDefaults(
      landingConfig,
      initialTemplateParam as any,
      {
        name: tenant.name,
        category: tenant.category,
      }
    );

    setLandingConfig(mergedConfig as TenantLandingConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTemplateParam, tenant?.name, tenant?.category]);

  // ============================================================================
  // SIDEBAR & SHEET HANDLERS
  // ============================================================================

  // Step 1: User clicks section → Show variant sidebar
  const handleSectionClick = useCallback((section: SectionType) => {
    setActiveSection(section);
    setShowVariantSidebar(true);
    setShowFormSheet(false);
  }, []);

  // Step 2: User clicks variant → Open form sheet/drawer
  const handleVariantSelect = useCallback((variant: string) => {
    // Variant change will be handled by LandingBuilder
    setShowFormSheet(true);
  }, []);

  // Close variant sidebar
  const handleVariantSidebarClose = useCallback(() => {
    setShowVariantSidebar(false);
    setActiveSection(null);
  }, []);

  // Close form sheet
  const handleFormSheetClose = useCallback(() => {
    setShowFormSheet(false);
    // Keep variant sidebar open
  }, []);

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  const tenantLoading = tenant === null;

  if (tenantLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-4xl px-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Gagal memuat data tenant</p>
      </div>
    );
  }

  // ============================================================================
  // RENDER: FULL SCREEN ISOLATED LAYOUT
  // ============================================================================

  return (
    <div className="h-screen flex flex-col">
      {/* Custom Header (Minimal, not PageHeader) */}
      <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="gap-2"
          >
            {sidebarCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>

          <div className="h-6 w-px bg-border" />

          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-semibold text-lg">Landing Page Builder</h1>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-500">
              Unsaved
            </Badge>
          )}
          {validationErrors.length > 0 && (
            <Badge variant="destructive">{validationErrors.length} Error(s)</Badge>
          )}
          {hasUnsavedChanges && (
            <Button variant="outline" size="sm" onClick={handleDiscard} disabled={isSaving}>
              Discard
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isSaving}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handlePublish}
            disabled={isSaving || !hasUnsavedChanges}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Publishing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Layout: Sidebar + Variant Sidebar + Preview (Sheet is overlay) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Section Sidebar (Fixed) */}
        <BuilderSidebar
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          collapsed={sidebarCollapsed}
        />

        {/* LEFT 2: Variant Sidebar (Canva-style) */}
        {showVariantSidebar && activeSection && (
          <VariantSidebar
            section={activeSection}
            currentVariant={landingConfig?.[activeSection]?.variant}
            onVariantSelect={handleVariantSelect}
            onBack={handleVariantSidebarClose}
          />
        )}

        {/* CENTER: Live Preview */}
        <div className="flex-1 overflow-hidden bg-gradient-to-br from-muted/30 via-background to-muted/30">
          <LandingErrorBoundary>
            <LivePreview
              config={landingConfig}
              tenant={tenant}
              products={products}
              isLoading={productsLoading}
            />
          </LandingErrorBoundary>
        </div>
      </div>

      {/* RIGHT: Form Sheet/Drawer (opens when variant is selected) */}
      {showFormSheet && activeSection && (
        <SectionSheet
          section={activeSection}
          isOpen={showFormSheet}
          onClose={handleFormSheetClose}
          title={`Edit ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section`}
          description="Configure section settings"
        >
          <LandingErrorBoundary>
            <LandingBuilder
              config={landingConfig}
              onConfigChange={setLandingConfig}
              tenantSlug={tenant.slug}
              hasUnsavedChanges={hasUnsavedChanges}
              isSaving={isSaving}
              validationErrors={validationErrors}
              onPublish={handlePublish}
              onDiscard={handleDiscard}
              onReset={handleReset}
              onClearErrors={clearErrors}
              activeSection={activeSection}
            />
          </LandingErrorBoundary>
        </SectionSheet>
      )}
    </div>
  );
}

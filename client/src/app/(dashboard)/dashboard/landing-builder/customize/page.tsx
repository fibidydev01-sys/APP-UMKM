/**
 * ============================================================================
 * FILE: app/(dashboard)/dashboard/landing-builder/customize/page.tsx
 * ============================================================================
 * Route: /dashboard/landing-builder/customize
 * Description: Landing Page Builder with Sidebar + Sheet UI
 * Layout: Sidebar (left) | Preview (center) | Sheet (right overlay)
 * ============================================================================
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/dashboard';
import {
  LivePreview,
  LandingErrorBoundary,
  DeviceFrame,
  PreviewModeToggle,
  BuilderSidebar,
  LandingBuilderSimplified,
} from '@/components/landing-builder';
import type { DeviceMode, SectionType } from '@/components/landing-builder';
import { SectionSheet } from '@/components/landing-builder/section-sheet';
import { useTenant } from '@/hooks';
import { useLandingConfig } from '@/hooks/use-landing-config';
import { productsApi } from '@/lib/api';
import { getAllTemplates, getTemplateDefaults, mergeWithTemplateDefaults } from '@/lib/landing';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { TenantLandingConfig, Product } from '@/types';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CustomizeLandingPage() {
  const searchParams = useSearchParams();
  const initialTemplateParam = searchParams.get('template');

  const { tenant, refresh } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // UI State
  const [previewMode, setPreviewMode] = useState<DeviceMode>('normal');
  const [activeSection, setActiveSection] = useState<SectionType | null>(null);

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
        console.error('[CustomizeLanding] Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [tenant]);

  // ============================================================================
  // TEMPLATE SWITCHING
  // ============================================================================

  const templates = getAllTemplates();
  const currentTemplateId = landingConfig?.template || 'suspended-minimalist';

  const handleTemplateChange = useCallback(
    (templateId: string) => {
      if (!tenant) return;

      const mergedConfig = mergeWithTemplateDefaults(
        landingConfig,
        templateId as any,
        {
          name: tenant.name,
          category: tenant.category,
        }
      );

      setLandingConfig(mergedConfig as TenantLandingConfig);
    },
    [tenant, landingConfig, setLandingConfig]
  );

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
  // SECTION SHEET HANDLERS
  // ============================================================================

  const handleSectionClick = useCallback((section: SectionType) => {
    setActiveSection(section);
  }, []);

  const handleSheetClose = useCallback(() => {
    setActiveSection(null);
  }, []);

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  const tenantLoading = tenant === null;

  if (tenantLoading) {
    return (
      <div>
        <PageHeader
          title="Landing Page Builder"
          description="Customize your landing page with live preview"
        />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div>
        <PageHeader
          title="Landing Page Builder"
          description="Customize your landing page with live preview"
        />
        <p className="text-muted-foreground mt-6">Gagal memuat data tenant</p>
      </div>
    );
  }

  // ============================================================================
  // RENDER: NEW LAYOUT WITH SIDEBAR + SHEET
  // ============================================================================

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <PageHeader
        title="Landing Page Builder"
        description="Pilih section dari sidebar, edit di panel samping"
      >
        <Link href="/dashboard/landing-builder/gallery">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Gallery
          </Button>
        </Link>
      </PageHeader>

      {/* Top Bar: Template + Preview Mode + Actions */}
      <div className="flex items-center justify-between gap-4 p-4 border-b bg-muted/30 mt-4">
        <div className="flex items-center gap-4">
          {/* Template Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Template:</span>
            <Select value={currentTemplateId} onValueChange={handleTemplateChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview Mode Toggle */}
          <PreviewModeToggle activeMode={previewMode} onChange={setPreviewMode} />

          {/* Unsaved Changes Badge */}
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              Unsaved Changes
            </Badge>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Badge variant="destructive">
              {validationErrors.length} Error(s)
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscard}
              disabled={isSaving}
            >
              Discard
            </Button>
          )}

          <Button
            variant="default"
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

      {/* Main Layout: Sidebar + Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Sidebar (Fixed) */}
        <BuilderSidebar
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
        />

        {/* CENTER: Live Preview with Device Frame */}
        <div className="flex-1 overflow-hidden bg-gradient-to-br from-muted/30 via-background to-muted/30">
          <LandingErrorBoundary>
            <DeviceFrame mode={previewMode}>
              <LivePreview
                config={landingConfig}
                tenant={tenant}
                products={products}
                isLoading={productsLoading}
              />
            </DeviceFrame>
          </LandingErrorBoundary>
        </div>
      </div>

      {/* RIGHT: Section Edit Sheet (Overlay) */}
      {activeSection && (
        <SectionSheet
          section={activeSection}
          isOpen={true}
          onClose={handleSheetClose}
          title={`Edit ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section`}
          description="Customize this section's content and appearance"
        >
          {/* Render the simplified builder (block selection only) */}
          {/* Data editing is now handled in Settings > Landing */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            <LandingErrorBoundary>
              <LandingBuilderSimplified
                config={landingConfig}
                tenant={tenant}
                onConfigChange={setLandingConfig}
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
          </div>
        </SectionSheet>
      )}
    </div>
  );
}

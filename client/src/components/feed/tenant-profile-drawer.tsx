// ══════════════════════════════════════════════════════════════
// TENANT PROFILE DRAWER
// Opens when user clicks tenant logo/name in feed drawer header
// Fetches full PublicTenant data via getBySlug
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Drawer } from 'vaul';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import {
  Store,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { tenantsApi } from '@/lib/api';
import { getCategoryInfo, formatWhatsAppUrl } from '@/lib/discover';
import type { PublicTenant } from '@/types';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface TenantProfileDrawerProps {
  slug: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ══════════════════════════════════════════════════════════════
// CACHE - avoid re-fetching same tenant
// ══════════════════════════════════════════════════════════════

const tenantCache = new Map<string, PublicTenant>();

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function TenantProfileDrawer({
  slug,
  open,
  onOpenChange,
}: TenantProfileDrawerProps) {
  const [tenant, setTenant] = useState<PublicTenant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [featureIndex, setFeatureIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── Fetch tenant data ───────────────────────────────────────
  useEffect(() => {
    if (!open || !slug) return;

    // Check cache
    const cached = tenantCache.get(slug);
    if (cached) {
      setTenant(cached);
      setLoading(false);
      setError(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await tenantsApi.getBySlug(slug);
        tenantCache.set(slug, data);
        setTenant(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, slug]);

  // ── Reset on close ──────────────────────────────────────────
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current && !open) {
      setAboutExpanded(false);
      setFeatureIndex(0);
    }
    prevOpen.current = open;
  }, [open]);

  // ── Scroll to top on slug change ────────────────────────────
  useEffect(() => {
    if (open && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [slug, open]);

  // ── Derived data ────────────────────────────────────────────
  const categoryInfo = tenant ? getCategoryInfo(tenant.category) : null;
  const primaryColor = tenant?.theme?.primaryColor || categoryInfo?.color || '#6b7280';
  const features = tenant?.aboutFeatures ?? [];
  const hasAboutContent = !!(tenant?.aboutContent || tenant?.aboutImage);
  const hasFeatures = features.length > 0;
  const hasContact = !!(tenant?.whatsapp || tenant?.phone || tenant?.address);
  const hasMap = !!(tenant?.contactShowMap && tenant?.contactMapUrl);
  const tenantUrl = tenant ? `${window.location.origin}/${tenant.slug}` : '';

  // About text truncation
  const aboutText = tenant?.aboutContent ?? '';
  const isLongAbout = aboutText.length > 200;
  const displayAbout = aboutExpanded || !isLongAbout ? aboutText : aboutText.slice(0, 200) + '...';

  // Feature carousel navigation
  const nextFeature = useCallback(() => {
    setFeatureIndex((i) => (i + 1) % features.length);
  }, [features.length]);

  const prevFeature = useCallback(() => {
    setFeatureIndex((i) => (i - 1 + features.length) % features.length);
  }, [features.length]);

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[10001]" />

        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-[10002]',
            'bg-background rounded-t-[20px]',
            'h-[85vh] outline-none',
            'flex flex-col',
          )}
          aria-describedby="tenant-profile-description"
        >
          {/* Accessibility */}
          <Drawer.Title asChild>
            <VisuallyHidden.Root>
              {tenant ? `Profil ${tenant.name}` : 'Profil Toko'}
            </VisuallyHidden.Root>
          </Drawer.Title>
          <Drawer.Description asChild>
            <VisuallyHidden.Root id="tenant-profile-description">
              {tenant?.description || 'Preview profil toko'}
            </VisuallyHidden.Root>
          </Drawer.Description>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* ══════════ LOADING ══════════ */}
          {loading && (
            <div className="flex-1 px-6 py-4 max-w-xl mx-auto w-full">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="w-14 h-14 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <Skeleton className="h-48 w-full rounded-xl mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          )}

          {/* ══════════ ERROR ══════════ */}
          {error && !loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Store className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Gagal memuat profil toko</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    if (slug) {
                      tenantCache.delete(slug);
                      setError(false);
                      setLoading(true);
                      tenantsApi.getBySlug(slug).then((data) => {
                        tenantCache.set(slug, data);
                        setTenant(data);
                        setLoading(false);
                      }).catch(() => {
                        setError(true);
                        setLoading(false);
                      });
                    }
                  }}
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          )}

          {/* ══════════ CONTENT ══════════ */}
          {tenant && !loading && !error && (
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
              <div className="max-w-xl mx-auto w-full px-6 pb-8">

                {/* ── HEADER ─────────────────────────────────────── */}
                <div className="flex items-center gap-4 py-4">
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 border-2"
                    style={{ borderColor: `${primaryColor}30` }}
                  >
                    {tenant.logo ? (
                      <Image src={tenant.logo} alt={tenant.name} width={56} height={56} className="object-cover w-full h-full" />
                    ) : (
                      <Store className="w-7 h-7 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-lg truncate">{tenant.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {categoryInfo && (
                        <span className="font-medium" style={{ color: primaryColor }}>
                          {categoryInfo.labelShort}
                        </span>
                      )}
                      {tenant.address && (
                        <>
                          <span>·</span>
                          <span className="truncate">{tenant.address.split(',')[0]}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {tenant.description && (
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {tenant.description}
                  </p>
                )}

                <Separator className="mb-6" />

                {/* ── TENTANG KAMI ────────────────────────────────── */}
                {hasAboutContent && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Tentang Kami
                    </h3>

                    {tenant.aboutImage && (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted mb-3">
                        <Image
                          src={tenant.aboutImage}
                          alt={`Tentang ${tenant.name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {aboutText && (
                      <div>
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {displayAbout}
                        </p>
                        {isLongAbout && (
                          <button
                            className="text-xs font-medium text-primary hover:underline mt-1 inline-flex items-center gap-0.5"
                            onClick={() => setAboutExpanded(!aboutExpanded)}
                          >
                            {aboutExpanded ? (
                              <>Sembunyikan <ChevronUp className="h-3 w-3" /></>
                            ) : (
                              <>Baca Selengkapnya <ChevronDown className="h-3 w-3" /></>
                            )}
                          </button>
                        )}
                      </div>
                    )}

                    <Separator className="mt-6" />
                  </div>
                )}

                {/* ── KEUNGGULAN KAMI ─────────────────────────────── */}
                {hasFeatures && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Keunggulan Kami
                    </h3>

                    <div className="relative">
                      {/* Feature Card */}
                      <div
                        className="rounded-xl border p-4 text-center"
                        style={{ borderColor: `${primaryColor}20` }}
                      >
                        <div
                          className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                          style={{ backgroundColor: `${primaryColor}15` }}
                        >
                          {features[featureIndex]?.icon ? (
                            <span className="text-xl">{features[featureIndex].icon}</span>
                          ) : (
                            <Sparkles className="h-5 w-5" style={{ color: primaryColor }} />
                          )}
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{features[featureIndex]?.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {features[featureIndex]?.description}
                        </p>
                      </div>

                      {/* Navigation Arrows */}
                      {features.length > 1 && (
                        <>
                          <button
                            onClick={prevFeature}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-7 h-7 rounded-full bg-background border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={nextFeature}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-7 h-7 rounded-full bg-background border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      {/* Dots */}
                      {features.length > 1 && (
                        <div className="flex items-center justify-center gap-1.5 mt-3">
                          {features.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setFeatureIndex(i)}
                              className={cn(
                                'w-1.5 h-1.5 rounded-full transition-all',
                                i === featureIndex ? 'w-4' : 'bg-muted-foreground/30',
                              )}
                              style={i === featureIndex ? { backgroundColor: primaryColor } : undefined}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator className="mt-6" />
                  </div>
                )}

                {/* ── KONTAK ──────────────────────────────────────── */}
                {hasContact && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Kontak
                    </h3>

                    <div className="space-y-3">
                      {/* WhatsApp */}
                      {tenant.whatsapp && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center">
                              <MessageCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">WhatsApp</p>
                              <p className="text-sm font-medium">{tenant.whatsapp}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={formatWhatsAppUrl(tenant.whatsapp)} target="_blank" rel="noopener noreferrer">
                              Chat
                            </Link>
                          </Button>
                        </div>
                      )}

                      {/* Phone */}
                      {tenant.phone && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <Phone className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Telepon</p>
                              <p className="text-sm font-medium">{tenant.phone}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`tel:${tenant.phone}`}>
                              Hubungi
                            </Link>
                          </Button>
                        </div>
                      )}

                      {/* Address */}
                      {tenant.address && (
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                          <div className="w-9 h-9 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">Alamat</p>
                            <p className="text-sm font-medium">{tenant.address}</p>
                            {tenant.contactMapUrl && (
                              <Link
                                href={tenant.contactMapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-0.5"
                              >
                                Lihat di Maps <ExternalLink className="h-3 w-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator className="mt-6" />
                  </div>
                )}

                {/* ── LOKASI / MAP ────────────────────────────────── */}
                {hasMap && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Lokasi Kami
                    </h3>

                    <div className="rounded-xl overflow-hidden border bg-muted">
                      <iframe
                        src={tenant.contactMapUrl!}
                        className="w-full h-[250px] border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Lokasi ${tenant.name}`}
                      />
                    </div>

                    <Separator className="mt-6" />
                  </div>
                )}

                {/* ── FOOTER CTA ──────────────────────────────────── */}
                <Button
                  asChild
                  className="w-full h-11 gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Link href={`/${tenant.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Kunjungi Website
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

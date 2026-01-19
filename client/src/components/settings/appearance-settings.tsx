'use client';

import { Loader2, Save, Check, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUpload } from '@/components/upload';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface AppearanceFormData {
  logo: string | undefined;
  banner: string | undefined;
  primaryColor: string;
  category: string;
}

interface AppearanceSettingsProps {
  formData: AppearanceFormData | null;
  isLoading: boolean;
  isSaving: boolean;
  isRemovingLogo: boolean;
  isRemovingBanner: boolean;
  onLogoChange: (url: string) => void;
  onBannerChange: (url: string) => void;
  onColorChange: (color: string) => void;
  onCategoryChange: (category: string) => void;
  onRemoveLogo: () => Promise<void>;
  onRemoveBanner: () => Promise<void>;
  onSave: () => Promise<void>;
}

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

// ============================================================================
// COMPONENT
// ============================================================================

export function AppearanceSettings({
  formData,
  isLoading,
  isSaving,
  isRemovingLogo,
  isRemovingBanner,
  onLogoChange,
  onBannerChange,
  onColorChange,
  onCategoryChange,
  onRemoveLogo,
  onRemoveBanner,
  onSave,
}: AppearanceSettingsProps) {
  const CATEGORY_OPTIONS = [
    { value: 'RESTORAN', label: 'Restoran / Café' },
    { value: 'FASHION', label: 'Fashion / Pakaian' },
    { value: 'ELEKTRONIK', label: 'Elektronik' },
    { value: 'MAKANAN', label: 'Makanan & Minuman' },
    { value: 'KECANTIKAN', label: 'Kecantikan & Kosmetik' },
    { value: 'KERAJINAN', label: 'Kerajinan Tangan' },
    { value: 'JASA', label: 'Jasa / Layanan' },
    { value: 'LAINNYA', label: 'Lainnya' },
  ];

  return (
    <div className="space-y-6">
      {/* Business Identity Card */}
      <Card>
        <CardHeader>
          <CardTitle>Identitas Bisnis</CardTitle>
          <CardDescription>
            Kategori toko Anda yang menentukan fitur dan template yang tersedia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading || !formData ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="space-y-2">
              <Label htmlFor="category">Kategori Toko *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => onCategoryChange(e.target.value)}
                disabled={isSaving}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Pilih kategori...</option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Pilih kategori yang paling sesuai dengan jenis bisnis Anda
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logo & Banner Card */}
      <Card>
        <CardHeader>
          <CardTitle>Logo & Banner</CardTitle>
          <CardDescription>
            Gambar yang ditampilkan di toko online Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading || !formData ? (
            <div className="space-y-4">
              <Skeleton className="h-40 w-40" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Logo Toko</Label>
                <div className="max-w-[200px]">
                  <ImageUpload
                    value={formData.logo}
                    onChange={onLogoChange}
                    onRemove={onRemoveLogo}
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

              <Separator />

              <div className="space-y-2">
                <Label>Banner Toko</Label>
                <ImageUpload
                  value={formData.banner}
                  onChange={onBannerChange}
                  onRemove={onRemoveBanner}
                  disabled={isRemovingBanner}
                  folder="fibidy/banners"
                  aspectRatio={3}
                  placeholder="Upload banner toko"
                />
                <p className="text-xs text-muted-foreground">
                  Rekomendasi: 1200x400px, format PNG atau JPG
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Theme Color Card */}
      <Card>
        <CardHeader>
          <CardTitle>Warna Tema</CardTitle>
          <CardDescription>
            Pilih warna utama untuk toko online Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading || !formData ? (
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-16 w-16 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => onColorChange(color.value)}
                  disabled={isSaving}
                  className={cn(
                    'relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                    formData.primaryColor === color.value
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
                    {formData.primaryColor === color.value && (
                      <Check className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <span className="text-xs font-medium">{color.name}</span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dark Mode Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Mode Gelap</CardTitle>
          <CardDescription>
            Ubah tampilan antara mode terang dan gelap.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
              <Moon className="h-4 w-4" />
              <span>/</span>
              <Sun className="h-4 w-4" />
            </span>
            untuk mengubah mode tampilan.
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving || isLoading}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Simpan Tampilan
        </Button>
      </div>
    </div>
  );
}
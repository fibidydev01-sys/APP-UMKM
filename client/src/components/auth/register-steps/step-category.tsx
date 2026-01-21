'use client';

import { CategoryCard } from '../category-card';
import { Button } from '@/components/ui/button';
import { getCategoryList } from '@/config/categories';
import { Package, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// ==========================================
// TYPES
// ==========================================

interface StepCategoryProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onNext: () => void;
  onBack: () => void;
}

// ==========================================
// COMPONENT
// ==========================================

export function StepCategory({
  selectedCategory,
  onSelectCategory,
  onNext,
  onBack,
}: StepCategoryProps) {
  const categories = getCategoryList();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Pilih Kategori Usaha</h2>
        <p className="text-muted-foreground">
          Pilih yang paling sesuai dengan bisnis Anda
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.key}
            icon={cat.icon}
            label={cat.label}
            color={cat.color}
            isSelected={selectedCategory === cat.key}
            onClick={() => onSelectCategory(cat.key)}
          />
        ))}
      </div>

      {/* "Lainnya" Card - Full Width */}
      <button
        type="button"
        onClick={() => onSelectCategory('OTHER')}
        className={cn(
          'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all',
          selectedCategory === 'OTHER'
            ? 'border-primary bg-primary/10'
            : 'border-dashed border-muted-foreground/30 hover:border-primary/50'
        )}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
          <Package className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="text-left flex-1">
          <p className="font-medium">Lainnya</p>
          <p className="text-sm text-muted-foreground">
            Jenis usaha tidak ada di daftar
          </p>
        </div>
        {selectedCategory === 'OTHER' && (
          <Check className="w-5 h-5 text-primary" />
        )}
      </button>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Kembali
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!selectedCategory}
          className="flex-1"
        >
          Lanjut
        </Button>
      </div>
    </div>
  );
}

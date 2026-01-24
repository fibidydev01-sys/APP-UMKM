import { z } from 'zod';

// ==========================================
// PRODUCT VALIDATION SCHEMAS (ZOD)
// ==========================================

/**
 * Product form schema
 */
export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama produk tidak boleh kosong')
    .max(200, 'Nama produk maksimal 200 karakter'),
  description: z
    .string()
    .max(1000, 'Deskripsi maksimal 1000 karakter')
    .optional(),
  category: z
    .string()
    .max(100, 'Kategori maksimal 100 karakter')
    .optional(),
  sku: z
    .string()
    .max(50, 'SKU maksimal 50 karakter')
    .optional(),
  price: z
    .number()
    .min(0, 'Harga tidak boleh negatif'),
  comparePrice: z
    .number()
    .min(0, 'Harga coret tidak boleh negatif')
    .optional(),
  costPrice: z
    .number()
    .min(0, 'Harga modal tidak boleh negatif')
    .optional(),
  stock: z
    .number()
    .min(0, 'Stok tidak boleh negatif')
    .optional(),
  minStock: z
    .number()
    .min(0, 'Stok minimum tidak boleh negatif')
    .optional(),
  trackStock: z.boolean().optional(),
  unit: z
    .string()
    .max(20, 'Satuan maksimal 20 karakter')
    .optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

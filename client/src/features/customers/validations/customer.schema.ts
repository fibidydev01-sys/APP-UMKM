import { z } from 'zod';

// ==========================================
// CUSTOMER VALIDATION SCHEMAS (ZOD)
// ==========================================

/**
 * Customer form schema
 * ✅ Phone validation untuk format TANPA prefix (81234567890)
 * ✅ Notes field REMOVED (not supported by backend yet)
 */
export const customerSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama pelanggan tidak boleh kosong')
    .max(100, 'Nama maksimal 100 karakter'),
  phone: z
    .string()
    .min(9, 'Nomor telepon minimal 9 digit')
    .max(13, 'Nomor telepon maksimal 13 digit')
    .regex(/^[0-9]{9,13}$/, 'Format nomor telepon tidak valid (contoh: 81234567890)'),
  email: z
    .string()
    .email('Format email tidak valid')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(300, 'Alamat maksimal 300 karakter')
    .optional(),
  // notes - REMOVED (backend tidak support)
});

export type CustomerFormData = z.infer<typeof customerSchema>;

import { z } from 'zod';

// ==========================================
// SETTINGS VALIDATION SCHEMAS (ZOD)
// ==========================================

/**
 * Store settings schema
 */
export const storeSettingsSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama toko minimal 3 karakter')
    .max(100, 'Nama toko maksimal 100 karakter'),
  description: z
    .string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional(),
  whatsapp: z
    .string()
    .min(1, 'Nomor WhatsApp tidak boleh kosong')
    .regex(/^62[0-9]{9,13}$/, 'Format WhatsApp harus diawali 62'),
  phone: z.string().optional(),
  address: z
    .string()
    .max(300, 'Alamat maksimal 300 karakter')
    .optional(),
  logo: z.string().optional(),
});

export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;

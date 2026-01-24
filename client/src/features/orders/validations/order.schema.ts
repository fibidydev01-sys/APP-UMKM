import { z } from 'zod';

// ==========================================
// ORDER VALIDATION SCHEMAS (ZOD)
// ==========================================

/**
 * Order item schema
 */
export const orderItemSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(1, 'Nama item tidak boleh kosong'),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  qty: z.number().min(1, 'Jumlah minimal 1'),
  notes: z.string().optional(),
});

/**
 * Order form schema
 */
export const orderSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Minimal 1 item dalam order'),
  discount: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export type OrderItemFormData = z.infer<typeof orderItemSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;

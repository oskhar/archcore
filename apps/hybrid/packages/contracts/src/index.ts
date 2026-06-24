import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string().min(1).max(50),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const InventorySchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  stockQuantity: z.number().int().min(0),
  lastSyncAt: z.date().optional(),
  version: z.number().int().min(0).optional(),
});

export const SalesItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const SaleSchema = z.object({
  id: z.string().uuid().optional(),
  totalAmount: z.number().positive(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']),
  items: z.array(SalesItemSchema).nonempty(),
  transactionDate: z.date().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
export type Inventory = z.infer<typeof InventorySchema>;
export type Sale = z.infer<typeof SaleSchema>;
export type SalesItem = z.infer<typeof SalesItemSchema>;

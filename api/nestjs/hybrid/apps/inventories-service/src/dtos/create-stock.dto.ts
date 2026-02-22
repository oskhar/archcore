import z from 'zod';

export const CreateStockSchema = z.object({
  product_id: z.number(),
  quantity: z.number(),
  type: z.enum(['out', 'in']),
});

export type CreateStockDto = z.infer<typeof CreateStockSchema>;

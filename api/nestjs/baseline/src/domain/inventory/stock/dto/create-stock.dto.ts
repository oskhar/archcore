import z from 'zod';

export const CreateStockSchema = z.object({
  quantity: z.number(),
  type: z.enum(['in', 'out']),
});

export type CreateStockDto = z.infer<typeof CreateStockSchema>;

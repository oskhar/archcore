import { z } from 'zod';

export const AdjustStockSchema = z.object({
  productId: z.string().uuid(),
  delta: z.number().int(),
});

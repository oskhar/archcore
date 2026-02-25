import z from 'zod';

export const FindAllStockSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  type: z.enum(['in', 'out'])
  minQuantity: z.coerce.number().int().optional(),
  maxQuantity: z.coerce.number().int().optional(),
  createdFrom: z.coerce.date().optional(),
  createdTo: z.coerce.date().optional(),
  sortBy: z.enum(['created_at', 'quantity', 'type']).default('created_at'),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
});

export type FindAllStockDto = z.infer<typeof FindAllStockSchema>;

import z from 'zod';

export const FindAllItemSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  minPrice: z.coerce.number().int().optional(),
  maxPrice: z.coerce.number().int().optional(),
  createdFrom: z.coerce.date().optional(),
  createdTo: z.coerce.date().optional(),
  sortBy: z.enum(['created_at', 'price', 'name']).default('created_at'),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
});

export type FindAllItemDto = z.infer<typeof FindAllItemSchema>;

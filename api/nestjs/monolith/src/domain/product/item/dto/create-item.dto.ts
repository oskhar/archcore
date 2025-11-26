import z from 'zod';

export const CreateItemSchema = z.object({
  sku: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
});

export type CreateItemDto = z.infer<typeof CreateItemSchema>;

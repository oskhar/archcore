import { z } from 'zod';

export const SalesItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const CreateTransactionSchema = z.object({
  items: z.array(SalesItemSchema).nonempty(),
});

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;

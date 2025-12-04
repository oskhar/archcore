import z from 'zod';

export const CreateTransactionSchema = z.object({
  transaction_number: z.string(),
  total_amount: z.coerce.number(),
  payment_method: z.enum(['cash', 'credit_card', 'e-wallet']),
  status: z.enum(['pending', 'complete', 'cancel']),
  item: z.array(
    z.object({
      unit_id: z.coerce.number(),
      item_id: z.coerce.number(),
      quantity: z.coerce.number(),
    }),
  ),
});

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;

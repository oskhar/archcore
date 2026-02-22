import z from 'zod';

export const DeleteStockSchema = z.object({
  id: z.number(),
});

export type DeleteStockDto = z.infer<typeof DeleteStockSchema>;

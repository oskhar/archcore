import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().positive(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  price: z.number().positive().optional(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;

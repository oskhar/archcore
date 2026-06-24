import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  description: z.string().optional(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;

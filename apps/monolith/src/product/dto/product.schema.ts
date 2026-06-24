import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  description: z.string().optional(),
  category: z.string().min(1).max(50),
});

export const CreateProductSchema = ProductSchema;
export const UpdateProductSchema = ProductSchema.partial();

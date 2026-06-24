import { z } from 'zod';
import { CreateProductSchema, UpdateProductSchema } from './product.schema';

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;

import { z } from 'zod';
import { CreateTransactionSchema } from './sales.schema';

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;

import { z } from 'zod';
import { AdjustStockSchema } from './inventory.schema';

export type AdjustStockDto = z.infer<typeof AdjustStockSchema>;

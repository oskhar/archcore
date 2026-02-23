import z from 'zod';

export const FindAllTransactionSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
    minTotalAmount: z.coerce.number().int().optional(),
    maxTotalAmount: z.coerce.number().int().optional(),
    status: z.enum(['pending', 'complete', 'cancel']).optional(),
    createdFrom: z.coerce.date().optional(),
    createdTo: z.coerce.date().optional(),
    sortBy: z.enum(['created_at', 'total_amount', 'transaction_number']).default('created_at'),
    sortOrder: z.enum(['ASC', 'DESC']).default('DESC'),
});

export type FindAllTransactionDto = z.infer<typeof FindAllTransactionSchema>;

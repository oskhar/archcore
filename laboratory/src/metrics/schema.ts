import { z } from 'zod';

export const ArtilleryOutputSchema = z.object({
  aggregate: z.object({
    summaries: z.record(z.string(), z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      count: z.number().optional(),
      p50: z.number(),
      median: z.number().optional(),
      p75: z.number().optional(),
      p90: z.number().optional(),
      p95: z.number(),
      p99: z.number(),
      p999: z.number().optional()
    })),
    counters: z.record(z.string(), z.number()),
    rates: z.record(z.string(), z.number()),
    vusers: z.object({
      created: z.number().optional(),
      completed: z.number().optional(),
      failed: z.number().optional(),
      created_by_scenario: z.record(z.string(), z.number()).optional()
    }).optional(),
    firstCounterAt: z.number().optional(),
    lastCounterAt: z.number().optional(),
    firstSummaryAt: z.number().optional(),
    lastSummaryAt: z.number().optional()
  }),
  intermediate: z.array(z.any()).optional()
});

export type ArtilleryOutput = z.infer<typeof ArtilleryOutputSchema>;

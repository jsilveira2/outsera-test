import { z } from 'zod';

export const awardIntervalSchema = z.object({
  producer: z.string(),
  interval: z.number().int(),
  previousWin: z.number().int(),
  followingWin: z.number().int(),
});

export const awardRangeSchema = z.object({
  min: z.array(awardIntervalSchema),
  max: z.array(awardIntervalSchema),
});

export type AwardIntervalDto = z.infer<typeof awardIntervalSchema>;
export type AwardRangeDto = z.infer<typeof awardRangeSchema>;

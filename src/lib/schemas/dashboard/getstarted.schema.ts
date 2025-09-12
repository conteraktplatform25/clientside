import { z } from 'zod';

export const profileLevelFormSchema = z.object({
  profileLogger: z.array(z.string()),
});

export type TProfileLevelFormSchema = z.infer<typeof profileLevelFormSchema>;

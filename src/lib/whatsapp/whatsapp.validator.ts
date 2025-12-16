import { z } from 'zod';

export const WhatsAppWebhookSchema = z.object({
  entry: z.array(
    z.object({
      changes: z.array(
        z.object({
          value: z.object({
            messages: z
              .array(
                z.object({
                  from: z.string(),
                  id: z.string(),
                  timestamp: z.string(),
                  type: z.string(),
                  text: z
                    .object({
                      body: z.string(),
                    })
                    .optional(),
                })
              )
              .optional(),
            statuses: z.array(z.any()).optional(),
          }),
        })
      ),
    })
  ),
});

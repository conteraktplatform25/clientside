import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

/* ------------------------------------------------------------------ */
/* Message Objects                                                     */
/* ------------------------------------------------------------------ */
const WhatsAppTextMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.literal('text'),
  text: z.object({
    body: z.string(),
  }),
});
const WhatsAppImageMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.literal('image'),
  image: z.object({
    id: z.string(),
    caption: z.string().optional(),
    mime_type: z.string().optional(),
  }),
});

const WhatsAppDocumentMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.literal('document'),
  document: z.object({
    id: z.string(),
    filename: z.string().optional(),
    mime_type: z.string().optional(),
  }),
});

/* Accept known message types + future ones */
const WhatsAppMessageSchema = z.union([
  WhatsAppTextMessageSchema,
  WhatsAppImageMessageSchema,
  WhatsAppDocumentMessageSchema,
]);

/* ------------------------------------------------------------------ */
/* Status Objects                                                      */
/* ------------------------------------------------------------------ */
const WhatsAppStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['sent', 'delivered', 'read', 'failed']),
  timestamp: z.string().optional(),
  recipient_id: z.string().optional(),
});

// export const WhatsAppWebhookSchema = z
//   .object({
//     entry: z.array(
//       z.object({
//         changes: z.array(
//           z.object({
//             value: z.object({
//               messages: z
//                 .array(
//                   z.object({
//                     from: z.string(),
//                     id: z.string(),
//                     timestamp: z.string(),
//                     type: z.string(),
//                     text: z
//                       .object({
//                         body: z.string(),
//                       })
//                       .optional(),
//                   })
//                 )
//                 .optional(),
//               statuses: z.array(z.any()).optional(),
//             }),
//           })
//         ),
//       })
//     ),
//   })
/* ------------------------------------------------------------------ */
/* Webhook Value                                                       */
/* ------------------------------------------------------------------ */
const WhatsAppWebhookValueSchema = z.object({
  metadata: z.object({
    phone_number_id: z.string(),
    display_phone_number: z.string().optional(),
  }),

  messages: z.array(WhatsAppMessageSchema).optional(),
  statuses: z.array(WhatsAppStatusSchema).optional(),
});

/* ------------------------------------------------------------------ */
/* Root Webhook Schema                                                 */
/* ------------------------------------------------------------------ */
export const WhatsAppWebhookSchema = z
  .object({
    entry: z.array(
      z.object({
        changes: z.array(
          z.object({
            value: WhatsAppWebhookValueSchema,
          })
        ),
      })
    ),
  })
  .openapi('WhatsAppWebhookPayload');

export type TWhatsAppMessagePayload = z.infer<typeof WhatsAppMessageSchema>;
export type TWhatsAppWebhookPayload = z.infer<typeof WhatsAppWebhookSchema>;

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ContactSource, ContactStatus } from '@prisma/client';
import { z } from 'zod';
import { PaginationResponsechema } from '../pagination.schema';

extendZodWithOpenApi(z);

/**=================================================================
 * Tag Implementation Schema
 */
export const CreateTagSchema = z
  .object({
    name: z.string().min(1, 'Tag name is required'),
    color: z
      .string()
      .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid color hex code')
      .optional()
      .openapi({ example: '#FFFFFF' }),
  })
  .openapi('CreateTagRequest');

export const UpdateTagSchema = CreateTagSchema.partial().openapi('UpdateTagRequest');

export const TagResponseSchema = z
  .object({
    id: z.string(),
    name: z.string().min(2),
    color: z.string().nullable().optional(),
    created_at: z.coerce.date(),
  })
  .openapi('TagReponse');

export const TagListResponseSchema = z.array(TagResponseSchema).openapi('TagListResponse');

export const TagDetailedResponseSchema = z
  .object({
    id: z.string(),
    name: z.string().min(2),
    color: z.string().nullable().optional(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
  })
  .openapi('TagDetailedReponse');

/**=================================================================
 =====================================================================
 */

/**=================================================================
 * Contact Implementation Schema
 */
export const ContactQuerySchema = z
  .object({
    page: z
      .union([z.string(), z.number()])
      .transform((v) => Number(v))
      .refine((n) => n > 0, 'Page must be positive')
      .default(1),

    limit: z
      .union([z.string(), z.number()])
      .transform((v) => Number(v))
      .default(10),
    search: z.string().optional(),
    sortBy: z.enum(['created_at', 'name']).default('created_at'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .openapi('ContactQuery');

export const CreateContactSchema = z
  .object({
    name: z.string().min(2),
    phone_number: z.string(),
    email: z.string().nullable().optional(),
    whatsapp_opt_in: z.boolean().default(true),
    custom_fields: z
      .record(
        z.string(),
        z.object({
          type: z.enum(['text', 'number', 'date', 'boolean']),
          value: z.any(),
        })
      )
      .optional(),
    source: z.string().nullable().optional(),
  })
  .openapi('CreateContactRequest');

export const UpdateContactSchema = z
  .object({
    name: z.string().min(2).optional(),
    phone_number: z.string().optional(),
    email: z.string().optional(),
    whatsapp_opt_in: z.boolean().optional(),
    custom_fields: z.record(z.string(), z.any()).optional(), // For flexible metadata like { city: "Lagos" }
    tags: z
      .array(
        z.object({
          name: z.string().min(1),
          color: z.string().optional(),
        })
      )
      .optional(),
  })
  .openapi('UpdateContactRequest');

export const TagSupportResponseSchema = z.object({
  name: z.string().min(2),
  color: z.string().nullable().optional(),
});

export const ContactTagSchema = z.object({
  id: z.string(),
  tag: TagSupportResponseSchema,
});

export const ContactResponseSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable(),
    phone_number: z.string(),
    email: z.string().nullable(),
    status: z.enum(ContactStatus),
    source: z.enum(ContactSource),
    contactTag: z.array(ContactTagSchema),
  })
  .openapi('ContactReponse');

export const ContactListResponseSchema = z
  .object({
    pagination: PaginationResponsechema,
    contacts: z.array(ContactResponseSchema),
  })
  .openapi('ContactListResponse');

export const ContactDetailsResponseSchema = z
  .object({
    id: z.uuid(),
    businessProfileId: z.uuid(),
    name: z.string().nullable(),
    phone_number: z.string(),
    email: z.string().nullable(),
    whatsapp_opt_in: z.boolean().nullable(),
    status: z.enum(ContactStatus),
    source: z.enum(ContactSource),
    custom_fields: z.record(z.string(), z.any()).optional(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    contactTag: z.array(ContactTagSchema),
  })
  .openapi('ContactDetailsReponse');

export const ContactDesktopResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    phone_number: z.string(),
    email: z.string().nullable(),
    totalAmountSpent: z.number(),
    lastOrderNumber: z.string().nullable().optional(),
    lastTag: z.string().nullable().optional(),
    totalTags: z.number().int().default(0),
    tagColor: z.string().nullable().optional(),
    dateCreated: z.coerce.date(),
  })
  .openapi('ContactDesktopReponse');

export const ContactDesktopListResponseSchema = z
  .object({
    pagination: PaginationResponsechema,
    contacts: z.array(ContactDesktopResponseSchema),
  })
  .openapi('ContactDesktopListResponse');

/**=================================================================
 =====================================================================
 */

/**=================================================================
 * ContactTag Implementation Schema
 */
export const CreateContactTagSchema = z
  .object({
    tagIds: z.array(z.uuid()), // Array of UUIDs
  })
  .openapi('CreateContactTagRequest');

export const ContactSupportResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone_number: z.string(),
  email: z.string().nullable().optional(),
  created_at: z.coerce.date(),
});

export const ContactTagResponseScheme = z
  .object({
    id: z.string(),
    tag: TagResponseSchema,
    contact: ContactSupportResponseSchema,
  })
  .openapi('ContactTagResponse');
export const ContactTagListResponseSchema = z.array(ContactTagResponseScheme).openapi('ContactTagListResponse');

// export const CreateContactTagSchema = z
//   .object({
//     name: z.string().min(1, 'Tag name is required').openapi({ example: 'ATTACH' }),
//     color: z
//       .string()
//       .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid color hex code')
//       .optional()
//       .openapi({ example: '#FFFFFF' }),
//     contactId: z.uuid('Invalid contact ID'),
//   })
//   .openapi('CreateContactTagRequest');

// export const UpdateContactTagSchema = z
//   .object({
//     name: z.string().min(1, 'Tag name is required').openapi({ example: 'ATTACH' }),
//     color: z
//       .string()
//       .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid color hex code')
//       .optional()
//       .openapi({ example: '#FFFFFF' }),
//   })
//   .openapi('UpdateContactTagRequest');

// export const BulkContactTagSchema = z.object({
//   tags: z.array(CreateContactTagSchema).min(1, 'At least one tag is required'),
// });

// export const ContactTagResponse = z.object({
//   id: z.uuid(),
//   name: z.string().openapi({ example: 'ATTACH' }),
//   color: z.string(),
//   contactId: z.uuid(),
//   createdAt: z.date(),
// });

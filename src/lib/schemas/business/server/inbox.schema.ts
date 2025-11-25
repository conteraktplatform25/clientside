// -----------------------------------------------------------------------------
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ContactStatus } from '@prisma/client';
import { z } from 'zod';
import { PaginationResponsechema } from '../pagination.schema';

extendZodWithOpenApi(z);
// Reusable enums
export const MessageChannelEnum = z.enum(['WHATSAPP', 'WEBCHAT', 'SMS', 'EMAIL']);
export const ConversationStatusEnum = z.enum(['OPEN', 'CLOSED', 'ARCHIVED']);
export const MessageDirectionEnum = z.enum(['INBOUND', 'OUTBOUND']);
export const MessageTypeEnum = z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'TEMPLATE', 'INTERACTIVE']);

/*****************************************
 * ****** Conversation ******************
 *****************************************/
export const ConversationQuerySchema = z
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
  })
  .openapi('ConversationQuery');

export const CreateConversationSchema = z
  .object({
    contactId: z.uuid(),
    assignedTo: z.uuid().optional(),
    channel: MessageChannelEnum.optional(),
  })
  .openapi('CreateConversation');

export const UpdateConversationSchema = z.object({
  status: ConversationStatusEnum.optional(),
  assignedTo: z.uuid().nullable().optional(),
});

const CreateContactResponseSchema = z.object({
  name: z.string().nullable(),
  phone_number: z.string(),
});

export const CreateConversationResponseSchema = z
  .object({
    id: z.string(),
    contact: CreateContactResponseSchema.optional(),
    channel: MessageChannelEnum,
    created_at: z.coerce.date(),
  })
  .openapi('CreateConversationResponse');

export const UpdateConversationResponseSchema =
  CreateConversationResponseSchema.partial().openapi('UpdateConversationResponse');

export const DeleteConversationResponseSchema = z
  .object({
    id: z.string(),
    status: ConversationStatusEnum,
    channel: MessageChannelEnum,
    updated_at: z.coerce.date(),
  })
  .openapi('DeleteConversationResponse');

const ContactResponseSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  phone_number: z.string(),
  status: z.enum(ContactStatus),
});

const UserResponseSchema = z.object({
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
});

export const ConversationResponseSchema = z
  .object({
    id: z.string(),
    contact: ContactResponseSchema.optional(),
    status: ConversationStatusEnum,
    channel: MessageChannelEnum,
    lastMessageAt: z.coerce.date(),
    created_at: z.coerce.date(),
    assignee: UserResponseSchema.nullable().optional(),
  })
  .openapi('ConversationResponse');

export const ConversationListResponseSchema = z
  .object({
    pagination: PaginationResponsechema,
    conversations: z.array(ConversationResponseSchema),
  })
  .openapi('ConversationListResponse');

const BusinessProfileDataSchema = z.object({
  id: z.string(),
  company_name: z.string(),
  business_number: z.string().nullable().optional(),
});

const ConversationDataSchema = z.object({
  id: z.string(),
  status: ConversationStatusEnum,
  channel: MessageChannelEnum,
  lastMessageAt: z.coerce.date(),
  businessProfile: BusinessProfileDataSchema,
});
const MessageDataResponseSchema = z.object({
  id: z.string(),
  senderContact: ContactResponseSchema,
  senderUser: UserResponseSchema,
  businessProfile: BusinessProfileDataSchema,
  channel: MessageChannelEnum,
  direction: MessageDirectionEnum,
  type: MessageTypeEnum,
  content: z.string().nullable().optional(),
  mediaUrl: z.string().nullable().optional(),
  mediaType: z.string().nullable().optional(),
  rawPayload: z.any().optional().nullable(),
  whatsappMessageId: z.string().nullable().optional(),
  created_at: z.coerce.date(),
});

export const MessageDetailsResponseSchema = z
  .object({
    conversation: ConversationDataSchema,
    messages: z.array(MessageDataResponseSchema),
    cursor: z.string().nullable().optional(),
  })
  .openapi('MessageDetailsResponse');

export type CreateConversationInput = z.infer<typeof CreateConversationSchema>;
export type UpdateConversationInput = z.infer<typeof UpdateConversationSchema>;

/***************************************************
 * *** ConversationUser (invite / join / leave)n ***
 ***************************************************/
export const CreateConversationUserSchema = z.object({
  conversationId: z.uuid(),
  userId: z.uuid(),
});

export type CreateConversationUserInput = z.infer<typeof CreateConversationUserSchema>;

/***************************************
 * ************** Message **************
 ***************************************/
export const CreateMessageSchema = z
  .object({
    conversationId: z.string().uuid().optional(), // optional if creating via webhook and conversation auto-created
    senderUserId: z.string().uuid().optional().nullable(),
    senderContactId: z.string().uuid().optional().nullable(),
    channel: MessageChannelEnum.optional(),
    direction: MessageDirectionEnum,
    type: MessageTypeEnum.optional().default('TEXT'),
    content: z.string().optional().nullable(),
    mediaUrl: z.string().url().optional().nullable(),
    mediaType: z.string().optional().nullable(),
    rawPayload: z.any().optional().nullable(),
    whatsappMessageId: z.string().optional().nullable(),
  })
  .openapi('CreateMessage');

export const CreateMessageResponseSchema = z
  .object({
    id: z.string(),
    senderContact: ContactResponseSchema,
    channel: MessageChannelEnum,
    direction: MessageDirectionEnum,
    type: MessageTypeEnum,
    created_at: z.coerce.date(),
  })
  .openapi('CreateMessageResponse');

export const MessageQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 50)),
  cursor: z.string().optional(),
});

export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
export type MessageQuery = z.infer<typeof MessageQuerySchema>;

// -----------------------------
//
// -----------------------------
/*************************************************
 * ********** Additional helper schemas **********
 **************************************************/
export const AssignConversationSchema = z.object({
  assignedTo: z.uuid().nullable(),
});

export const CloseConversationSchema = z.object({
  reason: z.string().optional(),
});

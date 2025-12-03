// -----------------------------------------------------------------------------
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ContactStatus } from '@prisma/client';
import { z } from 'zod';
import { PaginationResponsechema } from '../pagination.schema';
import { InfiniteData } from '@tanstack/react-query';

extendZodWithOpenApi(z);
// Reusable enums
export const MessageChannelEnum = z.enum(['WHATSAPP', 'WEBCHAT', 'SMS', 'EMAIL']);
export const ConversationStatusEnum = z.enum(['OPEN', 'CLOSED', 'ARCHIVED']);
export const MessageDirectionEnum = z.enum(['INBOUND', 'OUTBOUND']);
export const MessageTypeEnum = z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT']);
export const MessageDeliveryStatus = z.enum(['QUEUED', 'SENDING', 'PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED']);

export interface InboxFilterState {
  status: 'ALL' | 'OPEN' | 'CLOSED' | 'ARCHIVED';
  channel: 'ALL' | 'WHATSAPP' | 'WEBCHAT' | 'SMS' | 'EMAIL';
  assigned: 'ALL' | 'UNASSIGNED' | 'ME';
  search: string;
}

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
    lastMessagePreview: z.string().nullable().optional(),
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
  lastMessagePreview: z.string().nullable().optional(),
  businessProfile: BusinessProfileDataSchema,
});
export const MessageDataResponseSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderContact: ContactResponseSchema.nullable().optional(),
  senderUser: UserResponseSchema.nullable().optional(),
  businessProfile: BusinessProfileDataSchema,
  channel: MessageChannelEnum,
  direction: MessageDirectionEnum,
  deliveryStatus: MessageDeliveryStatus,
  type: MessageTypeEnum,
  content: z.string().nullable().optional(),
  mediaUrl: z.string().nullable().optional(),
  mediaType: z.string().nullable().optional(),
  rawPayload: z.any().optional().nullable(),
  whatsappMessageId: z.string().nullable().optional(),
  created_at: z.string(),
});

export const MessageDetailsResponseSchema = z
  .object({
    conversation: ConversationDataSchema,
    messages: z.array(MessageDataResponseSchema),
    cursor: z.string().nullable().optional(),
  })
  .openapi('MessageDetailsResponse');

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
    content: z.string().optional().nullable(),
    mediaUrl: z.string().url().optional().nullable(),
  })
  .openapi('CreateMessage');

export const CreateMessageResponseSchema = z
  .object({
    id: z.string(),
    conversationId: z.string(),
    senderContact: ContactResponseSchema.nullable().optional(),
    businessProfile: BusinessProfileDataSchema,
    channel: MessageChannelEnum,
    direction: MessageDirectionEnum,
    deliveryStatus: MessageDeliveryStatus,
    type: MessageTypeEnum,
    whatsappMessageId: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
    mediaUrl: z.string().nullable().optional(),
    created_at: z.string(),
  })
  .openapi('CreateMessageResponse');

export const MessageQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 50)),
  cursor: z.string().optional(),
});

// export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
// export type MessageQuery = z.infer<typeof MessageQuerySchema>;

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

export const StartConversationSchema = z.object({
  contactId: z.string(),
  //channel: z.enum(['WHATSAPP', 'WEBCHAT', 'SMS', 'EMAIL']).optional().default('WHATSAPP'),
});
export const InboxEvaluationSchema = z.object({
  conversationId: z.string(),
  contact: ContactResponseSchema.optional(),
  message: CreateMessageResponseSchema.optional(),
});

export type TMessagesInfinite = InfiniteData<TMessageDetailsResponse>;
export type TConversationQuery = z.infer<typeof ConversationQuerySchema>;
export type TConversationListResponse = z.infer<typeof ConversationListResponseSchema>;
export type TCreateConversation = z.infer<typeof CreateConversationSchema>;
export type TCreateConversationResponse = z.infer<typeof CreateConversationResponseSchema>;
export type TMessageQuery = z.infer<typeof MessageQuerySchema>;
export type TMessageDetailsResponse = z.infer<typeof MessageDetailsResponseSchema>;
export type TMessageDataResponse = z.infer<typeof MessageDataResponseSchema>;
export type TCreateMessage = z.infer<typeof CreateMessageSchema>;
export type TCreateMessageResponse = z.infer<typeof CreateMessageResponseSchema>;
export type TConversationResponse = z.infer<typeof ConversationResponseSchema>;
export type TStartConversation = z.infer<typeof StartConversationSchema>;
export type TContactResponse = z.infer<typeof ContactResponseSchema>;

export type TInboxRealtime = z.infer<typeof InboxEvaluationSchema>;

export type TBusinessProfileData = z.infer<typeof BusinessProfileDataSchema>;

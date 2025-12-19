/*************************************************
 * ********** /api/inbox/conversations **********
 **************************************************/
import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import {
  ConversationListResponseSchema,
  ConversationQuerySchema,
  CreateConversationResponseSchema,
  CreateConversationSchema,
  TCreateConversationResponse,
} from '@/lib/schemas/business/server/inbox.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 401);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    // const isMember = await checkBusinessMembership(user.id, businessProfileId);
    // if (!isMember) return failure('User is Forbidden to access', 403);

    const { searchParams } = new URL(req.url);
    const parsed = ConversationQuerySchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return failure(JSON.stringify(parsed.error.flatten()), 400);
    }

    const { page, limit, search } = parsed.data;
    const skip = (page - 1) * limit;

    const where: Prisma.ConversationWhereInput = {
      businessProfileId,
    };
    if (search) {
      where.OR = [
        { contact: { name: { contains: search, mode: 'insensitive' } } },
        { contact: { phone_number: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [conversationPaginated, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastMessageAt: 'desc' },
        select: {
          id: true,
          contact: { select: { id: true, name: true, phone_number: true, status: true } },
          status: true,
          channel: true,
          lastMessageAt: true,
          lastMessagePreview: true,
          created_at: true,
          assignee: { select: { first_name: true, last_name: true } },
        },
        //include: { contact: true, assignee: true, messages: { take: 1, orderBy: { created_at: 'desc' } } },
      }),
      prisma.conversation.count({ where }),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const responseData = {
      pagination: { page, limit, total, totalPages },
      conversations: conversationPaginated,
    };

    const conversations = ConversationListResponseSchema.parse(responseData);

    return success(conversations, 'List of conversation retrieved successfully');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /api/inbox/conversations error:', message);
    return failure(message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 401);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(CreateConversationSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const data = validation.data;

    // Ensure contact exists
    const contact = await prisma.contact.findUnique({ where: { id: data.contactId } });
    if (!contact) return failure('contact not found', 404);

    let responseData: TCreateConversationResponse | null = null;

    // Ensure if Conversation for the contact previously exist based on the status if its previously closed
    responseData = await prisma.conversation.findFirst({
      where: { contactId: data.contactId, status: 'OPEN' },
      select: {
        id: true,
        contact: { select: { name: true, phone_number: true } },
        channel: true,
        created_at: true,
      },
    });

    if (!responseData) {
      responseData = await prisma.conversation.create({
        data: {
          businessProfileId,
          contactId: data.contactId,
          assignedTo: data.assignedTo ?? null,
          channel: data.channel ?? 'WHATSAPP',
        },
        select: {
          id: true,
          contact: { select: { name: true, phone_number: true } },
          channel: true,
          created_at: true,
        },
      });

      // auto-add creator as participant
      if (!responseData) return failure('Failed to initiate Comversation with client', 403);
      await prisma.conversationUser.create({ data: { conversationId: responseData.id, userId: user.id } });
    }

    const conversation = CreateConversationResponseSchema.parse(responseData);

    return success({ conversation }, 'Conversation initiated successfully', 201);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/inbox/conversations error:', message);
    return failure(message, 500);
  }
}

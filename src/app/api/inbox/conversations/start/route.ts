import { authenticateRequest, authorizeRole } from '@/lib/auth';
import { validateRequest } from '@/lib/helpers/validation-request.helper';
import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';
import { StartConversationSchema } from '@/lib/schemas/business/server/inbox.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 401);
    const userId = user.id;

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const validation = await validateRequest(StartConversationSchema, req);
    if (!validation.success) return failure(validation.response, 401);

    const { contactId } = validation.data;

    // Use a transaction to find or create an OPEN conversation for (businessProfileId + contactId)
    const result = await prisma.$transaction(async (tx) => {
      // Validate contact exists and belongs to business
      const contact = await tx.contact.findUnique({
        where: { id: contactId },
        select: { id: true, businessProfileId: true },
      });
      if (!contact) {
        throw new Error('Contact not found');
      }
      if (contact.businessProfileId !== businessProfileId) {
        throw new Error('Contact does not belong to this business');
      }

      // Find an open conversation if exists
      let conversation = await tx.conversation.findFirst({
        where: {
          businessProfileId,
          contactId,
          status: 'OPEN',
        },
        select: {
          id: true,
          contact: { select: { id: true, name: true, phone_number: true, status: true } },
          assignee: { select: { first_name: true, last_name: true } },
          channel: true,
          status: true,
          lastMessageAt: true,
          lastMessagePreview: true,
          created_at: true,
        },
      });
      let created = false;
      if (!conversation) {
        // create new conversation
        conversation = await tx.conversation.create({
          data: {
            businessProfileId,
            contactId,
            channel: 'WHATSAPP',
            status: 'OPEN',
            lastMessageAt: new Date(),
            lastMessagePreview: null,
          },
          select: {
            id: true,
            contact: { select: { id: true, name: true, phone_number: true, status: true } },
            assignee: { select: { first_name: true, last_name: true } },
            channel: true,
            status: true,
            lastMessageAt: true,
            lastMessagePreview: true,
            created_at: true,
          },
        });
        created = conversation.created_at ? true : false;
      }

      // Ensure the current user is added as a ConversationUser (participant) if not present
      const existingParticipant = await tx.conversationUser.findUnique({
        where: {
          conversationId_userId: {
            conversationId: conversation.id,
            userId,
          },
        },
        select: { id: true },
      });

      if (!existingParticipant) {
        await tx.conversationUser.create({
          data: {
            conversationId: conversation.id,
            userId,
            joinedAt: new Date(),
            lastReadAt: new Date(),
            unreadCount: 0,
          },
          select: { id: true },
        });
      } else {
        // Optionally update lastReadAt if you want the opener to mark read
        await tx.conversationUser.update({
          where: { id: existingParticipant.id },
          data: { lastReadAt: new Date() },
          select: { id: true },
        });
      }
      return { conversation, created };
    });

    // Broadcast event to Pusher so agents see the new conversation in their list
    const channelName = `private-business-${businessProfileId}`;
    const eventName = result.created ? 'conversation.created' : 'conversation.opened';
    await pusherServer.trigger(channelName, eventName, {
      conversation: {
        id: result.conversation.id,
        contact: {
          id: result.conversation.contact?.id,
        },
        channel: result.conversation.channel,
        status: result.conversation.status,
        lastMessageAt: result.conversation.lastMessageAt,
        lastMessagePreview: result.conversation.lastMessagePreview,
        created_at: result.conversation.created_at,
      },
    });

    // Build response according to frontend CreateConversationResponseSchema
    const response = {
      id: result.conversation.id,
      contact: result.conversation.contact,
      assignee: result.conversation.assignee,
      channel: result.conversation.channel,
      status: result.conversation.status,
      lastMessageAt: result.conversation.lastMessageAt,
      lastMessagePreview: result.conversation.lastMessagePreview,
      created_at: result.conversation.created_at,
    };

    return success(response, 'Successful Conversation Initiated', 200);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /api/inbox/conversations/start error:', message);
    return failure(message, 500);
  }
}

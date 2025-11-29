/*************************************************
 * ********** /api/inbox/conversations/[id]/messages **********
 **************************************************/
import { authenticateRequest, authorizeRole } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';
import {
  CreateMessageResponseSchema,
  CreateMessageSchema,
  MessageDetailsResponseSchema,
  MessageQuerySchema,
} from '@/lib/schemas/business/server/inbox.schema';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import { NextRequest } from 'next/server';
import twilio from 'twilio';
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';

const twClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const conv = await prisma.conversation.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        lastMessageAt: true,
        lastMessagePreview: true,
        channel: true,
        businessProfile: { select: { id: true, company_name: true, business_number: true } },
      },
    });
    if (!conv) return failure('Conversation cannot be found', 404);

    // const isMember = await checkBusinessMembership(user.id, conv.businessProfile.id);
    // if (!isMember) return failure('User is Forbidden to access', 403);

    const { searchParams } = new URL(req.url);
    const parsed = MessageQuerySchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return failure(JSON.stringify(parsed.error.flatten()), 400);
    }

    const { limit, cursor } = parsed.data;

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { created_at: 'desc' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        conversationId: true,
        senderContact: { select: { id: true, name: true, phone_number: true, status: true } },
        senderUser: { select: { first_name: true, last_name: true } },
        businessProfile: { select: { id: true, company_name: true, business_number: true } },
        channel: true,
        direction: true,
        deliveryStatus: true,
        type: true,
        content: true,
        mediaUrl: true,
        mediaType: true,
        rawPayload: true,
        whatsappMessageId: true,
        created_at: true,
      },
    });

    let nextCursor: string | null = null;
    if (messages.length > limit) {
      const next = messages.pop();
      nextCursor = next?.id ?? null;
    }
    const responseData = {
      messages,
      conversation: conv,
      nextCursor,
    };

    const messageProfile = MessageDetailsResponseSchema.parse(responseData);

    return success(messageProfile, 'Successfully retrieved message');
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('GET /inbox/conversations/[id]/messages error:', err);
    return failure(message, 500);
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // 1️⃣ Auth + Role
    const user = await authenticateRequest(req);
    if (!user) return failure('Unauthorized', 404);

    const isAuthorized = authorizeRole(user, ['Business', 'Admin']);
    if (!isAuthorized) return failure('Forbidden: Insufficient permissions', 403);

    const businessProfileId = user.businessProfile?.[0]?.id;
    if (!businessProfileId) return failure('Business profile not configured.', 400);

    const conv = await prisma.conversation.findUnique({
      where: { id },
      select: {
        id: true,
        businessProfileId: true,
        businessProfile: { select: { company_name: true, business_number: true } },
        contact: { select: { name: true, phone_number: true, whatsapp_opt_in: true } },
        channel: true,
      },
    });
    if (!conv) return failure('Conversation cannot be found', 404);

    // const canSend = await userCan(user.id, businessProfileId, 'inbox.send');
    // if (!canSend) return failure('User is Forbidden to send message', 403);

    // 2️⃣ Parse + Validate Input
    const body = await req.json();
    const parsed = CreateMessageSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Zod validation error:', parsed.error.flatten());
      return failure('Invalid input: ' + JSON.stringify(parsed.error.flatten()), 400);
    }

    const { mediaUrl, content } = parsed.data;

    // create message as OUTBOUND
    const responseData = await prisma.message.create({
      data: {
        conversationId: id,
        businessProfileId,
        senderUserId: user.id,
        direction: 'OUTBOUND',
        type: mediaUrl ? 'IMAGE' : 'TEXT',
        content: content,
        mediaUrl: mediaUrl ?? null,
        deliveryStatus: 'PENDING',
      },
      select: {
        id: true,
        conversationId: true,
        senderContact: { select: { id: true, name: true, phone_number: true, status: true } },
        businessProfile: { select: { id: true, company_name: true, business_number: true } },
        channel: true,
        direction: true,
        type: true,
        content: true,
        mediaUrl: true,
        whatsappMessageId: true,
        created_at: true,
        deliveryStatus: true,
      },
    });

    // update conversation preview
    await prisma.conversation.update({
      where: { id },
      data: { lastMessageAt: new Date(), lastMessagePreview: content ?? mediaUrl ?? null },
      select: { id: true },
    });

    const registeredNumber = process.env.TWILIO_WHATSAPP_NUMBER!;
    console.log('API Messaging route: ', registeredNumber);
    if (conv.contact && conv.contact.whatsapp_opt_in && conv.channel === 'WHATSAPP') {
      (async () => {
        try {
          const from = `whatsapp:${registeredNumber}`;
          const to = `whatsapp:${conv.contact?.phone_number}`;
          const payload: MessageListInstanceCreateOptions = { from, to, body: content ?? undefined };
          if (mediaUrl) payload.mediaUrl = [mediaUrl];

          const twResp = await twClient.messages.create(payload);

          // update message record with SID and delivered status (SENT)
          await prisma.message.update({
            where: { id: responseData.id },
            data: { whatsappMessageId: twResp.sid, deliveryStatus: 'SENT', rawPayload: twResp },
          });
        } catch (err) {
          console.error('Twilio send failed', err);
          await prisma.message.update({
            where: { id: responseData.id },
            data: { deliveryStatus: 'FAILED', rawPayload: { error: String(err) } },
          });
          // optionally enqueue retry job
        }
        // notify clients of updated message (delivery status)
        await pusherServer.trigger(`private-business-${conv.businessProfileId}`, 'message.updated', {
          id: responseData.id,
        });
      })();
    }

    const messageProfile = CreateMessageResponseSchema.parse(responseData);

    return success({ messageProfile }, 'Message delivered successfully', 201);
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /inbox/conversations/[id]/messages error:', err);
    return failure(message, 500);
  }
}

import { validateTwilioSignature, twilioClient } from '@/lib/twilio';
import { triggerMessageCreated } from '@/lib/pusher';
import { NextRequest } from 'next/server';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';
import prisma from '@/lib/prisma';

/**
 * Disable body parsing so we can access raw body for signature verification
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // get raw text body
    const rawBody = await req.text(); // Twilio sends application/x-www-form-urlencoded

    // verify signature
    const signature = req.headers.get('x-twilio-signature') ?? '';
    const url = req.url; // full url Twilio called (must match publicly)
    const valid = validateTwilioSignature({ signature, url, rawBody });
    if (!valid) return failure('Invalid Twilio signature', 401);

    // parse the form-encoded params
    const params = Object.fromEntries(new URLSearchParams(rawBody)) as Record<string, string>;

    // Twilio fields of interest
    const from = (params['From'] || '').replace(/^whatsapp:/i, ''); // customer phone
    const to = (params['To'] || '').replace(/^whatsapp:/i, ''); // business phone (our WhatsApp number)
    const body = params['Body'] ?? null;
    const messageSid = params['MessageSid'] ?? null;
    const numMedia = Number(params['NumMedia'] ?? 0);

    // Lookup business by business_number
    const businessProfile = await prisma.businessProfile.findUnique({ where: { business_number: to } });
    if (!businessProfile) {
      // respond 200 to avoid Twilio retries but log
      console.error('Incoming message for unknown business number:', to, params);
      return success(true);
    }

    // Find or create contact (scoped to business)
    let contact = await prisma.contact.findFirst({
      where: { businessProfileId: businessProfile.id, phone_number: from },
    });
    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          businessProfileId: businessProfile.id,
          phone_number: from,
          name: null,
        },
      });
    }

    // Find an open conversation for this contact (prefer open, else create)
    let conversation = await prisma.conversation.findFirst({
      where: {
        businessProfileId: businessProfile.id,
        contactId: contact.id,
        status: 'OPEN',
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          businessProfileId: businessProfile.id,
          contactId: contact.id,
          channel: 'WHATSAPP',
        },
      });
    }

    // handle media if any (for simplicity, store first media)
    let mediaUrl: string | null = null;
    let mediaType: string | null = null;
    if (numMedia > 0) {
      // Twilio provides MediaUrl0, MediaContentType0, etc.
      mediaUrl = params['MediaUrl0'] ?? null;
      mediaType = params['MediaContentType0'] ?? null;
    }

    // Persist inbound message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        businessProfileId: businessProfile.id,
        senderContactId: contact.id,
        direction: 'INBOUND',
        type: mediaUrl ? 'IMAGE' : 'TEXT', // simple inference
        content: body,
        mediaUrl,
        mediaType,
        whatsappMessageId: messageSid ?? null,
        rawPayload: params,
      },
      include: {
        senderContact: true,
        conversation: true,
      },
    });

    // Update conversation lastMessageAt
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date(), status: 'OPEN' },
    });

    // Trigger Pusher event to notify any subscribed clients for this business
    const payload = {
      id: message.id,
      conversationId: message.conversationId,
      content: message.content,
      mediaUrl: message.mediaUrl,
      mediaType: message.mediaType,
      direction: message.direction,
      created_at: message.created_at,
      contact: { id: contact.id, phone_number: contact.phone_number, name: contact.name },
    };

    try {
      await triggerMessageCreated(businessProfile.id, payload);
    } catch (err) {
      console.error('Pusher trigger failed', err);
    }

    // Reply to Twilio with 200 OK quickly
    return success({ ok: true });
  } catch (err) {
    const message = getErrorMessage(err);
    console.error('POST /inbox/messages/whatsapp error:', err);
    return failure(message, 500);
  }
}

import { MessageType } from '@prisma/client';
import prisma from '../prisma';
import { getErrorMessage } from '@/utils/errors';
import { failure, success } from '@/utils/response';

type TInboundMessageParams = {
  phoneNumberId: string;
  from: string;
  whatsappMessageId: string;
  content: string;
};

export async function handleInboundWhatsAppMessage(params: TInboundMessageParams) {
  /************************************************************
   * 1. Resolve BusinessProfile from WhatsApp phone_number_id
   ***********************************************************/
  const businessProfile = await prisma.businessProfile.findUnique({
    where: {
      business_number: params.phoneNumberId,
    },
    select: { id: true },
  });
  if (!businessProfile) {
    console.warn('⚠️ Unknown business number:', params.phoneNumberId);
    return success(true, 'Unknown business. Acknowledged to Twilio.', 200);
  }
  const businessProfileId = businessProfile.id;

  try {
    await prisma.$transaction(async (tx) => {
      /********************************
       * 2. Resolve or create Contact
       ********************************/
      let contact = await tx.contact.findFirst({
        where: { businessProfileId, phone_number: params.from },
        select: {
          id: true,
        },
      });
      if (!contact) {
        contact = await tx.contact.create({
          data: {
            businessProfileId,
            phone_number: params.from,
            whatsapp_opt_in: true,
          },
          select: {
            id: true,
          },
        });
      }

      /*************************************
       * 3. Resolve or create Conversation
       *************************************/
      let conversation = await tx.conversation.findFirst({
        where: { businessProfileId, contactId: contact.id, status: 'OPEN' },
        select: {
          id: true,
        },
      });
      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            businessProfileId,
            contactId: contact.id,
            channel: 'WHATSAPP',
            lastMessageAt: new Date(),
            lastMessagePreview: params.content.slice(0, 120),
          },
          select: {
            id: true,
          },
        });
      } else {
        await tx.conversation.update({
          where: { id: conversation.id },
          data: {
            lastMessageAt: new Date(),
            lastMessagePreview: params.content.slice(0, 120),
          },
          select: {
            id: true,
          },
        });
      }

      /****************************
       * 4. Create INBOUND Message
       ****************************/
      const message = await tx.message.create({
        data: {
          businessProfileId,
          conversationId: conversation.id,
          senderContactId: contact.id,
          direction: 'INBOUND',
          type: MessageType.TEXT,
          content: params.content,
          whatsappMessageId: params.whatsappMessageId,
          deliveryStatus: 'SENT',
        },
        select: {
          id: true,
        },
      });
      return { contact, conversation, message };
    });
  } catch (err) {
    console.error('❌ DB transaction error:', getErrorMessage(err));
    return failure('Database transaction failed', 500);
  }
}

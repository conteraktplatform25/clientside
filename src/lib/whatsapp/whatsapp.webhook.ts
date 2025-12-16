// import { MessageDeliveryStatus, MessageDirection, MessageType } from '@prisma/client';
// import prisma from '../prisma';
// import { IInboundWhatsAppMessageProps } from './whatsapp.types';

// export async function processInboundWhatsAppMessage(params: IInboundWhatsAppMessageProps) {
//   const conversation = await prisma.conversation.upsert({
//     where: {
//       businessProfileId_contactId: {
//         businessProfileId: params.businessProfileId,
//         contactId: params.contactId,
//       },
//     },
//     update: {
//       lastMessageAt: new Date(),
//       lastMessagePreview: params.content.slice(0, 120),
//     },
//     create: {
//       businessProfileId: params.businessProfileId,
//       contactId: params.contactId,
//       channel: 'WHATSAPP',
//       lastMessagePreview: params.content.slice(0, 120),
//     },
//   })

//   await prisma.message.create({
//     data: {
//       businessProfileId: params.businessProfileId,
//       conversationId: conversation.id,
//       senderContactId: params.contactId,
//       channel: 'WHATSAPP',
//       direction: MessageDirection.INBOUND,
//       type: MessageType.TEXT,
//       content: params.content,
//       whatsappMessageId: params.whatsappMessageId,
//       deliveryStatus: MessageDeliveryStatus.DELIVERED,
//     },
//   });
// }

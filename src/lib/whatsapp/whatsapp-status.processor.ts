import { MessageDeliveryStatus } from '@prisma/client';
import prisma from '../prisma';

type TStatusUpdateParams = {
  whatsappMessageId: string;
  status: MessageDeliveryStatus;
};

export async function handleWhatsAppStatusUpdate(params: TStatusUpdateParams) {
  await prisma.message.update({
    where: {
      whatsappMessageId: params.whatsappMessageId,
    },
    data: {
      deliveryStatus: params.status,
    },
  });
}

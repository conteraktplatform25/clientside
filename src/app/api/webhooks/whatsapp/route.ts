import { handleInboundWhatsAppMessage } from '@/lib/whatsapp/whatsapp-inbound.processor';
import { mapWhatsAppStatus } from '@/lib/whatsapp/whatsapp-status.mapper';
import { handleWhatsAppStatusUpdate } from '@/lib/whatsapp/whatsapp-status.processor';
import { WhatsAppWebhookSchema } from '@/lib/whatsapp/whatsapp.validator';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const parsed = WhatsAppWebhookSchema.safeParse(body);
  console.log('Meta AI INBOUND Webhook Request:', parsed);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const value = body.entry[0].changes[0].value;

  // 📩 INBOUND MESSAGES
  if (value.messages) {
    const phoneNumberId = value.metadata.phone_number_id;

    for (const msg of value.messages) {
      await handleInboundWhatsAppMessage({
        phoneNumberId,
        from: msg.from,
        whatsappMessageId: msg.id,
        content: msg.text?.body ?? '',
      });
    }
  }

  // 📦 DELIVERY STATUS UPDATES
  if (value.statuses) {
    for (const status of value.statuses) {
      await handleWhatsAppStatusUpdate({
        whatsappMessageId: status.id,
        status: mapWhatsAppStatus(status.status),
      });
    }
  }
}

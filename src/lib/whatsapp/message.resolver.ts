import { TSendWhatsAppMessageInput } from './whatsapp.types';

export function resolveWhatsAppPayload(input: TSendWhatsAppMessageInput) {
  switch (input.type) {
    case 'TEXT':
      return {
        messaging_product: 'whatsapp',
        to: input.to,
        type: 'text',
        text: {
          body: input.content,
        },
      };

    case 'IMAGE':
      return {
        messaging_product: 'whatsapp',
        to: input.to,
        type: 'image',
        image: {
          link: input.imageUrl,
          caption: input.caption,
        },
      };

    case 'VIDEO':
      return {
        messaging_product: 'whatsapp',
        to: input.to,
        type: 'video',
        video: {
          link: input.videoUrl,
          caption: input.caption,
        },
      };

    case 'DOCUMENT':
      return {
        messaging_product: 'whatsapp',
        to: input.to,
        type: 'document',
        document: {
          link: input.documentUrl,
          filename: input.filename,
        },
      };

    case 'TEMPLATE':
      return {
        messaging_product: 'whatsapp',
        to: input.to,
        type: 'template',
        template: {
          name: input.templateName,
          language: {
            code: input.language ?? 'en_US',
          },
        },
      };

    default:
      throw new Error('Unsupported WhatsApp message type');
  }
}

export type WhatsAppTextMessagePayload = {
  messaging_product: 'whatsapp';
  to: string;
  type: 'text';
  text: {
    body: string;
  };
};

export type WhatsAppTemplateMessagePayload = {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: {
      code: string;
    };
    components?: unknown[];
  };
};

export type WhatsAppSendResponse = {
  messages: {
    id: string;
  }[];
};

export interface ISendMessageRequestProps {
  businessProfileId: string;
  conversationId: string;
  senderUserId: string;
  to: string;
  content: string;
}

export interface ISendTemplateMessageRequestProps {
  businessProfileId: string;
  conversationId: string;
  senderUserId: string;
  to: string;
  templateName: string;
  language?: string;
}

export interface IInboundWhatsAppMessageProps {
  businessProfileId: string;
  contactId: string;
  from: string;
  content: string;
  whatsappMessageId: string;
}

export type TSendWhatsAppMessageInput =
  | {
      type: 'TEXT';
      to: string;
      content: string;
    }
  | {
      type: 'IMAGE';
      to: string;
      imageUrl: string;
      caption?: string;
    }
  | {
      type: 'VIDEO';
      to: string;
      videoUrl: string;
      caption?: string;
    }
  | {
      type: 'DOCUMENT';
      to: string;
      documentUrl: string;
      filename?: string;
    }
  | {
      type: 'TEMPLATE';
      to: string;
      templateName: string;
      language?: string;
    };

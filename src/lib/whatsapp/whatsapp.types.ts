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

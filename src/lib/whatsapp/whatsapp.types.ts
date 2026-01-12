export type WhatsappAvailability = 'in stock' | 'out of stock';

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

export interface WhatsappCatalogProductPayload {
  retailer_id: string;
  name: string;
  description?: string;
  price: string; // "1000 NGN"
  availability: WhatsappAvailability;
  image_url: string;
  category?: string;
}

export interface WhatsappCatalogSuccessResponse {
  id: string;
}

export interface WhatsappCatalogErrorResponse {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}

export type TMetaTokenResponse = {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
};

export type TMetaBusiness = {
  id: string;
  name: string;
};

export type TMetaWABA = {
  id: string;
  name: string;
};

export type TMetaPhoneNumber = {
  id: string;
  display_phone_number: string;
  verified_name?: string;
};

export type TWhatsAppDiscoveryResult = {
  metaBusinessId: string;
  wabaId: string;
  phoneNumbers: TMetaPhoneNumber[];
};

export type WhatsappCatalogResponse = WhatsappCatalogSuccessResponse | WhatsappCatalogErrorResponse;

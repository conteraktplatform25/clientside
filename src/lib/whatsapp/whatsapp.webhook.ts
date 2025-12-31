import { TProductResponse } from '../hooks/business/catalogue-sharing.hook';
import { WhatsappCatalogProductPayload, WhatsappCatalogResponse } from './whatsapp.types';
import { formatPrice, mapAvailability } from './whatsapp-helpers';

const BASE_URL = process.env.META_AI_WHATSAPP_BASEURL;
const API_VERSION = process.env.META_AI_WHATSAPP_API_VERSION!;
const CATALOGUE_ID = process.env.META_AI_WHATSAPP_CATALOGUE_ID!;

export async function sendProductToWhatsappCatalog(product: TProductResponse): Promise<string> {
  if (!product.media?.length) {
    throw new Error('Product must have at least one image');
  }

  const payload: WhatsappCatalogProductPayload = {
    retailer_id: product.id,
    name: product.name,
    description: product.description ?? undefined,
    price: formatPrice(product.price.toString(), product.currency),
    availability: mapAvailability(product.stock),
    image_url: product.media[0].url,
    category: product.category?.name,
  };

  const WHATSAPP_ENDPOINT = `${BASE_URL}/${API_VERSION}/${CATALOGUE_ID}/product`;

  const response = await fetch(WHATSAPP_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response) throw new Error('Failed to connect to whatsapp service.');

  const json = (await response.json()) as WhatsappCatalogResponse;

  // ❌ Meta error handling
  if (!response.ok || 'error' in json) {
    const message = 'error' in json ? json.error.message : 'Unknown WhatsApp catalog error';

    throw new Error(message);
  }

  return json.id; // WhatsApp catalog product ID
}

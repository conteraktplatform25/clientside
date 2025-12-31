import { WhatsappAvailability } from './whatsapp.types';

export function mapAvailability(stock: number): WhatsappAvailability {
  return stock > 0 ? 'in stock' : 'out of stock';
}

export function formatPrice(price: number | string, currency: string): string {
  return `${price} ${currency}`;
}

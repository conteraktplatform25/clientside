import { customAlphabet } from 'nanoid';

export function generateOrderNumber(profileId: string): string {
  // Example: ORD-20251117-6G4K (YYYYMMDD-rand)
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);
  const prefix = profileId.substring(0, 3).toUpperCase();
  const now = new Date();

  const nanoidValue = nanoid();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');

  // Format like ORDER-INT-A4S7DI20251115
  return `#${prefix}${date}${nanoidValue}`;
}

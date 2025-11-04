import { customAlphabet } from 'nanoid';

export function generateOrderNumber(profileId: string): string {
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);
  const prefix = profileId.substring(0, 4).toUpperCase();

  const nanoidValue = nanoid();

  // Format like TAKT-INT-2025-A4S7DI
  const year = new Date().getFullYear();
  return `TAKT-${prefix}-${year}-${nanoidValue}`;
}

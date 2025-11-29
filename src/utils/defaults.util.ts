import { TBusinessHourRecord } from '@/lib/hooks/business/business-settings.hook';

export const defaultBusinessHours = (): TBusinessHourRecord => ({
  monday: { open: '09:00', close: '17:00' },
  tuesday: { open: '09:00', close: '17:00' },
  wednesday: { open: '09:00', close: '17:00' },
  thursday: { open: '09:00', close: '17:00' },
  friday: { open: '09:00', close: '17:00' },
  saturday: { open: null, close: null },
  sunday: { open: null, close: null },
});

export function hasTimestamp(x: unknown): x is { timestamp: string } {
  return typeof x === 'object' && x !== null && 'timestamp' in x;
}

import { TBusinessHourRecord } from '@/lib/hooks/business/business-settings.hook';
import { formatInTimeZone } from 'date-fns-tz';

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

export function metaTimestampToDate(timestamp: string): Date {
  return new Date(Number(timestamp) * 1000);
}

export function getLocalMessageTime(utc: string): string {
  const date = new Date(utc);

  if (isNaN(date.getTime())) return '--:--';

  return formatInTimeZone(date, Intl.DateTimeFormat().resolvedOptions().timeZone, 'HH:mm');
}

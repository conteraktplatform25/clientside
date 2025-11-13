import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export function formatDateField(isoDate?: string | Date | null, options?: { relative?: boolean }): string {
  if (!isoDate) return '—';

  const date = typeof isoDate === 'string' ? parseISO(isoDate) : isoDate;
  if (!isValid(date)) return '—';

  // ✅ If relative option is on, show "3 days ago" or "Yesterday"
  if (options?.relative) {
    const diffInDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays < 7) {
      return formatDistanceToNow(date, { addSuffix: true }); // e.g., "3 days ago"
    }
  }

  // ✅ Otherwise, show formatted date
  return format(date, 'dd/MM/yyyy');
}

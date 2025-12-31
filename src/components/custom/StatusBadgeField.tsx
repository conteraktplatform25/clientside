import { cn } from '@/lib/utils';
import { ProductStatus } from '@prisma/client';

interface StatusBadgeProps {
  status: ProductStatus;
}

const STATUS_STYLES: Record<ProductStatus, string> = {
  DRAFT: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  ACTIVE: 'bg-primary-100 text-primary-700 border-primary-300',
  PUBLISHED: 'bg-green-100 text-green-700 border-green-300',
  ARCHIVED: 'bg-red-100 text-red-700 border-red-300',
};

const STATUS_LABELS: Record<ProductStatus, string> = {
  DRAFT: 'Draft (Not visible to customers)',
  ACTIVE: 'Active (Ready for sale but not yet published)',
  PUBLISHED: 'Live on WhatsApp & Store',
  ARCHIVED: 'Archived (No longer available for sale)',
};

export const StatusBadgeField = ({ status }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
};

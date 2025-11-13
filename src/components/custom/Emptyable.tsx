import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface IEmptyTableProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyTable({
  title,
  description = 'No data available.',
  icon,
  actionText,
  onAction,
}: IEmptyTableProps) {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center space-y-4'>
      <div className='text-6xl text-gray-300'>{icon ?? '📭'}</div>
      <h3 className='text-lg font-semibold text-neutral-800'>{title}</h3>
      <p className='text-sm text-neutral-500'>{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className='mt-2 bg-primary-base text-white rounded-md flex items-center gap-2'>
          <PlusCircle size={16} /> {actionText}
        </Button>
      )}
    </div>
  );
}

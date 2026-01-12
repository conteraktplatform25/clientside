import { ReactNode, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CreateContactDrawer } from '@/app/(business)/contacts/custom/CreateContactDialog';

interface IEmptyTableProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionText?: string;
}

export function EmptyTable({ title, description = 'No data available.', icon, actionText }: IEmptyTableProps) {
  const [isCreateContactDialogOpen, setIsCreateContactDialogOpen] = useState<boolean>(false);
  const openCreateDrawer = useCallback(() => setIsCreateContactDialogOpen(true), []);
  const closeCreateDrawer = useCallback(() => setIsCreateContactDialogOpen(false), []);
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center space-y-4'>
      <div className='text-6xl text-gray-300'>{icon ?? '📭'}</div>
      <h3 className='text-lg font-semibold text-neutral-800'>{title}</h3>
      <p className='text-sm text-neutral-500'>{description}</p>
      {actionText && (
        <Button
          onClick={openCreateDrawer}
          className='mt-2 bg-primary-base text-white rounded-md flex items-center gap-2'
        >
          <PlusCircle size={16} /> {actionText}
        </Button>
      )}
      <CreateContactDrawer open={isCreateContactDialogOpen} onClose={closeCreateDrawer} />
    </div>
  );
}

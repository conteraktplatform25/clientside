import { ReactNode } from 'react';

interface IEmptyQuickReplyProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function EmptyQuickReplyProps({ title, description = 'No data available.', icon }: IEmptyQuickReplyProps) {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center space-y-4'>
      <div className='text-6xl text-gray-300'>{icon ?? '📭'}</div>
      <h3 className='text-lg font-semibold text-neutral-800'>{title}</h3>
      <p className='text-sm text-neutral-500'>{description}</p>
    </div>
  );
}

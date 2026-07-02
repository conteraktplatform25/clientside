import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { Button } from '../ui/button';

type TAlertType = 'success' | 'error' | null;

export interface IAlertProps {
  type: TAlertType;
  title?: string;
  description?: string;
  onClose?: () => void;
}

const AlertDisplayField: React.FC<IAlertProps> = ({ type, title, description, onClose }) => {
  const isSuccess = type === 'success';
  return (
    <Alert
      variant='default'
      className={`mt-2 flex flex-col gap-2 border-l-3 ${
        isSuccess ? 'border-green-500 bg-green-50 text-green-800' : 'border-red-500 bg-red-50 text-red-800'
      }`}
    >
      <div className='w-full flex items-start justify-between gap-1'>
        <div className='flex items-start gap-4'>
          {isSuccess ? <CheckCircle2 className='h-5 w-5 mt-0.5' /> : <XCircle className='h-5 w-5 mt-0.5' />}
          <div className='block space-y-0.5'>
            <AlertTitle>{title}</AlertTitle>
            {description && <AlertDescription>{description}</AlertDescription>}
          </div>
        </div>
        {onClose && (
          <div className='flex items-end text-right'>
            <Button onClick={onClose} variant='ghost' className='bg-transparent text-primary-base'>
              <X size={20} />
            </Button>
          </div>
        )}
      </div>
    </Alert>
  );
};

export default AlertDisplayField;

import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IErrorServerFieldProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

const ErrorServerField: React.FC<IErrorServerFieldProps> = ({
  title = 'Something went wrong',
  description = 'We couldn’t load the requested data. Please try again.',
  onRetry,
}) => {
  return (
    <div className='flex items-center justify-center min-h-[60vh] bg-white px-4'>
      <div
        className='
          w-full max-w-md
          rounded-2xl
          border border-error-200
          bg-error-50
          p-6
          text-center
        '
      >
        <div
          className='
            mx-auto mb-4 flex h-12 w-12 items-center justify-center
            rounded-full
            bg-error-100
            text-error-base
          '
        >
          <AlertTriangle className='h-6 w-6' />
        </div>
        <h2 className='text-lg font-semibold text-[var(--color-error-800)]'>{title}</h2>
        <p className='mt-2 text-sm text-[var(--color-error-700)]'>{description}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant='outline'
            className='
              mt-6
              border-[var(--color-error-300)]
              text-[var(--color-error-700)]
              hover:bg-[var(--color-error-100)]
            '
          >
            <RefreshCcw className='mr-2 h-4 w-4' />
            Try again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorServerField;

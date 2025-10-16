'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxIndeterminateProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
}

const CheckboxIndeterminate = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxIndeterminateProps
>(({ className, indeterminate, ...props }, ref) => {
  const internalRef = React.useRef<HTMLButtonElement>(null);

  React.useImperativeHandle(ref, () => internalRef.current!, [internalRef]);

  React.useEffect(() => {
    if (internalRef.current) {
      // Manually set the data-state attribute for indeterminate styling
      internalRef.current.dataset.state = indeterminate ? 'indeterminate' : props.checked ? 'checked' : 'unchecked';
    }
  }, [indeterminate, props.checked]);

  return (
    <CheckboxPrimitive.Root
      ref={internalRef}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-base data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
        {indeterminate ? (
          // Custom indicator for indeterminate state (e.g., a dash or dot)
          <div className='h-2 w-2 rounded-full bg-primary-foreground' />
        ) : (
          // Default checkmark for checked state
          <Check className='h-4 w-4' />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
CheckboxIndeterminate.displayName = 'CheckboxIndeterminate';

export { CheckboxIndeterminate };

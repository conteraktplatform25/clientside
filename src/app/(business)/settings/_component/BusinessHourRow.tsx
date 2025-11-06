'use client';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // or your custom InputField
import { Button } from '@/components/ui/button';
import React from 'react';
import { TBusinessProfileForm } from '@/lib/schemas/business/client/client-settings.schema';

interface BusinessHourRowProps {
  day: keyof TBusinessProfileForm['business_hour'];
  register: UseFormRegister<TBusinessProfileForm>;
  watch: UseFormWatch<TBusinessProfileForm>;
  setValue: UseFormSetValue<TBusinessProfileForm>;
}

export const BusinessHourRow: React.FC<BusinessHourRowProps> = ({ day, register, watch, setValue }) => {
  const open = watch(`business_hour.${day}.open` as const);
  const close = watch(`business_hour.${day}.close` as const);
  const isClosed = open === null && close === null;

  const toggleClosed = () => {
    if (isClosed) {
      setValue(`business_hour.${day}.open`, '09:00');
      setValue(`business_hour.${day}.close`, '17:00');
    } else {
      setValue(`business_hour.${day}.open`, null);
      setValue(`business_hour.${day}.close`, null);
    }
  };

  return (
    <div className='flex items-center justify-between border p-3 rounded-lg bg-white shadow-sm'>
      <Label className='capitalize w-24 text-xs leading-[155%]'>{day}</Label>
      <div className='flex items-center gap-2'>
        <Input
          type='time'
          {...register(`business_hour.${day}.open` as const)}
          disabled={isClosed}
          className='border rounded-md px-2 py-1 text-xs leading-[155%]'
        />
        <span>-</span>
        <Input
          type='time'
          {...register(`business_hour.${day}.close` as const)}
          disabled={isClosed}
          className='border rounded-md px-2 py-1 text-xs leading-[155%]'
        />
        <Button
          type='button'
          onClick={toggleClosed}
          variant='ghost'
          className='ml-2 text-xs leading-[155%] text-white hover:text-white bg-neutral-base hover:bg-neutral-700'
        >
          {isClosed ? 'Set Open' : 'Mark Closed'}
        </Button>
      </div>
    </div>
  );
};

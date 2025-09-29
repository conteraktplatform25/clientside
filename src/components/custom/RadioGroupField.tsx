import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface RadioGroupFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  control: Control<T>;
  options: string[];
  orientation?: 'vertical' | 'horizontal';
}

export default function RadioGroupField<T extends FieldValues>({
  name,
  label,
  control,
  options,
  orientation = 'vertical',
}: RadioGroupFieldProps<T>) {
  return (
    <div className='mb-2'>
      {label ? <Label className='font-normal text-sm mb-2'>{label}</Label> : null}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className={`flex ${orientation === 'vertical' ? 'flex-col gap-2' : 'flex-row gap-4'}`}
            >
              {options.map((opt) => (
                <div key={opt} className='flex items-center space-x-2'>
                  <RadioGroupItem
                    id={`${name}-${opt}`}
                    value={opt}
                    className='border-gray-400 hover:bg-neutral-100 data-[state=checked]:bg-primary-base data-[state=checked]:text-white'
                  />
                  <Label htmlFor={`${name}-${opt}`}>{opt}</Label>
                </div>
              ))}
            </RadioGroup>

            {fieldState.error && <p className='text-sm text-red-500 mt-1'>{fieldState.error.message}</p>}
          </div>
        )}
      />
    </div>
  );
}

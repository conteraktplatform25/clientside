import React from 'react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface CheckboxGroupFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  control: Control<T>;
  options: string[];
  description?: string[];
  showMoreStatus?: boolean;
}

export default function CheckboxGroupField<T extends FieldValues>({
  name,
  label,
  control,
  options,
  description,
  showMoreStatus = false,
}: CheckboxGroupFieldProps<T>) {
  return (
    <div className='mb-6'>
      {label ? <Label className='font-semibold text-sm mb-2'>{label}</Label> : null}
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const currentValues: string[] = field.value || [];

          const handleToggle = (optionValue: string) => {
            if (currentValues.includes(optionValue)) {
              field.onChange(currentValues.filter((v) => v !== optionValue));
            } else {
              field.onChange([...currentValues, optionValue]);
            }
          };

          return (
            <div className='flex flex-col gap-8'>
              {options.map((opt, index) => (
                <div key={opt} className='flex items-center space-x-2 '>
                  <Checkbox
                    id={`${name}-${opt}`}
                    checked={currentValues.includes(opt)}
                    onCheckedChange={() => handleToggle(opt)}
                    className='border-gray-400 hover:bg-gray-100 data-[state=checked]:bg-primary-base data-[state=checked]:text-white'
                  />
                  <div className='flex flex-col gap-1'>
                    <Label className='text-sm leading-4 font-normal' htmlFor={`${name}-${opt}`}>
                      {opt}
                    </Label>
                    {description && (
                      <span className='w-full max-w-[200px] text-xs font-normal text-gray-600'>
                        {description[index]}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        }}
      />
      {showMoreStatus && <div className='mt-4 text-[#0D5AB9] font-normal text-sm'>Show more</div>}
    </div>
  );
}

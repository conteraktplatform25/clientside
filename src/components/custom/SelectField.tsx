import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { ISelectOption } from '@/type/client/default.type';
import { isSelectOption } from '@/lib/hooks/default.hook';

interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  options: string[] | ISelectOption[];
  placeholder?: string;
  className?: string;
  important?: boolean;
}

export default function SelectField<T extends FieldValues>({
  name,
  label,
  control,
  options,
  placeholder,
  className,
  important,
}: SelectFieldProps<T>) {
  return (
    <div className='relative mb-1 w-full'>
      {label && (
        <div className='flex items-start gap-1'>
          <label className='text-sm'>{label}</label>
          {important && <span className='text-error-600 font-black'>*</span>}
        </div>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          return (
            <div className='relative w-full'>
              <Select value={field.value ?? ''} onValueChange={field.onChange}>
                <SelectTrigger
                  id={name as string}
                  className={`text-left focus-visible:border-none focus-visible:ring-ring/10 bg-white pb-4 pt-6 hover:bg-gray-50 ${className}`}
                >
                  <SelectValue placeholder={placeholder || label} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => {
                    if (isSelectOption(opt)) {
                      return (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      );
                    } else {
                      return (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      );
                    }
                  })}
                </SelectContent>
              </Select>

              {fieldState.error && <p className='text-sm text-red-500 mt-1'>{fieldState.error.message}</p>}
            </div>
          );
        }}
      />
    </div>
  );
}

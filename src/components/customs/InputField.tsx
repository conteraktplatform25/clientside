import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Input } from '../ui/input';

interface InputFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  control: Control<T>;
  type?: React.HTMLInputTypeAttribute | undefined;
  placeholder?: string;
  className?: string;
  important?: boolean;
  disabled?: boolean;
}

export default function InputField<T extends FieldValues>({
  name,
  label,
  control,
  type = 'text',
  placeholder,
  className,
  important,
  disabled = false,
}: InputFieldProps<T>) {
  return (
    <div className='w-full'>
      {label && (
        <div className='flex items-start gap-1'>
          <label className='text-sm'>{label}</label>
          {important && <span className='text-error-600 font-black'>*</span>}
        </div>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className={`border rounded py-2 px-4 w-full ${className}`}
              disabled={disabled}
            />
            {fieldState.error && <p className='text-red-500 text-sm'>{fieldState.error.message}</p>}
          </>
        )}
      />
    </div>
  );
}

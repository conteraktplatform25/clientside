import React, { useState } from 'react';
import { Control, Controller, ControllerFieldState, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { Input } from '../ui/input';

interface PriceInputProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>;
  fieldState: ControllerFieldState;
  formatCurrency: (value: string | number | undefined) => string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

interface PriceInputFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  control: Control<T>;
  placeholder?: string;
  className?: string;
  important?: boolean;
  disabled?: boolean;
  locale?: string;
  currency?: string;
}

export default function PriceInputField<T extends FieldValues>({
  name,
  label,
  control,
  placeholder,
  className,
  important,
  disabled = false,
  locale = 'en-US',
  currency = 'NGN',
}: PriceInputFieldProps<T>) {
  const formatCurrency = (value: string | number | undefined) => {
    if (value === '' || value == null) return '';
    const num = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(num);
  };
  return (
    <div className='w-full'>
      {label && (
        <div className='flex items-start gap-1 mb-1'>
          <label className='text-sm'>{label}</label>
          {important && <span className='text-error-600 font-black'>*</span>}
        </div>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <PriceInput
            field={field}
            fieldState={fieldState}
            formatCurrency={formatCurrency}
            placeholder={placeholder}
            className={className}
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}

function PriceInput<T extends FieldValues>({
  field,
  fieldState,
  formatCurrency,
  placeholder,
  className,
  disabled,
}: PriceInputProps<T>) {
  const [displayValue, setDisplayValue] = useState(formatCurrency(field.value));

  const handleFocus = () => {
    setDisplayValue(field.value ?? '');
  };
  const handleBlur = () => {
    setDisplayValue(formatCurrency(field.value));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d.]/g, '');
    const numericValue = parseFloat(raw);
    field.onChange(isNaN(numericValue) ? undefined : numericValue);
    setDisplayValue(raw);
  };

  return (
    <>
      <Input
        {...field}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder ?? 'NGN0.00'}
        className={`border rounded py-2 px-4 w-full text-right ${className}`}
        disabled={disabled}
      />
      {fieldState.error && <p className='text-red-500 text-sm mt-1'>{fieldState.error.message}</p>}
    </>
  );
}

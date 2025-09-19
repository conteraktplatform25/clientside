import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, Path, FieldValues, Control } from 'react-hook-form';
import { useSelectFilterStore } from '@/lib/store/business/inbox';

interface ISelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  brief: 'chat_status' | 'tag_labels' | 'assignee' | 'sort_order';
  label: string;
  options: string[];
  control: Control<T>;
  className?: string;
}

export default function SelectFilterField<T extends FieldValues>({
  name,
  brief,
  label,
  control,
  options,
  className,
}: ISelectFieldProps<T>) {
  const setFilter = useSelectFilterStore((state) => state.setFilter);
  return (
    <div className='w-full'>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className='flex flex-col gap-1'>
            {label && <label className='text-sm'>{label}</label>}
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                setFilter(brief, value); // Sync Zustand
              }}
              value={field.value}
            >
              <SelectTrigger
                id={name as string}
                className={`text-left focus-visible:border-none rounded-sm focus-visible:ring-ring/10 bg-white pb-4 pt-6 hover:bg-gray-50 ${className}`}
              >
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      />
    </div>
  );
}

//export default SelectFilterField;

'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface IAPIDateRange {
  from?: string;
  to?: string;
}

interface IDateRangePickerProps {
  value?: IAPIDateRange;
  onChange: (value: IAPIDateRange) => void;
}

export function DateRangePicker({ value, onChange }: IDateRangePickerProps) {
  const [internalRange, setInternalRange] = useState<DateRange>({
    from: value?.from ? new Date(value.from) : undefined,
    to: value?.to ? new Date(value.to) : undefined,
  });

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) return;

    setInternalRange(range);

    onChange({
      from: range.from ? format(range.from, 'yyyy-MM-dd') : undefined,
      to: range.to ? format(range.to, 'yyyy-MM-dd') : undefined,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='h-10 w-[260px] justify-start text-left font-normal'>
          <CalendarIcon className='mr-2 h-4 w-4' />
          {internalRange.from ? (
            internalRange.to ? (
              <>
                {format(internalRange.from, 'PPP')} – {format(internalRange.to, 'PPP')}
              </>
            ) : (
              format(internalRange.from, 'PPP')
            )
          ) : (
            <span>Select date range</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-auto p-0' align='end'>
        <div className='flex flex-col space-y-2 p-3'>
          <Calendar mode='range' selected={internalRange} onSelect={handleSelect} numberOfMonths={2} />

          {/* Presets */}
          <div className='grid grid-cols-3 gap-2'>
            <Button
              variant='secondary'
              onClick={() =>
                handleSelect({
                  from: new Date(),
                  to: new Date(),
                })
              }
            >
              Today
            </Button>

            <Button
              variant='secondary'
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                handleSelect({ from: weekAgo, to: today });
              }}
            >
              Last 7 days
            </Button>

            <Button
              variant='secondary'
              onClick={() => {
                const today = new Date();
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                handleSelect({ from: firstDay, to: today });
              }}
            >
              This month
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

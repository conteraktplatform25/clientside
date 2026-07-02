'use client';

import { endOfMonth, endOfQuarter, endOfWeek, startOfMonth, startOfQuarter, startOfWeek, subWeeks } from 'date-fns';
import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { DateRange } from 'react-day-picker';

export type TDateRangeValue = {
  label: string;
  from: Date;
  to: Date;
};

interface ICustomCalendarProps {
  value?: TDateRangeValue;
  onChange: (value: TDateRangeValue) => void;
}

export default function CustomRangeCalendar({ onChange }: ICustomCalendarProps) {
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');
  const [customRange, setCustomRange] = useState<DateRange | undefined>();

  const today = new Date();

  const presets: TDateRangeValue[] = [
    { label: 'Today', from: today, to: today },
    {
      label: 'This Week',
      from: startOfWeek(today, { weekStartsOn: 1 }),
      to: endOfWeek(today, { weekStartsOn: 1 }),
    },
    {
      label: 'Last Week',
      from: startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
      to: endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
    },
    {
      label: 'This Month',
      from: startOfMonth(today),
      to: endOfMonth(today),
    },
    {
      label: 'This Quarter',
      from: startOfQuarter(today),
      to: endOfQuarter(today),
    },
  ];

  const handlePresetSelect = (preset: TDateRangeValue) => {
    setMode('preset');
    onChange(preset);
  };

  const handleCustomApply = () => {
    if (customRange && customRange.from && customRange.to) {
      onChange({
        label: 'Custom',
        from: customRange.from,
        to: customRange.to,
      });
    }
  };

  return (
    <Card className='w-full max-w-md rounded-2xl shadow-sm'>
      <CardContent className='p-4 space-y-4'>
        <div className='grid grid-cols-2 gap-2'>
          {presets.map((preset) => (
            <Button key={preset.label} variant='outline' onClick={() => handlePresetSelect(preset)}>
              {preset.label}
            </Button>
          ))}
          <Button variant={mode === 'custom' ? 'default' : 'outline'} onClick={() => setMode('custom')}>
            Custom
          </Button>
        </div>
        {mode === 'custom' && (
          <div className='space-y-3'>
            <Calendar mode='range' selected={customRange} onSelect={setCustomRange} numberOfMonths={2} />

            <Button className='w-full' onClick={handleCustomApply}>
              Apply Custom Range
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X, Check } from 'lucide-react';
import clsx from 'clsx';

type APIDateRange = { from?: string; to?: string };

interface IDateRangePickerPremiumProps {
  value?: APIDateRange;
  onChange: (range: APIDateRange) => void;
  /**
   * Optional: number of months to show side-by-side
   * default: 2
   */
  numberOfMonths?: number;
  /**
   * optional placeholder string
   */
  placeholder?: string;
}

export function DateRangePickerPremium({
  value,
  onChange,
  numberOfMonths = 2,
  placeholder = 'Select date range',
}: IDateRangePickerPremiumProps) {
  // internal uses react-day-picker DateRange where `from` is required (may be undefined)
  const [internalRange, setInternalRange] = useState<DateRange>({
    from: value?.from ? new Date(value.from) : undefined,
    to: value?.to ? new Date(value.to) : undefined,
  });

  const [open, setOpen] = useState(false);

  // Keep internal state synced if parent value changes
  useEffect(() => {
    setInternalRange({
      from: value?.from ? new Date(value.from) : undefined,
      to: value?.to ? new Date(value.to) : undefined,
    });
  }, [value]);

  const toAPIRange = (r?: DateRange): APIDateRange => {
    if (!r) return {};
    return {
      from: r.from ? format(r.from, 'yyyy-MM-dd') : undefined,
      to: r.to ? format(r.to, 'yyyy-MM-dd') : undefined,
    };
  };

  const handleSelect = (range: DateRange | undefined) => {
    // We keep internal range live-updating but do not emit to parent until Apply is pressed.
    if (!range) {
      setInternalRange({ from: undefined, to: undefined });
      return;
    }
    setInternalRange(range);
  };

  const handleClear = () => {
    setInternalRange({ from: undefined, to: undefined });
    // also inform parent of cleared range immediately (optional)
    onChange({});
    setOpen(false);
  };

  const handleApply = () => {
    onChange(toAPIRange(internalRange));
    setOpen(false);
  };

  const presets = [
    {
      id: 'today',
      label: 'Today',
      getRange: () => {
        const d = new Date();
        return { from: d, to: d };
      },
    },
    {
      id: '7days',
      label: 'Last 7 days',
      getRange: () => {
        const to = new Date();
        const from = new Date(to);
        from.setDate(to.getDate() - 6);
        return { from, to };
      },
    },
    {
      id: 'month',
      label: 'This month',
      getRange: () => {
        const to = new Date();
        const from = new Date(to.getFullYear(), to.getMonth(), 1);
        return { from, to };
      },
    },
  ];

  // pretty label shown in trigger
  const renderTriggerLabel = () => {
    if (internalRange?.from && internalRange?.to) {
      return `${format(internalRange.from, 'MMM d, yyyy')} — ${format(internalRange.to, 'MMM d, yyyy')}`;
    }
    if (internalRange?.from && !internalRange?.to) {
      return `${format(internalRange.from, 'MMM d, yyyy')}`;
    }
    return placeholder;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='h-10 w-[320px] justify-start text-left px-3 py-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-150'
        >
          <CalendarIcon className='mr-3 h-4 w-4 text-muted-foreground' />
          <div className='flex-1 text-sm text-muted-foreground truncate'>{renderTriggerLabel()}</div>
          {internalRange.from || internalRange.to ? (
            <button
              aria-label='clear dates'
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className='ml-2 inline-flex items-center justify-center rounded-md p-1 hover:bg-muted'
            >
              <X className='h-4 w-4 text-muted-foreground' />
            </button>
          ) : null}
        </Button>
      </PopoverTrigger>

      <AnimatePresence>
        {open && (
          <PopoverContent asChild align='end' side='bottom' className='p-0'>
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className='w-[920px] rounded-lg bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden'
            >
              <div className='flex flex-col md:flex-row gap-4 p-4'>
                {/* Left: Calendar */}
                <div className='flex-1'>
                  <Calendar
                    mode='range'
                    selected={internalRange}
                    onSelect={handleSelect}
                    numberOfMonths={numberOfMonths}
                    className='rounded-md'
                    // pass custom classNames if your Calendar accepts them
                  />
                </div>

                {/* Right: Controls */}
                <div className='w-80 flex flex-col'>
                  <div className='mb-3'>
                    <div className='text-sm font-medium text-slate-900 mb-1'>Selected range</div>
                    <div className='text-sm text-muted-foreground'>
                      {internalRange?.from ? format(internalRange.from, 'PPP') : '—'}{' '}
                      {internalRange?.to ? `— ${format(internalRange.to, 'PPP')}` : ''}
                    </div>
                  </div>

                  {/* Presets */}
                  <div className='mb-4'>
                    <div className='text-xs font-semibold text-muted-foreground mb-2'>Presets</div>
                    <div className='grid grid-cols-1 gap-2'>
                      {presets.map((p) => (
                        <motion.button
                          key={p.id}
                          onClick={() => setInternalRange(p.getRange())}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={clsx(
                            'text-sm w-full text-left px-3 py-2 rounded-md border hover:shadow-sm transition-shadow',
                            'bg-white border-gray-100'
                          )}
                        >
                          {p.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className='flex-1' />

                  {/* Action row */}
                  <div className='flex items-center justify-between gap-2 pt-2 border-t border-gray-100'>
                    <div className='flex items-center space-x-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                          setInternalRange({
                            from: value?.from ? new Date(value.from) : undefined,
                            to: value?.to ? new Date(value.to) : undefined,
                          });
                          setOpen(false);
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          handleClear();
                        }}
                      >
                        Clear
                      </Button>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Button
                        onClick={handleApply}
                        size='sm'
                        className='inline-flex items-center space-x-2 bg-primary-base hover:bg-primary-700'
                      >
                        <Check className='h-4 w-4' />
                        <span>Apply</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
}

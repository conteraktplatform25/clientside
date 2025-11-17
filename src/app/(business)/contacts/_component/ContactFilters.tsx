'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
//import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { CalendarIcon, Filter } from 'lucide-react';

interface ContactFiltersProps {
  onChange: (filters: ContactFilterState) => void;
  availableTags: string[];
}

export interface ContactFilterState {
  search: string;
  selectedTags: string[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

export function ContactFilters({ onChange, availableTags }: ContactFiltersProps) {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const applyFilters = () => {
    onChange({
      search,
      selectedTags,
      dateRange,
    });
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedTags([]);
    setDateRange({});
    onChange({
      search: '',
      selectedTags: [],
      dateRange: {},
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* Search */}
      <Input
        className='w-56'
        placeholder='Search contacts...'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          applyFilters();
        }}
      />

      {/* Tags */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' className='flex items-center gap-2'>
            <Filter size={16} />
            Tags
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-56 p-3 space-y-2'>
          <div className='text-sm font-medium mb-2'>Filter by Tags</div>

          {availableTags.length === 0 && <p className='text-sm text-muted-foreground'>No tags available</p>}

          {availableTags.map((tag) => (
            <label key={tag} className='flex items-center gap-2 text-sm cursor-pointer'>
              <Checkbox checked={selectedTags.includes(tag)} onCheckedChange={() => toggleTag(tag)} />
              {tag}
            </label>
          ))}

          {selectedTags.length > 0 && (
            <div className='flex flex-wrap gap-1 mt-2'>
              {selectedTags.map((tag) => (
                <Badge key={tag} variant='secondary'>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Date Range */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' className='flex items-center gap-2'>
            <CalendarIcon size={16} />
            Date Range
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          {/* <Calendar
            mode='range'
            selected={dateRange}
            onSelect={(range) => {
              setDateRange(range || {});
              applyFilters();
            }}
            numberOfMonths={2}
          /> */}
          {dateRange?.from && dateRange?.to && (
            <div className='p-2 text-sm'>
              {format(dateRange.from, 'LLL dd, yyyy')} → {format(dateRange.to, 'LLL dd, yyyy')}
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Reset */}
      <Button variant='ghost' onClick={resetFilters}>
        Reset
      </Button>
    </div>
  );
}

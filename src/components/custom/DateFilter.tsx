import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar1Icon } from 'lucide-react';
import { format } from 'date-fns';

interface DateFilterProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ selectedDate, onDateChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[180px] justify-start text-left font-normal', !selectedDate && 'text-muted-foreground')}
        >
          <Calendar1Icon className='mr-2 h-4 w-4' />
          {selectedDate ? format(selectedDate, 'PPP') : <span>Today</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar mode='single' selected={selectedDate} onSelect={onDateChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;

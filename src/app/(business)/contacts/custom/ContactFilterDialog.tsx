'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, ListFilter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { BsTags } from 'react-icons/bs';

interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

interface ContactFilterProps {
  onApplyFilters: (filters: FilterCondition[]) => void;
}

const availableTags = [
  { name: 'New order', color: '#1A73E8' },
  { name: 'Abandoned cart', color: '#EF3838' },
  { name: 'Big spender', color: '#4D26C9' },
  { name: 'Pending payment', color: '#F2BD17' },
];

const filterFields = [
  { value: 'phone_number', label: 'Phone number' },
  { value: 'total_spent', label: 'Total spent' },
  { value: 'created_on', label: 'Creation date' },
  { value: 'last_orderId', label: 'Last order ID' },
];

export function ContactFilterDialog({ onApplyFilters }: ContactFilterProps) {
  const [open, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Is Big spender', 'Is not Abandoned cart']);
  const [tagConditions, setTagConditions] = useState<{ [key: string]: 'is' | 'is not' }>({
    'Big spender': 'is',
    'Abandoned cart': 'is not',
  });
  const [expandTags, setExpandTags] = useState(true);
  const [expandOtherFilters, setExpandOtherFilters] = useState(true);
  const [otherFilters, setOtherFilters] = useState<FilterCondition[]>([
    { field: 'phone_number', operator: 'contains', value: '+234' },
  ]);
  const [selectedOperator, setSelectedOperator] = useState('contains');
  const [filterValue, setFilterValue] = useState('+234');

  const handleTagToggle = (tagName: string, condition: 'is' | 'is not') => {
    const displayName = `${condition === 'is' ? 'Is' : 'Is not'} ${tagName}`;

    if (selectedTags.includes(displayName)) {
      setSelectedTags(selectedTags.filter((t) => t !== displayName));
      const newConditions = { ...tagConditions };
      delete newConditions[tagName];
      setTagConditions(newConditions);
    } else {
      setSelectedTags([...selectedTags.filter((t) => !t.includes(tagName)), displayName]);
      setTagConditions({ ...tagConditions, [tagName]: condition });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
    const tagName = tag.replace('Is ', '').replace('Is not ', '');
    const newConditions = { ...tagConditions };
    delete newConditions[tagName];
    setTagConditions(newConditions);
  };

  const handleAddFilter = () => {
    const newFilter = { field: 'phone_number', operator: selectedOperator, value: filterValue };
    setOtherFilters([...otherFilters, newFilter]);
  };

  const handleRemoveFilter = (index: number) => {
    setOtherFilters(otherFilters.filter((_, i) => i !== index));
  };

  const handleResetTags = () => {
    setSelectedTags([]);
    setTagConditions({});
  };

  const handleResetOtherFilters = () => {
    setOtherFilters([]);
    setFilterValue('');
  };

  const handleApplyFilters = () => {
    onApplyFilters(otherFilters);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='default'
          className='bg-white hover:bg-gray-100 rounded-[8px] py-2.5 px-3 border border-[#EEEFF1] cursor-pointer'
        >
          <div className='inline-flex gap-1.5 items-center'>
            <ListFilter size={14} color='#1A73E8' />
            <span className='font-medium text-base leading-[150%] text-neutral-800'>Filter</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='fixed right-0 top-0 h-screen w-96 max-w-none translate-x-0 bg-white shadow-lg border-l border-gray-200'
        align='end'
      >
        <div className='flex flex-col'>
          <div className='flex items-center justify-between p-4 border-b'>
            <h3 className='font-semibold text-base'>Filter</h3>
            <Button variant='ghost' size='icon' className='h-6 w-6' onClick={handleCancel}>
              <X className='h-4 w-4' />
            </Button>
          </div>

          <div className='max-h-[500px] overflow-y-auto'>
            <div className='border-b'>
              <button
                onClick={() => setExpandTags(!expandTags)}
                className='flex items-center justify-between w-full p-4 hover:bg-gray-50'
              >
                <span className='font-medium text-sm'>Tags</span>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-auto p-0 text-xs text-blue-600 hover:bg-transparent'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetTags();
                    }}
                  >
                    Reset
                  </Button>
                  {expandTags ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
                </div>
              </button>

              {expandTags && (
                <div className='px-4 pb-4 space-y-3'>
                  <div className='flex flex-wrap gap-2'>
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant='secondary'
                        className='bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full px-3 py-1'
                      >
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className='ml-1.5 hover:bg-blue-200 rounded-full'>
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <div className='space-y-2'>
                    {availableTags.map((tag) => (
                      <div key={tag.name} className='flex items-center justify-between py-1'>
                        <div className='flex items-center gap-2'>
                          <BsTags style={{ color: tag.color }} className='w-4 h-4' />
                          <span className='text-sm'>{tag.name}</span>
                        </div>
                        <div className='flex gap-1'>
                          <Button
                            variant={tagConditions[tag.name] === 'is' ? 'default' : 'ghost'}
                            size='sm'
                            className='h-7 text-xs px-2'
                            onClick={() => handleTagToggle(tag.name, 'is')}
                          >
                            Is
                          </Button>
                          <Button
                            variant={tagConditions[tag.name] === 'is not' ? 'default' : 'ghost'}
                            size='sm'
                            className='h-7 text-xs px-2'
                            onClick={() => handleTagToggle(tag.name, 'is not')}
                          >
                            Is not
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className='border-b'>
              <button
                onClick={() => setExpandOtherFilters(!expandOtherFilters)}
                className='flex items-center justify-between w-full p-4 hover:bg-gray-50'
              >
                <span className='font-medium text-sm'>Other filters</span>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-auto p-0 text-xs text-blue-600 hover:bg-transparent'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetOtherFilters();
                    }}
                  >
                    Reset
                  </Button>
                  {expandOtherFilters ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
                </div>
              </button>

              {expandOtherFilters && (
                <div className='px-4 pb-4 space-y-3'>
                  <div className='flex flex-wrap gap-2'>
                    {otherFilters.map((filter, index) => (
                      <Badge
                        key={index}
                        variant='secondary'
                        className='bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full px-3 py-1'
                      >
                        {filter.field} {filter.operator} {filter.value}
                        <button
                          onClick={() => handleRemoveFilter(index)}
                          className='ml-1.5 hover:bg-blue-200 rounded-full'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start text-blue-600 hover:bg-blue-50 h-8'
                    onClick={handleAddFilter}
                  >
                    + Add filter
                  </Button>

                  <Input placeholder='Search filter' className='h-9 text-sm' />

                  <div className='space-y-2'>
                    {filterFields.map((field) => (
                      <div key={field.value} className='text-sm py-1 hover:bg-gray-50 px-2 rounded cursor-pointer'>
                        {field.label}
                      </div>
                    ))}
                  </div>

                  <div className='pt-2 space-y-3'>
                    <RadioGroup value={selectedOperator} onValueChange={setSelectedOperator}>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='contains' id='contains' />
                        <Label htmlFor='contains' className='text-sm font-normal cursor-pointer'>
                          Contains
                        </Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='is not' id='is-not' />
                        <Label htmlFor='is-not' className='text-sm font-normal cursor-pointer'>
                          Is not
                        </Label>
                      </div>
                    </RadioGroup>

                    <Input
                      placeholder='+234'
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      className='h-9 text-sm'
                    />

                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full justify-center text-sm bg-blue-600 text-white hover:bg-blue-700'
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='flex items-center justify-end gap-2 p-4 border-t'>
            <Button variant='ghost' size='sm' onClick={handleCancel}>
              Cancel
            </Button>
            <Button size='sm' className='bg-blue-600 hover:bg-blue-700 text-white' onClick={handleApplyFilters}>
              Apply filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

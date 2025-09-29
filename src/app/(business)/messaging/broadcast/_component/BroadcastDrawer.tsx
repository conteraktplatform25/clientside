'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { create } from 'zustand';
import { motion } from 'framer-motion';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { FaPlus } from 'react-icons/fa6';
import RadioGroupField from '@/components/custom/RadioGroupField';
import { Card } from '@/components/ui/card';

// ----------------- Zustand store -----------------
type BroadcastStore = {
  open: boolean;
  setOpen: (val: boolean) => void;
};

const useBroadcastStore = create<BroadcastStore>((set) => ({
  open: false,
  setOpen: (val) => set({ open: val }),
}));

// ----------------- Validation Schema -----------------
const filterSchema = z.object({
  field: z.enum(['phone', 'spent', 'createdAt', 'orderId']),
  condition: z.enum(['is', 'isNot', 'contains']),
  value: z.string().min(1, 'Value required'),
});

const buttonSchema = z.object({
  action: z.enum(['call', 'url']),
  text: z.string().min(1, 'Button text required'),
  value: z.string().min(1, 'Value required'), // phone number or url
});

const broadcastSchema = z.object({
  title: z.string().min(1, 'Title required'),
  audience: z.enum(['All', 'Filtered']),
  filters: z.array(filterSchema).optional(),
  message: z.string().min(1, 'Message required'),
  variables: z.array(
    z.object({
      name: z.string(),
      fallback: z.string().optional(),
    })
  ),
  buttons: z.array(buttonSchema),
  schedule: z.enum(['immediate', 'later']),
  date: z.string().optional(),
  time: z.string().optional(),
});

type BroadcastForm = z.infer<typeof broadcastSchema>;

// ----------------- Component -----------------
export default function BroadcastDrawer() {
  const { open, setOpen } = useBroadcastStore();

  const form = useForm<BroadcastForm>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      title: '',
      audience: 'All',
      filters: [],
      message: '',
      variables: [],
      buttons: [],
      schedule: 'immediate',
    },
  });

  const {
    fields: filterFields,
    append: addFilter,
    remove: removeFilter,
  } = useFieldArray({ control: form.control, name: 'filters' });

  const {
    fields: buttonFields,
    append: addButton,
    remove: removeButton,
  } = useFieldArray({ control: form.control, name: 'buttons' });

  const onSubmit = (data: BroadcastForm) => {
    console.log('Form submitted:', data);
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpen(true)}
            variant={'default'}
            className='bg-primary-base hover:bg-primary-700 text-white rounded-[10px] px-4 py-3 cursor-pointer'
            asChild
          >
            <div className='inline-flex space-x-1'>
              <FaPlus />
              <span>New broadcast</span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className='translate-x-[25%] translate-y-[-50%] h-screen w-full max-w-lg p-6 rounded-none bg-white shadow-xl overflow-y-auto text-neutral-700'>
          <DialogHeader>
            <DialogTitle>
              <div className='flex justify-between items-start'>
                <p className='font-medium text-base leading-[150%]'>New Broadcast</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: open ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Title */}
              <div className='block space-y-1'>
                <Label className='font-medium text-sm leading-[155%] '>Broadcast Title</Label>
                <Input
                  className='focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]'
                  {...form.register('title')}
                  placeholder='Enter title'
                />
              </div>

              {/* Audience */}
              <Card className='px-3 py-2 gap-1'>
                <div className='block space-y-1'>
                  <Label className='font-semibold text-base leading-[155%] '>Broadcast Title</Label>
                  <RadioGroupField<BroadcastForm>
                    name='audience'
                    control={form.control}
                    options={['All', 'Filtered']}
                  />
                </div>
                {/* Filters (conditional) */}
                {form.watch('audience') === 'Filtered' && (
                  <div className='space-y-2'>
                    {filterFields.map((field, idx) => (
                      <div key={field.id} className='flex gap-2 items-center border p-2 rounded'>
                        <Controller
                          control={form.control}
                          name={`filters.${idx}.field`}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className='w-32'>
                                <SelectValue placeholder='Field' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='phone'>Phone</SelectItem>
                                <SelectItem value='spent'>Total Spent</SelectItem>
                                <SelectItem value='createdAt'>Created At</SelectItem>
                                <SelectItem value='orderId'>Last Order ID</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <Controller
                          control={form.control}
                          name={`filters.${idx}.condition`}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className='w-32'>
                                <SelectValue placeholder='Condition' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='is'>Is</SelectItem>
                                <SelectItem value='isNot'>Is Not</SelectItem>
                                <SelectItem value='contains'>Contains</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <Input {...form.register(`filters.${idx}.value`)} placeholder='Value' className='flex-1' />
                        <Button type='button' variant='outline' onClick={() => removeFilter(idx)}>
                          ✕
                        </Button>
                      </div>
                    ))}
                    <Button
                      type='button'
                      variant='ghost'
                      onClick={() => addFilter({ field: 'phone', condition: 'is', value: '' })}
                      className='bg-transparent text-primary-base hover:text-primary-700'
                    >
                      + Add Filter
                    </Button>
                  </div>
                )}
              </Card>

              {/* Message */}
              <div>
                <Label>Your Message</Label>
                <Textarea rows={4} {...form.register('message')} placeholder='Write your message...' />
              </div>

              {/* Variables */}
              <div>
                <Label>Variables</Label>
                <div className='flex gap-2 items-center'>
                  <Input placeholder='Variable name' />
                  <Input placeholder='Fallback value' />
                </div>
                {/* You could extend with FieldArray like filters/buttons */}
              </div>

              {/* Interactive Buttons */}
              <div className='space-y-3 border p-3 rounded-md'>
                <Label>Interactive Buttons</Label>
                {buttonFields.map((field, idx) => (
                  <div key={field.id} className='flex gap-2 items-center border p-2 rounded'>
                    <Controller
                      control={form.control}
                      name={`buttons.${idx}.action`}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className='w-28'>
                            <SelectValue placeholder='Action' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='call'>Call</SelectItem>
                            <SelectItem value='url'>Open URL</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Input {...form.register(`buttons.${idx}.text`)} placeholder='Button text' className='w-40' />
                    <Input {...form.register(`buttons.${idx}.value`)} placeholder='Phone/URL' className='flex-1' />
                    <Button type='button' variant='outline' onClick={() => removeButton(idx)}>
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => addButton({ action: 'call', text: '', value: '' })}
                >
                  + Add Button
                </Button>
              </div>

              {/* Schedule */}
              <div>
                <Label>Schedule</Label>
                <Select
                  value={form.watch('schedule')}
                  onValueChange={(val: 'immediate' | 'later') => form.setValue('schedule', val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='immediate'>Send Immediately</SelectItem>
                    <SelectItem value='later'>Schedule for Later</SelectItem>
                  </SelectContent>
                </Select>
                {form.watch('schedule') === 'later' && (
                  <div className='flex gap-2 mt-2'>
                    <Input type='date' {...form.register('date')} />
                    <Input type='time' {...form.register('time')} />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className='flex justify-end gap-2'>
                <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type='submit'>Send Broadcast</Button>
              </div>
            </form>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

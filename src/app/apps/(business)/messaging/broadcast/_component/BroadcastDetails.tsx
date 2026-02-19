import React from 'react';
import { motion } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CiClock2 } from 'react-icons/ci';
import { create } from 'zustand';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { IBroadcastMessageTableHeaderProps } from '@/type/client/business/broadcast.type';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MdClear } from 'react-icons/md';

// ----------------- Zustand store -----------------
type BroadcastStore = {
  open: boolean;
  setOpen: (val: boolean) => void;
};

const useBroadcastStore = create<BroadcastStore>((set) => ({
  open: false,
  setOpen: (val) => set({ open: val }),
}));

const BroadcastDetails = ({ broadcast }: { broadcast: IBroadcastMessageTableHeaderProps }) => {
  const { open, setOpen } = useBroadcastStore();
  console.log(broadcast);

  // ✅ Zod schema for validation
  const formSchema = z.object({
    message: z.string().min(5, 'Message is too short'),
    variable: z.string().optional(),
    value: z.string().optional(),
    fallbackValue: z.string().optional(),
    interactiveButtons: z.array(
      z.object({
        type: z.string(),
        text: z.string().min(1, 'Button text required'),
        link: z.url('Must be a valid URL'),
      })
    ),
    audienceFilter: z.string().optional(),
    schedule: z.date(),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message:
        'Hello, {{1}} Exciting news! Our new clothing line is now available. Pre-order yours today and get one item free!',
      variable: '{{1}}',
      value: 'Name',
      fallbackValue: 'there',
      interactiveButtons: undefined,
      audienceFilter: 'Phone number contains +234',
      schedule: new Date(),
    },
  });

  const { control, register, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'interactiveButtons',
  });

  function onSubmit(values: FormSchema) {
    console.log(values);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6'>
        <DialogTrigger asChild>
          <Button
            variant={'ghost'}
            className='bg-transparent font-medium text-sm hover:text-primary-700 text-primary-base p-2 cursor-pointer'
          >
            View details
          </Button>
        </DialogTrigger>
        <DialogContent className='translate-x-[25%] translate-y-[-50%] h-screen w-full max-w-lg p-6 rounded-none bg-white shadow-xl overflow-y-auto text-neutral-700'>
          <DialogHeader>
            <DialogTitle>
              <div className='flex justify-between items-start'>
                <p className='font-medium text-base leading-[150%]'>Broadcast message details</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: open ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
              <div className='inline-flex space-x-4'>
                <h5 className='font-semibold text-[18px] leading-[150%] text-neutral-800'>
                  New product launch announcement
                </h5>
                <Badge className='mt-1 bg-[#EFF6FF] text-primary-base' asChild>
                  <div className='inline-flex space-x-1 text-base'>
                    <CiClock2 className='w-4 h-4' />
                    <span className='font-semibold text-sm leading-[155%]'>Scheduled</span>
                  </div>
                </Badge>
              </div>
              {/* ✅ Statistics */}
              <div className='flex flex-col gap-1'>
                <Label className='font-medium text-base leading-[150%] text-neutral-700'>Statistics</Label>
                <div className='grid grid-cols-3 gap-4'>
                  <Card className='gap-2 py-4 rounded-[10px] border-[0.5px] border-[#1A73E8] bg-[#EFF6FF]'>
                    <CardHeader className='px-4'>
                      <CardTitle className='p-0 text-sm leading-[155%] text-neutral-base'>Total recipients</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='font-semibold text-3xl leading-[140%] text-[#2C2C2C]'>15</p>
                    </CardContent>
                  </Card>
                  <Card className='gap-2 py-4 rounded-[10px] border-[0.5px] border-[#4D26C9CC] bg-[#F6F4FF]'>
                    <CardHeader className='px-4'>
                      <CardTitle className='p-0 text-sm leading-[155%] text-neutral-base'>Delivered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='font-semibold text-3xl leading-[140%] text-[#2C2C2C]'>14</p>
                    </CardContent>
                  </Card>
                  <Card className='gap-2 py-4 rounded-[10px] border-[0.5px] border-[#0FAD1DCC] bg-[#F5FFF9]'>
                    <CardHeader className='px-4'>
                      <CardTitle className='p-0 text-sm leading-[155%] text-neutral-base'>Read</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='font-semibold text-3xl leading-[140%] text-[#2C2C2C]'>12</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              {/* ✅ Message */}
              <div className='flex flex-col gap-1'>
                <Label className='font-medium text-sm leading-[150%] text-neutral-700'>Message</Label>
                <div className='flex flex-col gap-4'>
                  <Textarea placeholder='Write your message here...' {...register('message')} />
                  <div className='grid grid-cols-5 gap-4'>
                    <div className='col-span-1 flex flex-col gap-1'>
                      <Label className='text-sm leading-[155%] text-neutral-800'>Variable</Label>
                      <Input {...register('variable')} />
                    </div>
                    <div className='col-span-2 flex flex-col gap-1'>
                      <Label className='text-sm leading-[155%] text-neutral-800'>Value</Label>
                      <Input {...register('value')} />
                    </div>
                    <div className='col-span-2 flex flex-col gap-1'>
                      <Label className='text-sm leading-[155%] text-neutral-800'>Fallback value</Label>
                      <Input {...register('fallbackValue')} />
                    </div>
                  </div>
                </div>
              </div>
              {/* ✅ Interactive buttons */}
              <div className='flex flex-col gap-1'>
                <Label className='font-medium text-base leading-[150%] text-neutral-700'>Interactive buttons</Label>
                <div className='mt-2 grid grid-cols-3 gap-4 items-start'>
                  <Label className='text-sm leading-[150%] text-neutral-700'>Type of action</Label>
                  <Label className='text-sm leading-[150%] text-neutral-700'>Button text</Label>
                  <Label className='text-sm leading-[150%] text-neutral-700'>Link</Label>
                </div>
                {fields.length > 0 &&
                  fields.map((field, index) => (
                    <div key={field.id} className='grid grid-cols-3 gap-4 items-end'>
                      <Select {...register(`interactiveButtons.${index}.type` as const)}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select action' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Visit link'>Visit link</SelectItem>
                          <SelectItem value='Call'>Call</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder='Button text' {...register(`interactiveButtons.${index}.text` as const)} />
                      <div className='flex items-start gap-1'>
                        <div className='flex-1 w-full'>
                          <Input
                            placeholder='https://example.com'
                            {...register(`interactiveButtons.${index}.link` as const)}
                          />
                        </div>

                        <Button
                          variant={'ghost'}
                          className='bg-transparent hover:bg-transparent text-error-base hover:text-error-700 p-0'
                          type='button'
                          onClick={() => remove(index)}
                        >
                          <FaRegTrashAlt />
                        </Button>
                      </div>
                    </div>
                  ))}
                <Button
                  type='button'
                  className='mt-4 bg-success-500 hover:bg-success-700'
                  onClick={() => append({ type: 'Visit link', text: '', link: '' })}
                >
                  + Add Interactions
                </Button>
              </div>
              {/* ✅ Audience */}
              <div className='flex flex-col gap-1'>
                <Label className='font-medium text-base leading-[150%] text-neutral-700'>Audience</Label>
                <div className='inline-flex space-x-4'>
                  <p className='mt-2 text-sm leading-[155%]'>Filtered audience</p>
                  <Badge className='flex items-center justify-between text-primary-base bg-[#EFF6FF] border-primary-base '>
                    <span className='text-xs'>Phone number contains +234</span>
                    <Button variant={'ghost'} className='p-0'>
                      <MdClear />
                    </Button>
                  </Badge>
                </div>
              </div>
              {/* ✅ Schedule */}
              <div className='flex flex-col gap-1'>
                <Label className='font-medium text-base leading-[150%] text-neutral-700'>Broadcast Schedule</Label>
                <div className='inline-flex space-x-4'>
                  <p className='text-sm leading-[150%]'>11/09/2025 11:00AM</p>
                </div>
              </div>
            </form>
          </motion.div>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default BroadcastDetails;

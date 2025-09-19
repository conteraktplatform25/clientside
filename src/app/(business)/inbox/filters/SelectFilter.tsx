import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  ConstTagLabels as tags,
  ConstChatStatus as statuses,
  ConstAssignee as assignees,
  ConstSorting as sortings,
} from '@/lib/constants/inbox.constant';
import { selectFilterSchema, TSelectFilterSchema } from '@/lib/schemas/dashboard/inbox.schema';
import { selectDefaultValues } from '@/lib/store/business/inbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { Funnel, X } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import SelectFilterField from '../component/SelectFilterField';
import { ScrollArea } from '@/components/ui/scroll-area';

const SelectFilter = () => {
  //const setFilter = useSelectFilterStore((state) => state.setFilter);
  const selectFilterform = useForm<TSelectFilterSchema>({
    resolver: zodResolver(selectFilterSchema),
    defaultValues: selectDefaultValues,
  });
  const {
    // handleSubmit,
    // formState: { errors },
    // setValue,
    control,
  } = selectFilterform;

  // const handleCategorySelect = (data: TSelectFilterSchema) => {
  //   console.log('Form submitted with: ', data);
  // };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          className='rounded-full border border-[#DEE2E6] bg-white focus-visible:shadow-none focus-visible:border-none'
        >
          <Funnel size={18} strokeWidth={1.51} color='#282B30' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[265px] p-0'>
        <div className='w-full grid gap-4 text-[#38393A]'>
          <div className='flex items-start justify-between p-4'>
            <p className='text-base leading-[155%] font-medium'>Filter</p>
            <Button
              variant={'ghost'}
              size={'sm'}
              className='rounded-full border border-[#DEE2E6] p-0 bg-[#F3F4F6] hover:bg-[#cccfd5] focus-visible:shadow-none focus-visible:border-none'
            >
              <X size={14} />
            </Button>
          </div>
          <Separator orientation='horizontal' className='data-[orientation=horizontal]:w-' />
          <ScrollArea className='h-64 w-full'>
            <div className='flex flex-col gap-4'>
              <SelectFilterField<TSelectFilterSchema>
                control={control}
                name='chat_status'
                brief='chat_status'
                label='Chat Status'
                options={statuses}
                className='w-[90%]'
              />
              <SelectFilterField<TSelectFilterSchema>
                control={control}
                name='tag_labels'
                brief='tag_labels'
                label='Labels'
                options={tags}
                className='w-[90%]'
              />
              <SelectFilterField<TSelectFilterSchema>
                control={control}
                name='assignee'
                brief='assignee'
                label='Assignee'
                options={assignees}
                className='w-[90%]'
              />
              <SelectFilterField<TSelectFilterSchema>
                control={control}
                name='sort_order'
                brief='sort_order'
                label='Sort'
                options={sortings}
                className='w-[90%]'
              />
              <Separator orientation='horizontal' className='data-[orientation=horizontal]:w-[95%]' />
              <div className='flex items-end justify-end gap-3 mr-4'>
                <Button className='border border-[#EEEFF1] text-neutral-700 bg-white hover:bg-gray-50 rounded-[10px] py-2 px-4 '>
                  Reset
                </Button>
                <Button className='border border-[#EEEFF1] text-white bg-primary-base hover:bg-primary-600 rounded-[10px] py-2 px-4 '>
                  Apply filters
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button
    //       variant='ghost'
    //       className='rounded-full border border-[#DEE2E6] bg-white focus-visible:shadow-none focus-visible:border-none'
    //     >
    //       <Funnel size={18} strokeWidth={1.51} color='#282B30' />
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent className='w-[265px] text-[#38393A]' align='start'>
    //     <DropdownMenuLabel>
    //       <div className='flex items-start justify-between'>
    //         <p className='test-[14px] leading-[155%] font-medium'>Filter</p>
    //         <Button
    //           variant={'ghost'}
    //           className='rounded-full border border-[#DEE2E6] p-0 bg-[#F3F4F6] focus-visible:shadow-none focus-visible:border-none'
    //         >
    //           <X size={14} />
    //         </Button>
    //       </div>
    //     </DropdownMenuLabel>
    //     <DropdownMenuSeparator />
    //     <DropdownMenuGroup>
    //       <DropdownMenuItem>
    //         <div className='block space-y-1'>
    //           <Label>Chat Status</Label>
    //           <Input />
    //         </div>
    //       </DropdownMenuItem>
    //       <DropdownMenuItem>Billing</DropdownMenuItem>
    //       <DropdownMenuItem>Settings</DropdownMenuItem>
    //       <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
    //     </DropdownMenuGroup>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
};

export default SelectFilter;

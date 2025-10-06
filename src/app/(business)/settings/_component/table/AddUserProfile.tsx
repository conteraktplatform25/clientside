'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUserProfileDialogStore } from '@/lib/store/business/settings.store';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { z } from 'zod';
import { motion } from 'framer-motion';
import InputField from '@/components/custom/InputField';
import { Card } from '@/components/ui/card';
import SelectField from '@/components/custom/SelectField';
import { ConstCountryCodeOptions as country_code } from '@/lib/constants/auth.constant';

const AddUserProfile = () => {
  const { open, setOpen } = useUserProfileDialogStore();

  // ✅ Zod schema for validation
  const formSchema = z.object({
    first_name: z.string().min(2, 'Name is too short'),
    last_name: z.string().min(2, 'Name is too short'),
    phone_country_code: z.string(),
    phone_number: z.string().min(8, 'Invalid Phone Number'),
    email: z.email(),
  });
  type TFormSchema = z.infer<typeof formSchema>;

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
      email: '',
    },
  });
  const { control, handleSubmit } = form;
  function onSubmit(values: TFormSchema) {
    console.log(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'default'}
          className='bg-primary-base hover:bg-primary-700 text-white rounded-[10px] px-4 py-3 cursor-pointer'
          asChild
        >
          <div className='inline-flex space-x-1'>
            <FaPlus />
            <span>Create User Profile</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className='fixed right-0 translate-x-[25%] translate-y-[-50%] h-screen w-full max-w-md p-6 rounded-none bg-white shadow-lg animate-in slide-in-from-right-80 duration-300 overflow-y-auto text-neutral-700'>
        <DialogHeader className='hidden border-b pb-4'>
          <DialogTitle className='text-lg font-semibold'>Dialog Title</DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: open ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className='max-w-[400px] w-full'
        >
          <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6'>
            <div className='flex justify-between items-start'>
              <p className='font-semibold text-sm leading-[155%] text-neutral-700'>Create User</p>
            </div>
            <div className='flex flex-col gap-4'>
              <InputField<TFormSchema>
                name={'first_name'}
                control={control}
                label='First Name'
                placeholder='Enter first name'
                type='text'
              />
              <InputField<TFormSchema>
                name={'last_name'}
                control={control}
                label='Last Name'
                placeholder='Enter last name'
                type='text'
              />
              <InputField<TFormSchema>
                name={'email'}
                control={control}
                label='Email'
                placeholder='Enter email here'
                type='email'
              />
              <div className='block space-y-0.5'>
                <p className='text-base leading-[150%]'>Phone Number</p>
                <Card className='w-full p-0 shadow-none rounded-sm'>
                  <div className='grid grid-cols-[80px_1fr] gap-0.5'>
                    <SelectField<TFormSchema>
                      control={control}
                      name={'phone_country_code'}
                      label=''
                      options={country_code}
                      className='w-full border-none border-r shadow-none rounded-none focus-visible:ring-0'
                    />
                    <InputField<TFormSchema>
                      name={'phone_number'}
                      control={control}
                      type='text'
                      placeholder='Enter Phone Number'
                      className='mt-1 border-none shadow-none rounded-none focus-visible:border-none focus-visible:ring-0'
                    />
                  </div>
                </Card>
              </div>
            </div>
          </form>
        </motion.div>
        {/* <ReplyEditor /> */}
      </DialogContent>
    </Dialog>
  );
};

export default AddUserProfile;

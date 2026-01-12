'use client';

import { TInviteUserRequest } from '@/lib/hooks/admin/system-user.hook';
import { fetchWithIndicatorHook } from '@/lib/hooks/fetch-with-indicator.hook';
import { InviteUserSchema } from '@/lib/schemas/admin/system-user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import AlertDisplayField, { IAlertProps } from '@/components/custom/AlertMessageField';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import InputField from '@/components/custom/InputField';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SystemAdminRole } from '@prisma/client';
import { formatRoleProfile } from '@/lib/helpers/string-manipulator.helper';
import { Button } from '@/components/ui/button';

interface IInviteAdminUserDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ----------- Async phone check -----------
async function checkPhoneExists(phone: string) {
  const res = await fetchWithIndicatorHook(`/api/admin/system-users/verification?phone=${phone}`);
  const data = await res.json();
  return data;
}

const InviteAdminDrawer = ({ open, onOpenChange }: IInviteAdminUserDrawerProps) => {
  const [alert, setAlert] = useState<IAlertProps>({ type: null });

  const form = useForm<TInviteUserRequest>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
      email: '',
    },
  });
  const admin_roles: SystemAdminRole[] = ['SUPER_ADMIN', 'ADMIN'];

  const onSubmit = async (data: TInviteUserRequest) => {
    console.log(data);
  };
  return (
    <AnimatePresence>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side='right' className='w-full sm:max-w-2xl flex flex-col'>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <SheetHeader>
              <SheetTitle className='font-medium text-base leading-[150%] text-neutral-700'>Add Admin Users</SheetTitle>
            </SheetHeader>
            <Separator />
            <div className='flex flex-col gap-3 p-4'>
              {alert.type && (
                <div className='px-4'>
                  <AlertDisplayField
                    type={alert.type}
                    title={alert.title || ''}
                    description={alert.description}
                    onClose={() => setAlert({ type: null, description: '', title: '' })}
                  />
                </div>
              )}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='flex-1 overflow-y-auto px-6 space-y-4 text-neutral-700'
                >
                  <InputField<TInviteUserRequest>
                    control={form.control}
                    name='first_name'
                    label='First Name'
                    placeholder='First name'
                    important
                  />
                  <InputField<TInviteUserRequest>
                    control={form.control}
                    name='last_name'
                    label='Last Name'
                    placeholder='Last name'
                    important
                  />
                  <InputField<TInviteUserRequest>
                    type='email'
                    control={form.control}
                    name='email'
                    label='Email'
                    placeholder='e.g. example@mail.com'
                    important
                  />
                  <FormField
                    control={form.control}
                    name='phone_number'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <PhoneInput
                            defaultCountry='NG'
                            value={field.value}
                            onChange={async (val) => {
                              field.onChange(val);
                              if (val) {
                                const exists = await checkPhoneExists(val);
                                if (exists) form.setError('phone_number', { message: 'Phone number already exists' });
                                else form.clearErrors('phone_number');
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='role'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className='h-8 w-44'>
                              <SelectValue placeholder='Select Role' />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {admin_roles.map((status) => (
                              <SelectItem key={status} value={status}>
                                {formatRoleProfile(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  {/* Actions */}
                  <div className='flex justify-end gap-2 pt-5'>
                    <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant='ghost'
                      type='submit'
                      className='mb-8 text-white bg-primary-base hover:bg-primary-700'
                    >
                      {'Invite User'}
                      {/* {createContact.isPending ? 'Saving...' : 'Create Contact'} */}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
        </SheetContent>
      </Sheet>
    </AnimatePresence>
  );
};

export default InviteAdminDrawer;

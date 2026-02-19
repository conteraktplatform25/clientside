'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AlertDisplayField, { IAlertProps } from '@/components/custom/AlertMessageField';
import { Form } from '@/components/ui/form';
import InputField from '@/components/custom/InputField';
import { Button } from '@/components/ui/button';
import { TSettingsPasswordChangeRequest, useChangeMyPassword } from '@/lib/hooks/business/userprofile-settings.hook';
import { SettingsPasswordChangeRequestSchema } from '@/lib/schemas/business/server/settings.schema';
import { Loader2 } from 'lucide-react';

const ChangePasswordForm = ({ email }: { email: string }) => {
  const [alert, setAlert] = useState<IAlertProps>({ type: null });

  const changePasswordHook = useChangeMyPassword();
  //const router = useRouter();

  const changePasswordForm = useForm<TSettingsPasswordChangeRequest>({
    resolver: zodResolver(SettingsPasswordChangeRequestSchema),
    defaultValues: {
      email,
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });
  const { handleSubmit, control, reset } = changePasswordForm;

  const handleChangePassword = async (data: TSettingsPasswordChangeRequest) => {
    await changePasswordHook.mutateAsync(data);
    setAlert({
      type: 'success',
      title: 'Password change was successful',
      description: 'Password change initiated by you was successful.',
    });
    reset();
  };
  return (
    <Form {...changePasswordForm}>
      {alert.type && (
        <AlertDisplayField
          type={alert.type}
          title={alert.title || ''}
          description={alert.description}
          onClose={() => setAlert({ type: null, description: '', title: '' })}
        />
      )}
      <form onSubmit={handleSubmit(handleChangePassword)} className='space-y-6 w-full'>
        <InputField<TSettingsPasswordChangeRequest>
          name={'current_password'}
          control={control}
          type='password'
          label='Current Password'
          important
        />
        <InputField<TSettingsPasswordChangeRequest>
          name={'new_password'}
          control={control}
          type='password'
          label='New Password'
          important
        />
        <InputField<TSettingsPasswordChangeRequest>
          name={'confirm_password'}
          control={control}
          type='password'
          label='Confirm New Password'
          important
        />
        <Button
          variant={'default'}
          className='mt-4 w-fit bg-primary-base hover:bg-primary-700 text-white hover:text-gray-100 text-[1.125rem]'
          disabled={changePasswordHook.isPending}
          type='submit'
        >
          {changePasswordHook.isPending ? (
            <>
              <Loader2 className='w-5 h-5 animate-spin' />
              <span className='text-sm leading-[150%]'>Changing Password...</span>
            </>
          ) : (
            <>
              <span className='text-base leading-[150%]'>Change Password</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;

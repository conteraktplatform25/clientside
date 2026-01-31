'use client';
import InputField from '@/components/custom/InputField';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { fetchWithIndicatorHook } from '@/lib/hooks/fetch-with-indicator.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoPersonCircle } from 'react-icons/io5';
import AlertDisplayField, { IAlertProps } from '@/components/custom/AlertMessageField';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { validateAndNormalizePhone } from '@/lib/phone/phone.util';
import { MemberRegistrationFormSchema } from '@/lib/schemas/business/server/settings.schema';
//import { useMemberRegistrationFormStore } from '@/lib/store/business/settings.store';
import { TMemberRegistrationForm } from '@/lib/hooks/business/userprofile-settings.hook';
import { useTeamMemberStore } from '@/lib/store/business/settings.store';

const MemberProfileForm = ({
  email,
  businessId,
  businessName,
  roleId,
  invitedBy,
}: {
  email: string;
  businessId: string;
  businessName: string;
  roleId: number;
  invitedBy: string;
}) => {
  //const router = useRouter();
  const [alert, setAlert] = useState<IAlertProps>({ type: null });

  const { memberCreation, clearProfile } = useTeamMemberStore();
  const profileForm = useForm<TMemberRegistrationForm>({
    resolver: zodResolver(MemberRegistrationFormSchema),
    defaultValues: {
      ...memberCreation,
      email,
      invitedby: invitedBy,
      roleId,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
    clearErrors,
  } = profileForm;

  const handleMemberSubmit = async (data: TMemberRegistrationForm) => {
    const validatePhoneNumber = validateAndNormalizePhone(data.phone_number, 'NG');
    if (!validatePhoneNumber.isValid) {
      setAlert({
        type: 'error',
        title: 'Failed to validate phone number',
        description: validatePhoneNumber.error,
      });
      return;
    }
    if (!validatePhoneNumber.normalized) {
      setAlert({
        type: 'error',
        title: 'Failed!!!',
        description: 'Phone number cannot be empty',
      });
      return;
    }
    data.phone_number = validatePhoneNumber.normalized;
    const response = await fetchWithIndicatorHook(`/api/auth/business-member/${businessId}/team-member`, {
      method: 'POST',
      body: JSON.stringify({ ...data }),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await response.json();
    if (json?.ok) {
      clearProfile();
      reset();
      setAlert({
        type: 'success',
        title: 'Successful Registration.',
        description: json.message || '',
      });
    } else {
      setAlert({
        type: 'error',
        title: 'Profile Failed',
        description: json.message || 'Something went wrong. Please try again.',
      });
    }
  };
  return (
    <Form {...profileForm}>
      {alert.type && (
        <AlertDisplayField
          type={alert.type}
          title={alert.title || ''}
          description={alert.description}
          onClose={() => setAlert({ type: null, description: '', title: '' })}
        />
      )}
      <form onSubmit={handleSubmit(handleMemberSubmit)} className='flex flex-col gap-6 w-full'>
        <div className='flex item-start gap-2'>
          <IoPersonCircle className='text-[#E2E8F0]' size={64} />
          <div className='mt-2 flex justify-center items-center h-auto space-y-0'>
            <h6 className='font-semibold text-[18px] leading-[150%] text-neutral-800'>{businessName}</h6>
          </div>
        </div>
        <div className='w-full flex items-start gap-6'>
          <InputField<TMemberRegistrationForm>
            name={'email'}
            control={control}
            type='email'
            label='Registered Email'
            placeholder='Email Address'
            className='mt-3'
            disabled
          />
          <FormField
            control={control}
            name='phone_number'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm leading-[150%]'>Phone Number</FormLabel>
                <FormControl>
                  <PhoneInput
                    defaultCountry='NG'
                    value={field.value!}
                    onChange={async (val) => {
                      field.onChange(val);
                      if (val) {
                        clearErrors('phone_number');
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className='w-full flex items-start gap-6'>
          <InputField<TMemberRegistrationForm>
            name={'first_name'}
            control={control}
            type='text'
            label='First Name'
            placeholder='Enter your first name'
            className='mt-1'
          />
          <InputField<TMemberRegistrationForm>
            name={'last_name'}
            control={control}
            type='text'
            label='Last Name'
            placeholder='Enter your last name'
            important
          />
        </div>
        <div className='flex item-center justify-center gap-6 w-full'>
          <InputField<TMemberRegistrationForm>
            name={'password'}
            control={control}
            type='password'
            label='Password'
            important
          />
          <InputField<TMemberRegistrationForm>
            name={'confirm_password'}
            control={control}
            type='password'
            label='Confirm Password'
            important
          />
        </div>
        <div className='block space-y-2'>
          <Button
            variant={'default'}
            className='mt-4 w-full bg-primary-base hover:bg-primary-700 text-white hover:text-gray-100 text-[1.125rem]'
            type='submit'
            disabled={isSubmitting}
          >
            Create account
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MemberProfileForm;

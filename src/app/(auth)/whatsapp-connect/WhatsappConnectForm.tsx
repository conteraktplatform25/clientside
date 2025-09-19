'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SVGIcon from '@/components/custom/SVGIcons';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchWithIndicatorHook } from '@/lib/hooks/fetch-with-indicator.hook';
import AlertDisplayField, { IAlertProps } from '@/components/custom/AlertMessageField';
import { Card } from '@/components/ui/card';
import SelectField from '@/components/custom/SelectField';
import { ConstCountryCodeOptions } from '@/lib/constants/auth.constant';
import { Separator } from '@/components/ui/separator';
import InputField from '@/components/custom/InputField';
import { Form } from '@/components/ui/form';

const connectPhoneSchema = z.object({
  phone_country_code: z.string().min(1, 'Country code is required'),
  phone_number: z.string().min(5, 'Invalid Phone Number'),
});
// Infer form types from schema
type TConnectPhoneSchema = z.infer<typeof connectPhoneSchema>;

const WhatsappConnetForm = () => {
  const [alert, setAlert] = useState<IAlertProps>({ type: null });
  const router = useRouter();

  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  //const decodedEmail = decodeURIComponent(email!);
  const full_name = searchParams.get('name');

  const connectPhoneForm = useForm<TConnectPhoneSchema>({
    resolver: zodResolver(connectPhoneSchema),
    defaultValues: {
      phone_country_code: '+234',
      phone_number: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = connectPhoneForm;

  const handleConnectPhoneSubmit = async (data: TConnectPhoneSchema) => {
    const business_number = {
      phone_number: `(${data.phone_country_code})${data.phone_number}`,
    };
    const response = await fetchWithIndicatorHook(`/api/auth/profile/business-number?email=${email}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...business_number }),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(response);
    const json = await response.json();
    if (json?.ok) {
      reset();
      setAlert({
        type: 'success',
        title: 'Business Profile Successful',
        description: json.message || '',
      });
      //router.push('/login');
    } else {
      setAlert({
        type: 'error',
        title: 'Profile Failed',
        description: json.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <section className='w-full flex flex-col gap-4'>
      <div className='flex items-start justify-between'>
        <div className='flex gap-0.5'>
          <SVGIcon className=' mt-1.5' fileName='icon-logo.svg' alt='Concakt Logo' width={29.39} height={20.58} />
          <div className='text-neutral-800 text-[1.801rem] font-semibold'>contakt</div>
        </div>
      </div>
      <div className='flex flex-col items-start gap-4 min-h-[85vh] max-w-3xl'>
        <div className='flex-1 flex flex-col items-start justify-center gap-6 w-full'>
          <div className='w-full flex items-start justify-between'>
            <div className='flex flex-col gap-1'>
              <Form {...connectPhoneForm}>
                <div className='block space-y-3 max-w-[420px]'>
                  <h6 className='font-bold text-black'>{`Hi ${full_name}, enter your Whatsapp Business phone number`}</h6>
                  <p className=' text-neutral-base text-base  leading-5'>Enter your phone number</p>
                </div>
                {alert.type && (
                  <div className='flex flex-col items-start gap-4'>
                    <AlertDisplayField
                      type={alert.type}
                      title={alert.title || ''}
                      description={alert.description}
                      onClose={() => setAlert({ type: null, description: '', title: '' })}
                    />
                    <Button
                      onClick={() => router.push('/login')}
                      variant={'default'}
                      className='bg-white border-neutral-800 text-neutral-700 hover:bg-neutral-100 font-medium w-fit'
                    >
                      Back to Login
                    </Button>
                  </div>
                )}
                <form onSubmit={handleSubmit(handleConnectPhoneSubmit)} className='flex flex-col gap-6 w-full'>
                  <div className='w-[100%] mt-12'>
                    <div className='block space-y-0.5'>
                      <p className='text-base leading-[150%]'>Phone Number</p>
                      <Card className='w-full p-0 shadow-none rounded-sm'>
                        <div className='max-w-[80%] grid grid-cols-[100px_1fr]'>
                          <SelectField<TConnectPhoneSchema>
                            control={control}
                            name={'phone_country_code'}
                            label=''
                            options={ConstCountryCodeOptions}
                            className='border-none shadow-none rounded-none focus-visible:ring-0'
                          />
                          <div className='flex flex-item gap-0.5'>
                            <Separator orientation='vertical' className='bg-neutral-100' />
                            <InputField<TConnectPhoneSchema>
                              name={'phone_number'}
                              control={control}
                              type='text'
                              placeholder='Enter Phone Number'
                              className='mt-1 border-none shadow-none rounded-none focus-visible:border-none focus-visible:ring-0'
                            />
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                  <div className='mt-24 w-full flex items-end justify-end gap-2'>
                    {/* <Button
                      onClick={() => router.push('/login')}
                      variant={'default'}
                      className='bg-white border-[#EEEFF1] text-neutral-700 hover:bg-neutral-100 font-medium w-fit'
                    >
                      Back to Login
                    </Button> */}
                    <Button
                      variant={'default'}
                      className='bg-primary-base text-white hover:bg-primary-700 font-medium w-fit'
                      type='submit'
                      disabled={isSubmitting}
                    >
                      Connect
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsappConnetForm;

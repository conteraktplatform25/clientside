import React from 'react';
import CheckboxGroupField from '@/components/custom/CheckboxGroupField';
import { TProfileLevelFormSchema } from '@/lib/schemas/dashboard/getstarted.schema';
import { useProfileLevelForm } from '@/lib/hooks/dashboard/getstarted.hooks';
import { ConstGetStarted as getStarted } from '@/lib/constants/getstarted.constant';

const GetStarted = () => {
  const { profileLevelFormHook, onSubmit } = useProfileLevelForm();
  const { control, handleSubmit } = profileLevelFormHook;
  return (
    <div className='w-full min-h-screen flex flex-col gap-8'>
      <div className='flex flex-col gap-2 items-start'>
        <h6 className='font-semibold text-neutral-800'>Get started</h6>
        <p className='text-base leading-5 text-neutral-base'>
          Setup the following to use Contakt effectively and supercharge your sales.
        </p>
      </div>
      <div className='space-y-4'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-1 items-start w-full'>
            <CheckboxGroupField<TProfileLevelFormSchema>
              control={control}
              name={'profileLogger'}
              options={getStarted}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default GetStarted;

'use client';
import React from 'react';
import { ConstUserTask } from '@/lib/constants/getstarted.constant';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useGettingStartedStore } from '@/lib/store/business/index.store';

const ContaktGetStarted = () => {
  const onboardingStatus = useGettingStartedStore((state) => state.onboardingStatus);
  const progress = useGettingStartedStore((state) => state.progressBar);

  return (
    <div className='max-w-2xl mx-auto xl:mx-48 flex flex-col gap-2'>
      <h6 className='font-semibold text-neutral-800'>Get started</h6>
      <p className='text-base leading-5 text-neutral-base'>
        Setup the following to use Contakt effectively and supercharge your sales.
      </p>
      <div className='mb-6'>
        <Progress value={progress} className='bg-gray-200 [&>div]:bg-success-base w-full h-2' />
      </div>
      <div className='space-y-6'>
        {ConstUserTask.map((task) => {
          const isCompleted = onboardingStatus[task.value] || false;

          return (
            <div key={task.value} className='flex items-center space-x-2'>
              {isCompleted ? (
                <>
                  <Checkbox id={task.value} checked={true} disabled />
                  <Label htmlFor={task.value} className='text-base text-neutral-base cursor-not-allowed opacity-90'>
                    {task.label}
                  </Label>
                </>
              ) : (
                <Link
                  href={task.href!}
                  className='flex items-center space-x-2 p-2 rounded-md transition hover:bg-success-light/20 w-fit'
                >
                  <Checkbox id={task.value} checked={false} />
                  <Label
                    htmlFor={task.value}
                    className='text-base text-primary-base cursor-pointer font-medium hover:underline'
                  >
                    {task.label}
                  </Label>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContaktGetStarted;

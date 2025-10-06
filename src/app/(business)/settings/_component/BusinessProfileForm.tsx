'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ConstBusinessIndustries as industries } from '@/lib/constants/auth.constant';
import { ImageUploader } from '@/components/custom/ImageUploderField';
//import { businessProfileSchema, TBusinessProfileForm } from '@/lib/store/business/settings.store';
import { businessProfileSchema, TBusinessProfileForm } from '@/lib/schemas/business/settings.schema';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import SelectField from '@/components/custom/SelectField';
import InputField from '@/components/custom/InputField';

interface BusinessProfileFormProps {
  className?: string;
}

const BusinessProfileForm = ({ className }: BusinessProfileFormProps) => {
  const businessProfileForm = useForm<TBusinessProfileForm>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      businessLogo: '',
      businessBio: '',
      category: '',
      businessAddress: '',
      businessEmail: '',
      businessWebsite: '',
    },
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = businessProfileForm;

  const businessLogo = watch('businessLogo');

  const handleFormSubmit = async (data: TBusinessProfileForm) => {
    try {
      console.log('Form data:', data);
      //onSubmit?.(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  return (
    <div className={cn('flex flex-col gap-6 max-w-2xl px-4 py-2', className)}>
      <h2 className='font-medium text-xl leading-[150%] text-neutral-800'>Setup your Business Whatsapp Profile</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-8'>
        {/* Business Logo */}
        <ScrollArea className='h-82'>
          <div className='flex flex-col gap-6 '>
            {/* Business Logo Uploader */}
            <div className='space-y-4'>
              <div className='space-y-1'>
                <Label className='text-[18px] leading-[155%] font-medium text-neutral-700'>Business Logo</Label>
                <p className='text-sm leading-[155%] text-neutral-base'>
                  Logo will appear as the profile picture for your business.
                </p>
              </div>
              <ImageUploader
                value={businessLogo}
                onChange={(value) => {
                  setValue('businessLogo', value);
                  if (errors.businessLogo) clearErrors('businessLogo');
                }}
                className='mt-2'
              />
              {errors.businessLogo && <p className='text-sm text-red-600'>{errors.businessLogo.message}</p>}
            </div>
            <Separator orientation='horizontal' />
            {/* Business Bio */}
            <div className='space-y-4'>
              <div className='space-y-1'>
                <Label className='text-[18px] leading-[155%] font-medium text-neutral-700'>Your business bio</Label>
                <p className='text-sm leading-[155%] text-neutral-base'>
                  Introduce your business and let customers know how you can help
                </p>
              </div>
              <Textarea
                id='businessBio'
                placeholder='Tell customers about your business...'
                className={cn(
                  'min-h-[100px] resize-none max-w-md',
                  errors.businessBio && 'border-red-500 focus:border-red-500'
                )}
                {...register('businessBio')}
              />
              {errors.businessBio && <p className='text-sm text-red-600'>{errors.businessBio.message}</p>}
            </div>
            {/* Category */}
            <div className='space-y-4'>
              <div className='space-y-1'>
                <Label className='text-[18px] leading-[155%] font-medium text-neutral-700'>Category</Label>
                <p className='text-sm leading-[155%] text-neutral-base'>Select a category for your business</p>
              </div>
              <SelectField<TBusinessProfileForm>
                name={'category'}
                control={control}
                options={industries}
                className='w-full max-w-md'
                placeholder='Select Category'
              />
            </div>
            <Separator orientation='horizontal' />
            {/* Contact Information */}
            <div className='space-y-4'>
              <div className='space-y-1'>
                <Label className='text-[18px] leading-[155%] font-medium text-neutral-700'>Contact information</Label>
                <p className='text-sm leading-[155%] text-neutral-base'>
                  Add your contact information for your business profile.
                </p>
              </div>
              {/* Business Address */}
              <div className='space-y-2'>
                <Label htmlFor='businessAddress' className='text-base font-medium text-gray-700'>
                  Business address
                </Label>
                <InputField<TBusinessProfileForm>
                  name='businessAddress'
                  control={control}
                  type='text'
                  placeholder='Enter Business Address'
                  className='max-w-md mt-1 focus-visible:ring-0'
                />
                {errors.businessAddress && <p className='text-sm text-red-600'>{errors.businessAddress.message}</p>}
              </div>
              {/* Business Email and Website */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg'>
                <div className='space-y-2'>
                  <Label htmlFor='businessAddress' className='mb-1 text-base font-medium text-gray-700'>
                    Business email
                  </Label>
                  <InputField<TBusinessProfileForm>
                    name='businessEmail'
                    control={control}
                    type='email'
                    placeholder='Enter Business Email'
                    className={`focus-visible:ring-0 ${cn(
                      errors.businessEmail && 'border-red-500 focus:border-red-500'
                    )}`}
                  />
                  {errors.businessEmail && <p className='text-sm text-red-600'>{errors.businessEmail.message}</p>}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='businessAddress' className='text-base font-medium text-gray-700'>
                    Business website
                  </Label>
                  <InputField<TBusinessProfileForm>
                    name='businessWebsite'
                    control={control}
                    type='text'
                    placeholder='Enter Business Website'
                    className={`focus-visible:ring-0 ${cn(
                      errors.businessWebsite && 'border-red-500 focus:border-red-500'
                    )}`}
                  />
                  {errors.businessWebsite && <p className='text-sm text-red-600'>{errors.businessWebsite.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </form>
    </div>
  );
};

export default BusinessProfileForm;

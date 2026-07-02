'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, ShieldCheck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface IBusinessCardProps {
  id: string;
  company_name: string;
  roleName: string;
  image?: string;
}

function BusinessCard({ id, company_name, roleName, image }: Readonly<IBusinessCardProps>) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
      }}
      className='rounded-xl border bg-card'
    >
      <div className='p-5'>
        <div className='flex gap-4'>
          <div>
            <Image
              src={image ?? '/images/business_placeholder.png'}
              width={54}
              height={54}
              alt=''
              className=' rounded-lg'
            />
          </div>
          <div className='space-y-0.5'>
            <h3 className='font-semibold text-lg leading-[150%]'>{company_name}</h3>
            <p className='text-sm'>Business ID: {id}</p>
            <p className='text-sm'>Type: {'Premium'}</p>
          </div>
        </div>
      </div>
      <div className='border-t px-5 py-3'>
        <div className='flex items-center gap-2'>
          <ShieldCheck size={16} />
          <span>{roleName}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function BusinessProfileSection() {
  const businesses: IBusinessCardProps[] = [
    {
      id: '806108011818799',

      company_name: 'Contakt Manager',

      roleName: 'Administrator',
    },

    {
      id: '1592654978757601',

      company_name: 'Contakt Platform v2',

      roleName: 'Administrator',
    },
  ];
  return (
    <div className='bg-gray-100 min-h-screen w-full mx-auto p-12 max-w-6xl'>
      <div className='flex flex-col gap-6'>
        {/* Page Header */}
        {/* <div className='flex'>
          <div className='space-x-1'>
            <h1 className='text-3xl font-bold tracking-tight'>Your Business Profiles</h1>
            <p className='text-default-500 mt-2'>Select a business to continue</p>
          </div>
        </div> */}
        <div className='flex justify-between'>
          <h1 className='text-3xlfont-bold tracking-tight'>Apps</h1>
          <div className='flex gap-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-3' size={18} />
              <Input placeholder='Search by App Name' className='pl-10 w-100' />
            </div>
            <Button>Create App</Button>
          </div>
        </div>
        {/* Membership Grid */}
        <div className='my-4 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          <Card className='w-full p-5 shadow-md rounded-xl border-2 h-48'>
            <CardContent className='px-4 py-2'>
              <div className='space-y-3'>
                <h6 className='font-semibold text-base leading-[150%] text-gray-700'>Filter by</h6>
                <div className='px-4'>
                  <RadioGroup defaultValue='all'>
                    <div className='flex gap-2'>
                      <RadioGroupItem value='all' id='all' />
                      <Label htmlFor='all'>All Businesses (2)</Label>
                    </div>
                    <div className='flex gap-2'>
                      <RadioGroupItem value='archived' id='archived' />
                      <Label htmlFor='archived'>Archived</Label>
                    </div>
                    <div className='flex gap-2'>
                      <RadioGroupItem value='required' id='required' />
                      <Label htmlFor='required'>Required Action</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='col-span-2 -full p-5 shadow-md rounded-xl border-2'>
            <CardContent>
              <div className='p-6'>
                <h2 className='font-semibold text-2xl'>Admin Apps</h2>
              </div>
              <div className='grid grid-cols-2 gap-6'>
                {businesses.map((business) => (
                  <BusinessCard key={business.id} {...business} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

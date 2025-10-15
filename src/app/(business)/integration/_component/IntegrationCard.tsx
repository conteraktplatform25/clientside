import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface IntegrationCardProps {
  title: string;
  description: string;
  src: string;
  onConnect: () => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ title, description, src, onConnect }) => {
  return (
    <Card className='flex flex-col justify-between h-full'>
      <CardHeader className='flex flex-row items-center space-x-4 pb-2'>
        <div className='p-2 rounded-md bg-gray-100 dark:bg-gray-800'>
          <Image src={src} alt={title} width={26} height={13} />
        </div>
        <CardTitle className='text-base font-semibold text-neutral-900'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='flex-grow space-y-4'>
        <p className='text-base leading-[150%] text-neutral-base'>{description}</p>
        <Button
          variant={'outline'}
          onClick={onConnect}
          className='w-full border-[#1A73E829] shadow-[#1A73E8] text-sm text-primary-base hover:text-white hover:bg-primary-base'
        >
          Connect to Contakt
        </Button>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;

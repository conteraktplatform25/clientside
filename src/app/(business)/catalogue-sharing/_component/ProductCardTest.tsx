import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { TCreateProductRequest } from '@/lib/hooks/business/catalogue-sharing.hook';
import { getCurrencySymbol } from '@/lib/helpers/string-manipulator.helper';

interface ProductCardProps {
  product: TCreateProductRequest;
}

const ProductCardTest: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className='p-0 w-full max-w-md rounded-lg overflow-hidden shadow-none transition-shadow duration-200'>
      <CardContent className='p-0'>
        <div className='relative w-full h-48 bg-gray-100 flex items-center justify-center'>
          {product.media ? (
            <Image
              height={48}
              width={48}
              src={product.media?.[0]?.url}
              alt={product.name}
              className='object-cover w-full h-full rounded-t-lg'
            />
          ) : (
            <svg width='144' height='117' viewBox='0 0 144 117' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <rect width='143.505' height='115.185' transform='translate(0.25 0.907959)' fill='#F3F4F6' />
              <path
                d='M72.4367 116.082C51.4148 116.082 30.393 116.082 9.37108 116.082C8.34418 116.082 7.304 116.082 6.27268 115.985C1.00983 115.538 -1.10593 112.308 1.13819 107.942C3.08576 104.172 5.21037 100.498 7.27302 96.7689C17.0108 79.2083 26.7487 61.6503 36.4865 44.095C36.7875 43.5588 37.1017 43.0225 37.4514 42.5105C39.9036 38.9301 43.8872 38.4261 47.0255 41.5146C49.2386 43.6757 51.1109 46.103 53.085 48.4455C63.1179 60.3883 73.1508 72.3364 83.1837 84.2899C87.5658 89.4912 93.0853 89.7734 98.2331 85.0963C100.787 82.7739 103.283 80.391 105.868 78.0887C110.529 73.9358 115.819 74.1857 119.625 79.0282C127.265 88.7452 134.715 98.5913 142.199 108.405C142.784 109.175 143.232 110.024 143.527 110.921C144.253 113.175 143.226 114.989 140.717 115.59C139.143 115.933 137.527 116.092 135.91 116.062C114.764 116.094 93.6062 116.101 72.4367 116.082Z'
                fill='#DCDDDF'
              />
              <path
                d='M119.581 19.8588C119.576 23.607 118.349 27.2693 116.055 30.3815C113.762 33.4937 110.506 35.9156 106.7 37.3401C102.894 38.7646 98.7098 39.1276 94.6771 38.3831C90.6443 37.6386 86.9451 35.8201 84.0483 33.1581C81.1515 30.4962 79.1877 27.1107 78.4057 23.4308C77.6237 19.7509 78.0589 15.9424 79.656 12.488C81.2531 9.0337 83.9403 6.08913 87.3768 4.02763C90.8132 1.96613 94.8443 0.880541 98.959 0.908485C104.438 0.97191 109.67 2.99401 113.528 6.53888C117.385 10.0837 119.559 14.8675 119.581 19.8588Z'
                fill='#DCDDDF'
              />
            </svg>
          )}
          {/* <span className='absolute top-2 left-2 font-medium bg-white text-neutral-800 text-xs px-2 py-1 rounded-full'>
            {product.category?.name}
          </span> */}
          <span className='absolute top-2 left-2 font-medium bg-white text-neutral-800 text-xs px-2 py-1 rounded-full'>
            {product.categoryId}
          </span>
        </div>
        <div className='p-3'>
          <h3 className='text-base leading-[150%] font-semibold mb-1 text-neutral-700'>{product.name}</h3>
          <p className='text-sm leading-[155%] text-neutral-500 line-clamp-2 mb-3'>
            {product.description || 'No description available.'}
          </p>
          <div className='flex items-center justify-between'>
            <span className='text-base font-semibold text-neutral-900'>
              {getCurrencySymbol(product.currency)} {product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className='p-4 pt-0'>
        <Button variant='outline' className='w-full'>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCardTest;

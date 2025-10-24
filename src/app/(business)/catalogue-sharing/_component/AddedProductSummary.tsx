'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useProductCatalogueStore } from '@/lib/store/business/catalogue-sharing.store';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AddedProductsSummary: React.FC = () => {
  const addedProducts = useProductCatalogueStore((state) => state.addedProducts);
  const addAddedProductsToCatalogue = useProductCatalogueStore((state) => state.addAddedProductsToCatalogue);
  const router = useRouter();

  const handleViewCatalogue = () => {
    addAddedProductsToCatalogue();
    router.push('/catalogue-sharing');
  };
  return (
    <div className='w-full max-w-md px-4 py-[18px] text-neutral-base bg-white border border-[#EEEFF1] rounded-[12px]'>
      <h2 className='text-base leading-[150%] text-neutral-700 font-semibold mb-2'>Added products</h2>
      <p className='text-sm leading-[155%] mb-4'>
        {addedProducts.length} product{addedProducts.length !== 1 ? 's' : ''} in catalogue
      </p>
      <div className='space-y-2 mb-4'>
        {addedProducts.length > 0 ? (
          addedProducts.map((product) => (
            <Card key={product.id} className='border-none shadow-none'>
              <CardContent className='p-4  border border-[#EEEFF1] rounded-[12px]'>
                <div className='flex justify-between items-start mb-1'>
                  <h3 className='font-medium text-sm leading-[155%]'>{product.name}</h3>
                  <span className='mt-1 font-medium text-sm'>
                    {product.currency} {product.price.toLocaleString()}
                  </span>
                </div>
                <div className='text-xs mb-1 max-w-fit border rounded-[8px] p-3 bg-[#F3F4F6]'>
                  {product.category?.name}
                </div>
                <p className='text-sm line-clamp-2 px-2'>{product.description}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className='text-sm leading-[155%] text-center py-4'>No products added yet.</p>
        )}
      </div>
      <Button onClick={handleViewCatalogue} className='w-full'>
        View catalogue <ArrowRight className='ml-2 h-4 w-4' />
      </Button>
    </div>
  );
};
export default AddedProductsSummary;

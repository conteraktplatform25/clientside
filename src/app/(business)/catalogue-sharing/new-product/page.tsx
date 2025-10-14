import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import NewProductCatalogueForm from '../_component/NewProductCatalogueForm';
import AddedProductsSummary from '../_component/AddedProductSummary';

const NewProductPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='container mx-auto'>
        {/* Breadcrumbs */}
        <nav className='mb-6 flex items-center text-sm text-gray-500'>
          <Link href='/catalogue-sharing' className='hover:text-blue-600'>
            Catalogue
          </Link>
          <ChevronRight className='h-4 w-4 mx-1' />
          <span className='text-blue-600 font-medium'>Create catalogue</span>
        </nav>

        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='lg:w-2/3'>
            <NewProductCatalogueForm />
          </div>
          <div className='lg:w-1/3'>
            <AddedProductsSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProductPage;

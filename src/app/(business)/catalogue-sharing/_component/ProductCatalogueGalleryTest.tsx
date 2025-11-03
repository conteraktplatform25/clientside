'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, Plus, Share2 } from 'lucide-react';
import { FaGreaterThan } from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';
import UILoaderIndicator from '@/components/custom/UILoaderIndicator';
import CategoryProfileDialog from './CategoryProfileDialog';
import { useCategoryCatalogueStore, useProductCatalogueStore } from '@/lib/store/business/catalogue-sharing.store';
import { useGetCategories, useGetProducts } from '@/lib/hooks/business/catalogue-sharing.hook';
import ProductCardTest from './ProductCardTest';

const PRODUCTS_PER_PAGE = 6;

const ProductCatalogueGalleryTest: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCategoriesDialogOpen, setIsCategoriesDialogOpen] = useState(false);

  const allCategories = useCategoryCatalogueStore((state) => state.allCategories);
  const clearAddedCategories = useCategoryCatalogueStore((state) => state.clearAddedCategories);
  const ddCategories = useCategoryCatalogueStore((state) => state.ddCategories);
  const setDDCategories = useCategoryCatalogueStore((state) => state.setDDCategories);

  const setProductCatalogue = useProductCatalogueStore((state) => state.addedProductsToCatalogue);
  const allProducts = useProductCatalogueStore((state) => state.catalogueProducts);

  // ✅ React Query data fetching
  const { data: categoriesData, isLoading: isLoadingCategories, isError: isErrorCategories } = useGetCategories();
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
  } = useGetProducts(selectedCategory, searchQuery, currentPage, PRODUCTS_PER_PAGE);

  // ✅ Extract real data
  //const products = productsData?.products ?? [];
  const pagination = productsData?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  useEffect(() => {
    if (categoriesData && categoriesData.categories.length > 0 && ddCategories.length === 0) {
      setDDCategories(categoriesData.categories);
    }
  }, [categoriesData, ddCategories, setDDCategories]);

  useEffect(() => {
    if (productsData && productsData.products.length > 0) {
      setProductCatalogue(productsData.products);
    }
  }, [productsData, setProductCatalogue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  if (isLoadingCategories || isLoadingProducts) {
    return <UILoaderIndicator label='Fetching your catalogue...' />;
  }

  if (isErrorCategories || isErrorProducts) {
    return <EmptyProductTest />;
  }

  const hasCategories = ddCategories.length > 0;
  const hasProducts = allProducts.length > 0;

  const handleCloseCategoryDialog = () => {
    setIsCategoriesDialogOpen(false);
    clearAddedCategories();
  };

  const handleCreateCategory = () => {
    setIsCategoriesDialogOpen(true);
  };

  if (!hasCategories || !hasProducts) return <EmptyProductTest />;

  return (
    <div className='container w-full mx-auto xl:mx-48 px-6 py-2'>
      {/* Header */}
      <div className='w-full flex justify-between my-4'>
        <div className='inline-flex space-x-2 py-3'>
          <h6 className='text-sm leading-[155%]'>Catalogue</h6>
          <FaGreaterThan className='mt-1.5 border-[1.5px] w-[10px] h-2.5 text-sm text-neutral-base' />
          <h6 className='text-primary-base text-sm leading-[155%]'>Product catalogue</h6>
        </div>
        <Button variant='link' className='font-medium text-sm text-primary-base' onClick={handleCreateCategory}>
          Create Categories
        </Button>
      </div>

      {/* Search + Filter */}
      <div className='flex flex-col md:flex-row items-center justify-between gap-4 mb-8'>
        <h3 className='font-semibold text-xl text-neutral-800'>Product Catalogue</h3>
        <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
          <div className='relative w-full md:max-w-xs'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' />
            <Input
              type='text'
              placeholder='Search products'
              className='pl-9 pr-3 py-2 rounded-[8px] border border-[#EEEFF1] w-full'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            onValueChange={(value) => setSelectedCategory(value === 'all' ? undefined : value)}
            value={selectedCategory || 'all'}
          >
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='All Categories' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All categories</SelectItem>
              {ddCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant='outline' className='w-full sm:w-auto'>
            <Link href='/catalogue-sharing/new-product' className='inline-flex items-center space-x-1.5'>
              <Plus className='mr-2 h-4 w-4' /> Add more
            </Link>
          </Button>
          <Button className='w-full sm:w-auto bg-primary-base'>
            <Share2 className='mr-2 h-4 w-4' /> Share catalogue
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      {hasProducts && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
          {allProducts.map((product) => (
            <ProductCardTest key={product.name} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink isActive={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Category Modal */}
      <CategoryProfileDialog
        listedCategories={allCategories}
        isOpen={isCategoriesDialogOpen}
        onClose={handleCloseCategoryDialog}
      />
    </div>
  );
};

const EmptyProductTest = () => {
  const { clearAddedCategories, allCategories } = useCategoryCatalogueStore();
  const [isCategoriesDialogOpen, setIsCategoriesDialogOpen] = useState(false);

  const handleCloseCategoryDialog = () => {
    setIsCategoriesDialogOpen(false);
    clearAddedCategories();
  };

  return (
    <div className='flex flex-col items-center justify-center h-[80vh] text-center bg-white relative'>
      <div className='absolute top-6 right-6'>
        {allCategories.length === 0 ? (
          <Button variant='link' className='text-primary-base' onClick={() => setIsCategoriesDialogOpen(true)}>
            Create Categories
          </Button>
        ) : (
          <div className='flex gap-8 items-start'>
            <Button variant='ghost' className='text-primary-base' onClick={() => setIsCategoriesDialogOpen(true)}>
              Create Categories
            </Button>
            <Link href='/catalogue-sharing/new-product'>
              <Button className='bg-primary-base hover:bg-primary-700 text-white'>+ Create products</Button>
            </Link>
          </div>
        )}
      </div>

      <Image
        src='/images/img-empty-data.png'
        alt='Empty catalogue'
        width={120}
        height={120}
        className='mb-4 opacity-80'
      />
      <p className='text-gray-500 text-base'>You don’t have any catalogue items yet.</p>

      <CategoryProfileDialog
        listedCategories={allCategories}
        isOpen={isCategoriesDialogOpen}
        onClose={handleCloseCategoryDialog}
      />
    </div>
  );
};

export default ProductCatalogueGalleryTest;

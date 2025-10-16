'use client';
import React, { useState, useMemo, useEffect } from 'react';
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
import ProductCard from './ProductCard';
import { FaGreaterThan } from 'react-icons/fa6';
import Link from 'next/link';
import { useProductCatalogueStore } from '@/lib/store/business/catalogue-sharing.store';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';

const PRODUCTS_PER_PAGE = 6;

const ProductCatalogueGallery: React.FC = () => {
  // Get products from store
  const catalogueProducts = useProductCatalogueStore((state) => state.catalogueProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All products');
  const [currentPage, setCurrentPage] = useState(1);
  const { setTitle } = usePageTitleStore();

  useEffect(() => {
    setTitle('Catalogue');
  }, [setTitle]);

  const filteredProducts = useMemo(() => {
    let products = catalogueProducts;

    if (searchTerm) {
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All products') {
      products = products.filter((product) => product.category === selectedCategory);
    }

    return products;
  }, [searchTerm, selectedCategory, catalogueProducts]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(catalogueProducts.map((p) => p.category)); // Use catalogueProducts for categories
    return ['All products', ...Array.from(uniqueCategories)];
  }, [catalogueProducts]); // Add catalogueProducts to dependencies

  return (
    <div className='container mx-auto p-6 bg-white rounded-lg shadow-md'>
      <div className='inline-flex space-x-2 py-3'>
        <h6 className=' text-sm leading-[155%]'>Catalogue</h6>
        <FaGreaterThan className='mt-1.5 border-[1.5px] w-[10px] h-2.5 text-sm text-neutral-base' />
        <h6 className='text-primary-base text-sm leading-[155%]'>Product catalogue</h6>
      </div>
      {/* Header: Search, Filter, Add More, Share Catalogue */}
      <div className='flex flex-col md:flex-row items-center justify-between gap-4 mb-8'>
        <h3 className='font-semibold text-xl leading-[150%] text-neutral-800'>Product Catalogue</h3>
        <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
          <div className='relative w-full md:max-w-xs'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' />
            <Input
              type='text'
              placeholder='Search products'
              className='pl-9 pr-3 py-2 rounded-[8px] border border-[#EEEFF1] focus:ring-blue-500 focus:border-blue-500 w-full'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          <Select
            onValueChange={(value) => {
              setSelectedCategory(value);
              setCurrentPage(1); // Reset to first page on filter
            }}
            value={selectedCategory}
          >
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='All products' />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant='outline' className='w-full sm:w-auto'>
            <Link href='/catalogue-sharing/new-product' className='inline-flex space-x-1.5'>
              <Plus className='mr-2 h-4 w-4' /> Add more
            </Link>
          </Button>
          <Button className='w-full sm:w-auto bg-primary-base'>
            <Share2 className='mr-2 h-4 w-4' /> Share catalogue
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className='col-span-full text-center text-gray-500 py-10'>No products found matching your criteria.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ProductCatalogueGallery;

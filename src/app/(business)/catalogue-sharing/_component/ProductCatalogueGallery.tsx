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
import ProductCard from './ProductCard';
import { FaGreaterThan } from 'react-icons/fa6';
import Link from 'next/link';
import Image from 'next/image';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';
import { IProductCatalogueProp } from '@/type/client/business/product-catalogue.type';
import UILoaderIndicator from '@/components/custom/UILoaderIndicator';

const PRODUCTS_PER_PAGE = 6;

const ProductCatalogueGallery: React.FC = () => {
  // Get products from store
  //const catalogueProducts = useProductCatalogueStore((state) => state.catalogueProducts);
  //const catalogueProducts: IProductCatalogueProp[] = [];
  const { setTitle } = usePageTitleStore();
  const [products, setProducts] = useState<IProductCatalogueProp[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All products');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle('Catalogue');
  }, [setTitle]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          categoryId: selectedCategory || '',
          page: currentPage.toString(),
          limit: PRODUCTS_PER_PAGE.toString(),
        });
        console.log(params);

        const res = await fetch(`/api/catalogue/products?${params.toString()}`);
        const data = await res.json();
        console.log(params);
        if (res.ok) {
          setProducts(data.data.products);
          setTotalPages(data.data.pagination.totalPages);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchTerm, selectedCategory, currentPage]);

  // const filteredProducts = useMemo(() => {
  //   let products = catalogueProducts;

  //   if (searchTerm) {
  //     products = products.filter(
  //       (product) =>
  //         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         product.description.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }

  //   if (selectedCategory !== 'All products') {
  //     products = products.filter((product) => product.category === selectedCategory);
  //   }

  //   return products;
  // }, [searchTerm, selectedCategory, catalogueProducts]);

  //const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  // const currentProducts = useMemo(() => {
  //   const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  //   const endIndex = startIndex + PRODUCTS_PER_PAGE;
  //   return filteredProducts.slice(startIndex, endIndex);
  // }, [filteredProducts, currentPage]);

  // const categories = useMemo(() => {
  //   const uniqueCategories = new Set(catalogueProducts.map((p) => p.category)); // Use catalogueProducts for categories
  //   return ['All categories', ...Array.from(uniqueCategories)];
  // }, [catalogueProducts]); // Add catalogueProducts to dependencies
  if (loading) return <UILoaderIndicator label='Fetching your setup progress...' />;

  if (products.length === 0) {
    return <EmptyProductCaalogue />;
  }

  return (
    <div className='container w-full mx-auto xl:mx-48 p-6'>
      <div className='inline-flex space-x-2 py-3'>
        <h6 className=' text-sm leading-[155%]'>Catalogue</h6>
        <FaGreaterThan className='mt-1.5 border-[1.5px] w-[10px] h-2.5 text-sm text-neutral-base' />
        <h6 className='text-primary-base text-sm leading-[155%]'>Product catalogue</h6>
      </div>
      {/* Header: Search, Filter, Add More, Share Catalogue */}
      <div className='flex flex-col md:flex-row items-center justify-between gap-4 w-full max-w-[1320px] mb-8'>
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
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='All Categories' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=''>All categories</SelectItem>
              {/* Dynamically render from products */}
              {[...new Set(products.map((p) => p.category?.name))].map(
                (cat) =>
                  cat && (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  )
              )}
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
        {/* {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))} */}
        {/* {currentProducts.length > 0 ? (
          currentProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className='col-span-full text-center text-gray-500 py-10'>No products found matching your criteria.</div>
        )} */}
      </div>

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
    </div>
  );
};

const EmptyProductCaalogue = () => {
  return (
    <div className='flex flex-col items-center justify-center h-[80vh] text-center bg-white relative'>
      {/* Top-right button */}
      <div className='absolute top-6 right-6'>
        <Link href='/catalogue-sharing/new-product'>
          <Button className='bg-primary-base hover:bg-primary-700 text-white'>+ Create catalogue</Button>
        </Link>
      </div>

      {/* Illustration + message */}
      <div className='flex flex-col items-center justify-center'>
        <Image
          src='/images/img-empty-data.png' // replace with your actual image path
          alt='Empty catalogue'
          width={120}
          height={120}
          className='mb-4 opacity-80'
        />
        <p className='text-gray-500 text-base'>You don’t have any catalogue items yet.</p>
      </div>
    </div>
  );
};

export default ProductCatalogueGallery;

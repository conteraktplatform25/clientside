'use client';

import React, { useEffect, useState } from 'react';
import { useCategoryCatalogueStore, useProductCatalogueStore } from '@/lib/store/business/catalogue-sharing.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, ChevronRight, ArrowLeft } from 'lucide-react';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '@/components/custom/InputField';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import {
  TCreateProductRequest,
  useCreateProduct,
  useGetDesktopProducts,
} from '@/lib/hooks/business/catalogue-sharing.hook';
import { CreateProductSchema } from '@/lib/schemas/business/server/catalogue.schema';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import UILoaderIndicator from '@/components/custom/UILoaderIndicator';
import { CurrencyType } from '@prisma/client';
import { getCurrencySymbol } from '@/lib/helpers/string-manipulator.helper';
import PriceInputField from '@/components/custom/PriceInputField';

const NewProductCatalogueFormTest: React.FC = () => {
  const router = useRouter();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  console.log(files);

  //const productCatalogues = useProductCatalogueStore((state) => state.catalogueProducts);
  const productCatalogues = useProductCatalogueStore((state) => state.desktopProducts);
  const setDesktopProduct = useProductCatalogueStore((state) => state.setDesktopProducts);

  const createProductMutation = useCreateProduct();
  const dropDownCategories = useCategoryCatalogueStore((state) => state.dropDownCategories);

  // const { data: productsData, isLoading: isLoadingProducts, isError: isErrorProducts } = useGetDesktopProducts();
  const { data: productsData, isLoading: isLoadingProducts } = useGetDesktopProducts();

  useEffect(() => {
    console.log(productsData);
    if (productsData && productsData.products.length > 0) {
      setDesktopProduct(productsData.products);
    }
  }, [productsData, setDesktopProduct]);

  const form = useForm<TCreateProductRequest>({
    resolver: zodResolver(CreateProductSchema) as Resolver<TCreateProductRequest>,
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      price: 0,
      stock: 0,
      media: [],
      currency: CurrencyType.NAIRA,
    },
  });

  const {
    handleSubmit,
    control,
    //formState: { errors },
    getValues,
    reset,
  } = form;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
    if (selectedFiles.length === 0) return;

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setFiles((prev) => [...prev, ...selectedFiles]);

    // Update form media field
    const mediaEntries = selectedFiles.map((file, index) => ({
      url: '', // will be populated after upload
      altText: file.name,
      order: (getValues('media')?.length ?? 0) + index + 1,
    }));

    form.setValue('media', [...(form.getValues('media') ?? []), ...mediaEntries]);
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));

    const updatedMedia = form.getValues('media')?.filter((_, i) => i !== index);
    form.setValue('media', updatedMedia);
  };

  const handleProductList = () => {
    router.push('/catalogue-sharing');
  };

  const onSubmit = async (data: TCreateProductRequest) => {
    console.log('✅ Product Submitted:', data);
    // Example: handle uploads here if needed
    // e.g., upload to S3 or your API before POSTing product
    // const uploadedMedia = await uploadFiles(files);
    // data.media = uploadedMedia.map((file, index) => ({
    //   url: file.url,
    //   altText: files[index].name,
    //   order: index + 1,
    // }));

    // Then call your /api/products POST route
    // await fetch("/api/products", { method: "POST", body: JSON.stringify(data) });
    data.media = undefined;
    await createProductMutation.mutateAsync(data);
    reset();
  };

  if (isLoadingProducts) {
    return (
      <div className='min-h-screen w-full mx-auto'>
        <UILoaderIndicator label='Fetching your previously store product catalogue ...' />;
      </div>
    );
  }

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
        {createProductMutation.isPending ? (
          <div className='flex justify-center items-center h-[800px]'>
            <UILoaderIndicator label='Saving product item to server...' />
          </div>
        ) : (
          <div className='flex flex-col lg:flex-row gap-6'>
            <div className='lg:w-2/3'>
              <div className='w-full max-w-3xl p-8 bg-white shadow rounded-2xl'>
                <div className='mb-6'>
                  <h2 className='text-xl font-semibold'>Create catalogue</h2>
                  <p className='text-gray-600 text-sm'>Fill in the information for your product.</p>
                </div>
                <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <InputField<TCreateProductRequest>
                        name={'name'}
                        control={control}
                        placeholder='Product name'
                        label='Product Name'
                        important
                      />
                      <InputField<TCreateProductRequest>
                        name={'sku'}
                        control={control}
                        placeholder='Product SKU'
                        label='Product SKU'
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name='description'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder='Description' {...field} rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <FormField
                        control={form.control}
                        name='currency'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Currency <span className='text-red-500'>*</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder='Select category' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={'NAIRA'}>{'Naira'}</SelectItem>
                                <SelectItem value={'DOLLAR'}>{'Dollar'}</SelectItem>
                                <SelectItem value={'POUND'}>{'Pound'}</SelectItem>
                                <SelectItem value={'EURO'}>{'Euro'}</SelectItem>
                                <SelectItem value={'CNY'}>{'CNY'}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <PriceInputField<TCreateProductRequest> name='price' control={control} label='Price' important />
                      <FormField
                        control={control}
                        name='stock'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock quantity</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                placeholder='0'
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                className='w-[100px]'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name='categoryId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Category <span className='text-red-500'>*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className='w-[300px]'>
                                <SelectValue placeholder='Select category' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dropDownCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Media Section */}
                    <FormItem>
                      <FormLabel>Product images</FormLabel>
                      <FormControl>
                        <div className='flex items-center space-x-2'>
                          <Input
                            id='productImages'
                            type='file'
                            multiple
                            accept='image/*'
                            onChange={handleImageChange}
                            className='hidden'
                          />
                          <Label
                            htmlFor='productImages'
                            className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50'
                          >
                            <Upload className='mr-2 h-4 w-4' /> Choose files
                          </Label>
                        </div>
                      </FormControl>

                      {/* Preview section */}
                      <div className='flex flex-wrap gap-2 mt-4'>
                        {imagePreviews.map((src, index) => (
                          <div
                            key={index}
                            className='relative w-24 h-24 rounded-md overflow-hidden border border-gray-200'
                          >
                            <Image
                              src={src}
                              alt={`Preview ${index + 1}`}
                              width={96}
                              height={96}
                              className='object-cover w-full h-full'
                            />
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 text-white hover:bg-black/70'
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X className='h-3 w-3' />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>

                    <Button type='submit' className='w-full md:w-auto bg-primary-base hover:bg-primary-700'>
                      Save product
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
            <div className='lg:w-1/3'>
              <div className='w-full max-w-md px-4 py-[18px] text-neutral-base bg-white border border-[#EEEFF1] rounded-[12px]'>
                <h2 className='text-base leading-[150%] text-neutral-700 font-semibold mb-2'>Added products</h2>
                <p className='text-sm leading-[155%] mb-4'>
                  {productCatalogues.length} product{productCatalogues.length !== 1 ? 's' : ''} in the server catalogue
                </p>
                <ScrollArea className='h-84'>
                  <div className='space-y-4'>
                    {productCatalogues.length > 0 ? (
                      productCatalogues.map((product) => (
                        <Card key={product.name} className='border-none shadow-none p-0'>
                          <CardContent className='px-4 py-2  border border-[#EEEFF1] rounded-[12px]'>
                            <div className='flex flex-col items-start mb-1'>
                              <h3 className='font-medium text-sm leading-[155%]'>{product.name}</h3>
                              <span className='mt-1 font-medium text-sm'>
                                {getCurrencySymbol(product.currency)} {product.price.toLocaleString()}
                              </span>
                            </div>
                            {product.category && (
                              <div className='text-xs mb-1 max-w-fit border rounded-[8px] p-3 bg-[#F3F4F6]'>
                                {product.category.name}
                              </div>
                            )}
                            <p className='text-sm line-clamp-2 px-2'>{product.description}</p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className='text-sm leading-[155%] text-center py-4'>No products added yet.</p>
                    )}
                  </div>
                </ScrollArea>

                {productCatalogues.length > 0 && (
                  <Button
                    variant={'default'}
                    onClick={handleProductList}
                    className='w-full flex items-center justify-center bg-gray-600 hover:bg-gray-700'
                  >
                    <ArrowLeft className='ml-2 h-4 w-4' /> Back to Product List
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewProductCatalogueFormTest;

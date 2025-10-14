'use client';

import React, { useState } from 'react';
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import {
  productCatalogueFormSchema,
  TProductCatalogueFormValues,
} from '@/lib/schemas/business/catalogue-sharing.schema';
import { useProductCatalogueStore } from '@/lib/store/business/catalogue-sharing.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '@/components/custom/InputField';
import { Label } from '@/components/ui/label';
import { IProductCatalogueProp } from '@/type/client/business/product-catalogue.type';

const categories = ['Clothing', 'Electronics', 'Home Goods', 'Books', 'Food'];

const NewProductCatalogueForm: React.FC = () => {
  const addProduct = useProductCatalogueStore((state) => state.addProduct);
  const form = useForm<TProductCatalogueFormValues>({
    resolver: zodResolver(productCatalogueFormSchema) as Resolver<TProductCatalogueFormValues>,
    defaultValues: {
      productName: '',
      productSKU: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      category: '',
      productImages: [],
    },
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newPreviews: string[] = [];
      const newImageBase64s: string[] = [];

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          newImageBase64s.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setImagePreviews((prev) => [...prev, ...newPreviews]);
            form.setValue('productImages', [...(form.getValues('productImages') || []), ...newImageBase64s]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const onSubmit = (values: TProductCatalogueFormValues) => {
    const newProduct: IProductCatalogueProp = {
      id: `prod-${Date.now()}`, // Simple unique ID
      name: values.productName,
      sku: values.productSKU,
      description: values.description,
      amount: values.price,
      stockQuantity: values.stockQuantity,
      category: values.category,
      imageUrl: values.productImages && values.productImages.length > 0 ? values.productImages[0] : '/placeholder.svg', // Use first image as main
      images: values.productImages,
      currency: '₦', // Default currency
      availability: values.stockQuantity && values.stockQuantity > 0 ? 'Available' : 'Out of Stock',
    };
    addProduct(newProduct);
    form.reset();
    setImagePreviews([]);
    toast.success('Product saved successfully!');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
    form.setValue(
      'productImages',
      (form.getValues('productImages') || []).filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className='w-full max-w-2xl p-6 bg-white rounded-lg shadow-md'>
      <div className='mb-6'>
        <h2 className='text-xl font-semibold'>Create catalogue</h2>
        <p className='text-gray-600 text-sm'>Fill in the information for your product.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <InputField<TProductCatalogueFormValues>
              name={'productName'}
              control={form.control}
              placeholder='Product name'
              label='Product Name'
              important
            />
            <InputField<TProductCatalogueFormValues>
              name={'productSKU'}
              control={form.control}
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
                  <Textarea placeholder='Description' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Price (₦) <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='0.00'
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='stockQuantity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock quantity</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='0'
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Category <span className='text-red-500'>*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
            <div className='flex flex-wrap gap-2 mt-4'>
              {imagePreviews.map((src, index) => (
                <div key={index} className='relative w-24 h-24 rounded-md overflow-hidden border border-gray-200'>
                  <img src={src} alt={`Product preview ${index + 1}`} className='object-cover w-full h-full' />
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

          <Button type='submit' className='w-full md:w-auto'>
            Save product
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewProductCatalogueForm;

'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TProductResponse, TUpdateProduct } from '@/lib/hooks/business/catalogue-sharing.hook';
import InputField from '@/components/custom/InputField';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProductSchema } from '@/lib/schemas/business/server/catalogue.schema';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PriceInputField from '@/components/custom/PriceInputField';
import { useUpdateProduct } from '@/lib/hooks/business/catalogue-sharing.hook';
import { CurrencyType } from '@prisma/client';

interface IProductEditFormProps {
  product: TProductResponse;
  onDone: () => void;
}

export default function ProductEditForm({ product, onDone }: IProductEditFormProps) {
  const { mutateAsync: updateProduct, isPending } = useUpdateProduct();
  const form = useForm<TUpdateProduct>({
    resolver: zodResolver(UpdateProductSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      currency: product.currency as CurrencyType,
      stock: product.stock,
      sku: product.sku,
      description: product.description,
    },
  });

  const { handleSubmit, control, formState } = form;

  const onSubmit = async (values: TUpdateProduct) => {
    const dirtyFields = formState.dirtyFields;

    const payload = {
      ...(dirtyFields.name && { name: values.name }),
      ...(dirtyFields.description && { description: values.description }),
      ...(dirtyFields.price && { price: values.price }),
      ...(dirtyFields.currency && { currency: values.currency as CurrencyType }),
      ...(dirtyFields.stock && { stock: values.stock }),
      ...(dirtyFields.sku && { sku: values.sku }),
    };
    await updateProduct({ id: product.id, data: payload });

    onDone();
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <InputField<TUpdateProduct>
            name={'name'}
            control={control}
            placeholder='Product name'
            label='Product Name'
            important
          />
          <InputField<TUpdateProduct> name={'sku'} control={control} placeholder='Product SKU' label='Product SKU' />
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
              </FormItem>
            )}
          />
          <PriceInputField<TUpdateProduct> name='price' control={control} label='Price' important />
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
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-end gap-2'>
          <Button type='button' variant='ghost' onClick={onDone}>
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={isPending}
            className={`
    flex items-center gap-2
    transition-colors
    ${isPending ? 'bg-gray-400' : 'bg-primary-base hover:bg-primary-700'}
  `}
          >
            {isPending && (
              <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
            )}
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
          {/* <Button
            type='submit'
            disabled={isPending}
            className={`
    transition-colors
    ${isPending ? 'bg-gray-500 hover:bg-gray-700' : 'bg-primary-base hover:bg-primary-700'}
  `}
          >
            {isPending ? (
              <div className='w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin' />
            ) : (
              'Save Changes'
            )}
          </Button> */}
        </div>
      </form>
    </Form>
  );
}

'use client';
import React from 'react';
import { Form } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConstInboxCategory as categories } from '@/lib/constants/inbox.constant';
import { categoryFilterSchema, TCategoryFilterSchema } from '@/lib/schemas/dashboard/inbox.schema';
import { useCategoryStore } from '@/lib/store/business/inbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const CategoryFilters = () => {
  const defaultCategory = categories[0]; // 'All'
  const { setCategory } = useCategoryStore(); // optional zustand

  const categoryForm = useForm<TCategoryFilterSchema>({
    resolver: zodResolver(categoryFilterSchema),
    defaultValues: {
      inbox_category: defaultCategory,
    },
  });
  const {
    handleSubmit,
    //formState: { errors },
    setValue,
    watch,
  } = categoryForm;

  const selectedCategory = watch('inbox_category');

  const handleCategorySelect = (data: TCategoryFilterSchema) => {
    console.log('Form submitted with: ', data);
    setCategory(data.inbox_category);
  };
  return (
    <div className='block space-x-1'>
      <Form {...categoryForm}>
        <form onSubmit={handleSubmit(handleCategorySelect)} className='space-y-6 w-full'>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setValue('inbox_category', value as (typeof categories)[number]);
              setCategory(value as (typeof categories)[number]); // if zustand
            }}
          >
            <SelectTrigger className='w-[150px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </form>
      </Form>
    </div>
  );
};

export default CategoryFilters;

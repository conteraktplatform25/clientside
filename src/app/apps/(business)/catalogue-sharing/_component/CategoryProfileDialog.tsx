'use client';
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CreateCategoryRequestSchema } from '@/lib/schemas/business/server/catalogue.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '@/components/custom/InputField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useCategoryCatalogueStore } from '@/lib/store/business/catalogue-sharing.store';
import { TCreateCategoryRequest, useCreateCategory } from '@/lib/hooks/business/catalogue-sharing.hook';
import { ScrollArea } from '@/components/ui/scroll-area';
import UILoaderIndicator from '@/components/custom/UILoaderIndicator';
//import { useSyncCategories } from '@/lib/hooks/business/bridge/catalogue.bridge';
import { getErrorMessage } from '@/utils/errors';

interface CategoryProfileDialogProps {
  listedCategories: TCreateCategoryRequest[];
  isOpen: boolean;
  onClose: () => void;
}

const CategoryProfileDialog: React.FC<CategoryProfileDialogProps> = ({ isOpen, onClose }) => {
  //useSyncCategories();
  const { addedCategories } = useCategoryCatalogueStore();
  const createCategoryMutation = useCreateCategory();

  const form = useForm<TCreateCategoryRequest>({
    resolver: zodResolver(CreateCategoryRequestSchema),
    defaultValues: { name: '', description: '' },
  });

  const handleSaveCategory = async (data: TCreateCategoryRequest) => {
    if (!data.name) {
      toast.error('Category Name is required');
      return;
    }
    toast.info('Saving category...');
    try {
      await createCategoryMutation.mutateAsync(data);
      form.reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleClose = async () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side='right' className='w-full sm:max-w-3xl'>
        <SheetHeader>
          <SheetTitle>
            <Label className='font-medium text-base text-neutral-700'>Product Category Listing Modal</Label>
          </SheetTitle>
        </SheetHeader>

        <Separator />

        {/* 🌀 Show loader when backend call is in progress */}
        {createCategoryMutation.isPending ? (
          <div className='flex justify-center items-center h-[400px]'>
            <UILoaderIndicator label='Saving categories to server...' />
          </div>
        ) : (
          <div className='flex flex-col lg:flex-row gap-6'>
            {/* Left side: Create form */}
            <div className='lg:w-1/2 px-6 py-4'>
              <h2 className='text-xl font-semibold mb-2'>Create Category</h2>
              <p className='text-gray-600 text-sm mb-6'>Fill in the information for your category.</p>

              <form onSubmit={form.handleSubmit(handleSaveCategory)} className='space-y-6'>
                <InputField<TCreateCategoryRequest>
                  name='name'
                  control={form.control}
                  placeholder='Category name...'
                  label='Category Name'
                  important
                />

                <InputField<TCreateCategoryRequest>
                  name='description'
                  control={form.control}
                  placeholder='Category description...'
                  label='Category Description'
                />
                <Button
                  type='submit'
                  disabled={form.formState.isSubmitting}
                  className='w-full md:w-auto bg-primary-base hover:bg-primary-700'
                >
                  Save Category
                </Button>
              </form>
            </div>

            {/* Right side: Added categories */}
            <div className='lg:w-1/2 p-3'>
              <div className='w-full bg-white border-2 border-[#EEEFF1] rounded-[12px] p-4 shadow-sm'>
                <h2 className='text-base font-semibold leading-[150%]'>Added Categories</h2>
                <p className='text-sm text-gray-600'>
                  {addedCategories.length} categor{addedCategories.length !== 1 ? 'ies' : 'y'} already added
                </p>

                <ScrollArea className='h-84'>
                  <div className='space-y-1'>
                    {addedCategories.length > 0 ? (
                      addedCategories.map((category, _idx) => {
                        const key = category.id ?? `temp-${_idx}`;
                        return (
                          <Card key={key} className='border-none shadow-none p-0'>
                            <CardContent className='px-4 py-2'>
                              <h3 className='font-medium text-base leading-[150%]'>{category.name}</h3>
                              <p className='text-sm line-clamp-2 leading-[155%]'>
                                {category.description || 'No description'}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })
                    ) : (
                      <p className='text-sm text-center py-4 text-gray-500'>No product category added yet.</p>
                    )}
                  </div>
                </ScrollArea>

                {addedCategories.length > 0 && (
                  <CardFooter className='mt-4'>
                    <Button
                      variant={'ghost'}
                      onClick={handleClose}
                      className='w-full flex items-center justify-center text-primary-base hover:text-primary-700 border-primary-base hover:bg-gray-100'
                    >
                      <ArrowLeft className='ml-2 h-4 w-4' /> Back to View Catalogue
                    </Button>
                  </CardFooter>
                )}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CategoryProfileDialog;

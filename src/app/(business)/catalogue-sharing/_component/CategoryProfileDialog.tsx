import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CreateCategorySchema } from '@/lib/schemas/business/server/catalogue.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '@/components/custom/InputField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useCategoryCatalogueStore } from '@/lib/store/business/catalogue-sharing.store';
import { TCreateCategoryRequest, useCreateCategory } from '@/lib/hooks/business/catalogue-sharing.hook';
import { getErrorMessage } from '@/utils/errors';

interface CategoryProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryProfileDialog: React.FC<CategoryProfileDialogProps> = ({ isOpen, onClose }) => {
  const { addCategory, addedCategories, clearAddedCategories } = useCategoryCatalogueStore();
  const createCategory = useCreateCategory();

  const form = useForm<TCreateCategoryRequest>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: { name: '', description: '' },
  });

  const handleSaveCategory = (data: TCreateCategoryRequest) => {
    addCategory(data);
    toast.success('Category added locally!');
    form.reset();
  };

  const handleSaveToServer = async () => {
    try {
      for (const category of addedCategories) {
        await createCategory.mutateAsync(category);
      }
      toast.success('All categories saved successfully!');
      clearAddedCategories();
    } catch (err) {
      toast.error('Failed to save categories: ' + getErrorMessage(err));
    }
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
          <div className='lg:w-1/2 p-6'>
            <div className='w-full bg-white border-2 border-[#EEEFF1] rounded-[12px] p-4 shadow-sm'>
              <h2 className='text-base font-semibold mb-2'>Added Categories</h2>
              <p className='text-sm mb-4 text-gray-600'>
                {addedCategories.length} categor{addedCategories.length !== 1 ? 'ies' : 'y'} added
              </p>

              <div className='space-y-3'>
                {addedCategories.length > 0 ? (
                  addedCategories.map((cat) => (
                    <Card key={cat.name} className='border-none shadow-none'>
                      <CardContent className='p-4 border border-[#EEEFF1] rounded-[12px]'>
                        <h3 className='font-medium text-base'>{cat.name}</h3>
                        <p className='text-sm line-clamp-2'>{cat.description}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className='text-sm text-center py-4 text-gray-500'>No product category added yet.</p>
                )}
              </div>

              {addedCategories.length > 0 && (
                <CardFooter className='mt-4'>
                  <Button onClick={handleSaveToServer} className='w-full flex items-center justify-center'>
                    Save to Server <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </CardFooter>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategoryProfileDialog;

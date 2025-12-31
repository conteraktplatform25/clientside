'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { TProductResponse, TUploadedMedia } from '@/lib/hooks/business/catalogue-sharing.hook';
import ProductViewContent from './ProductViewContent';
import ProductEditForm from './ProductEditForm';
import ProductMediaCarousel from './ProductMediaCarousel';

interface IProductDetailsModalProps {
  openProductDetails: boolean;
  onOpenChange: (open: boolean) => void;
  product: TProductResponse;
}

export default function ProductDetailsModal({ openProductDetails, onOpenChange, product }: IProductDetailsModalProps) {
  const [editMode, setEditMode] = useState(false);

  return (
    <Dialog open={openProductDetails} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-6xl'>
        <DialogHeader className='flex flex-row items-center justify-between'>
          <DialogTitle>Product Details</DialogTitle>

          <div className='flex items-center gap-2 mr-3 mt-4'>
            <span className='text-sm text-muted-foreground'>{editMode ? 'Edit mode' : 'View mode'}</span>
            <Switch checked={editMode} onCheckedChange={setEditMode} />
          </div>
        </DialogHeader>

        {/* Media */}
        <ProductMediaCarousel media={(product.media as TUploadedMedia[]) ?? []} />

        {/* Content */}
        {editMode ? (
          <ProductEditForm product={product} onDone={() => setEditMode(false)} />
        ) : (
          <ProductViewContent product={product} />
        )}
      </DialogContent>
    </Dialog>
  );
}

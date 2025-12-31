'use client';

import { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TProductResponse } from '@/lib/hooks/business/catalogue-sharing.hook';

interface ProductPreviewModalProps {
  open: boolean;
  onClose: () => void;
  product: TProductResponse;
}

export const ProductPreviewModal = ({ open, onClose, product }: ProductPreviewModalProps) => {
  const images = product.media ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goPrev, goNext]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-5xl p-0 overflow-hidden'>
        <DialogHeader className='p-4 border-b'>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        {/* Main Image */}
        <div className='relative w-full h-[70vh] bg-black flex items-center justify-center'>
          <Image
            src={images[activeIndex].url}
            alt={images[activeIndex].altText ?? product.name}
            fill
            className='object-contain'
            priority
          />

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <Button
                variant='ghost'
                size='icon'
                className='absolute left-4 bg-black/50 text-white hover:bg-black/70'
                onClick={goPrev}
              >
                <ChevronLeft className='h-6 w-6' />
              </Button>

              <Button
                variant='ghost'
                size='icon'
                className='absolute right-4 bg-black/50 text-white hover:bg-black/70'
                onClick={goNext}
              >
                <ChevronRight className='h-6 w-6' />
              </Button>
            </>
          )}
        </div>
        <span className='absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded'>
          {activeIndex + 1} / {images.length}
        </span>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className='flex gap-2 p-4 overflow-x-auto bg-white'>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-20 rounded border transition
                  ${idx === activeIndex ? 'border-primary-base ring-2 ring-primary-base' : 'border-gray-200'}`}
              >
                <Image src={img.url} alt={img.altText ?? ''} fill className='object-cover rounded' />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

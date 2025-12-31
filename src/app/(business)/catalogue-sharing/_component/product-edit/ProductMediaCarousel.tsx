'use client';

import { Button } from '@/components/ui/button';
import { TUploadedMedia } from '@/lib/hooks/business/catalogue-sharing.hook';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

export default function ProductMediaCarousel({ media }: { media: TUploadedMedia[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = media ?? [];

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
    <div>
      <div className='relative h-64 w-full rounded-md flex items-center justify-center overflow-hidden'>
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].altText ?? `Product image ${activeIndex + 1}`}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, 50vw'
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
    </div>
  );
}

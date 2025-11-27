'use client';
import { useCallback, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';
import { FaUserAlt } from 'react-icons/fa';

interface ImageUploaderProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  className?: string;
}

export function ImageUploader({ value, onChange, className }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>(value);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setPreview(result);
          onChange(result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleRemove = () => {
    setPreview(undefined);
    onChange(undefined);
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className='relative'>
        <Avatar className='h-16 w-16'>
          <AvatarImage src={preview} alt='Business logo' />
          <AvatarFallback className='bg-[#F3F4F6]'>
            <FaUserAlt className='h-8 w-8 text-[#CBD5E1]' />
          </AvatarFallback>
        </Avatar>
        {preview && (
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-gray-300'
            onClick={handleRemove}
          >
            <X className='h-3 w-3' />
          </Button>
        )}
      </div>
      <div className='flex item-start gap-3'>
        <div {...getRootProps()} className={cn('cursor-pointer', isDragActive && 'opacity-70')}>
          <input {...getInputProps()} />
          <Button type='button' variant='outline' className='text-[#1A73E8] border-blue-200 hover:bg-blue-50'>
            Upload Image
          </Button>
        </div>
        {preview && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={handleRemove}
            className='mt-0.5 text-gray-500 hover:text-gray-700 border-gray-500 hover:bg-gray-500 font-normal'
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}

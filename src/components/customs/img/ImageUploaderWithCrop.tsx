import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CropperDialog from './CropperModal';

// ---------- ImageUploaderWithCrop ----------
interface ImageUploaderWithCropProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  existingUrl?: string | null;
  className?: string;
}

export function ImageUploaderWithCrop({ value, onChange, existingUrl, className }: ImageUploaderWithCropProps) {
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState(0);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }

    if (existingUrl) {
      setPreview(existingUrl); // use backend image
      return;
    }

    setPreview(undefined);
  }, [value, existingUrl]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setRawFile(file);
    setCropperOpen(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: false,
    maxFiles: 1,
  });

  const handleCropped = useCallback(
    async (croppedFile: File) => {
      // compress cropped file before sending to parent
      setCropperOpen(false);
      setRawFile(null);

      // compress
      setIsCompressing(true);
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1000,
          useWebWorker: true,
          onProgress: (p: number) => setCompressProgress(p),
        };

        const compressed = await imageCompression(croppedFile, options);
        setIsCompressing(false);
        setCompressProgress(0);
        onChange(compressed as File);
      } catch (err) {
        console.error('Compression failed:', err);
        setIsCompressing(false);
        setCompressProgress(0);
        onChange(croppedFile); // fallback
      }
    },
    [onChange]
  );

  const handleRemove = () => {
    onChange(null);
    setRawFile(null);
    setPreview(undefined);
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className='relative'>
        <Avatar className='h-20 w-20 border'>
          {preview && <AvatarImage src={preview} alt='Logo preview' />}
          <AvatarFallback className='bg-gray-100'>
            <div className='text-gray-400'>Logo</div>
          </AvatarFallback>
        </Avatar>
        {preview && (
          <Button
            type='button'
            variant='outline'
            size='icon'
            onClick={handleRemove}
            className='absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border shadow'
          >
            <X className='h-3 w-3' />
          </Button>
        )}
      </div>
      <div className='flex flex-col gap-2'>
        <div
          {...getRootProps()}
          className={cn(
            'cursor-pointer border px-4 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2',
            isDragActive && 'opacity-70 bg-blue-50 border-primary-300'
          )}
        >
          <input {...getInputProps()} />
          <Upload className='w-4 h-4 text-primary-600' />
          <span className='text-primary-600 font-medium'>Upload & Crop</span>
        </div>
        {isCompressing && (
          <div className='w-40 h-2 bg-gray-200 rounded-full overflow-hidden'>
            <div className='h-full bg-blue-500 transition-all' style={{ width: `${compressProgress}%` }} />
          </div>
        )}

        {preview && (
          <Button variant='outline' size='sm' onClick={handleRemove} className='text-gray-600'>
            Remove
          </Button>
        )}
      </div>
      {/* Cropper modal */}
      <CropperDialog
        file={rawFile}
        open={cropperOpen}
        onClose={() => {
          setCropperOpen(false);
          setRawFile(null);
        }}
        onApply={(file) => void handleCropped(file)}
      />
    </div>
  );
}

export default ImageUploaderWithCrop;

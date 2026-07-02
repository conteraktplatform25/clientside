'use client';
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FaUserAlt } from 'react-icons/fa';

interface ImageUploaderProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
}

export function ImageUploader({ value, onChange, className }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>();
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  // Generate preview if value changes externally
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [value]);

  const handleImageCompression = async (file: File): Promise<File> => {
    setIsCompressing(true);
    setProgress(20);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
      onProgress: (p: number) => setProgress(p),
    };

    const compressedFile = await imageCompression(file, options);
    setProgress(100);

    setTimeout(() => {
      setIsCompressing(false);
      setProgress(0);
    }, 600);

    return compressedFile;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        const compressed = await handleImageCompression(file);
        const previewURL = URL.createObjectURL(compressed);

        setPreview(previewURL);
        onChange(compressed); // send compressed file to form
      } catch (error) {
        console.error('Image compression failed:', error);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: false,
    maxFiles: 1,
  });

  const handleRemove = () => {
    setPreview(undefined);
    onChange(null);
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* IMAGE PREVIEW */}
      <div className='relative'>
        <Avatar className='h-20 w-20 border'>
          <AvatarImage src={preview} alt='Logo Preview' />
          <AvatarFallback>
            <FaUserAlt className='h-8 w-8 text-gray-400' />
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

      {/* UPLOAD AREA */}
      <div className='flex flex-col gap-2'>
        <div
          {...getRootProps()}
          className={cn(
            'cursor-pointer',
            'border px-4 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2',
            isDragActive && 'opacity-70 bg-primary-50 border-primary-300'
          )}
        >
          <input {...getInputProps()} />
          <Upload className='w-4 h-4 text-blue-600' />
          <span className='text-primary-700 font-medium'>Upload Image</span>
        </div>

        {/* REMOVE BUTTON */}
        {preview && (
          <Button
            variant='outline'
            size='sm'
            onClick={handleRemove}
            className='text-gray-600 hover:text-gray-800 border-gray-500'
          >
            Remove
          </Button>
        )}

        {/* PROGRESS BAR */}
        {isCompressing && (
          <div className='w-40 h-2 bg-gray-200 rounded-full overflow-hidden'>
            <div className='h-full bg-primary-base transition-all' style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

//'use client';
// import { useCallback, useState } from 'react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { X } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { useDropzone } from 'react-dropzone';
// import { Button } from '../ui/button';
// import { FaUserAlt } from 'react-icons/fa';

// interface ImageUploaderProps {
//   value?: File | null;
//   onChange: (file: File | null) => void;
//   className?: string;
// }

// export function ImageUploader({ value, onChange, className }: ImageUploaderProps) {
//   //const [preview, setPreview] = useState<string | undefined>(value);

//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       const file = acceptedFiles[0];
//       if (file) {
//         setPreview(URL.createObjectURL(file)); // preview only
//         onChange(file); // send the actual File object
//         // const reader = new FileReader();
//         // reader.onload = () => {
//         //   const result = reader.result as string;
//         //   setPreview(result);
//         //   onChange(result);
//         // };
//         // reader.readAsDataURL(file);
//       }
//     },
//     [onChange]
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
//     },
//     maxFiles: 1,
//     multiple: false,
//   });

//   const handleRemove = () => {
//     setPreview(undefined);
//     onChange(undefined);
//   };

//   return (
//     <div className={cn('flex items-center gap-4', className)}>
//       <div className='relative'>
//         <Avatar className='h-16 w-16'>
//           <AvatarImage src={preview} alt='Business logo' />
//           <AvatarFallback className='bg-[#F3F4F6]'>
//             <FaUserAlt className='h-8 w-8 text-[#CBD5E1]' />
//           </AvatarFallback>
//         </Avatar>
//         {preview && (
//           <Button
//             type='button'
//             variant='outline'
//             size='icon'
//             className='absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-gray-300'
//             onClick={handleRemove}
//           >
//             <X className='h-3 w-3' />
//           </Button>
//         )}
//       </div>
//       <div className='flex item-start gap-3'>
//         <div {...getRootProps()} className={cn('cursor-pointer', isDragActive && 'opacity-70')}>
//           <input {...getInputProps()} />
//           <Button type='button' variant='outline' className='text-[#1A73E8] border-blue-200 hover:bg-blue-50'>
//             Upload Image
//           </Button>
//         </div>
//         {preview && (
//           <Button
//             type='button'
//             variant='outline'
//             size='sm'
//             onClick={handleRemove}
//             className='mt-0.5 text-gray-500 hover:text-gray-700 border-gray-500 hover:bg-gray-500 font-normal'
//           >
//             Remove
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

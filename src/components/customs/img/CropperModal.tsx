import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getCroppedImg } from './getCroppedImg';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import type { Area } from 'react-easy-crop';

// ---------- CropperModal ----------
interface CropperDialogProps {
  file: File | null;
  open: boolean;
  onClose: () => void;
  onApply: (file: File) => void;
}

const CropperDialog = ({ file, open, onClose, onApply }: CropperDialogProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!file) {
      setImageSrc(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onCropComplete = useCallback((_: Area, pix: Area) => {
    setCroppedAreaPixels(pix);
  }, []);

  const handleApply = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setProcessing(true);
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedFile = new File([blob], `logo_cropped.webp`, { type: 'image/webp' });
      if (!mountedRef.current) return;
      onApply(croppedFile);
      onClose();
    } catch (err) {
      console.error('Crop failed:', err);
    } finally {
      if (mountedRef.current) setProcessing(false);
    }
  }, [imageSrc, croppedAreaPixels, onApply, onClose]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className='max-w-2xl w-full'>
        <DialogHeader>
          <DialogTitle>Crop image</DialogTitle>
        </DialogHeader>

        <div className='relative h-[420px] w-full bg-gray-100 rounded-md overflow-hidden'>
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape='round'
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-sm text-muted-foreground'>No image</div>
          )}

          {/* Circular overlay to emphasize round crop */}
          <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
            <div className='w-[60%] h-[60%] rounded-full ring-2 ring-white/80 shadow-inner' />
          </div>
        </div>

        <div className='mt-4 flex items-center gap-4'>
          <label className='text-sm'>Zoom</label>
          <Slider
            defaultValue={[1]}
            min={1}
            max={3}
            step={0.01}
            value={[zoom]}
            onValueChange={(v) => setZoom(v[0])}
            className='w-56'
          />

          <div className='ml-auto flex items-center gap-2'>
            <Button variant='outline' onClick={onClose} disabled={processing}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={processing}>
              {processing ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Apply'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CropperDialog;

'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function ReplyPreviewModal({ open, onClose, title, content }: PreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className='whitespace-pre-wrap text-sm text-gray-700 leading-relaxed'>{content}</div>
      </DialogContent>
    </Dialog>
  );
}

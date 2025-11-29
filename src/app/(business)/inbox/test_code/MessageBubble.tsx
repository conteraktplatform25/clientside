import React from 'react';
import type { TCreateMessageResponse, TMessageDataResponse } from '@/lib/schemas/business/server/inbox.schema';
import { Clock, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';

function DeliveryIcon({ status }: { status?: TMessageDataResponse['deliveryStatus'] }) {
  // Use two checks visually for delivered/read. Lucide doesn't have a double-check icon built-in,
  // so render two Check icons side-by-side for the double-check effect.
  if (!status) return null;

  switch (status) {
    case 'PENDING':
      return (
        <span className='inline-flex items-center gap-[2px]' title='Pending'>
          <Clock className='w-4 h-4 text-gray-600 font-bold' />
        </span>
      );
    case 'SENT':
      return (
        <span className='inline-flex items-center gap-[2px]' title='Sent'>
          <Check className='w-4 h-4 text-gray-600 font-bold' />
        </span>
      );
    case 'DELIVERED':
      return (
        <span className='inline-flex items-center gap-[2px]' title='Delivered'>
          <Check className='w-3 h-3 text-gray-600 font-bold' />
          <Check className='w-3 h-3 text-gray-600 font-bold' />
        </span>
      );
    case 'READ':
      return (
        <span className='inline-flex items-center gap-[2px]' title='Read'>
          <Check className='w-3 h-3 text-green-600 font-bold' />
          <Check className='w-3 h-3 text-green-600 font-bold' />
        </span>
      );
    case 'FAILED':
      return (
        <span className='inline-flex items-center gap-[2px]' title='Failed to send'>
          <AlertCircle className='w-4 h-4 text-red-600 font-bold' />
        </span>
      );
    default:
      return null;
  }
}

function formatTime(ts: string | undefined) {
  try {
    const d = new Date(ts ?? '');
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function MessageBubble({ message }: { message: TCreateMessageResponse }) {
  const isOutbound = message.direction === 'OUTBOUND';
  const time = formatTime(message.created_at);

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] min-w-[180px] p-3 rounded-2xl shadow-sm text-sm whitespace-pre-wrap break-words ${isOutbound ? 'bg-[#E9F3FF]' : 'bg-[#F3F4F6]'}`}
      >
        {message.mediaUrl && (
          <Image src={message.mediaUrl} alt='media' width={160} height={160} className='rounded-md mb-2' />
        )}
        {message.type === 'TEXT' && <div className='mb-1'>{message.content}</div>}
        <div className='flex items-center justify-end gap-2 text-xs text-slate-500 mt-2'>
          <div>{time}</div>
          {isOutbound && <DeliveryIcon status={message.deliveryStatus} />}
        </div>
      </div>
    </div>
  );
}

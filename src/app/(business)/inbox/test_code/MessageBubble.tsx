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

export default function MessageBubble({ message }: { message: TCreateMessageResponse }) {
  const isOutbound = message.direction === 'OUTBOUND';
  console.log(message.created_at);

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm whitespace-pre-wrap break-words ${isOutbound ? 'bg-[#E9F3FF] text-neutral-700' : 'bg-[#F3F4F6] text-[#35393F]'}`}
      >
        {/* Text or media */}
        <div className='flex items-start justify-between gap-6'>
          {message.mediaUrl ? (
            <Image
              src={message.mediaUrl}
              className='rounded-xl mb-1 max-w-[200px]'
              width={120}
              height={120}
              alt='media'
            />
          ) : null}
          {message.type === 'TEXT' && <div className='whitespace-pre-wrap'>{message.content}</div>}
          {/* meta row: timestamp + status (for outbound) */}
          <div
            className={`flex items-center justify-end gap-2 mt-2 text-xs ${isOutbound ? 'text-neutral-600' : 'text-slate-500'}`}
          >
            <div>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            {isOutbound && (
              <div className='flex items-center'>
                <DeliveryIcon status={message.deliveryStatus} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

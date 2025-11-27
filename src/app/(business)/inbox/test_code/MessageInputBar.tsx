'use client';

import React, { useState } from 'react';
import { Paperclip, SendHorizonal, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type MessageInputBarProps = {
  conversationId: string;
  onSendText: (text: string) => void;
  onSendMedia: (url: string) => void;
  isSending?: boolean;
};

export function MessageInputBar({ conversationId, onSendText, onSendMedia, isSending }: MessageInputBarProps) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  console.log(file);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendText(text.trim());
    setText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);

    // Temporary example: convert file to a blob URL
    const url = URL.createObjectURL(f);
    onSendMedia(url);
  };

  return (
    <div className='border-t bg-white p-3 flex items-center gap-2'>
      {/* File upload */}
      <label className='cursor-pointer p-2 hover:bg-gray-100 rounded-xl'>
        <Paperclip size={20} />
        <input type='file' className='hidden' onChange={handleFileUpload} />
      </label>
      {/* Emoji button (not wired but UI-ready) */}
      <Button type='button' variant='ghost' size='icon' className='text-slate-500 hover:text-primary-base'>
        <Smile size={20} />
      </Button>

      {/* Text input */}
      <Input
        type='text'
        className='flex-1 border rounded-xl px-3 py-2 focus:outline-none'
        placeholder='Type a message...'
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />

      {/* Send Button */}
      <Button
        type='button'
        onClick={handleSend}
        disabled={!conversationId || isSending || !text.trim()}
        className='rounded-lg px-4'
      >
        {isSending ? (
          <div className='w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin' />
        ) : (
          <SendHorizonal size={20} className='text-white' />
        )}
      </Button>
    </div>
  );
}

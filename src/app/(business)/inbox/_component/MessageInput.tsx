'use client';

import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
//import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className='p-4 border-t border-gray-200 bg-white'>
      <div className='flex items-end space-x-3'>
        <Button variant='ghost' size='icon' className='text-gray-500 hover:text-gray-700'>
          <Paperclip className='w-5 h-5' />
        </Button>

        <div className='flex-1 relative'>
          <Textarea
            placeholder='Enter your message...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className='min-h-[44px] max-h-32 resize-none pr-12 py-3'
            rows={1}
          />

          <Button variant='ghost' size='icon' className='absolute right-2 bottom-2 text-gray-500 hover:text-gray-700'>
            <Smile className='w-4 h-4' />
          </Button>
        </div>

        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || disabled}
            className='rounded-full w-10 h-10 p-0'
          >
            <Send className='w-4 h-4' />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

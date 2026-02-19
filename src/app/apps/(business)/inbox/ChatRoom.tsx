'use client';
import { useState } from 'react';
import { EllipsisVertical, Send, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatFilters from './ChatFilters';
import SearchUser from './SearchUser';
import MessageMenu from './MessageMenu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Message {
  id: number;
  sender: 'me' | 'other';
  text: string;
  timestamp: string;
}

const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'other', text: 'Thanks m’am.', timestamp: '27 Aug, 11:31 AM' },
    { id: 2, sender: 'me', text: 'I recommend the Glow Kit.', timestamp: '27 Aug, 11:31 AM' },
    { id: 3, sender: 'me', text: 'It will glow up and polish your skin...', timestamp: '27 Aug, 11:32 AM' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), sender: 'me', text: input, timestamp: new Date().toLocaleTimeString() },
    ]);
    setInput('');
  };

  return (
    <div className='flex w-full bg-gray-100'>
      {/* Main Chat Area */}
      <main className='flex flex-1'>
        {/* Chat list */}
        <section className='w-1/3 border-r border-gray-200 bg-white flex flex-col'>
          <div className='p-3'>
            <SearchUser />
          </div>
          <div className='block'>
            <ChatFilters />
          </div>
          <MessageMenu />
        </section>
        {/* Conversation */}
        <section className='w-2/3 flex flex-col px-4 bg-white'>
          {/* Chat header */}
          <div className='flex item-start justify-between border-b border-gray-200 p-4 font-semibold'>
            <div className='flex items-center gap-2'>
              <div className='w-12 h-12 rounded-full bg-neutral-300 p-2 flex items-center justify-center'>
                <span className='font-semibold text-2xl leading-[140%] text-white text-center'>MD</span>
              </div>
              <div className='flex-1'>
                <div className='flex flex-col items-start'>
                  <p className='font-semibold text-base leading-[150%] text-[#282B30]'>Michael Daramola</p>
                  <div className='flex items-start gap-1'>
                    <Tag size={12} strokeWidth={1.2} />
                    <span className={`text-xs leading-[155%]`}>Wednesday order</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex gap-2 items-start'>
              <Select>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select an agent' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Agent</SelectLabel>
                    <SelectItem value='apple'>Angela Sudman</SelectItem>
                    <SelectItem value='banana'>Aderongbi Clement</SelectItem>
                    <SelectItem value='blueberry'>Albert Mccauley</SelectItem>
                    <SelectItem value='grapes'>Chukwuka Michael</SelectItem>
                    <SelectItem value='pineapple'>Spencer Smith</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button variant={'ghost'} className='rounded-full border-none bg-transparent hover:bg-gray-100'>
                <EllipsisVertical />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className='h-[320px] rounded-md border p-4'>
            <div className='flex-1 overflow-y-auto p-4 space-y-3'>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-sm px-4 py-2 rounded-2xl text-base shadow-sm ${
                    msg.sender === 'me' ? 'ml-auto bg-[#E9F3FF] text-neutral-700' : 'bg-[#F3F4F6] text-neutral-700'
                  }`}
                >
                  {msg.text}
                  <div className='text-[10px] opacity-70 mt-1 w-full text-right'>{msg.timestamp}</div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className='border-t border-gray-200 p-3 flex gap-2'>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Enter your message'
              className='flex-1 px-3 py-2 rounded-lg border text-sm'
            />
            <button onClick={sendMessage} className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg'>
              <Send className='w-5 h-5' />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChatRoom;

'use client';
import { useState } from 'react';
import { Search, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className='flex h-screen w-full bg-gray-100'>
      {/* Main Chat Area */}
      <main className='flex flex-1'>
        {/* Chat list */}
        <section className='w-1/3 border-r border-gray-200 bg-white flex flex-col'>
          <div className='p-3'>
            <div className='relative'>
              <Search className='absolute left-2 top-2 w-4 h-4 text-gray-400' />
              <input
                type='text'
                placeholder='Search for your message or users'
                className='pl-8 pr-2 py-2 w-full rounded-md border text-sm'
              />
            </div>
          </div>
          <div className='flex-1 overflow-y-auto'>
            {['Adun Benedicta', 'Customer 2', 'Customer 3'].map((name, i) => (
              <div key={i} className='flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b'>
                <div className='w-10 h-10 rounded-full bg-gray-300' />
                <div className='flex-1'>
                  <div className='font-medium'>{name}</div>
                  <div className='text-sm text-gray-500 truncate'>Thank you for your order...</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Conversation */}
        <section className='w-2/3 flex flex-col'>
          {/* Chat header */}
          <div className='border-b border-gray-200 p-4 font-semibold'>Adun Benedicta</div>
          {/* Messages */}
          <ScrollArea className='h-[320px] rounded-md border p-4'>
            <div className='flex-1 overflow-y-auto p-4 space-y-3'>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-sm px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    msg.sender === 'me' ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.text}
                  <div className='text-[10px] opacity-70 mt-1'>{msg.timestamp}</div>
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

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChatSidebar } from './ChatSidebar';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { MessageInput } from './MessageInput';
import { useChatStore } from '@/lib/store/business/survey/inbox-survey.store';
// import { useChatStore } from '@/lib/chat-store';
//import { getPusherClient, subscribeToChannel } from '@/lib/pusher-client';
import { UserProfile, Message, Conversation } from '@/type/client/business/survey/inbox-survey.type';
import { usePageTitleStore } from '@/lib/store/defaults/usePageTitleStore';
// import { Message, User, Conversation } from '@/types/chat';

export default function ChatInterface() {
  const { currentUser, activeConversation, addMessage, setCurrentUser } = useChatStore();
  const { setTitle } = usePageTitleStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTitle('Inbox');
  }, [setTitle]);

  // Mock data for demo
  useEffect(() => {
    const mockUser: UserProfile = {
      id: 'user1',
      name: 'You',
      email: 'you@example.com',
      isOnline: true,
    };
    setIsLoading(true);

    const otherUser: UserProfile[] = [
      {
        id: 'user2',
        name: 'Amaka Daniels',
        email: 'amaka@example.com',
        isOnline: true,
        avatar:
          'https://images.pexels.com/photos/415829/pexels-photo-415829p.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      },
      {
        id: 'user3',
        name: 'Aregbesola Michael',
        email: 'tonyaregbe@example.com',
        isOnline: false,
        avatar:
          'https://images.pexels.com/photos/415829/pexels-photo-415829p.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      },
    ];

    const mockConversation: Conversation = {
      id: 'conv1',
      participants: [mockUser, otherUser[0], otherUser[1]],
      unreadCount: 0,
      updatedAt: new Date(),
      lastMessage: {
        id: 'msg1',
        content: 'Can I see a Picture?',
        senderId: 'user2',
        receiverId: 'user1',
        conversationId: 'conv1',
        timestamp: new Date(),
        isRead: false,
        messageType: 'text',
      },
    };

    setCurrentUser(mockUser);

    // Set up mock conversations
    useChatStore.setState({
      conversations: [mockConversation],
      messages: {
        conv1: [
          {
            id: 'msg1',
            content: 'Thanks mam.',
            senderId: 'user2',
            receiverId: 'user1',
            conversationId: 'conv1',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            isRead: true,
            messageType: 'text',
          },
          {
            id: 'msg2',
            content: 'I recommend the Glow Kit.',
            senderId: 'user1',
            receiverId: 'user2',
            conversationId: 'conv1',
            timestamp: new Date(Date.now() - 1000 * 60 * 3),
            isRead: true,
            messageType: 'text',
          },
          {
            id: 'msg3',
            content:
              'It will glow up and polish your skin, fade blemishes like spots, stretch marks, scars, etc, and give you smooth skin in your natural skin tone.',
            senderId: 'user1',
            receiverId: 'user2',
            conversationId: 'conv1',
            timestamp: new Date(Date.now() - 1000 * 60 * 2),
            isRead: true,
            messageType: 'text',
          },
          {
            id: 'msg4',
            content: 'Can I see a Picture?',
            senderId: 'user2',
            receiverId: 'user1',
            conversationId: 'conv1',
            timestamp: new Date(Date.now() - 1000 * 60),
            isRead: false,
            messageType: 'text',
          },
        ],
      },
    });
    setIsLoading(false);
  }, [setCurrentUser]);

  const handleSendMessage = async (content: string) => {
    if (!activeConversation || !currentUser) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content,
      senderId: currentUser.id,
      receiverId: activeConversation.participants.find((p) => p.id !== currentUser.id)?.id || '',
      conversationId: activeConversation.id,
      timestamp: new Date(),
      isRead: false,
      messageType: 'text',
    };

    addMessage(newMessage);

    // Here you would typically send the message to your backend
    // and emit it via Pusher for real-time delivery
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className='w-80 flex-shrink-0'
      >
        <ChatSidebar />
      </motion.div>

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col'>
        <ChatHeader />

        <div className='flex-1 flex flex-col bg-white'>
          {activeConversation ? (
            <>
              <ChatMessages conversationId={activeConversation.id} />
              <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </>
          ) : (
            <div className='flex-1 flex items-center justify-center'>
              <div className='text-center'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>Welcome to Chat</h3>
                <p className='text-gray-600'>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

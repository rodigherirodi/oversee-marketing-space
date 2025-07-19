
import React from 'react';
import { ChatProvider } from '@/contexts/ChatContext';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatArea from '@/components/chat/ChatArea';

const Chat = () => {
  return (
    <ChatProvider>
      <div className="flex h-full">
        <ChatSidebar />
        <ChatArea />
      </div>
    </ChatProvider>
  );
};

export default Chat;

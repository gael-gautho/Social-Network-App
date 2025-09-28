'use client';

import { useState, useEffect, useRef } from 'react';
import MessagesList from './MessagesList';
import MessageForm from './MessageForm';
import { ConversationWithMessages } from '@/types';

interface ChatWindowProps {
  conversation: ConversationWithMessages;
  currentUserId: string;
  onSendMessage: (body: string) => Promise<boolean>;
}

export default function ChatWindow({ 
  conversation, 
  currentUserId, 
  onSendMessage 
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const getOtherUser = () => {
    return conversation.users.find(user => user.id !== currentUserId);
  };

  const otherUser = getOtherUser();

  return (
    <>
      {/* En-tête du chat */}
      {otherUser && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <img 
              src={otherUser.get_avatar} 
              alt={otherUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
              {/* <p className="text-sm text-gray-500">Active now</p> */}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="max-h-96 overflow-y-auto p-4">
          <MessagesList 
            messages={conversation.messages}
            currentUserId={currentUserId}
          />
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <MessageForm onSendMessage={onSendMessage} />
      </div>
    </>
  );
}
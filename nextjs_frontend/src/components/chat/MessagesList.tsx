'use client';

import { Message } from '@/types';
import Image from 'next/image';

interface MessagesListProps {
  messages: Message[];
  currentUserId: string;
}

export default function MessagesList({ messages, currentUserId }: MessagesListProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.created_by.id === currentUserId;

        return (
          <div
            key={message.id}
            className={`
              flex w-full space-x-3 max-w-md
              ${isCurrentUser ? 'ml-auto justify-end' : ''}
            `}
          >
            {!isCurrentUser && (
              <div className="flex-shrink-0">
                <Image 
                  src={message.created_by.get_avatar} 
                  alt={message.created_by.name}
                  width={40} height={40}
                  className="w-10 h-10 rounded-full"
                />
              </div>
            )}
            
            <div className={isCurrentUser ? 'order-first' : ''}>
              <div className={`
                p-3 rounded-lg
                ${isCurrentUser 
                  ? 'bg-blue-600 text-white rounded-l-lg rounded-br-lg' 
                  : 'bg-gray-300 text-gray-900 rounded-r-lg rounded-bl-lg'
                }
              `}>
                <p className="text-sm">{message.body}</p>
              </div>
              <div className={`
                mt-1 text-xs text-gray-500
                ${isCurrentUser ? 'text-right' : 'text-left'}
              `}>
                {message.created_at_formatted} ago
              </div>
            </div>

            {isCurrentUser && (
              <div className="flex-shrink-0">
                <Image 
                  src={message.created_by.get_avatar} 
                  alt={message.created_by.name}
                  width={40} height={40}
                  className="w-10 h-10 rounded-full"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
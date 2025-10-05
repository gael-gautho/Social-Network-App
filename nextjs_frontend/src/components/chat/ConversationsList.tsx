'use client';

import { Conversation } from '@/types';
import Image from 'next/image';

interface ConversationsListProps {
  conversations: Conversation[];
  activeConversationId: string;
  currentUserId: string;
  onConversationSelect: (conversation: Conversation) => void;
}

export default function ConversationsList({ 
  conversations, 
  activeConversationId, 
  currentUserId,
  onConversationSelect 
}: ConversationsListProps) {
  
  const getOtherUser = (conversation: Conversation) => {
    return conversation.users.find(user => user.id !== currentUserId);
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
      
      <div className="space-y-3">
        {conversations.map((conversation) => {
          const otherUser = getOtherUser(conversation);
          const isActive = conversation.id === activeConversationId;

          if (!otherUser) return null;

          return (
            <div
              key={conversation.id}
              onClick={() => onConversationSelect(conversation)}
              className={`
                flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                ${isActive 
                  ? 'bg-purple-100 border border-purple-200' 
                  : 'hover:bg-gray-50 border border-transparent'
                }
              `}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <Image 
                  src={otherUser.get_avatar} 
                  alt={otherUser.name}
                  width={40} height={40}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                
                <p className={`
                  text-sm font-semibold truncate
                  ${isActive ? 'text-purple-900' : 'text-gray-900'}
                `}>
                  {otherUser.name}
                </p>

              </div>

              <span className={`
                text-xs whitespace-nowrap ml-2
                ${isActive ? 'text-purple-600' : 'text-gray-500'}
              `}>
                {conversation.modified_at_formatted}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
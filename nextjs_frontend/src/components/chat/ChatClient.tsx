'use client';

import { useState, useEffect } from 'react';
import ConversationsList from './ConversationsList';
import ChatWindow from './ChatWindow';
import apiService from '@/libs/apiService';
import { Conversation, ConversationWithMessages, Message } from '@/types';
import { useUser } from '@/app/userContext';


interface ChatClientProps {
  initialConversations: Conversation[];
}

export default function ChatClient({ initialConversations }: ChatClientProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversation, setActiveConversation] = useState<ConversationWithMessages | null>(null);
  const currentUser = useUser();

  // Charger la première conversation au montage
  useEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      handleSetActiveConversation(conversations[0]);
    }
  }, [conversations, activeConversation]);

  const getMessages = async (conversationId: string): Promise<ConversationWithMessages | null> => {
    try {
      const data = await apiService.get(`/api/chat/${conversationId}/`);
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return null;
    }
  };

  const handleSetActiveConversation = async (conversation: Conversation) => {
    const conversationWithMessages = await getMessages(conversation.id);
    if (conversationWithMessages) {
      setActiveConversation(conversationWithMessages);
    }
  };

  const handleSendMessage = async (body: string): Promise<boolean> => {
    if (!activeConversation || !body.trim()) return false;

    try {
      const newMessage = await apiService.post(`/api/chat/${activeConversation.id}/send/`, {
        body: body.trim()
      });

      if (newMessage) {
        setActiveConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, newMessage]
        } : null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="col-span-4 p-8 bg-white border border-gray-200 rounded-lg text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No conversations yet</h3>
        <p className="text-gray-500">
          Start chatting by visiting someone's profile and sending them a message.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Liste des conversations */}
      <div className="main-left col-span-1">
        <ConversationsList
          conversations={conversations}
          activeConversationId={activeConversation?.id || ''}
          currentUserId={currentUser.user_id}
          onConversationSelect={handleSetActiveConversation}
        />
      </div>

      {/* Fenêtre de chat */}
      <div className="main-center col-span-3 space-y-4">
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            currentUserId={currentUser.user_id}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="p-8 bg-white border border-gray-200 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
            <p className="text-gray-500">
              Choose a conversation from the list to start chatting.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
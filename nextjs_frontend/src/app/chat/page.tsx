export const dynamic = 'force-dynamic';

import ChatClient from '@/components/chat/ChatClient';
import apiService from '@/libs/apiService';
import { Conversation } from '@/types';

async function getConversations(): Promise<Conversation[]> {
  try {
    const conversations = await apiService.get('/api/chat/');
    return conversations || [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

export default async function ChatPage() {
  const conversations = await getConversations();

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
      <ChatClient initialConversations={conversations} />
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: 'Messages - Let\'s Like',
    description: 'Chat with your friends on Let\'s Like',
  };
}
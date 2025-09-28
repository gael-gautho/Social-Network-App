'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProfileUser, FriendshipRequestResponse } from '@/types';
import { useUser } from '@/app/userContext';
import apiService from '@/libs/apiService';
import { toast } from 'sonner';

interface ProfileSidebarProps {
  user: ProfileUser;
  profileId: string;
  onFriendshipRequest: () => void;
}

export default function ProfileSidebar({ 
  user, 
  profileId,
  onFriendshipRequest 
}: ProfileSidebarProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const currentUser = useUser();
  
  const isOwnProfile = currentUser.user_id === user.id;

  const sendFriendshipRequest = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const response = await apiService.post(`/api/friends/${profileId}/request/`, '');

    if (response.message) {
      
      if (response.message === 'request already sent') {
        toast.error(response.message)
        console.log('The request has already been sent!');
      } else {
        toast.success(response.message)
        console.log('The request was sent!');
        onFriendshipRequest();
      }
    }
    setIsSubmitting(false);

  };

  const sendDirectMessage = async () => {
    try {
      const response = await fetch(`/api/chat/${profileId}/get-or-create/`);
      
      if (response.ok) {
        router.push('/chat');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const logout = () => {
    // userStore.removeToken()
    console.log('Logout');
    router.push('/login');
  };

  return (
    <div className="p-4 bg-white border border-gray-200 text-center rounded-lg">
      <img 
        src={user.get_avatar} 
        alt={user.name}
        className="mb-6 h-[150px] w-full rounded-md "
      />
      
      <p>
        <strong>{user.name}</strong>
      </p>

      <div className="mt-6 flex space-x-8 justify-around">
        <Link 
          href={`/profile/${user.id}/friends`}
          className="text-xs text-gray-500 hover:text-purple-600 transition-colors"
        >
          {user.friends_count} friends
        </Link>
        <p className="text-xs text-gray-500">
          {user.posts_count} posts
        </p>
      </div>

      <div className="mt-6 space-y-2">
        {!isOwnProfile && (
          <>
            <button
              onClick={sendFriendshipRequest}
              disabled={isSubmitting || user.can_send_friendship_request === false}
              className="w-full py-3 px-3 bg-purple-600 text-xs text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Sending...' : 'Send friendship request'}
            </button>

            <button
              onClick={sendDirectMessage}
              className="w-full py-3 px-3 bg-purple-600 text-xs text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Send direct message
            </button>
          </>
        )}

        {isOwnProfile && (
          <>
            <button
              onClick={logout}
              className="w-full py-3 px-3 bg-red-600 text-xs text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Log out
            </button>
            
            <Link
              href="/profile/edit"
              className="inline-block w-full py-3 px-3 bg-purple-600 text-xs text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Edit profile
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
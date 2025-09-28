'use client';

import { useState } from 'react';
import FriendshipRequests from '@/components/FriendshipRequests';
import FriendsList from '@/components/FriendsList';
import { FriendshipRequest, User } from '@/types';

interface FriendsClientProps {
  initialRequests: FriendshipRequest[];
  initialFriends: User[];
  userId: string;
}

export default function FriendsClient({ 
  initialRequests, 
  initialFriends, 
  userId 
}: FriendsClientProps) {
  const [requests, setRequests] = useState<FriendshipRequest[]>(initialRequests);
  const [friends, setFriends] = useState<User[]>(initialFriends);

  const handleRequestAction = (requestId: string, userId: string, accepted: boolean) => {
    // Supprimer la demande de la liste
    setRequests(prevRequests => 
      prevRequests.filter(request => request.id !== requestId)
    );

    // Si acceptée, ajouter l'utilisateur à la liste d'amis
    if (accepted) {
      const acceptedRequest = requests.find(request => request.id === requestId);
      if (acceptedRequest) {
        setFriends(prevFriends => [...prevFriends, acceptedRequest.created_by]);
      }
    }
  };

  return (
    <>
      {requests.length > 0 && (
        <FriendshipRequests 
          requests={requests}
          onRequestHandled={handleRequestAction}
        />
      )}

      {friends.length > 0 && (
        <FriendsList friends={friends} />
      )}

      {requests.length === 0 && friends.length === 0 && (
        <div className="p-8 bg-white border border-gray-200 rounded-lg text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No friends yet</h3>
          <p className="text-gray-500">
            This user hasn't connected with anyone yet.
          </p>
        </div>
      )}
    </>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import apiService from '@/libs/apiService';
import { FriendshipRequest, RequestStatus } from '@/types';
import { toast } from 'sonner';

interface FriendshipRequestsProps {
  requests: FriendshipRequest[];
  onRequestHandled: (requestId: string, userId: string, accepted: boolean) => void;
}

export default function FriendshipRequests({ 
  requests, 
  onRequestHandled 
}: FriendshipRequestsProps) {
  const [loadingRequests, setLoadingRequests] = useState<Set<string>>(new Set());

  const handleRequest = async (
    status: RequestStatus, 
    userId: string, 
    requestId: string
  ) => {
    if (loadingRequests.has(requestId)) return;

    setLoadingRequests(prev => new Set(prev).add(requestId));

    try {
      const response = await apiService.post(`/api/friends/${userId}/${status}/`, {});
      
      onRequestHandled(requestId, userId, status === 'accepted');
      toast.success(response.message)
      console.log(`Friend request ${status}`);
    } catch (error) {
      console.error(`Error ${status} friend request:`, error);
      toast.error("Something went wrong. Try again later")
    } finally {
      setLoadingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Friendship requests ({requests.length})
      </h2>

      <div className="space-y-4">
        {requests.map((friendshipRequest) => {
          const isLoading = loadingRequests.has(friendshipRequest.id);
          
          return (
            <div
              key={friendshipRequest.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={friendshipRequest.created_by.get_avatar}
                  alt={friendshipRequest.created_by.name}
                  className="w-12 h-12 rounded-full"
                />
                
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    <Link 
                      href={`/profile/${friendshipRequest.created_by.id}`}
                      className="hover:text-purple-600 transition-colors"
                    >
                      {friendshipRequest.created_by.name}
                    </Link>
                  </p>
                  
                  <div className="flex space-x-4 mt-1 text-xs text-gray-500">
                    <span>{friendshipRequest.created_by.friends_count} friends</span>
                    <span>{friendshipRequest.created_by.posts_count} posts</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleRequest('accepted', friendshipRequest.created_by.id, friendshipRequest.id)}
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                   Accept
                </button>
                
                <button
                  onClick={() => handleRequest('rejected', friendshipRequest.created_by.id, friendshipRequest.id)}
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
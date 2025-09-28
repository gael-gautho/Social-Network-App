'use client';

import Link from 'next/link';
import { User } from '@/types';

interface FriendsListProps {
  friends: User[];
}

export default function FriendsList({ friends }: FriendsListProps) {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Friends ({friends.length})
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {friends.map((user) => (
          <div
            key={user.id}
            className="p-4 text-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img 
              src={user.get_avatar}
              alt={user.name}
              className="mb-6 rounded-full w-full max-w-[80px] mx-auto"
            />
            
            <p className="mb-4">
              <strong>
                <Link 
                  href={`/profile/${user.id}`}
                  className="text-gray-900 hover:text-purple-600 transition-colors"
                >
                  {user.name}
                </Link>
              </strong>
            </p>

            <div className="flex space-x-6 justify-center text-xs text-gray-500">
              <span>{user.friends_count} friends</span>
              <span>{user.posts_count} posts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
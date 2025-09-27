'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileSidebar from '@/components/ProfileSidebar';
import FeedItem from '@/components/FeedItem';
import { Post, ProfileUser } from '@/types';

interface ProfileClientProps {
  initialUser: ProfileUser;
  initialPosts: Post[];
  profileId: string;
}

export default function ProfileClient({ 
  initialUser, 
  initialPosts, 
  profileId 
}: ProfileClientProps) {
  const [user, setUser] = useState<ProfileUser>(initialUser);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const router = useRouter();

  // Rechargement des données si l'ID change
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`/api/posts/profile/${profileId}/`);
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (profileId !== initialUser.id) {
      fetchProfileData();
    }
  }, [profileId, initialUser.id]);

  const deletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));

    setUser(prevUser => ({
      ...prevUser,
      posts_count: prevUser.posts_count - 1
    }));
  };

  const handleFriendshipRequest = () => {
    setUser(prevUser => ({
      ...prevUser,
      can_send_friendship_request: false
    }));
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
      <div className="main-left col-span-1">
        <ProfileSidebar 
          user={user} 
          profileId={profileId}
          onFriendshipRequest={handleFriendshipRequest}
        />
      </div>

      <div className="main-center col-span-3 space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-white border border-gray-200 rounded-lg"
            >
              <FeedItem post={post} onDeletePost={deletePost} />
            </div>
          ))
        ) : (
          <div className="p-8 bg-white border border-gray-200 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
            <p className="text-gray-500">
              {user.name} hasn't shared any posts yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
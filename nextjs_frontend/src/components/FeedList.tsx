'use client';

import { useState } from 'react';
import FeedForm from '@/components/FeedForm';
import FeedItem from '@/components/FeedItem';
import { Post } from '@/types';

interface FeedListProps {
  initialPosts: Post[];
}

export default function FeedList({ initialPosts }: FeedListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const deletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const addPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg">
      <FeedForm onPostCreated={addPost} />
      </div>
      {posts?.map((post) => (
        <div
          key={post.id}
          className="p-4 bg-white border border-gray-200 rounded-lg"
        >
          <FeedItem post={post} onDeletePost={deletePost} />
        </div>
      ))}
    </>
  );
}
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import PostDetailClient from '@/components/PostDetailClient';
import PeopleYouMayKnow from '@/components/PeopleYouMayKnow';
import Trends from '@/components/Trends';
import { Post } from '@/types';
import apiService from '@/libs/apiService';

interface PostDetailPageProps {
  params: {
    id: string;
  };
}


export default async function PostDetailPage({ params }: PostDetailPageProps) {
  
  const id = (await params).id
  const response = await apiService.get(`/api/posts/${id}/`);
  const post: Post = response.post
  
  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
      <div className="main-center col-span-3 space-y-4">
        <PostDetailClient initialPost={post} postId={params.id} />
      </div>
      
      <div className="main-right col-span-1 space-y-4">
        <Suspense fallback={<div className="p-4 bg-white border border-gray-200 rounded-lg">Loading...</div>}>
          <PeopleYouMayKnow />
        </Suspense>
        <Suspense fallback={<div className="p-4 bg-white border border-gray-200 rounded-lg">Loading...</div>}>
          <Trends />
        </Suspense>
      </div>
    </div>
  );
}


export async function generateMetadata({ params }: PostDetailPageProps) {
  
  const id = (await params).id
  const response = await apiService.get(`/api/posts/${id}/`);
  const post: Post = response.post
  
  if (!post) {
    return {
      title: 'Post not found - Let\'s Like',
    };
  }

  return {
    title: `${post.created_by.name}'s post - Let's Like`,
    description: post.body.substring(0, 160),
  };
}
import { Suspense } from 'react';
import FeedList from '@/components/FeedList';
import PeopleYouMayKnow from '@/components/PeopleYouMayKnow';
import Trends from '@/components/Trends';
import { Post } from '@/types';
import apiService from '@/libs/apiService';



export default async function FeedPage() {
  
  const response = await apiService.get('/api/posts/');
  const posts: Post[] = response.data

  

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
      <div className="main-center col-span-3 space-y-4">
        <FeedList initialPosts={posts} />
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
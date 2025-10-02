
import { Suspense } from 'react';
import FeedItem from '@/components/FeedItem';
import PeopleYouMayKnow from '@/components/PeopleYouMayKnow';
import Trends from '@/components/Trends';
import apiService from '@/libs/apiService';
import { Post } from '@/types';

interface TrendPageProps {
  params: {
    id: string;
  };
}


export default async function TrendPage({ params }: TrendPageProps) {
  
  const id = (await params).id
  const response = await apiService.get(`/api/posts/?trend=${id}`);
  const posts: Post[] = response.data


  return (
    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
      <div className="main-center col-span-3 space-y-4">
        {/* En-tête du trend */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900">
            Trend: <span className="text-purple-600">#{id}</span>
          </h2>
          {posts.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {posts.length} post{posts.length > 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* Posts du trend */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-white border border-gray-200 rounded-lg"
            >
              <FeedItem post={post} />
            </div>
          ))
        ) : (
          <div className="p-8 bg-white border border-gray-200 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No posts for #{id}
            </h3>
            <p className="text-gray-500">
              Be the first to post about this trend!
            </p>
          </div>
        )}
      </div>

      {/* Sidebar */}
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

export async function generateMetadata({ params }: TrendPageProps) {
  return {
    title: `#${(await params).id} - Trends - Let's Like`,
    description: `Explore posts about #${(await params).id} on Let's Like`,
  };
}
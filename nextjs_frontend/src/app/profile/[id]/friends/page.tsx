import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import FriendsClient from '@/components/FriendsClient';
import PeopleYouMayKnow from '@/components/PeopleYouMayKnow';
import Trends from '@/components/Trends';
import apiService from '@/libs/apiService';
import Image from 'next/image';

interface FriendsPageProps {
  params: {
    id: string;
  };
}



export default async function FriendsPage({ params }: FriendsPageProps) {
    const id = (await params).id
    const friendsData = await apiService.get(`/api/friends/${id}/`);

  if (!friendsData) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
      <div className="main-left col-span-1">
        <div className="p-4 bg-white border border-gray-200 text-center rounded-lg">
          <div className='h-[150px] relative'>
            <Image 
              src={friendsData.user.get_avatar} 
              alt={friendsData.user.name}
              fill
              sizes="50vw"
              className="mb-6 rounded-md "
              priority
            />
          </div>
          
          <p>
            <strong>{friendsData.user.name}</strong>
          </p>

          <div className="mt-6 flex space-x-8 justify-around">
            <p className="text-xs text-gray-500">
              {friendsData.user.friends_count} friends
            </p>
            <p className="text-xs text-gray-500">
              {friendsData.user.posts_count} posts
            </p>
          </div>
        </div>
      </div>

      <div className="main-center col-span-2 space-y-4">
        <FriendsClient 
          initialRequests={friendsData.requests}
          initialFriends={friendsData.friends}
          userId={id}
        />
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

export async function generateMetadata({ params }: FriendsPageProps) {
    const id = (await params).id
    const friendsData = await apiService.get(`/api/friends/${id}/`);
  
    if (!friendsData) {
    return {
      title: 'Friends not found - Let\'s Like',
    };
  }

  return {
    title: `${friendsData.user.name}'s friends - Let's Like`,
    description: `View ${friendsData.user.name}'s friends and friendship requests on Let's Like`,
  };
}
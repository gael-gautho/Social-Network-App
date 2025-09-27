import { notFound } from 'next/navigation';
import ProfileClient from '@/components/ProfileClient';
import apiService from '@/libs/apiService';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {

  const id = (await params).id
  const profileData = await apiService.get(`/api/posts/profile/${id}/`)

  if (!profileData) {
    notFound();
  }

  return (
    <ProfileClient 
      initialUser={profileData.user} 
      initialPosts={profileData.posts}
      profileId={id}
    />
  );
}


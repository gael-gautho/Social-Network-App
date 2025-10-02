import EditProfileForm from '@/components/EditProfileForm';
import { getAccessToken } from '@/libs/actions';
import { redirect } from 'next/navigation';
import { getUserInfo } from '@/libs/actions';
import apiService from '@/libs/apiService';


export default async function EditProfilePage() {
  const user = await apiService.get('/api/me/')

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-2 gap-4">
      <div className="main-left">
        <div className="p-12 bg-white border border-gray-200 rounded-lg">
          <h1 className="mb-6 text-2xl font-bold">Edit profile</h1>

          <p className="mb-6 text-gray-500">
            Modify your informations
          </p>

          <a 
            href="/profile/edit/password" 
            className="text-purple-600 hover:text-purple-800 underline transition-colors"
          >
            Edit password
          </a>
        </div>
      </div>

      <div className="main-right">
        <EditProfileForm user={user} />
      </div>
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: 'Edit Profile - Let\'s Like',
    description: 'Edit your profile information on Let\'s Like',
  };
}
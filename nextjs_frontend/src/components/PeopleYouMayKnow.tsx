import Link from 'next/link';
import { User } from '@/types';
import apiService from '@/libs/apiService';
import Image from 'next/image';


export default async function PeopleYouMayKnow() {
  const response = await apiService.get('/api/friends/suggestions/');
  const users: User[] = response.data

  if (!users.length) {
    return null;
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <h3 className="mb-6 text-xl">People you may know</h3>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src={user.get_avatar} width={40} height={40} className="w-[40px] h-[40px] rounded-full" alt={user.name} />
              <p className="text-xs">
                <strong>{user.name}</strong>
              </p>
            </div>
            <Link
              href={`/profile/${user.id}`}
              className="py-2 px-3 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
            >
              Show
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
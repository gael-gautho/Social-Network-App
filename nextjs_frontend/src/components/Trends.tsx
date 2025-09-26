import Link from 'next/link';
import { Trend } from '@/types';
import apiService from '@/libs/apiService';


export default async function Trends() {
  const response = await apiService.get('/api/posts/trends/');
  const trends: Trend[] = response.data

  if (!trends.length) {
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <h3 className="mb-6 text-xl">Trends</h3>
        <p className="text-gray-500 text-sm">No trends available</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <h3 className="mb-6 text-xl">Trends</h3>
      <div className="space-y-4">
        {trends.map((trend) => (
          <div key={trend.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-xs">
                <strong>#{trend.hashtag}</strong><br />
                <span className="text-gray-500">{trend.occurences} posts</span>
              </p>
            </div>
            <Link
              href={`/trends/${trend.hashtag}`}
              className="py-2 px-3 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
            >
              Explore
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
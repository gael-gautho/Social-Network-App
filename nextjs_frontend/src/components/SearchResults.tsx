'use client';

import Link from 'next/link';
import FeedItem from '@/components/FeedItem';
import { User } from '@/types';
import { Post } from '@/types';

interface SearchResultsProps {
  query: string;
  users: User[];
  posts: Post[];
}

export default function SearchResults({ query, users, posts }: SearchResultsProps) {
  const totalResults = users.length + posts.length;

  if (totalResults === 0) {
    return (
      <div className="p-8 bg-white border border-gray-200 rounded-lg text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
        <p className="text-gray-500">
          No users or posts found for "{query}". Try different keywords.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Résumé des résultats */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800">
          <strong>{totalResults}</strong> result{totalResults > 1 ? 's' : ''} found for "{query}"
        </p>
      </div>

      {/* Résultats utilisateurs */}
      {users.length > 0 && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            People ({users.length})
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 text-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img 
                  src={user.get_avatar} 
                  alt={user.name}
                  className="w-16 h-16 rounded-full mx-auto mb-3"
                />
                
                <p className="mb-3">
                  <strong>
                    <Link 
                      href={`/profile/${user.id}`}
                      className="text-gray-900 hover:text-purple-600 transition-colors"
                    >
                      {user.name}
                    </Link>
                  </strong>
                </p>

                <div className="flex space-x-4 justify-center text-xs text-gray-500">
                  <span>{user.friends_count} friends</span>
                  <span>{user.posts_count} posts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Résultats posts */}
      {posts.length > 0 && (
        <>
          {users.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 px-4">
                Posts ({posts.length})
              </h3>
            </div>
          )}
          
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-white border border-gray-200 rounded-lg"
            >
              <FeedItem post={post} onDeletePost={() => {}} />
            </div>
          ))}
        </>
      )}
    </>
  );
}
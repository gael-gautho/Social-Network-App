
import { Suspense } from 'react';
import SearchForm from '@/components/SearchForm';
import SearchResults from '@/components/SearchResults';
import PeopleYouMayKnow from '@/components/PeopleYouMayKnow';
import Trends from '@/components/Trends';
import apiService from '@/libs/apiService';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}



export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = (await searchParams).q || '';
    let searchResults = null; 

    if (query) {
        searchResults = await apiService.post(`/api/search/`, {query:query.trim()});
    }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
      <div className="main-center col-span-3 space-y-4">
        {/* Formulaire de recherche */}
        <SearchForm initialQuery={query} />

        {/* Résultats de recherche */}
        {searchResults ? (
          <SearchResults
            query={query}
            users={searchResults.users}
            posts={searchResults.posts}
          />
        ) : query ? (
          // Cas d'erreur de recherche
          <div className="p-8 bg-white border border-gray-200 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-red-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Search Error</h3>
            <p className="text-gray-500">
              Unable to search at the moment. Please try again.
            </p>
          </div>
        ) : (
          // Message d'accueil
          <div className="p-8 bg-white border border-gray-200 rounded-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Search Let's Like</h3>
            <p className="text-gray-500">
              Find people and posts that interest you
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

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const query = (await searchParams);
  
  if (query) {
    return {
      title: `Search results for "${query}" - Let's Like`,
      description: `Search results for ${query} on Let's Like social network`,
    };
  }

  return {
    title: 'Search - Let\'s Like',
    description: 'Search for people and posts on Let\'s Like social network',
  };
}
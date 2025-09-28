'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchFormProps {
  initialQuery: string;
}

export default function SearchForm({ initialQuery }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <form onSubmit={handleSubmit} className="p-4 flex space-x-4">
        <div className="relative flex-1">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-4 w-full bg-gray-100 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors pr-10"
            placeholder="What are you looking for?"
          />
          
          
        </div>

        <button
          type="submit"
          className="flex items-center justify-center py-4 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors min-w-[4rem]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
}
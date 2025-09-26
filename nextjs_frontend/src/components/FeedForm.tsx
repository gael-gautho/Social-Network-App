'use client';

import { useState, useRef } from 'react';
import { Post } from '@/types';

interface FeedFormProps {
  onPostCreated: (post: Post) => void;
}

export default function FeedForm({ onPostCreated }: FeedFormProps) {
  const [body, setBody] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!body.trim()) return;
    
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      if (fileInputRef.current?.files?.[0]) {
        formData.append('image', fileInputRef.current.files[0]);
      }
      
      formData.append('body', body);
      formData.append('is_private', isPrivate.toString());

      const response = await fetch('/api/posts/create/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newPost: Post = await response.json();
        onPostCreated(newPost);
        
        // Reset form
        setBody('');
        setIsPrivate(false);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitForm}>
      <div className="p-4">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="p-4 w-full bg-gray-100 rounded-lg resize-none"
          placeholder="What are you thinking about?"
          rows={4}
          disabled={isSubmitting}
        />
        
        <label className="flex items-center mt-2 space-x-2">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            disabled={isSubmitting}
          />
          <span>Private</span>
        </label>

        {previewUrl && (
          <div className="mt-3">
            <img src={previewUrl} className="w-[100px] rounded-xl" alt="Preview" />
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-100 flex justify-between">
        <label className="inline-block py-4 px-6 bg-gray-600 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/*"
            className="hidden"
            disabled={isSubmitting}
          />
          Attach image
        </label>
        
        <button
          type="submit"
          disabled={isSubmitting || !body.trim()}
          className="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
}
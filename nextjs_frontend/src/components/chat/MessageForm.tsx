'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface MessageFormProps {
  onSendMessage: (body: string) => Promise<boolean>;
}

export default function MessageForm({ onSendMessage }: MessageFormProps) {
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!body.trim() || isSending) return;

    setIsSending(true);
    
    const success = await onSendMessage(body);
    
    if (success) {
      setBody('');
    } else {
        toast.error('Something went wrong. Try again later')
        console.error('Failed to send message');
    }
    
    setIsSending(false);
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="p-4 w-full bg-gray-100 rounded-lg resize-none border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors"
          placeholder="Send a message ..."
          rows={3}
          disabled={isSending}
        />
        
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {body.length > 0 && (
            <span className={body.length > 1000 ? 'text-red-500' : ''}>
              {body.length}/1000
            </span>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!body.trim() || isSending || body.length > 1000}
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </form>
  );
}
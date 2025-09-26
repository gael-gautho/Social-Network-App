'use client';

import Link from 'next/link';
import { Comment } from '@/types';

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <img 
            src={comment.created_by.get_avatar} 
            alt={comment.created_by.name}
            className="w-[40px] h-[40px] rounded-full"
          />
          
          <p>
            <strong>
              <Link 
                href={`/profile/${comment.created_by.id}`}
                className="hover:text-purple-600 transition-colors"
              >
                {comment.created_by.name}
              </Link>
            </strong>
          </p>
        </div>

        <p className="text-gray-600">{comment.created_at_formatted} ago</p>
      </div>

      <p>{comment.body}</p>
    </>
  );
}
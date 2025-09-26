'use client';

import { useState } from 'react';
import FeedItem from '@/components/FeedItem';
import CommentItem from '@/components/CommentItem';
import CommentForm from '@/components/CommentForm';
import { Post, Comment } from '@/types';

interface PostDetailClientProps {
  initialPost: Post;
  postId: string;
}

export default function PostDetailClient({ initialPost, postId }: PostDetailClientProps) {
  const [post, setPost] = useState<Post>(initialPost);

  const handleCommentAdded = (newComment: Comment, newCommentsCount: number) => {
    setPost(prevPost => ({
      ...prevPost,
      comments_count: newCommentsCount,
      comments: [...(prevPost.comments || []), newComment]
    }));
  };

  const handleDeletePost = (id: string) => {
    window.location.href = '/feed';
  };

  if (!post.id) {
    return (
      <div className="p-8 bg-white border border-gray-200 rounded-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading post...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <FeedItem post={post} onDeletePost={handleDeletePost} />
      </div>

      {post.comments && post.comments.length > 0 && (
        <>
          {post.comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 ml-20 bg-white border border-gray-200 rounded-lg"
            >
              <CommentItem comment={comment} />
            </div>
          ))}
        </>
      )}

      <div className="bg-white border border-gray-200 rounded-lg">
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      </div>
    </>
  );
}
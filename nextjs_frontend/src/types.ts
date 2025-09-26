// types/index.ts
export interface User {
  id: string;
  name: string;
  get_avatar: string;
  posts_count?: number;
}

export interface PostAttachment {
  id: string;
  get_image: string;
}

export interface Comment {
  id: string;
  body: string;
  created_at_formatted: string;
  created_by: {
    id: string;
    name: string;
    get_avatar: string;
  };
}

export interface Post {
  id: string;
  body: string;
  created_at_formatted: string;
  created_by: User;
  attachments: PostAttachment[];
  likes_count: number;
  comments_count: number;
  has_liked: boolean;
  is_private: boolean;
  comments?: Comment[]; 
}

export interface Trend {
  id: string;
  hashtag: string;
  occurences: number;
}


export interface MyJwtPayload {
  user_id: string;
}

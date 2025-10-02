export interface User {
  id: string;
  name: string;
  get_avatar: string;
  email: string;
  friends_count: number;
  posts_count: number;
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


export interface UserInfo {
  user_id: string;
  get_avatar: string;
}


export interface ProfileUser extends User {
  friends_count: number;
  posts_count: number;
  can_send_friendship_request?: boolean;
}

export interface ProfileResponse {
  posts: Post[];
  user: ProfileUser;
}

export interface FriendshipRequestResponse {
  message: string;
}

export type RequestStatus = 'accepted' | 'rejected';

export interface FriendshipRequest {
  id: string;
  created_by: User;
  created_at?: string;
}


// -------Chat--------

export interface ChatUser {
  id: string;
  name: string;
  get_avatar: string;
}

export interface Message {
  id: string;
  body: string;
  created_by: ChatUser;
  created_at_formatted: string;
}

export interface Conversation {
  id: string;
  users: ChatUser[];
  modified_at_formatted: string;
  messages?: Message[];
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}


export interface NotificationType {
  id: string;
  body: string;
  type_of_notification: 'post_like' | 'post_comment' | 'friend_request';
  post_id: string;
  created_for_id: string;
};

export interface MyJwtPayload {
  user_id: string;
}

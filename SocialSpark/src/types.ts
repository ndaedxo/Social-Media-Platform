export interface User {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  followers: string[];
  following: string[];
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  likes: string[];
  comments: Comment[];
  timestamp: number;
}
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post, Comment } from '../types';

interface CreatePostData {
  content: string;
  userId: string;
  imageUrl?: string;
}

interface PostsContextType {
  posts: Post[];
  createPost: (data: CreatePostData) => Promise<void>;
  likePost: (postId: string, userId: string) => Promise<void>;
  commentOnPost: (postId: string, comment: Comment) => Promise<void>;
  error: string | null;
}

const PostsContext = createContext<PostsContextType | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const stored = localStorage.getItem('posts');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading stored posts:', error);
      return [];
    }
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('posts', JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving posts:', error);
      setError('Failed to save posts');
    }
  }, [posts]);

  const createPost = async (data: CreatePostData) => {
    try {
      if (!data.content.trim()) {
        throw new Error('Post content cannot be empty');
      }

      if (!data.userId) {
        throw new Error('User ID is required');
      }

      const newPost: Post = {
        id: crypto.randomUUID(),
        content: data.content,
        userId: data.userId,
        imageUrl: data.imageUrl,
        likes: [],
        comments: [],
        timestamp: Date.now(),
      };

      setPosts(currentPosts => [newPost, ...currentPosts]);
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create post';
      setError(message);
      throw new Error(message);
    }
  };

  const likePost = async (postId: string, userId: string) => {
    try {
      if (!postId || !userId) {
        throw new Error('Post ID and User ID are required');
      }

      setPosts(currentPosts => 
        currentPosts.map(post => {
          if (post.id === postId) {
            const likes = post.likes.includes(userId)
              ? post.likes.filter(id => id !== userId)
              : [...post.likes, userId];
            return { ...post, likes };
          }
          return post;
        })
      );
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update like';
      setError(message);
      throw new Error(message);
    }
  };

  const commentOnPost = async (postId: string, comment: Comment) => {
    try {
      if (!postId || !comment.content.trim() || !comment.userId) {
        throw new Error('Invalid comment data');
      }

      setPosts(currentPosts =>
        currentPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, comment]
            };
          }
          return post;
        })
      );
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add comment';
      setError(message);
      throw new Error(message);
    }
  };

  return (
    <PostsContext.Provider value={{ posts, createPost, likePost, commentOnPost, error }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}
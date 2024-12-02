import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import { AlertCircle, Users, Globe } from 'lucide-react';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import LoadingSkeleton from './LoadingSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

const POSTS_PER_PAGE = 5;

export default function Feed() {
  const { currentUser } = useAuth();
  const { posts, error: postsError } = usePosts();
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnlyFollowing, setShowOnlyFollowing] = useState(true);
  const loadingTimeoutRef = useRef<number>();

  // Filter posts based on following status
  const filteredPosts = posts.filter(post => 
    showOnlyFollowing 
      ? currentUser?.following.includes(post.userId) || post.userId === currentUser?.id
      : true
  );

  const sortedPosts = filteredPosts.sort((a, b) => b.timestamp - a.timestamp);
  const hasMorePosts = visiblePosts < sortedPosts.length;

  const loadMore = useCallback(() => {
    setIsLoading(true);

    try {
      loadingTimeoutRef.current = window.setTimeout(() => {
        setVisiblePosts(prev => prev + POSTS_PER_PAGE);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      setIsLoading(false);
    }
  }, []);

  // Cleanup timeout on unmount
  useState(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Feed</h1>
        <button
          onClick={() => setShowOnlyFollowing(!showOnlyFollowing)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          {showOnlyFollowing ? (
            <>
              <Users className="w-4 h-4" />
              <span>Following</span>
            </>
          ) : (
            <>
              <Globe className="w-4 h-4" />
              <span>All Posts</span>
            </>
          )}
        </button>
      </div>

      <CreatePost />

      <AnimatePresence>
        {postsError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-600"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{postsError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {sortedPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {showOnlyFollowing ? (
              <>
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No posts from people you follow yet.</p>
                <button
                  onClick={() => setShowOnlyFollowing(false)}
                  className="text-blue-500 hover:underline mt-2"
                >
                  View all posts
                </button>
              </>
            ) : (
              <>
                <Globe className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No posts available.</p>
              </>
            )}
          </div>
        ) : (
          sortedPosts.slice(0, visiblePosts).map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
        
        {isLoading && <LoadingSkeleton />}
        
        {hasMorePosts && !isLoading && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadMore}
            className="w-full py-3 bg-white text-blue-500 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            Load More Posts
          </motion.button>
        )}
      </div>
    </div>
  );
}
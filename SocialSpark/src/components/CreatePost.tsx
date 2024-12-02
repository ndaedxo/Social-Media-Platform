import { useState } from 'react';
import { Camera, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';

const MAX_CHARACTERS = 280;

export default function CreatePost() {
  const { currentUser } = useAuth();
  const { createPost } = usePosts();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const charactersLeft = MAX_CHARACTERS - content.length;
  const isOverLimit = charactersLeft < 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !content.trim() || isOverLimit || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await createPost({
        content: content.trim(),
        userId: currentUser.id,
      });
      setContent('');
      setIsExpanded(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="card p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-surface-500">
                {currentUser.username[0].toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (!isExpanded && e.target.value.length > 0) {
                  setIsExpanded(true);
                }
              }}
              onFocus={() => setIsExpanded(true)}
              placeholder="What's on your mind?"
              className="w-full resize-none border-0 focus:ring-0 text-lg placeholder:text-surface-400 bg-transparent min-h-[60px]"
            />
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-surface-200 mt-2 pt-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
                        aria-label="Add image"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm ${
                          isOverLimit
                            ? 'text-red-500'
                            : charactersLeft <= 20
                            ? 'text-amber-500'
                            : 'text-surface-500'
                        }`}
                      >
                        {charactersLeft}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={!content.trim() || isOverLimit || isLoading}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {isLoading ? 'Posting...' : 'Post'}
                      </motion.button>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 text-red-500 text-sm flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </form>
    </div>
  );
}
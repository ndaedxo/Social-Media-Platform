import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post, User, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import ProgressiveImage from './ProgressiveImage';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { currentUser } = useAuth();
  const { likePost, commentOnPost } = usePosts();
  const [author, setAuthor] = useState<User | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentAuthors, setCommentAuthors] = useState<Record<string, User>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const MAX_CONTENT_LENGTH = 280;
  const shouldTruncate = post.content.length > MAX_CONTENT_LENGTH;
  const displayContent = isExpanded ? post.content : post.content.slice(0, MAX_CONTENT_LENGTH);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const postAuthor = users.find((u: User) => u.id === post.userId);
    setAuthor(postAuthor || null);

    const authors: Record<string, User> = {};
    post.comments.forEach((comment) => {
      const commentAuthor = users.find((u: User) => u.id === comment.userId);
      if (commentAuthor) {
        authors[comment.userId] = commentAuthor;
      }
    });
    setCommentAuthors(authors);
  }, [post.userId, post.comments]);

  if (!author) return null;

  const isLiked = currentUser && post.likes.includes(currentUser.id);
  const formattedDate = new Date(post.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim()) return;

    commentOnPost(post.id, {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      content: commentText.trim(),
      timestamp: Date.now(),
    });
    setCommentText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <Link to={`/profile/${author.username}`}>
          <div className="w-10 h-10 bg-surface-100 rounded-full flex items-center justify-center overflow-hidden">
            {author.avatar ? (
              <ProgressiveImage
                src={author.avatar}
                alt={author.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-surface-500">
                {author.username[0].toUpperCase()}
              </span>
            )}
          </div>
        </Link>
        <div>
          <Link
            to={`/profile/${author.username}`}
            className="font-medium text-surface-900 hover:text-primary-500 transition-colors"
          >
            {author.username}
          </Link>
          <div className="text-sm text-surface-500">{formattedDate}</div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-surface-800 leading-relaxed whitespace-pre-wrap">
          {displayContent}
          {shouldTruncate && !isExpanded && '...'}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-500 text-sm mt-2 hover:text-primary-600 transition-colors"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {post.imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <ProgressiveImage
            src={post.imageUrl}
            alt="Post content"
            className="w-full"
          />
        </div>
      )}

      <div className="flex items-center gap-6 text-surface-500">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => currentUser && likePost(post.id, currentUser.id)}
          className={`flex items-center gap-2 hover:text-red-500 transition-colors ${
            isLiked ? 'text-red-500' : ''
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{post.likes.length}</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 hover:text-primary-500 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments.length}</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 hover:text-green-500 transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 border-t border-surface-200 pt-4"
          >
            {currentUser && (
              <form onSubmit={handleComment} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="input-base"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!commentText.trim()}
                  className="btn-primary p-2.5"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </form>
            )}

            <div className="space-y-4">
              {post.comments
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <Link to={`/profile/${commentAuthors[comment.userId]?.username}`}>
                      <div className="w-8 h-8 bg-surface-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {commentAuthors[comment.userId]?.avatar ? (
                          <ProgressiveImage
                            src={commentAuthors[comment.userId].avatar!}
                            alt={commentAuthors[comment.userId].username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-surface-500">
                            {commentAuthors[comment.userId]?.username[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/profile/${commentAuthors[comment.userId]?.username}`}
                        className="font-medium text-surface-900 hover:text-primary-500 transition-colors"
                      >
                        {commentAuthors[comment.userId]?.username}
                      </Link>
                      <p className="text-surface-800 break-words">{comment.content}</p>
                      <div className="text-xs text-surface-500 mt-1">
                        {new Date(comment.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
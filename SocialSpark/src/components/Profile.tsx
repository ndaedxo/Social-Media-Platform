import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostsContext';
import { User } from '../types';
import PostCard from './PostCard';
import { UserCircle, Users, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { username } = useParams();
  const { currentUser, updateUser } = useAuth();
  const { posts } = usePosts();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.username === username);
    setUser(foundUser || null);
    setBio(foundUser?.bio || '');
  }, [username]);

  if (!user) {
    return <div className="text-center py-8">User not found</div>;
  }

  const userPosts = posts.filter(post => post.userId === user.id);
  const isCurrentUser = currentUser?.id === user.id;
  const isFollowing = currentUser?.following.includes(user.id);

  const handleFollow = () => {
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: User) => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          following: isFollowing
            ? u.following.filter(id => id !== user.id)
            : [...u.following, user.id]
        };
      }
      if (u.id === user.id) {
        return {
          ...u,
          followers: isFollowing
            ? u.followers.filter(id => id !== currentUser.id)
            : [...u.followers, currentUser.id]
        };
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    updateUser(updatedUsers.find((u: User) => u.id === currentUser.id)!);
    setUser(updatedUsers.find((u: User) => u.id === user.id)!);
  };

  const handleUpdateBio = () => {
    if (!currentUser || !isCurrentUser) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: User) => {
      if (u.id === currentUser.id) {
        return { ...u, bio };
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    updateUser({ ...currentUser, bio });
    setUser({ ...user, bio });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          
          {isEditing ? (
            <div className="mt-4 w-full max-w-md">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Write something about yourself..."
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBio}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="relative mt-2">
              <p className="text-gray-600 text-center">{user.bio || 'No bio yet'}</p>
              {isCurrentUser && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute -right-6 top-0 p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          
          <div className="flex gap-8 mt-4">
            <div className="text-center">
              <div className="font-semibold">{user.followers.length}</div>
              <div className="text-gray-500 text-sm">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{user.following.length}</div>
              <div className="text-gray-500 text-sm">Following</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{userPosts.length}</div>
              <div className="text-gray-500 text-sm">Posts</div>
            </div>
          </div>

          {!isCurrentUser && currentUser && (
            <button
              onClick={handleFollow}
              className={`mt-6 px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                isFollowing 
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Users className="w-4 h-4" />
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </motion.div>

      <div className="space-y-4">
        {userPosts
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
      </div>
    </div>
  );
}
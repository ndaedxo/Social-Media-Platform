import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Search, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import NavItem from './navigation/NavItem';

export default function Layout() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  if (!currentUser) return <Outlet />;

  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/search", icon: Search, label: "Search" },
    { to: `/profile/${currentUser.username}`, icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      <nav className="fixed bottom-0 w-full bg-white border-t border-surface-200 md:top-0 md:border-b md:border-t-0 z-50 backdrop-blur-lg bg-white/80">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-semibold text-primary-500 hidden md:block">
              SocialSpark
            </Link>
            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
              {navItems.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-2 rounded-lg text-surface-500 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4 pb-20 md:pt-20 md:pb-4">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
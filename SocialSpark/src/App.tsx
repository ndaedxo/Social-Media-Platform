import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PostsProvider } from './context/PostsContext';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Search from './components/Search';
import ErrorFallback from './components/ErrorFallback';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  return !currentUser ? <>{children}</> : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Feed />} />
        <Route path="search" element={<Search />} />
        <Route path="profile/:username" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const handleError = (error: Error, info: { componentStack: string }) => {
    // Log to your error reporting service
    console.error('Application error:', error);
    console.error('Component stack:', info.componentStack);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
      <Router>
        <AuthProvider>
          <PostsProvider>
            <AppRoutes />
          </PostsProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
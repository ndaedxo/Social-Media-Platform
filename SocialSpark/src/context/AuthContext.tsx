import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading stored user:', error);
      return null;
    }
  });

  const [error, setError] = useState<string | null>(null);

  const login = async (username: string) => {
    try {
      if (!username.trim()) {
        throw new Error('Username cannot be empty');
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      let user = users.find((u: User) => u.username === username);

      if (!user) {
        user = {
          id: crypto.randomUUID(),
          username,
          followers: [],
          following: [],
          timestamp: Date.now()
        };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
      }

      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to login';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      setError(null);
    } catch (error) {
      const message = 'Failed to logout';
      setError(message);
      throw new Error(message);
    }
  };

  const updateUser = async (user: User) => {
    try {
      if (!user.id || !user.username) {
        throw new Error('Invalid user data');
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: User) => u.id === user.id ? user : u);
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      setError(message);
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUser, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
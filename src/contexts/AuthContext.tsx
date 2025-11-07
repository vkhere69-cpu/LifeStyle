import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../lib/api-client';
import type { AdminUser } from '../lib/types';

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('admin_user');
        const token = localStorage.getItem('auth_token');
        
        if (storedUser && token) {
          // For now, just set the user if we have a token
          // In a production app, you might want to verify the token is still valid
          // by making an authenticated request to a /me or /verify endpoint
          setUser(JSON.parse(storedUser));
        } else {
          // Clear any invalid or expired auth data
          localStorage.removeItem('admin_user');
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid auth data
        localStorage.removeItem('admin_user');
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await apiClient.login(email, password);

      if (error || !data) {
        throw new Error('Invalid credentials');
      }

      const adminUser: AdminUser = {
        id: data.id,
        email: data.email,
        name: data.name,
        created_at: data.created_at,
      };

      setUser(adminUser);
      localStorage.setItem('admin_user', JSON.stringify(adminUser));
      
      // The token is already set in the apiClient during the login call
      // Now we need to ensure the user state is updated before proceeding
      return data;
    } catch (error) {
      // Clear any partial auth data on error
      setUser(null);
      localStorage.removeItem('admin_user');
      localStorage.removeItem('auth_token');
      throw new Error('Invalid credentials');
    }
  };

  const logout = async () => {
    apiClient.logout();
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

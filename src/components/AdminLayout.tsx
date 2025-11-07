import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-yellow-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar isAdmin />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Welcome back, <span className="font-semibold">{user?.name || 'Admin'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Render nested routes */}
          <Outlet />
          {children}
        </div>
      </div>
    </div>
  );
}

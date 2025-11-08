import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';

interface NavbarProps {
  isAdmin?: boolean;
}

export default function Navbar({ isAdmin = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const publicLinks = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin' },
    //{ name: 'Instagram', href: '/admin/instagram' },
    { name: 'YouTube', href: '/admin/youtube' },
    { name: 'Portfolio', href: '/admin/portfolio' },
    { name: 'Blog', href: '/admin/blog' },
    { name: 'Contacts', href: '/admin/contacts' },
    { name: 'Subscribers', href: '/admin/subscribers' },
    { name: 'Settings', href: '/admin/settings' },
  ];

  const links = isAdmin ? adminLinks : publicLinks;

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-violet-200/50 dark:border-violet-800/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <img src="/logo-noBG.png" alt="Logo" className="h-8 w-8" />
              <span className="font-bold text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 dark:from-yellow-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                Lifestyle
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="relative px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 group transition-colors duration-200"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            {!isAdmin && (
              <Link
                to="/admin/login"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-violet-100/50 dark:bg-gray-800/50 text-violet-600 dark:text-gray-300 hover:bg-violet-200/50 dark:hover:bg-gray-700/50 hover:text-violet-700 dark:hover:text-white transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-violet-200/50 dark:border-gray-800/50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-gray-800/50 hover:text-violet-600 dark:hover:text-white transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            {!isAdmin && (
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 mx-2 mt-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

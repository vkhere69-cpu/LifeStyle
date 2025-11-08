import { Link } from 'react-router-dom';
import { Instagram, Youtube, Mail, Heart } from 'lucide-react';
import { SubscribeForm } from './SubscribeForm';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-violet-900/30 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo-noBG.png" alt="Logo" className="h-10 w-10" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Lifestyle
              </h3>
            </div>
            <p className="text-white/90">
              Where comedy meets modelling. Follow the journey of laughter and style.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-gray-200">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white/80 hover:text-violet-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-white/80 hover:text-violet-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/80 hover:text-violet-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-violet-400 transition-colors duration-200 flex items-center group">
                  <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-gray-200">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-3 bg-gray-800/50 rounded-full hover:bg-violet-600 transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-5 w-5 text-gray-200" />
              </a>
              <a
                href="#"
                className="p-3 bg-gray-800/50 rounded-full hover:bg-violet-600 transition-all duration-300 hover:scale-110"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <Link
                to="/contact"
                className="p-3 bg-gray-800/50 rounded-full hover:bg-violet-600 transition-all duration-300 hover:scale-110"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <SubscribeForm variant="footer" showTitle={true} />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700/50 text-center text-white/70">
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="h-4 w-4 text-violet-500" /> © {currentYear} Lifestyle
          </p>
        </div>
      </div>
    </footer>
  );
}

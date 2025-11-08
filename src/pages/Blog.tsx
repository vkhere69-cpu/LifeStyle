import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { apiClient } from '../lib/api-client';
import type { BlogPost } from '../lib/types';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
    // Track page view
    apiClient.trackPageView('Blog').catch(err => console.error('Analytics error:', err));
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const data = await apiClient.getBlogPosts();
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-violet-100 dark:bg-gray-900 pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 dark:from-yellow-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 px-4">
            Stories, insights, and behind-the-scenes from my journey
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden border border-violet-200/50 dark:border-gray-800/50 hover:border-violet-500/50 transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-gray-900/80 to-gray-800/50 animate-pulse"></div>
                <div className="p-4 sm:p-5 md:p-6 space-y-3">
                  <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-900/70 to-gray-800/50 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-900/60 to-gray-800/40 rounded w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-900/60 to-gray-800/40 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {posts.map((post) => (
              <div key={post._id} className="group bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-violet-300 dark:border-violet-600 hover:border-violet-500 dark:hover:border-violet-400 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-gray-900/80 to-gray-800/50 relative overflow-hidden">
                  <img
                    src={post.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 sm:mb-3 flex-wrap gap-1">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-violet-500" />
                    <span className="mr-1 sm:mr-2">{formatDate(post.published_at)}</span>
                    <span className="text-gray-400 dark:text-gray-600">•</span>
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-1 sm:mx-1.5 text-violet-500" />
                    <span>5 min read</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center font-medium group text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors duration-200 text-sm sm:text-base"
                  >
                    <span className="relative">
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                      Read more
                    </span>
                    <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1 text-violet-600 dark:text-violet-400" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-14 md:py-16 bg-gray-900/40 rounded-2xl border border-gray-800/50 px-4">
            <p className="text-white text-sm sm:text-base">No blog posts found. Check back soon for updates!</p>
          </div>
        )}
      </div>
    </div>
  );
}

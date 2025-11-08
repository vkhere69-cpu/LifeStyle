import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { apiClient } from '../lib/api-client';
import type { BlogPost as BlogPostType } from '../lib/types';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
      // Track page view with blog slug
      apiClient.trackPageView(`Blog Post: ${slug}`).catch(err => console.error('Analytics error:', err));
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const data = await apiClient.getBlogPostBySlug(slug!);
      if (data) {
        setPost(data);
      } else {
        navigate('/blog');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      navigate('/blog');
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-violet-100 dark:bg-gray-900 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4 sm:space-y-6">
            <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-64 sm:h-80 md:h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-2 sm:space-y-3">
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-violet-100 dark:bg-gray-900 pt-20 sm:pt-24 pb-12 sm:pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="group flex items-center gap-2 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 mb-6 sm:mb-8 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Blog</span>
        </button>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto object-cover max-h-[300px] sm:max-h-[400px] md:max-h-[500px]"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 dark:from-yellow-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-500" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-500" />
              <span>5 min read</span>
            </div>
          </div>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors text-sm"
          >
            <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Share</span>
            <span className="sm:hidden">Share</span>
          </button>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-violet-50 dark:bg-gray-800 rounded-xl border-l-4 border-violet-500">
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 italic">
              {post.excerpt}
            </p>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-sm sm:prose-base md:prose-lg dark:prose-invert max-w-none mb-10 sm:mb-12">
          <div 
            className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-sm sm:text-base"
            style={{ 
              fontSize: 'inherit', 
              lineHeight: '1.75',
            }}
          >
            {post.content}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-10 sm:mt-12 p-6 sm:p-8 bg-gradient-to-r from-violet-100 via-purple-100 to-violet-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-gray-800 rounded-2xl text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Enjoyed this post?
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 px-4">
            Subscribe to get notified about new content and updates!
          </p>
          <button
            onClick={() => navigate('/#subscribe')}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 text-white rounded-full font-semibold hover:from-violet-700 hover:via-purple-700 hover:to-violet-800 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            Subscribe Now
          </button>
        </div>
      </article>
    </div>
  );
}

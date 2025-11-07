import { useEffect, useState } from 'react';
import { BarChart3, Youtube, FileText, Image, Mail, Eye, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';

export default function Dashboard() {
  const [stats, setStats] = useState({
    youtube: 0,
    portfolio: 0,
    blog: 0,
    contacts: 0,
    pageViews: 0,
    subscribers: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [yt, portfolio, blog, contacts, analytics, subscribers] = await Promise.all([
        apiClient.getYouTubeVideos(1, 100).catch(() => ({ videos: [] })),
        apiClient.getPortfolioItems().catch(() => []),
        apiClient.getBlogPosts().catch(() => []),
        apiClient.getContactRequests().catch(() => []),
        apiClient.getAnalytics().catch(() => []),
        apiClient.getSubscribers().catch(() => ({ active: 0 })),
      ]);

      setStats({
        youtube: yt?.videos ? yt.videos.length : 0,
        portfolio: Array.isArray(portfolio) ? portfolio.length : 0,
        blog: Array.isArray(blog) ? blog.length : 0,
        contacts: Array.isArray(contacts) ? contacts.length : 0,
        pageViews: Array.isArray(analytics) ? analytics.length : 0,
        subscribers: subscribers?.active || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const cards = [
    {
      title: 'YouTube Videos',
      value: stats.youtube,
      icon: Youtube,
      color: 'from-red-500 to-red-600',
      link: '/admin/youtube',
    },
    {
      title: 'Portfolio Items',
      value: stats.portfolio,
      icon: Image,
      color: 'from-orange-500 to-orange-600',
      link: '/admin/portfolio',
    },
    {
      title: 'Blog Posts',
      value: stats.blog,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/blog',
    },
    {
      title: 'Contact Requests',
      value: stats.contacts,
      icon: Mail,
      color: 'from-green-500 to-green-600',
      link: '/admin/contacts',
    },
    {
      title: 'Page Views',
      value: stats.pageViews,
      icon: Eye,
      color: 'from-indigo-500 to-indigo-600',
      link: '#',
    },
    {
      title: 'Subscribers',
      value: stats.subscribers,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/subscribers',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Overview of your content and analytics
          </p>
        </div>
        <BarChart3 className="h-8 w-8 text-orange-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="block group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {card.value}
            </div>
            <div className="text-gray-600 dark:text-gray-400">{card.title}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              to="/admin/hero"
              className="block px-4 py-3 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
            >
              Manage Hero Section
            </Link>
            <Link
              to="/admin/notifications"
              className="block px-4 py-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
            >
              Manage Notifications
            </Link>
            <Link
              to="/admin/blog/new"
              className="block px-4 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              Create New Blog Post
            </Link>
            <Link
              to="/admin/portfolio/new"
              className="block px-4 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              Add Portfolio Item
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

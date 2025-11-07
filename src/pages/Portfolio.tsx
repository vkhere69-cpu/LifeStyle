import { useEffect, useState } from 'react';
import { Camera, Video } from 'lucide-react';
import { apiClient } from '../lib/api-client';
import type { PortfolioItem } from '../lib/types';

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
    // Track page view
    apiClient.trackPageView('Portfolio').catch(err => console.error('Analytics error:', err));
  }, []);

  const fetchPortfolio = async () => {
    try {
      const data = await apiClient.getPortfolioItems();
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = filter === 'all'
    ? items
    : items.filter((item) => item.category === filter);

  const categories = ['all', 'modelling', 'comedy', 'fashion', 'lifestyle'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-violet-100 dark:bg-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 dark:from-yellow-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
            Portfolio
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            A collection of my work in modelling, comedy, and creative content
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`
                px-6 py-2.5 rounded-full font-medium capitalize transition-all duration-300
                ${
                  filter === cat
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white/50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/70 border border-violet-200/50 dark:border-gray-800/50 hover:border-violet-500/50'
                }
                hover:scale-105
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-violet-300 dark:border-violet-600 hover:border-violet-500 dark:hover:border-violet-400 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {item.media_type === 'video' ? (
                  <video
                    src={item.media_url}
                    poster={item.thumbnail_url}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={item.media_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {item.media_type === 'video' ? (
                        <Video className="h-5 w-5 text-violet-400" />
                      ) : (
                        <Camera className="h-5 w-5 text-violet-400" />
                      )}
                      <span className="text-violet-400 text-sm font-semibold uppercase">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-300 text-sm line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No portfolio items found for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

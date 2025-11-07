import { useEffect, useState } from 'react';
import { Youtube, RefreshCw, Eye, EyeOff, ExternalLink, Trash2, Clock } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import type { YouTubeVideo } from '../../lib/types';

export default function YouTubeManager() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [nextSyncIn, setNextSyncIn] = useState<string>('');

  useEffect(() => {
    fetchVideos();
  }, []);

  // Countdown timer for next auto-sync (runs every hour at :00)
  useEffect(() => {
    const calculateNextSync = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      
      const diff = nextHour.getTime() - now.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      setNextSyncIn(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    calculateNextSync();
    const interval = setInterval(calculateNextSync, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchVideos = async () => {
    try {
      const data = await apiClient.getYouTubeVideos(1, 100);
      if (data && data.videos) setVideos(data.videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (_id: string, currentVisibility: boolean) => {
    try {
      await apiClient.updateYouTubeVisibility(_id, !currentVisibility);
      setVideos(videos.map(v => v._id === _id ? { ...v, is_visible: !currentVisibility } : v));
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const deleteVideo = async (_id: string) => {
    if (!confirm('Are you sure you want to delete this video from the database? It will be re-synced if still on YouTube.')) {
      return;
    }

    try {
      await apiClient.deleteYouTubeVideo(_id);
      setVideos(videos.filter(v => v._id !== _id));
      alert('Video deleted successfully. It will be re-added during next sync if still on YouTube.');
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video. Please try again.');
    }
  };

  const syncYouTube = async () => {
    if (!confirm('This will fetch latest videos from YouTube and add any new ones. Continue?')) {
      return;
    }

    setSyncing(true);
    try {
      const result = await apiClient.syncYouTubeVideos();
      
      if (result.success) {
        alert(`✅ Sync completed successfully!\n\n📹 New videos added: ${result.newVideos || 0}\n📊 Total videos fetched: ${result.totalFetched || 0}`);
        // Refresh the video list to show newly added videos
        await fetchVideos();
      } else {
        alert('Sync completed but no result data returned.');
      }
    } catch (error) {
      console.error('Error syncing YouTube:', error);
      alert('❌ Failed to sync YouTube videos. Please check your API key and channel ID configuration.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Youtube className="h-8 w-8 text-red-500" />
            YouTube Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your YouTube videos
          </p>
          {nextSyncIn && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 text-violet-500" />
              <span>Next auto-sync in: <span className="font-mono font-semibold text-violet-600 dark:text-violet-400">{nextSyncIn}</span></span>
            </div>
          )}
        </div>
        <button
          onClick={syncYouTube}
          disabled={syncing}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync YouTube'}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {video.title}
                </h3>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleVisibility(video._id, video.is_visible)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      video.is_visible
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {video.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    {video.is_visible ? 'Visible' : 'Hidden'}
                  </button>
                  <div className="flex items-center gap-1">
                    <a
                      href={`https://youtube.com/watch?v=${video.youtube_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="View on YouTube"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => deleteVideo(video._id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete from database"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl">
          <Youtube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No YouTube videos found. Click "Sync YouTube" to fetch your latest content.
          </p>
        </div>
      )}
    </div>
  );
}

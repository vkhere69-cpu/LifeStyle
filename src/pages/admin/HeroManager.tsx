import { useEffect, useState } from 'react';
import { Video, Save, Loader2, Youtube, Upload } from 'lucide-react';
import { apiClient } from '../../lib/api-client';

export default function HeroManager() {
  const [heroContent, setHeroContent] = useState({
    video_url: '',
    video_type: 'youtube',
    title: 'Welcome to My Page',
    subtitle: 'Discover amazing content',
    cta_text: 'Explore More',
    cta_link: '/portfolio',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      const data = await apiClient.getHeroContent();
      setHeroContent(data);
    } catch (error) {
      console.error('Error fetching hero content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await apiClient.updateHeroContent(heroContent);
      setMessage('Hero content updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hero Section Manager</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Customize the hero section video and content
          </p>
        </div>
        <Video className="h-8 w-8 text-violet-500" />
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        {/* Video Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Video Type
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setHeroContent({ ...heroContent, video_type: 'youtube' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                heroContent.video_type === 'youtube'
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Youtube className="h-5 w-5" />
              YouTube
            </button>
            <button
              onClick={() => setHeroContent({ ...heroContent, video_type: 'upload' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                heroContent.video_type === 'upload'
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Upload className="h-5 w-5" />
              Upload
            </button>
          </div>
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Video URL {heroContent.video_type === 'youtube' ? '(YouTube Embed URL)' : '(Direct Video URL)'}
          </label>
          <input
            type="text"
            value={heroContent.video_url}
            onChange={(e) => setHeroContent({ ...heroContent, video_url: e.target.value })}
            placeholder="https://www.youtube.com/embed/..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={heroContent.title}
            onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subtitle
          </label>
          <textarea
            value={heroContent.subtitle}
            onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* CTA Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Call-to-Action Text
          </label>
          <input
            type="text"
            value={heroContent.cta_text}
            onChange={(e) => setHeroContent({ ...heroContent, cta_text: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* CTA Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Call-to-Action Link
          </label>
          <input
            type="text"
            value={heroContent.cta_link}
            onChange={(e) => setHeroContent({ ...heroContent, cta_link: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Preview */}
      {heroContent.video_url && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Preview</h2>
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
            <iframe
              src={heroContent.video_url}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

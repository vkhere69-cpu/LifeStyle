// src/pages/Home.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Youtube, ArrowRight, Sparkles } from 'lucide-react';
import { apiClient } from '../lib/api-client';
import { YoutubeFeed } from '../components/YoutubeFeed';
import { NotificationPanel } from '../components/NotificationPanel';
import { SubscribeForm } from '../components/SubscribeForm';

interface HeroContent {
  video_url: string;
  video_type: 'youtube' | 'upload';
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
}

export default function Home() {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);

  useEffect(() => {
    fetchContent();
    // Track page view
    apiClient.trackPageView('Home').catch(err => console.error('Analytics error:', err));
  }, []);

  const fetchContent = async () => {
    try {
      const heroData = await apiClient.getHeroContent();
      setHeroContent(heroData);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  return (
    <>
      {/* Notification Panel */}
      <NotificationPanel />
      
      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory transition-colors duration-300 scrollbar-hide">
        {/* --- Modern Hero Section with Video Background --- */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-yellow-50 to-violet-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-violet-900/30 snap-start">
          {/* Video Background */}
          {heroContent?.video_url && (
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-black/40 z-10"></div>
              {heroContent.video_type === 'youtube' ? (
                <iframe
                  src={`${heroContent.video_url}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${heroContent.video_url.split('/').pop()}`}
                  className="absolute top-1/2 left-1/2"
                  allow="autoplay; encrypted-media"
                  style={{ 
                    pointerEvents: 'none',
                    transform: 'translate(-50%, -50%)',
                    width: '177.77vh',
                    height: '56.25vw',
                    minWidth: '100%',
                    minHeight: '100%'
                  }}
                />
              ) : (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                >
                  <source src={heroContent.video_url} type="video/mp4" />
                </video>
              )}
            </div>
          )}

          {/* Content Overlay */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl">
                {heroContent?.title || 'Welcome'}
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
                  {heroContent?.subtitle || 'To My World'}
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto drop-shadow-lg px-2">
                Discover amazing content and join the journey
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4">
                <Link
                  to={heroContent?.cta_link || '/portfolio'}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 text-white rounded-full font-semibold hover:from-violet-700 hover:via-purple-700 hover:to-violet-800 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {heroContent?.cta_text || 'Explore More'}
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/contact"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-white/50 text-sm sm:text-base"
                >
                  Let's Collaborate
                </Link>
              </div>

              {/* Subscribe Form and Scroll Indicator - Same Line */}
              <div className="mt-6 sm:mt-8 flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
                {/* Subscribe Form */}
                <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow-2xl">
                  <SubscribeForm variant="hero" showTitle={false} />
                </div>

                {/* Scroll down indicator */}
                <div className="text-center animate-bounce hidden sm:block">
                  <div className="flex flex-col items-center space-y-2">
                    <p className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-widest drop-shadow-lg">Scroll to Watch</p>
                    <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-violet-400 to-transparent"></div>
                    <div className="flex items-center space-x-2">
                      <Youtube className="h-4 w-4 sm:h-5 sm:w-5 text-violet-400 animate-pulse drop-shadow-lg" />
                      <span className="text-xs sm:text-sm font-medium text-white/90 drop-shadow-lg">Shorts Feed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- YouTube Shorts Feed Section --- */}
        <section className="relative h-screen bg-black snap-start">
          {/* Sticky header that appears below navbar */}
          <div className="sticky top-16 left-0 right-0 z-40 bg-gradient-to-r from-violet-900/90 via-purple-900/90 to-violet-900/90 backdrop-blur-md py-3 sm:py-4 border-b border-violet-500/50">
            <div className="flex items-center justify-center gap-2 sm:gap-3 px-4">
              <Youtube className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-violet-400" />
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-violet-400 to-purple-400">
                  Shorts Feed
                </span>
              </h2>
            </div>
          </div>
          
          <YoutubeFeed />
        </section>

        {/* --- CTA Section --- */}
        <section className="min-h-screen bg-gradient-to-br from-violet-100 via-white to-yellow-100 dark:from-gray-900 dark:via-purple-900/30 dark:to-violet-900/20 text-gray-900 dark:text-white snap-start flex items-center justify-center py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Sparkles className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 mx-auto mb-4 sm:mb-6 text-violet-600 dark:text-violet-400" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 dark:from-yellow-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                Ready to Work Together?
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 text-gray-700 dark:text-gray-300 px-4">
              Let's create something amazing! From brand collaborations to creative projects,
              I'm always excited to bring new ideas to life.
            </p>
            <Link
              to="/contact"
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 text-white rounded-full font-semibold hover:from-violet-700 hover:via-purple-700 hover:to-violet-800 transition-all duration-300 transform hover:scale-105 shadow-xl text-sm sm:text-base"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
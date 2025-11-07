// src/components/YoutubeFeed.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { apiClient } from '../lib/api-client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Loader2,
  Youtube,
  ThumbsUp,
  MessageSquare,
  Share2,
  Volume2,
  VolumeX,
  Pause,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface YouTubeVideo {
  _id: string;
  youtube_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  published_at: string;
}

const ITEMS_PER_PAGE = 5; // Load 5 videos at a time for a shorts feed

// --- Individual Video Player ---
// This component handles the playback and UI for a single video "short"
const VideoShort = ({
  video,
  isActive,
  onEnded,
}: {
  video: YouTubeVideo;
  isActive: boolean;
  onEnded: () => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.8, // Video is considered "active" when 80% visible
  });

  const postPlayerMessage = (action: string, args?: any) => {
    playerRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: 'command',
        func: action,
        args: args || [],
      }),
      '*'
    );
  };

  // Autoplay/pause when in view
  useEffect(() => {
    if (isActive && inView) {
      // Use a small delay to ensure player is ready
      setTimeout(() => {
        postPlayerMessage('playVideo');
        setIsPlaying(true);
      }, 500);
    } else {
      postPlayerMessage('pauseVideo');
      setIsPlaying(false);
    }
  }, [isActive, inView]);

  // Handle player state changes (like video ending)
  useEffect(() => {
    const handlePlayerMessage = (event: MessageEvent) => {
      if (
        event.source !== playerRef.current?.contentWindow ||
        !event.data ||
        typeof event.data !== 'string'
      ) {
        return;
      }
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'onStateChange') {
          const playerState = data.info;
          // 0 = ended
          if (playerState === 0) {
            setIsPlaying(false);
            onEnded(); // Notify parent to scroll to next video
          }
          // 1 = playing
          else if (playerState === 1) {
            setIsPlaying(true);
          }
          // 2 = paused
          else if (playerState === 2) {
            setIsPlaying(false);
          }
        }
      } catch (error) {
        console.warn('Could not parse player message:', error);
      }
    };

    window.addEventListener('message', handlePlayerMessage);
    return () => {
      window.removeEventListener('message', handlePlayerMessage);
    };
  }, [onEnded]);

  const togglePlay = () => {
    if (isPlaying) {
      postPlayerMessage('pauseVideo');
    } else {
      postPlayerMessage('playVideo');
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (isMuted) {
      postPlayerMessage('unMute');
    } else {
      postPlayerMessage('mute');
    }
    setIsMuted(!isMuted);
  };

  return (
    <div
      ref={ref}
      className="relative h-screen w-full snap-center overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="absolute inset-0 bg-black">
        <iframe
          ref={playerRef}
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${
            video.youtube_id
          }?autoplay=0&mute=${
            isMuted ? 1 : 0
          }&controls=0&showinfo=0&rel=0&enablejsapi=1&modestbranding=1&playsinline=1&loop=0&origin=${
            window.location.origin
          }`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Video Overlay & Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute inset-0 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Play/Pause Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence>
          {!isPlaying && (
            <motion.button
              onClick={togglePlay}
              className="rounded-full bg-black/30 p-4 text-white backdrop-blur-sm"
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Play className="h-12 w-12" fill="currentColor" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Info Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
        <h3 className="mb-2 text-lg font-bold line-clamp-2">{video.title}</h3>
        <p className="mb-4 text-sm line-clamp-3">{video.description}</p>
        <div className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-500" />
          <span className="text-sm font-semibold">YouTube</span>
        </div>
      </div>

      {/* Side Action Buttons */}
      <div className="absolute bottom-24 right-2 flex flex-col items-center gap-4 text-white">
        <button className="flex flex-col items-center">
          <div className="rounded-full bg-black/30 p-3 backdrop-blur-sm">
            <ThumbsUp className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold">Like</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="rounded-full bg-black/30 p-3 backdrop-blur-sm">
            <MessageSquare className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold">Comment</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="rounded-full bg-black/30 p-3 backdrop-blur-sm">
            <Share2 className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold">Share</span>
        </button>
      </div>

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-10 rounded-full bg-black/30 p-3 text-white backdrop-blur-sm"
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </button>

      {/* Simple Click to Play/Pause */}
      <div
        className="absolute inset-0 z-0 h-full w-full"
        onClick={togglePlay}
      />
    </div>
  );
};

// --- Main Feed Component ---
export function YoutubeFeed() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadVideos = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await apiClient.getYouTubeVideos(page, ITEMS_PER_PAGE);

      setVideos((prev) => {
        const videoMap = new Map(prev.map((video) => [video._id, video]));
        response.videos.forEach((video: YouTubeVideo) =>
          videoMap.set(video._id, video)
        );
        return Array.from(videoMap.values());
      });

      setHasMore(response.pagination.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
      if (initialLoad) setInitialLoad(false);
    }
  }, [page, loading, hasMore, initialLoad]);

  // Initial load
  useEffect(() => {
    loadVideos();
  }, []);

  // Update active video index based on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const videoHeight = containerRef.current.clientHeight; //
      const currentIndex = Math.round(scrollTop / videoHeight);

      if (currentIndex !== activeVideoIndex) {
        setActiveVideoIndex(currentIndex);
      }

      // Load more if near the end
      const totalHeight = containerRef.current.scrollHeight;
      if (
        hasMore &&
        !loading &&
        scrollTop + videoHeight * 2 >= totalHeight // Load when 2 videos away from end
      ) {
        loadVideos();
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [activeVideoIndex, hasMore, loadVideos, loading]);

  const scrollToVideo = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * containerRef.current.clientHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleVideoEnd = () => {
    const nextIndex = activeVideoIndex + 1;
    if (nextIndex < videos.length) {
      scrollToVideo(nextIndex);
    }
  };

  if (initialLoad) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-red-500" />
          <h2 className="text-2xl font-bold text-white">
            Loading Shorts...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black scrollbar-hide"
    >
      <AnimatePresence>
        {videos.map((video, index) => (
          <VideoShort
            key={`${video._id}-${index}`}
            video={video}
            isActive={index === activeVideoIndex}
            onEnded={handleVideoEnd}
          />
        ))}
      </AnimatePresence>

      {/* Loading indicator at the bottom */}
      {loading && (
        <div className="flex h-screen w-full snap-center items-center justify-center bg-black">
          <Loader2 className="h-10 w-10 animate-spin text-red-500" />
        </div>
      )}

      {/* End of feed */}
      {!loading && !hasMore && videos.length > 0 && (
        <div className="flex h-screen w-full snap-center flex-col items-center justify-center space-y-6 bg-black text-white">
          <Youtube className="h-16 w-16 text-violet-500" />
          <h3 className="text-2xl font-bold">That's all for now!</h3>
          <p className="max-w-xs text-center text-gray-400">
            You've seen all the shorts. Check back later for more.
          </p>
          <button
            onClick={() => scrollToVideo(0)}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
          >
            <ArrowUp className="h-5 w-5" />
            Back to Top
          </button>
        </div>
      )}

      {/* Scroll hints */}
      {activeVideoIndex < videos.length - 1 && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-8 w-8 text-white/50" />
        </div>
      )}
      {activeVideoIndex > 0 && (
        <div className="pointer-events-none absolute top-6 left-1/2 z-20 -translate-x-1/2 animate-bounce-reverse">
          <ArrowUp className="h-8 w-8 text-white/50" />
        </div>
      )}
    </div>
  );
}
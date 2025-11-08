import { useState, useEffect } from 'react';
import { Youtube, Instagram, Zap } from 'lucide-react';

interface SocialCTA {
  id: number;
  message: string;
  icon: 'youtube' | 'instagram' | 'threads';
  link: string;
  color: string;
  hoverColor: string;
}

export default function ComedyMascot() {
  const [isJiggling, setIsJiggling] = useState(false);

  const socialCTAs: SocialCTA[] = [
    {
      id: 1,
      message: "Subscribe on YouTube",
      icon: 'youtube',
      link: 'https://youtube.com/@your-channel',
      color: 'from-red-500 to-red-600',
      hoverColor: 'from-red-600 to-red-700',
    },
    {
      id: 2,
      message: "Follow on Instagram",
      icon: 'instagram',
      link: 'https://instagram.com/your-username',
      color: 'from-pink-500 to-purple-600',
      hoverColor: 'from-pink-600 to-purple-700',
    },
    {
      id: 3,
      message: "Follow on Threads",
      icon: 'threads',
      link: 'https://threads.net/@your-username',
      color: 'from-violet-600 to-purple-600',
      hoverColor: 'from-violet-700 to-purple-700',
    },
  ];

  const [currentCTA, setCurrentCTA] = useState(socialCTAs[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const jigglingInterval = setInterval(() => {
      setIsJiggling(true);
      setTimeout(() => setIsJiggling(false), 1000);
    }, 8000);

    const rotateInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % socialCTAs.length;
        setCurrentCTA(socialCTAs[newIndex]);
        return newIndex;
      });
    }, 6000);

    return () => {
      clearInterval(jigglingInterval);
      clearInterval(rotateInterval);
    };
  }, []);

  const handleClick = () => {
    window.open(currentCTA.link, '_blank', 'noopener,noreferrer');
  };

  const renderIcon = () => {
    switch (currentCTA.icon) {
      case 'youtube':
        return <Youtube className="h-7 w-7" />;
      case 'instagram':
        return <Instagram className="h-7 w-7" />;
      case 'threads':
        return <Zap className="h-7 w-7" />;
      default:
        return <Youtube className="h-7 w-7" />;
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <div className="relative">
        <div className={`hidden md:block absolute bottom-20 right-0 bg-gradient-to-r ${currentCTA.color} text-white px-5 py-3 rounded-xl shadow-2xl whitespace-nowrap backdrop-blur-sm border border-white/20 transition-all duration-500`}>
          <div className="font-semibold text-sm">{currentCTA.message}</div>
          <div className={`absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-gradient-to-br ${currentCTA.color}`}></div>
        </div>

        <button
          onClick={handleClick}
          className={`
            bg-gradient-to-br ${currentCTA.color}
            hover:bg-gradient-to-br hover:${currentCTA.hoverColor}
            text-white p-4 rounded-full shadow-2xl
            transition-all duration-500 transform hover:scale-110
            border-2 border-white/30 hover:border-white/50
            ${isJiggling ? 'animate-wiggle' : ''}
          `}
          aria-label={currentCTA.message}
          title={currentCTA.message}
        >
          {renderIcon()}
        </button>
      </div>
    </div>
  );
}

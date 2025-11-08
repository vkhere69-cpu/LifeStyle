import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Laugh, Sparkles, Target, Heart } from 'lucide-react';
import { apiClient } from '../lib/api-client';

export default function About() {
  useEffect(() => {
    // Track page view
    apiClient.trackPageView('About').catch(err => console.error('Analytics error:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-violet-100 dark:from-gray-900 dark:via-black dark:to-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 dark:from-yellow-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            About Me
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Where laughter meets the lens
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Creator"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Hi, I'm a Creator
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                I'm a content creator who blends comedy with modelling, bringing a unique
                perspective to both worlds. My journey started with making people laugh,
                and evolved into creating visual stories that inspire and entertain.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Through Instagram reels, YouTube videos, and modelling campaigns, I strive
                to create content that's not just beautiful, but meaningful and fun.
                Every project is an opportunity to push creative boundaries and connect
                with amazing people.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                When I'm not in front of the camera, you'll find me brainstorming new
                comedy sketches, exploring fashion trends, or collaborating with brands
                that share my vision for authentic, engaging content.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-6 rounded-xl border border-violet-200/50 dark:border-gray-800/50">
                <Laugh className="h-8 w-8 text-violet-500 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Comedy</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Making people laugh every day
                </p>
              </div>
              <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-6 rounded-xl border border-violet-200/50 dark:border-gray-800/50">
                <Camera className="h-8 w-8 text-violet-500 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Modelling</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Bringing fashion to life
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-3xl border border-violet-200/50 dark:border-gray-800/50 p-8 md:p-12 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            What I Do Best
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex p-4 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-violet-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Content Creation
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Creating engaging reels, videos, and posts that resonate with audiences
                and drive engagement.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-4">
                <Target className="h-8 w-8 text-violet-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Brand Collaborations
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Partnering with brands to create authentic content that connects with
                their target audience.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-4">
                <Heart className="h-8 w-8 text-violet-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Community Building
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Fostering a supportive community of creators and fans who share a love for
                comedy and creativity.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700 rounded-3xl shadow-2xl p-8 md:p-12 text-white text-center">
          <Heart className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Create Something Amazing
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            I'm always excited to collaborate on new projects, whether it's brand
            partnerships, creative campaigns, or comedy collaborations.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-white text-violet-600 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}

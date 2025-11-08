import { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, Instagram, Youtube } from 'lucide-react';
import { apiClient } from '../lib/api-client';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Track page view
    apiClient.trackPageView('Contact').catch(err => console.error('Analytics error:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiClient.createContactRequest(formData);

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error submitting contact form:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-violet-100 dark:from-gray-900 dark:via-black dark:to-gray-900 pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 dark:from-yellow-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent mb-3 sm:mb-4">
            Let's Connect
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 px-4">
            Have a project in mind? Let's collaborate and create something amazing!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-violet-200/50 dark:border-gray-800/50 p-6 sm:p-8">
              <Mail className="h-10 w-10 sm:h-12 sm:w-12 text-violet-500 mb-3 sm:mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Get in Touch
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">
                I'm always open to discussing new projects, creative ideas, brand
                collaborations, or opportunities to be part of your vision.
              </p>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/40 dark:bg-black/30 rounded-lg border border-violet-200/50 dark:border-gray-800/50">
                  <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-violet-500" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      Instagram
                    </div>
                    <a
                      href="https://instagram.com"
                      className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors text-sm sm:text-base"
                    >
                      @comedycreator
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/40 dark:bg-black/30 rounded-lg border border-violet-200/50 dark:border-gray-800/50">
                  <Youtube className="h-5 w-5 sm:h-6 sm:w-6 text-violet-500" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      YouTube
                    </div>
                    <a
                      href="https://youtube.com"
                      className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors text-sm sm:text-base"
                    >
                      Lifestyle Channel
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/40 dark:bg-black/30 rounded-lg border border-violet-200/50 dark:border-gray-800/50">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-violet-500" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Email</div>
                    <a
                      href="mailto:hello@comedycreator.com"
                      className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors text-sm sm:text-base break-all"
                    >
                      hello@comedycreator.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700 rounded-2xl shadow-xl p-6 sm:p-8 text-white">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">What to Expect</h3>
              <ul className="space-y-2.5 sm:space-y-3">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">Response within 24-48 hours</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">Professional and creative collaboration</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">Tailored solutions for your project</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">Authentic and engaging content</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-violet-200/50 dark:border-gray-800/50 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Send a Message
            </h2>

            {success && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2 sm:gap-3">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Message sent successfully! I'll get back to you soon.</span>
              </div>
            )}

            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm sm:text-base">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-violet-300 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-black/30 text-gray-900 dark:text-white placeholder-gray-500 text-sm sm:text-base"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-violet-300 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-black/30 text-gray-900 dark:text-white placeholder-gray-500 text-sm sm:text-base"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-violet-300 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-black/30 text-gray-900 dark:text-white placeholder-gray-500 text-sm sm:text-base"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-violet-300 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-black/30 text-gray-900 dark:text-white placeholder-gray-500 resize-none text-sm sm:text-base"
                  placeholder="Tell me about your project or collaboration idea..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

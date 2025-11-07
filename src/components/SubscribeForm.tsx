import { useState } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { apiClient } from '../lib/api-client';

interface SubscribeFormProps {
  variant?: 'hero' | 'footer' | 'sidebar';
  showTitle?: boolean;
}

export function SubscribeForm({ variant = 'footer', showTitle = true }: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess(false);

    try {
      const result = await apiClient.subscribe(email);
      setSuccess(true);
      setMessage(result.message || 'Successfully subscribed!');
      setEmail('');
    } catch (error: any) {
      setMessage(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          container: 'max-w-md mx-auto',
          input: 'px-6 py-4 text-lg',
          button: 'px-8 py-4 text-lg',
        };
      case 'sidebar':
        return {
          container: 'max-w-sm',
          input: 'px-4 py-3 text-sm',
          button: 'px-6 py-3 text-sm',
        };
      default: // footer
        return {
          container: 'max-w-md',
          input: 'px-4 py-3',
          button: 'px-6 py-3',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={styles.container}>
      {showTitle && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Stay Updated
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Subscribe to get notified about new content, shorts, and blog posts!
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading || success}
              className={`w-full pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50 transition-all ${styles.input}`}
            />
          </div>
          <button
            type="submit"
            disabled={loading || success}
            className={`bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 text-white rounded-lg font-semibold hover:from-violet-700 hover:via-purple-700 hover:to-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-2 ${styles.button}`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Subscribing...
              </>
            ) : success ? (
              <>
                <CheckCircle className="h-5 w-5" />
                Subscribed!
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </div>

        {message && (
          <div
            className={`text-sm p-3 rounded-lg ${
              success
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}
          >
            {message}
          </div>
        )}
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
        By subscribing, you agree to receive email updates. Unsubscribe anytime.
      </p>
    </div>
  );
}

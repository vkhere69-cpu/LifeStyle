import { useEffect, useState } from 'react';
import { X, Info, CheckCircle, AlertTriangle, Megaphone } from 'lucide-react';
import { apiClient } from '../lib/api-client';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'announcement';
  icon: string;
  link: string;
  is_active: boolean;
  expires_at: string | null;
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const dismissedIds = JSON.parse(localStorage.getItem('dismissed_notifications') || '[]');
    setDismissed(dismissedIds);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiClient.getNotifications();
      setNotifications(data);
      if (data.length > 0) {
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissed, id];
    setDismissed(newDismissed);
    localStorage.setItem('dismissed_notifications', JSON.stringify(newDismissed));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'announcement': return <Megaphone className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-500 text-green-800 dark:text-green-300';
      case 'warning': return 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-500 text-yellow-800 dark:text-yellow-300';
      case 'announcement': return 'bg-gradient-to-r from-violet-50 to-purple-100 dark:from-violet-900/20 dark:to-purple-800/20 border-violet-500 text-violet-800 dark:text-violet-300';
      default: return 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-500 text-blue-800 dark:text-blue-300';
    }
  };

  const activeNotifications = notifications.filter(n => !dismissed.includes(n._id));

  if (activeNotifications.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] space-y-3"
        >
          {activeNotifications.map((notification) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`rounded-xl border-l-4 p-4 shadow-xl backdrop-blur-sm ${getTypeStyles(notification.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm mb-1">{notification.title}</h3>
                  <p className="text-sm opacity-90">{notification.message}</p>
                  {notification.link && (
                    <a
                      href={notification.link}
                      className="text-sm font-semibold underline mt-2 inline-block hover:opacity-80"
                      onClick={() => handleDismiss(notification._id)}
                    >
                      Learn More →
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleDismiss(notification._id)}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

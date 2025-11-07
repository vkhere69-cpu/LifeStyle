import { useEffect, useState } from 'react';
import { Mail, Trash2, CheckCircle, Clock } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import type { ContactRequest } from '../../lib/types';

export default function ContactsManager() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await apiClient.getContactRequests();
      if (data) setRequests(data);
    } catch (error) {
      console.error('Error fetching contact requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (_id: string, status: string) => {
    try {
      await apiClient.updateContactStatus(_id, status);
      setRequests(requests.map(r => r._id === _id ? { ...r, status } : r));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteRequest = async (_id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      await apiClient.deleteContactRequest(_id);
      setRequests(requests.filter(r => r._id !== _id));
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const filteredRequests = filter === 'all'
    ? requests
    : requests.filter(r => r.status === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Mail className="h-8 w-8 text-green-500" />
            Contact Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage collaboration requests and messages
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {['all', 'new', 'read', 'replied'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-colors ${
              filter === status
                ? 'bg-green-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${
                request.status === 'new' ? 'border-l-4 border-green-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {request.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === 'new'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : request.status === 'replied'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <a
                    href={`mailto:${request.email}`}
                    className="text-green-500 hover:text-green-600 mb-2 inline-block"
                  >
                    {request.email}
                  </a>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(request.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <div className="font-semibold text-gray-900 dark:text-white mb-2">
                  {request.subject}
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {request.message}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateStatus(request._id, 'read')}
                  disabled={request.status === 'read'}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => updateStatus(request._id, 'replied')}
                  disabled={request.status === 'replied'}
                  className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark as Replied
                </button>
                <button
                  onClick={() => deleteRequest(request._id)}
                  className="ml-auto p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl">
          <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No contact requests {filter !== 'all' && `with status "${filter}"`}.
          </p>
        </div>
      )}
    </div>
  );
}

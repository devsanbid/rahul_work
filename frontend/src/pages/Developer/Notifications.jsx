import React, { useState, useEffect } from 'react';
import { FiBell, FiCheck, FiX, FiTrash2, FiFilter, FiMail, FiDollarSign, FiUser, FiFileText, FiLoader } from 'react-icons/fi';
import { developerAPI } from '../../services/api';

const DeveloperNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await developerAPI.getNotifications({ userId: user.id });
      setNotifications(response.data?.notifications || response.notifications || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await developerAPI.markNotificationAsRead(id, user.id);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
      // Trigger a custom event to update header notification count
      window.dispatchEvent(new CustomEvent('notificationUpdate'));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await developerAPI.markAllNotificationsAsRead(user.id);
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      // Trigger a custom event to update header notification count
      window.dispatchEvent(new CustomEvent('notificationUpdate'));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await developerAPI.deleteNotification(id, user.id);
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );
      // Trigger a custom event to update header notification count
      window.dispatchEvent(new CustomEvent('notificationUpdate'));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    if (filter === 'job_request') return notification.type === 'job_request' || notification.type === 'job';
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'job_request':
      case 'job':
        return FiFileText;
      case 'payment':
        return FiDollarSign;
      case 'message':
        return FiMail;
      case 'review':
        return FiUser;
      default:
        return FiBell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'job_request':
      case 'job':
        return 'bg-blue-500';
      case 'payment':
        return 'bg-green-500';
      case 'message':
        return 'bg-purple-500';
      case 'review':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const NotificationCard = ({ notification }) => {
    const Icon = getNotificationIcon(notification.type);
    const iconColor = getNotificationColor(notification.type);
    
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
        notification.isRead ? 'border-gray-300' : 'border-[#d97757]'
      } hover:shadow-lg transition-shadow`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`${iconColor} p-2 rounded-full flex-shrink-0`}>
              <Icon size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className={`font-semibold truncate ${
                  notification.isRead ? 'text-gray-700' : 'text-gray-900'
                }`}>
                  {notification.title}
                </h4>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-[#d97757] rounded-full flex-shrink-0"></div>
                )}
              </div>
              <p className={`text-sm ${
                notification.isRead ? 'text-gray-600' : 'text-gray-800'
              } mb-2`}>
                {notification.message}
              </p>
              <p className="text-xs text-gray-500">
                {getTimeAgo(notification.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification.id)}
                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                title="Mark as read"
              >
                <FiCheck size={16} />
              </button>
            )}
            <button
              onClick={() => deleteNotification(notification.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete notification"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h2>
          <p className="text-gray-600">
            Stay updated with your latest activities
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-[#d97757] text-white text-xs rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-[#c56647] transition-colors"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <FiFilter size={20} className="text-gray-600" />
            <span className="text-gray-700">Filter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'job_request', label: 'Job Requests', count: notifications.filter(n => n.type === 'job_request' || n.type === 'job').length },
              { key: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
              { key: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
              { key: 'review', label: 'Reviews', count: notifications.filter(n => n.type === 'review').length }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-[#d97757] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <FiLoader className="animate-spin text-[#d97757] mr-2" size={24} />
          <span className="text-gray-600">Loading notifications...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchNotifications}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Notifications List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}

      {!loading && !error && filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <FiBell size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No notifications found</p>
          <p className="text-gray-400">
            {filter === 'all' 
              ? "You're all caught up!" 
              : `No ${filter.replace('_', ' ')} notifications at the moment.`
            }
          </p>
        </div>
      )}

      {/* Notification Settings */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          {[
            { label: 'Job Requests', description: 'Get notified when you receive new job requests' },
            { label: 'Payment Updates', description: 'Receive notifications about payments and withdrawals' },
            { label: 'Messages', description: 'Get notified when clients send you messages' },
            { label: 'Reviews', description: 'Receive notifications when clients leave reviews' }
          ].map((setting, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{setting.label}</p>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#d97757] peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d97757]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperNotifications;

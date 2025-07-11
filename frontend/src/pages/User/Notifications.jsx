import React, { useState, useEffect } from 'react';
import { 
  BellIcon, 
  CheckIcon, 
  XMarkIcon,
  UserIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application':
      case 'user':
        return UserIcon;
      case 'payment':
        return CurrencyDollarIcon;
      case 'project':
      case 'job':
        return BriefcaseIcon;
      case 'alert':
      case 'error':
        return ExclamationTriangleIcon;
      default:
        return BellIcon;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'application':
      case 'user':
        return 'bg-blue-100 text-blue-600';
      case 'payment':
        return 'bg-green-100 text-green-600';
      case 'project':
      case 'job':
        return 'bg-[#d97757] bg-opacity-20 text-[#d97757]';
      case 'alert':
      case 'error':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userAPI.getNotifications(user?.id);
      const notifications = response.data?.notifications || response.notifications || [];
      const notificationsWithUI = notifications.map(notification => ({
        ...notification,
        icon: getNotificationIcon(notification.type),
        color: getNotificationColor(notification.type),
        time: formatTimeAgo(notification.createdAt),
        read: notification.isRead
      }));
      setNotifications(notificationsWithUI);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      setActionLoading(prev => ({ ...prev, [`read_${id}`]: true }));
      await userAPI.markNotificationAsRead(id, user?.id);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read');
    } finally {
      setActionLoading(prev => ({ ...prev, [`read_${id}`]: false }));
    }
  };

  const markAllAsRead = async () => {
    try {
      setActionLoading(prev => ({ ...prev, markAll: true }));
      await userAPI.markAllNotificationsAsRead(user?.id);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to mark all notifications as read');
    } finally {
      setActionLoading(prev => ({ ...prev, markAll: false }));
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }
    
    try {
      setActionLoading(prev => ({ ...prev, [`delete_${id}`]: true }));
      await userAPI.deleteNotification(id, user?.id);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification');
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${id}`]: false }));
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600 mt-2">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={actionLoading.markAll}
              className="flex items-center px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading.markAll ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <CheckIcon className="w-4 h-4 mr-2" />
              )}
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d97757]"></div>
          <span className="ml-3 text-gray-600">Loading notifications...</span>
        </div>
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                {['all', 'unread', 'read'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterType
                        ? 'bg-[#d97757] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    {filterType === 'unread' && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mark All as Read Button */}
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
              </span>
              {filteredNotifications.some(n => !n.read) && (
                <button
                  onClick={markAllAsRead}
                  disabled={actionLoading.markAll}
                  className="flex items-center px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading.markAll ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <CheckIcon className="w-4 h-4 mr-2" />
                  )}
                  Mark All as Read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-lg shadow">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No notifications found</p>
                <p className="text-gray-400 text-sm mt-2">
                  {filter === 'unread' ? 'All notifications have been read' : 'Check back later for updates'}
                </p>
              </div>
            ) : (
              <div>
                {filteredNotifications.map((notification) => {
                  return (
                    <div
                      key={notification.id}
                      className="p-6 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#d97757] rounded-full mt-2 flex-shrink-0"></div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  disabled={actionLoading[`read_${notification.id}`]}
                                  className="text-gray-400 hover:text-[#d97757] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Mark as read"
                                >
                                  {actionLoading[`read_${notification.id}`] ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#d97757]"></div>
                                  ) : (
                                    <CheckIcon className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                disabled={actionLoading[`delete_${notification.id}`]}
                                className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete notification"
                              >
                                {actionLoading[`delete_${notification.id}`] ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                ) : (
                                  <XMarkIcon className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;

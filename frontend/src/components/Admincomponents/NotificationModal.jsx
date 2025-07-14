import React from 'react';
import { X, Bell, User, DollarSign, FolderOpen, AlertCircle, CheckCircle, Clock, Trash2, BookMarked as MarkAsRead } from 'lucide-react';

const NotificationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      type: 'user',
      title: 'New User Registration',
      message: 'John Smith has registered as a developer',
      time: '2 minutes ago',
      read: false,
      icon: User,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      id: 2,
      type: 'project',
      title: 'Project Completed',
      message: 'E-commerce Platform project has been marked as completed',
      time: '15 minutes ago',
      read: false,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $12,500 received from TechCorp Inc.',
      time: '1 hour ago',
      read: true,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      id: 4,
      type: 'project',
      title: 'Project Deadline Approaching',
      message: 'Mobile App Development project deadline is in 2 days',
      time: '2 hours ago',
      read: false,
      icon: AlertCircle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 5,
      type: 'user',
      title: 'Profile Update',
      message: 'Sarah Davis updated her profile information',
      time: '3 hours ago',
      read: true,
      icon: User,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      id: 6,
      type: 'project',
      title: 'New Project Proposal',
      message: 'Creative Agency submitted a new project proposal',
      time: '4 hours ago',
      read: false,
      icon: FolderOpen,
      color: 'text-[#d97757]',
      bgColor: 'bg-[#d97757] bg-opacity-20'
    },
    {
      id: 7,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight at 2:00 AM',
      time: '6 hours ago',
      read: true,
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    {
      id: 8,
      type: 'payment',
      title: 'Invoice Generated',
      message: 'Invoice #INV-2024-001 has been generated for StartupXYZ',
      time: '8 hours ago',
      read: true,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-16">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[80vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-[#d97757]" />
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-[#d97757] text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button className="text-[#d97757] hover:text-[#c86a4a] text-sm font-medium transition-colors">
              Mark all as read
            </button>
            <button className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
              Clear all
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-[#d97757]' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${notification.bgColor}`}>
                      <notification.icon className={`w-4 h-4 ${notification.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#d97757] rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <button className="text-[#d97757] hover:text-[#c86a4a] text-xs">
                              Mark as read
                            </button>
                          )}
                          <button className="text-gray-400 hover:text-gray-600">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button className="w-full text-center text-[#d97757] hover:text-[#c86a4a] text-sm font-medium transition-colors">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
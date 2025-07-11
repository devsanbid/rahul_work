import React, { useState, useRef, useEffect } from 'react';
import { 
  BellIcon, 
  UserIcon, 
  Bars3Icon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../services/api';

const Header = ({ toggleSidebar, activeTab, sidebarOpen, isMobile }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await userAPI.getNotifications();
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to empty array if API fails
      setNotifications([]);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await userAPI.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await userAPI.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const searchDevelopers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setLoading(true);
    try {
      const response = await userAPI.getDevelopers({ search: query, limit: 5 });
      setSearchResults(response.data.developers || []);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching developers:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = (tab) => {
    const titles = {
      'dashboard': 'Dashboard',
      'hire-developer': 'Hire Developer',
      'post-job': 'Post Job',
      'my-requests': 'My Requests',
      'profile': 'Profile',
      'payments': 'Payments',
      'notifications': 'Notifications'
    };
    return titles[tab] || 'Dashboard';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to developers page with search query
      navigate(`/user/hire-developer?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      searchDevelopers(value);
    }, 300);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatNotificationTime = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 lg:px-6 h-16 flex-shrink-0 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-full max-w-full">
        {/* Left Section */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className={`
              lg:hidden p-2 rounded-md transition-colors duration-200 mr-3 flex-shrink-0
              ${sidebarOpen 
                ? 'text-[#d97757] bg-orange-50' 
                : 'text-gray-600 hover:text-[#d97757] hover:bg-gray-100'
              }
            `}
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 bg-[#d97757] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">DH</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-gray-800 truncate">
                  {getPageTitle(activeTab)}
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block truncate">
                  DevHire Galaxy
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md ml-8" ref={searchRef}>
              <form onSubmit={handleSearch} className="w-full relative">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search developers, projects..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent text-sm transition-colors duration-200"
                  />
                  {loading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#d97757]"></div>
                    </div>
                  )}
                </div>
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-64 overflow-y-auto">
                    {searchResults.map((developer) => (
                      <div 
                        key={developer.id}
                        onClick={() => {
                          navigate(`/user/hire-developer?developer=${developer.id}`);
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#d97757] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {developer.name?.charAt(0)?.toUpperCase() || 'D'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{developer.name}</p>
                            <p className="text-xs text-gray-500 truncate">{developer.skills?.slice(0, 3).join(', ')}</p>
                          </div>
                          <div className="text-xs text-gray-400">
                            ${developer.hourlyRate}/hr
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-[#d97757] hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <BellIcon className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-[#d97757] hover:text-[#c86641] font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <BellIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        onClick={() => markNotificationAsRead(notification.id)}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-blue-50 border-l-2 border-[#d97757]' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatNotificationTime(notification.createdAt || notification.timestamp)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        navigate('/user/notifications');
                        setShowNotifications(false);
                      }}
                      className="text-xs text-[#d97757] hover:text-[#c86641] font-medium"
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-[#d97757] rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <span className="text-gray-700 font-medium text-sm">{user?.name || 'User'}</span>
                <p className="text-xs text-gray-500">{user?.role || 'User'}</p>
              </div>
              <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                showProfileMenu ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              
                
                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <UserIcon className="w-4 h-4 mr-3" />
                  Profile Settings
                </button>
                
                
                <hr className="my-2" />
                
                <button 
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

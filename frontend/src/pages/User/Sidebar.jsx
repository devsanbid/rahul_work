import React from 'react';
import { 
  HomeIcon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  DocumentTextIcon,
  UserIcon,
  CreditCardIcon,
  BellIcon,
  PlusCircleIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, closeSidebar, isMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
    { id: 'hire-developer', name: 'Hire Developer', icon: UserGroupIcon },
    { id: 'post-job', name: 'Post Job', icon: PlusCircleIcon },
    { id: 'my-requests', name: 'My Requests', icon: BriefcaseIcon },
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'payments', name: 'Payments', icon: CreditCardIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-white shadow-lg border-r border-gray-200">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Navigation</h2>
          <p className="text-xs text-gray-600">Choose a section</p>
        </div>
        {isMobile && (
          <button
            onClick={closeSidebar}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-orange-50 transition-colors duration-200 ${
                  activeTab === item.id 
                    ? 'bg-orange-100 border-r-4 border-[#d97757] text-[#d97757]' 
                    : 'text-gray-700 hover:text-[#d97757]'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mb-4"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          <span className="font-medium">Sign Out</span>
        </button>
        
        {/* Footer */}
        <div className="text-xs text-gray-500 text-center">
          © 2024 DevHire Platform
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

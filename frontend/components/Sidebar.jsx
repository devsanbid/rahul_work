import React from 'react';
import { 
  FiHome, 
  FiBriefcase, 
  FiStar, 
  FiUser, 
  FiDollarSign, 
  FiFileText, 
  FiBell,
  FiX
} from 'react-icons/fi';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'job-requests', label: 'Job Requests', icon: FiBriefcase },
    { id: 'my-jobs', label: 'My Jobs', icon: FiFileText },
    { id: 'reviews', label: 'Reviews', icon: FiStar },
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'payments', label: 'Payments', icon: FiDollarSign },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transform transition-transform duration-300 z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Developer Panel</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 overflow-y-auto h-[calc(100%-5rem)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-left transition-colors duration-200
                  ${activeTab === item.id 
                    ? 'bg-[#d97757] text-white border-r-4 border-[#c56647]' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon size={20} className="mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;

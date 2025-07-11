import React, { useState } from "react";
import { FiMenu, FiBell, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = ({ setIsSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 px-4 py-3 z-40">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
          >
            <FiMenu size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Developer Dashboard
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <FiBell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-[#d97757] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name || "Developer"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.title || "Full Stack Developer"}
                </p>
              </div>
              <div className="w-8 h-8 bg-[#d97757] rounded-full flex items-center justify-center">
                <FiUser size={16} className="text-white" />
              </div>
              <FiChevronDown size={16} className="text-gray-500" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/developer/profile');
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiUser className="w-4 h-4 mr-3" />
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
                  <FiLogOut className="w-4 h-4 mr-3" />
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

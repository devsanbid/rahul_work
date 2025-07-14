
import React from "react";
import { FiMenu, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserHeader = ({ setIsSidebarOpen, developer }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
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
            User Dashboard
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
         
          {/* Profile dropdown */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-800">
                {developer?.name || "John Doe"}
              </p>
              <p className="text-xs text-gray-500">
                {developer?.title || "Full Stack Developer"}
              </p>
            </div>
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-[#d97757] rounded-full flex items-center justify-center">
                  <FiUser size={16} className="text-white" />
                </div>
              </button>
            </div>
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Logout"
          >
            <FiLogOut size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
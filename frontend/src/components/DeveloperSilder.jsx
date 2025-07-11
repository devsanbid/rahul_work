import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBriefcase,
  FiFileText,
  FiStar,
  FiUser,
  FiDollarSign,
  FiBell,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: FiHome },
  { id: "job-requests", label: "Job Requests", icon: FiBriefcase },
  { id: "my-jobs", label: "My Jobs", icon: FiFileText },
  { id: "proposals", label: "My Proposals", icon: FiFileText },
  { id: "reviews", label: "Reviews", icon: FiStar },
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "payments", label: "Payments", icon: FiDollarSign },
  { id: "notifications", label: "Notifications", icon: FiBell },
];

const DeveloperSidebar = ({ isOpen, setIsSidebarOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
  <>
    {/* Mobile overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-opacity-50 z-30 lg:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}
    <div
      className={`
      fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transform transition-transform duration-300 z-30
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0
    `}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Developer Panel</h2>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-1 rounded-md hover:bg-gray-100"
        >
          <FiX size={20} />
        </button>
      </div>
      <div className="flex flex-col h-[calc(100%-5rem)]">
        <nav className="mt-4 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={`/developer/${item.id}`}
                className={({ isActive }) =>
                  `w-full flex items-center px-4 py-3 text-left transition-colors duration-200 ${
                    isActive
                      ? "bg-[#d97757] text-white border-r-4 border-[#c56647]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon size={20} className="mr-3" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut size={20} className="mr-3" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  </>
  );
};

export default DeveloperSidebar;

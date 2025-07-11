
import React from "react";
import { NavLink } from "react-router-dom";
import {
  User,
  CrossIcon,
  Home,
Users,
PlusCircle,
Briefcase,
CreditCard,
Bell,
FileText
} from "lucide-react";

const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'hire-developer', name: 'Hire Developer', icon: Users },
    { id: 'post-job', name: 'Post Job', icon: PlusCircle },
    { id: 'jobs', name: 'Jobs', icon: Briefcase },
    { id: 'proposals', name: 'Proposals', icon: FileText },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
];

export const UserSlider = ({ isOpen, setIsSidebarOpen }) => (
  <>
    {/* Mobile overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 opacity-50 bg-gray-200/30 z-30 lg:hidden"
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
          <CrossIcon size={20} />
        </button>
      </div>
      <nav className="mt-4 overflow-y-auto h-[calc(100%-5rem)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={`/user/${item.id}`}
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
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  </>
);

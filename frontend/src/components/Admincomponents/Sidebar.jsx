import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  DollarSign, 
  Settings, 
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
  TrendingUp
} from 'lucide-react';
import DashboardPage from '../pages/admin/Dashboard';
import UserManagementPage from '../pages/admin/UserManagement';
import ProjectManagementPage from '../pages/admin/Projectmanagement';
import FinancialsPage from '../pages/admin/Financials';
import SettingsPage from '../pages/admin/SettingsPage';
import NotificationModal from './NotificationModal';
import {useNavigate} from "react-router-dom"
function Sidebar() {

  const router = useNavigate()

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'project', name: 'Project Management', icon: FolderOpen },
    { id: 'financials', name: 'Financials', icon: DollarSign },
    { id: 'earnings', name: 'Admin Earnings', icon: TrendingUp },
    { id: 'setting', name: 'Settings', icon: Settings },
  ];




  return (
    <div className="h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={` h-full  w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#d97757] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-gray-800">DevHire</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
                router(item.id)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeTab === item.id
                  ? 'bg-[#d97757] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

    //   {/* Notification Modal */}
    //   <NotificationModal 
    //     isOpen={showNotifications} 
    //     onClose={() => setShowNotifications(false)} 
    //   />
export default Sidebar;
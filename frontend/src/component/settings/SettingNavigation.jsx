import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  CreditCard, 
  Settings as SettingsIcon 
} from 'lucide-react';

const SettingsNavigation = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'integrations', name: 'Integrations', icon: Database },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'advanced', name: 'Advanced', icon: SettingsIcon }
  ];

  return (
    <div className="lg:w-64">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <nav className="p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#d97757] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SettingsNavigation;